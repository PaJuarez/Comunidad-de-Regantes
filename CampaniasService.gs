/**
 * ==========================================================
 * Comunidad de Regantes - Sistema de Gestión
 * Archivo: CampaniasService.gs
 *
 * Versión: 0.4.3
 * Última actualización: 07/07/2026
 *
 * Servicio encargado de crear campañas.
 * ==========================================================
 */

class CampaniasService extends BaseService {

  constructor() {

    super("Campañas");

    this.spreadsheet = new SpreadsheetService();

    this.config = new ConfiguracionService();

    this.socios = new SociosService();

    this.contadores = new ContadoresService();

  }

  /**
   * ======================================================
   * Crea una nueva campaña.
   * ======================================================
   */
  crearCampania(nombreHoja) {

    this.config.validar();

    if (this._existeHoja(nombreHoja)) {

      SpreadsheetApp.getUi().alert(
        `Ya existe una campaña llamada "${nombreHoja}".`
      );

      return null;

    }

    const hoja = this.spreadsheet.createSheet(nombreHoja);

    this._crearCabecera(hoja);

    const filas = this._generarFilas();

    this._escribirFilas(hoja, filas);

    this._insertarFormulas(hoja);

    this._aplicarFormato(hoja);

    SpreadsheetApp
      .getActive()
      .setActiveSheet(hoja);

    return hoja;

  }

  /**
   * ======================================================
   * Comprueba si una hoja existe.
   * ======================================================
   */
  _existeHoja(nombreHoja) {

    return this.spreadsheet.exists(
      nombreHoja
    );

  }

  /**
   * ======================================================
   * Escribe la cabecera.
   * ======================================================
   */
  _crearCabecera(hoja) {

    const columnas = Object.values(
      CONFIG.CAMPAIGN_COLUMNS
    );

    hoja
      .getRange(
        1,
        1,
        1,
        columnas.length
      )
      .setValues([columnas]);

  }

  _generarFilas() {

    const precio = this.config.getPrecioAgua();

    const iva = this.config.getIVA();

    const textoNoDomiciliado =
      this.config.getTextoNoDomiciliado();
    Logger.log(textoNoDomiciliado);
    return this.contadores
      .getAll()
      .map(contador => {

        const numeroSocio =
          contador[CONFIG.HEADERS.CONTADOR_SOCIO];

        const socio =
          this.socios.getByNumero(numeroSocio);

        if (!socio) {
          return null;
        }

        const cuenta =
          socio[CONFIG.HEADERS.CUENTA];
        Logger.log(cuenta);
        const domiciliado =
          cuenta === textoNoDomiciliado
            ? "NO"
            : "SI";

        return [

          contador[
          CONFIG.HEADERS.CONTADOR
          ],

          numeroSocio,

          socio[
          CONFIG.HEADERS.NOMBRE
          ],

          socio[
          CONFIG.HEADERS.TITULOS
          ],

          domiciliado,

          "", // Lectura anterior

          "", // Lectura actual

          "", // Consumo

          precio,

          "", // Base imponible

          iva,

          "", // Cuota IVA

          "", // Total

          "" // Observaciones

        ];

      })
      .filter(fila => fila !== null);

  }

  _escribirFilas(hoja, filas) {

    if (filas.length === 0) {
      return;
    }

    hoja
      .getRange(
        2,
        1,
        filas.length,
        filas[0].length
      )
      .setValues(filas);

  }

  /**
 * ======================================================
 * Aplica el formato de la campaña.
 * ======================================================
 */
  _aplicarFormato(hoja) {

    const ultimaFila = hoja.getLastRow();
    const ultimaColumna = hoja.getLastColumn();

    // Cabecera
    hoja
      .getRange(1, 1, 1, ultimaColumna)
      .setFontWeight("bold")
      .setBackground("#1F4E78")
      .setFontColor("white")
      .setHorizontalAlignment("center");

    // Congelar cabecera
    hoja.setFrozenRows(1);

    // Filtro
    if (!hoja.getFilter()) {

      hoja
        .getRange(
          1,
          1,
          ultimaFila,
          ultimaColumna
        )
        .createFilter();

      this._protegerColumnasCalculadas(hoja);
    }

    // Anchos de columnas
    hoja.setColumnWidth(1, 110); // Contador
    hoja.setColumnWidth(2, 90);  // Socio
    hoja.setColumnWidth(3, 250); // Nombre
    hoja.setColumnWidth(4, 90);  // Títulos
    hoja.setColumnWidth(5, 110); // Domiciliado

    hoja.autoResizeColumns(6, ultimaColumna - 5);

    // Centrar columnas
    this._centrarColumnas(hoja);

    // Formato numérico
    this._formatoNumerico(hoja);

    this._aplicarColores(hoja);

    this._aplicarValidaciones(hoja);

    this._aplicarFormatoCondicional(hoja);

  }

