/**
 * ==========================================================
 * SociosService
 * ==========================================================
 */

class SociosService extends BaseService {

  constructor() {

    super("Socios");

    this.spreadsheet =
      new SpreadsheetService();

    this.repository =
      new SheetRepository(
        this.spreadsheet,
        CONFIG.SHEETS.SOCIOS
      );

    this.cache = {};

    this.reload();

  }

  reload() {

    this.cache = {};

    const rows =
      this.repository.getRows();

    rows.forEach(row => {

      const socio =
        this.repository.toObject(row);

      this.cache[
        socio[
        CONFIG.HEADERS.SOCIO
        ]
      ] = socio;

    });

  }

  getByNumero(numero) {

    return this.cache[numero] || null;

  }

  exists(numero) {

    return this.getByNumero(numero) != null;

  }

  getNombre(numero) {

    const socio = this.getByNumero(numero);

    if (!socio) return "";

    return socio[
      CONFIG.HEADERS.NOMBRE
    ];

  }

  getTitulos(numero) {

    const socio = this.getByNumero(numero);

    if (!socio) return 0;

    return Number(
      socio[
      CONFIG.HEADERS.TITULOS
      ]
    );

  }

  buscar(texto) {

    texto = texto.toLowerCase();

    return Object.values(this.cache)

      .filter(s => {

        return s[
          CONFIG.HEADERS.NOMBRE
        ]

          .toLowerCase()

          .includes(texto);

      });

  }

}