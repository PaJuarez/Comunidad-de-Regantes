/**
 * ==========================================================
 * SheetRepository.gs
 * ==========================================================
 */

class SheetRepository {

  constructor(spreadsheetService, sheetName) {

    this.sheetName = sheetName;

    this.spreadsheet = spreadsheetService;

    this.sheet = this.spreadsheet.getSheet(sheetName);

    if (!this.sheet) {

      throw new Error(
        `No existe la hoja "${sheetName}".`
      );

    }

    this.reload();

  }

  /**
   * Recarga los datos de la hoja.
   */
  reload() {

    this.data =
      this.sheet
        .getDataRange()
        .getValues();

    this.headers =
      this.data.shift();

  }

  /**
   * Devuelve todas las filas.
   */
  getRows() {

    return this.data;

  }

  /**
   * Devuelve los encabezados.
   */
  getHeaders() {

    return this.headers;

  }

  /**
   * Devuelve el índice de una columna.
   */
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
   * Convierte una fila en objeto.
   */
  toObject(row) {

    const obj = {};

    this.headers.forEach((header, index) => {

      obj[header] = row[index];

    });

    return obj;

  }

  /**
   * Busca una fila por el valor de una columna.
   */
  findOne(columnName, value) {

    const index =
      this.getColumnIndex(columnName);

    const row =
      this.data.find(r => r[index] == value);

    return row
      ? this.toObject(row)
      : null;

  }

  /**
   * Busca varias filas.
   */
  findAll(columnName, value) {

    const index =
      this.getColumnIndex(columnName);

    return this.data

      .filter(r => r[index] == value)

      .map(r => this.toObject(r));

  }

  /**
   * Actualiza un valor.
   */
  update(searchColumn, searchValue, updateColumn, newValue) {

    const searchIndex =
      this.getColumnIndex(searchColumn);

    const updateIndex =
      this.getColumnIndex(updateColumn);

    for (let i = 0; i < this.data.length; i++) {

      if (this.data[i][searchIndex] == searchValue) {

        this.sheet
          .getRange(
            i + 2,
            updateIndex + 1
          )
          .setValue(newValue);

        this.reload();

        return true;

      }

    }

    return false;

  }

  /**
   * Escribe los encabezados.
   */
  setHeaders(headers) {

    this.sheet.clear();

    this.sheet
      .getRange(
        1,
        1,
        1,
        headers.length
      )
      .setValues([headers]);

    this.sheet
      .getRange(
        1,
        1,
        1,
        headers.length
      )
      .setFontWeight("bold");

    this.reload();

  }

  /**
   * Añade varias filas de una sola vez.
   */
  appendRows(rows) {

    if (!rows || rows.length === 0) {
      return;
    }

    const firstRow =
      this.sheet.getLastRow() + 1;

    this.sheet

      .getRange(
        firstRow,
        1,
        rows.length,
        rows[0].length
      )

      .setValues(rows);

    this.reload();

  }

}