  /**
 * ======================================================
 * Aplica formato condicional.
 * ======================================================
 */
  _aplicarFormatoCondicional(hoja) {

    const letraLectura =
      this._getLetraColumna(
        CONFIG.CAMPAIGN_COLUMNS.LECTURA_ACTUAL
      );

    const rango = hoja.getRange(
      2,
      1,
      hoja.getLastRow() - 1,
      hoja.getLastColumn()
    );

    const regla =
      SpreadsheetApp
        .newConditionalFormatRule()
        .whenFormulaSatisfied(
          `=$${letraLectura}2=""`
        )
        .setBackground("#FFF9CC")
        .setRanges([rango])
        .build();

    hoja.setConditionalFormatRules([
      regla
    ]);

  }

  /**
 * ======================================================
 * Centra las columnas numéricas.
 * ======================================================
 */
  _centrarColumnas(hoja) {

    const ultimaFila = hoja.getLastRow();

    [
      CONFIG.CAMPAIGN_COLUMNS.CONTADOR,
      CONFIG.CAMPAIGN_COLUMNS.SOCIO,
      CONFIG.CAMPAIGN_COLUMNS.TITULOS,
      CONFIG.CAMPAIGN_COLUMNS.DOMICILIADO,
      CONFIG.CAMPAIGN_COLUMNS.IVA

    ].forEach(nombre => {

      hoja
        .getRange(
          2,
          this._getIndiceColumna(nombre),
          ultimaFila - 1
        )
        .setHorizontalAlignment("center");

    });

  }

  /**
 * ======================================================
 * Aplica formatos numéricos.
 * ======================================================
 */
  _formatoNumerico(hoja) {

    const ultimaFila = hoja.getLastRow();

    [
      CONFIG.CAMPAIGN_COLUMNS.PRECIO,
      CONFIG.CAMPAIGN_COLUMNS.BASE,
      CONFIG.CAMPAIGN_COLUMNS.CUOTA_IVA,
      CONFIG.CAMPAIGN_COLUMNS.TOTAL

    ].forEach(nombre => {

      this
        ._getRangoDatos(hoja, nombre)
        .setNumberFormat("#,##0.00 €");

    });

  }

  /**
 * ======================================================
 * Devuelve el índice de una columna de campaña.
 * ======================================================
 */
  _getIndiceColumna(nombre) {

    return Object
      .values(CONFIG.CAMPAIGN_COLUMNS)
      .indexOf(nombre) + 1;

  }

  /**
 * Devuelve el rango de datos de una columna.
 */
  _getRangoDatos(hoja, nombreColumna) {

    return hoja.getRange(

      2,

      this._getIndiceColumna(nombreColumna),

      hoja.getLastRow() - 1

    );

  }

  /**
 * ======================================================
 * Devuelve la letra de una columna de la campaña.
 * ======================================================
 */
  _getLetraColumna(nombre) {

    const indice = this._getIndiceColumna(nombre);

    let letra = "";
    let n = indice;

    while (n > 0) {

      const resto = (n - 1) % 26;

      letra = String.fromCharCode(65 + resto) + letra;

      n = Math.floor((n - 1) / 26);

    }

    return letra;

  }

