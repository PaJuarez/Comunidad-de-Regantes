/**
 * ==========================================================
 * Comunidad de Regantes - Sistema de Gestión
 * Archivo: Installer.gs
 *
 * Versión: 0.4.3
 * Última actualización: 07/07/2026
 *
 * Instalación y actualización del proyecto.
 * ==========================================================
 */

class Installer {

  constructor() {

    this.spreadsheet =
      new SpreadsheetService();

  }

  /**
   * ======================================================
   * Instala o actualiza el proyecto.
   * ======================================================
   */
  install() {

    this.createConfigurationSheet();

    this.createLogSheet();

    Logger.log(
      "Proyecto instalado correctamente."
    );

  }

  /**
   * ======================================================
   * Crea o actualiza la hoja Configuración.
   * ======================================================
   */
  createConfigurationSheet() {

    let sheet =
      this.spreadsheet.getSheet(
        CONFIG.SHEETS.CONFIG
      );

    if (!sheet) {

      sheet =
        this.spreadsheet.createSheet(
          CONFIG.SHEETS.CONFIG
        );

      sheet.getRange(1, 1, 1, 3)
        .setValues([[
          "Parámetro",
          "Valor",
          "Descripción"
        ]]);

      sheet.getRange("A1:C1")
        .setFontWeight("bold");

    }

    const parametros = [

      {
        nombre:
          CONFIG.SETTINGS.WATER_PRICE,

        valor: 0.80,

        descripcion:
          "Precio del agua por m³"
      },

      {
        nombre:
          CONFIG.SETTINGS.VAT,

        valor: 10,

        descripcion:
          "IVA aplicado (%)"
      },

      {
        nombre:
          CONFIG.SETTINGS.CURRENCY,

        valor: "€",

        descripcion:
          "Moneda utilizada"
      },

      {
        nombre:
          CONFIG.SETTINGS.NO_DOMICILIADO,

        valor: "NO DOMICILIADO",

        descripcion:
          "Texto que identifica un socio no domiciliado"
      }

    ];

    const ultimaFila =
      sheet.getLastRow();

    const existentes =
      ultimaFila > 1

        ? sheet
          .getRange(
            2,
            1,
            ultimaFila - 1,
            1
          )
          .getValues()
          .flat()

        : [];

    parametros.forEach(param => {

      if (!existentes.includes(
        param.nombre
      )) {

        sheet.appendRow([

          param.nombre,

          param.valor,

          param.descripcion

        ]);

      }

    });

    sheet.autoResizeColumns(1, 3);

  }

  /**
   * ======================================================
   * Crea la hoja LOG.
   * ======================================================
   */
  createLogSheet() {

    let sheet =
      this.spreadsheet.getSheet(
        CONFIG.SHEETS.LOG
      );

    if (sheet)
      return;

    sheet =
      this.spreadsheet.createSheet(
        CONFIG.SHEETS.LOG
      );

    sheet.getRange(1, 1, 1, 3)

      .setValues([[
        "Fecha",
        "Nivel",
        "Mensaje"
      ]]);

    sheet.getRange("A1:C1")

      .setFontWeight("bold");

    sheet.autoResizeColumns(1, 3);

  }

}

/**
 * ==========================================================
 * Punto de entrada público.
 * ==========================================================
 */

function installProject() {

  new Installer().install();

}