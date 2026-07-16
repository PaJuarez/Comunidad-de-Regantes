/**
 * ==========================================================
 * Comunidad de Regantes - Sistema de Gestión
 * Archivo: ConfiguracionService.gs
 *
 * Versión: 0.4.2
 * Última actualización: 07/07/2026
 *
 * Servicio para gestionar la configuración del sistema.
 * ==========================================================
 */

class ConfiguracionService extends BaseService {

  constructor() {

    super("Configuración");

    this.spreadsheet =
      new SpreadsheetService();

    this.repository =
      new SheetRepository(
        this.spreadsheet,
        CONFIG.SHEETS.CONFIG
      );

    this.reload();

  }

  /**
   * Recarga la configuración en memoria.
   */
  reload() {

    this.cache = {};

    this.repository.getRows().forEach(row => {

      const parametro = row[0];
      const valor = row[1];

      this.cache[parametro] = valor;

    });

  }

  /**
   * Comprueba si existe un parámetro.
   */
  exists(nombreParametro) {

    return Object.prototype.hasOwnProperty.call(
      this.cache,
      nombreParametro
    );

  }

  /**
   * Devuelve el valor de un parámetro.
   */
  get(nombreParametro) {

    if (!this.exists(nombreParametro)) {

      throw new Error(
        `No existe el parámetro "${nombreParametro}".`
      );

    }

    return this.cache[nombreParametro];

  }

  /**
   * Modifica el valor de un parámetro.
   */
  set(nombreParametro, valor) {

    const actualizado = this.repository.update(
      "Parámetro",
      nombreParametro,
      "Valor",
      valor
    );

    if (!actualizado) {

      throw new Error(
        `No existe el parámetro "${nombreParametro}".`
      );

    }

    this.reload();

  }

  /**
   * Precio del agua.
   */
  getPrecioAgua() {

    return Number(
      this.get(CONFIG.SETTINGS.WATER_PRICE)
    );

  }

  /**
   * IVA.
   */
  getIVA() {

    return Number(
      this.get(CONFIG.SETTINGS.VAT)
    );

  }

  /**
   * Moneda.
   */
  getMoneda() {

    return this.get(
      CONFIG.SETTINGS.CURRENCY
    );

  }

  /**
   * Texto que identifica un socio no domiciliado.
   */
  getTextoNoDomiciliado() {

    return this.get(
      CONFIG.SETTINGS.NO_DOMICILIADO
    );

  }

  /**
   * Valida la configuración del sistema.
   */
  validar() {

    // Precio agua
    const precio = this.getPrecioAgua();

    if (isNaN(precio)) {
      throw new Error(
        "El precio del agua debe ser numérico."
      );
    }

    if (precio <= 0) {
      throw new Error(
        "El precio del agua debe ser mayor que cero."
      );
    }

    // IVA
    const iva = this.getIVA();

    if (isNaN(iva)) {
      throw new Error(
        "El IVA debe ser numérico."
      );
    }

    if (iva < 0 || iva > 100) {
      throw new Error(
        "El IVA debe estar entre 0 y 100."
      );
    }

    // Moneda
    const moneda = this.getMoneda();

    if (!moneda || moneda.toString().trim() === "") {
      throw new Error(
        "Debe indicarse una moneda."
      );
    }

    // Texto no domiciliado
    const texto = this.getTextoNoDomiciliado();

    if (!texto || texto.toString().trim() === "") {
      throw new Error(
        "Debe definirse el texto para los socios no domiciliados."
      );
    }

    return true;

  }

}