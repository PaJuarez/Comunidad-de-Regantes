/**
 * ==========================================================
 * Comunidad de Regantes
 * Archivo: ContadoresService.gs
 *
 * Versión: 0.3.0
 * Última actualización: 05/07/2026
 *
 * Descripción:
 * Servicio para gestionar la hoja "Contadores".
 * ==========================================================
 */

class ContadoresService extends BaseService {

  constructor() {

    super("Contadores");

    this.spreadsheet =
      new SpreadsheetService();

    this.repository =
      new SheetRepository(
        this.spreadsheet,
        CONFIG.SHEETS.CONTADORES
      );

    this.socios = new SociosService();

    this.reload();

  }

  /**
   * Recarga los datos de la hoja.
   */
  reload() {

    this.contadores = this.repository.getRows();

    this.socios.reload();

  }

  /**
   * Devuelve todos los contadores.
   */
  getAll() {

    return this.contadores.map(row =>
      this.repository.toObject(row)
    );

  }

  /**
   * Busca un contador.
   */
  getByNumero(numero) {

    return this.repository.findOne(
      CONFIG.HEADERS.CONTADOR,
      numero
    );

  }

  /**
   * Comprueba si existe.
   */
  exists(numero) {

    return this.getByNumero(numero) !== null;

  }

  /**
   * Devuelve el nº de socio asociado.
   */
  getNumeroSocio(numeroContador) {

    const contador = this.getByNumero(numeroContador);

    if (!contador)
      return null;

    return contador[
      CONFIG.HEADERS.CONTADOR_SOCIO
    ];

  }

  /**
   * Devuelve todos los contadores de un socio.
   */
  getBySocio(numeroSocio) {

    return this.repository.findAll(
      CONFIG.HEADERS.CONTADOR_SOCIO,
      numeroSocio
    );

  }

  /**
   * Genera las filas base para una campaña.
   */
  generarFilasCampania() {

    const filas = [];

    const contadores = this.getAll();

    contadores.forEach(contador => {

      const numeroSocio =
        contador[
        CONFIG.HEADERS.CONTADOR_SOCIO
        ];

      const socio =
        this.socios.getByNumero(numeroSocio);

      if (!socio)
        return;

      filas.push([

        contador[
        CONFIG.HEADERS.CONTADOR
        ],

        numeroSocio,

        socio[
        CONFIG.HEADERS.NOMBRE
        ],

        socio[
        CONFIG.HEADERS.TITULOS
        ]

      ]);

    });

    return filas;

  }

}