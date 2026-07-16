/**
 * ==========================================================
 * Helpers.gs
 * ==========================================================
 */

class Helpers {

  /**
   * Devuelve la hoja indicada.
   */
  static getSheet(nombre) {

    const sheet =
      SpreadsheetApp
        .getActiveSpreadsheet()
        .getSheetByName(nombre);

    if (!sheet) {

      throw new Error(
        `No existe la hoja "${nombre}".`
      );

    }

    return sheet;

  }

  /**
   * Devuelve todos los datos.
   */
  static getData(sheet) {

    return sheet
      .getDataRange()
      .getValues();

  }

  /**
   * Busca una columna por su nombre.
   */
  static getColumnIndex(headers, columnName) {

    const index =
      headers.indexOf(columnName);

    if (index === -1) {

      throw new Error(
        `No existe la columna "${columnName}".`
      );

    }

    return index;

  }

  /**
   * Fecha actual.
   */
  static now() {

    return new Date();

  }

}