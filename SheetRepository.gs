/**
 * ==========================================================
 * SheetRepository.gs
 * ==========================================================
 */

class SheetRepository {

  constructor(sheetName) {

    this.sheetName = sheetName;

    this.sheet = SpreadsheetApp
      .getActive()
      .getSheetByName(sheetName);

    if (!this.sheet) {
      throw new Error(
        `No existe la hoja "${sheetName}".`
      );
    }

    this.reload();

  }

  reload() {

    this.data =
      this.sheet
      .getDataRange()
      .getValues();

    this.headers =
      this.data.shift();

  }

  getRows() {

    return this.data;

  }

  getHeaders() {

    return this.headers;

  }

  getColumnIndex(name) {

    const index =
      this.headers.indexOf(name);

    if (index === -1) {

      throw new Error(
        `No existe la columna "${name}".`
      );

    }

    return index;

  }

    /**
    * Convierte una fila en un objeto.
    */
    toObject(row) {

        const obj = {};

        this.headers.forEach((header, index) => {

            obj[header] = row[index];

        });

    return obj;

    }

}