  _insertarFormulas(hoja) {

    const ultimaFila = hoja.getLastRow();

    this._setFormulaColumna(
      hoja,
      CONFIG.CAMPAIGN_COLUMNS.CONSUMO,
      fila => `=${this._celda(CONFIG.CAMPAIGN_COLUMNS.LECTURA_ACTUAL, fila)}-${this._celda(CONFIG.CAMPAIGN_COLUMNS.LECTURA_ANTERIOR, fila)}`
    );

    this._setFormulaColumna(
      hoja,
      CONFIG.CAMPAIGN_COLUMNS.BASE,
      fila => `=${this._celda(CONFIG.CAMPAIGN_COLUMNS.CONSUMO, fila)}*${this._celda(CONFIG.CAMPAIGN_COLUMNS.PRECIO, fila)}`
    );

    this._setFormulaColumna(
      hoja,
      CONFIG.CAMPAIGN_COLUMNS.CUOTA_IVA,
      fila => `=${this._celda(CONFIG.CAMPAIGN_COLUMNS.BASE, fila)}*${this._celda(CONFIG.CAMPAIGN_COLUMNS.IVA, fila)}/100`
    );

    this._setFormulaColumna(
      hoja,
      CONFIG.CAMPAIGN_COLUMNS.TOTAL,
      fila => `=${this._celda(CONFIG.CAMPAIGN_COLUMNS.BASE, fila)}+${this._celda(CONFIG.CAMPAIGN_COLUMNS.CUOTA_IVA, fila)}`
    );

  }

  _setFormulaColumna(hoja, columna, formulaBuilder) {

    const ultimaFila = hoja.getLastRow();

    const formulas = [];

    for (let fila = 2; fila <= ultimaFila; fila++) {

      formulas.push([
        formulaBuilder(fila)
      ]);

    }

    this
      ._getRangoDatos(hoja, columna)
      .setFormulas(formulas);

  }

  _celda(nombreColumna, fila) {

    return this._getLetraColumna(nombreColumna) + fila;

  }

  /**
 * ======================================================
 * Colorea las columnas según su función.
 * ======================================================
 */
  _aplicarColores(hoja) {

    const editable = "#FFF2CC";      // Amarillo claro
    const lecturaAnterior = "#DDEBF7"; // Azul claro
    const calculada = "#7ab972";     // Gris claro

    this._getRangoDatos(
      hoja,
      CONFIG.CAMPAIGN_COLUMNS.LECTURA_ANTERIOR
    ).setBackground(lecturaAnterior);

    this._getRangoDatos(
      hoja,
      CONFIG.CAMPAIGN_COLUMNS.LECTURA_ACTUAL
    ).setBackground(editable);

    [
      CONFIG.CAMPAIGN_COLUMNS.CONSUMO,
      CONFIG.CAMPAIGN_COLUMNS.BASE,
      CONFIG.CAMPAIGN_COLUMNS.CUOTA_IVA,
      CONFIG.CAMPAIGN_COLUMNS.TOTAL
    ].forEach(columna => {

      this
        ._getRangoDatos(hoja, columna)
        .setBackground(calculada);

    });

  }

  /**
 * ======================================================
 * Valida la lectura actual.
 * ======================================================
 */
  _aplicarValidaciones(hoja) {

    const regla = SpreadsheetApp
      .newDataValidation()
      .requireNumberGreaterThanOrEqualTo(0)
      .setAllowInvalid(false)
      .setHelpText(
        "Introduzca la lectura del contador."
      )
      .build();

    this
      ._getRangoDatos(
        hoja,
        CONFIG.CAMPAIGN_COLUMNS.LECTURA_ACTUAL
      )
      .setDataValidation(regla);

  }

  /**
 * ======================================================
 * Protege una columna.
 * ======================================================
 */
  _protegerColumna(hoja, nombreColumna) {

    const rango = this._getRangoDatos(
      hoja,
      nombreColumna
    );

    const proteccion = rango.protect();

    proteccion.setDescription(
      `Columna protegida: ${nombreColumna}`
    );

    // Permitir editar a los mismos editores del documento
    proteccion.removeEditors(
      proteccion.getEditors()
    );

    if (proteccion.canDomainEdit()) {
      proteccion.setDomainEdit(false);
    }

  }

  /**
 * ======================================================
 * Protege las columnas calculadas.
 * ======================================================
 */
  _protegerColumnasCalculadas(hoja) {

    [

      CONFIG.CAMPAIGN_COLUMNS.CONSUMO,

      CONFIG.CAMPAIGN_COLUMNS.BASE,

      CONFIG.CAMPAIGN_COLUMNS.CUOTA_IVA,

      CONFIG.CAMPAIGN_COLUMNS.TOTAL

    ].forEach(columna => {

      this._protegerColumna(
        hoja,
        columna
      );

    });

  }

}

