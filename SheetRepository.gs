/**
 * ==========================================================
 * Comunidad de Regantes
 * Archivo: SheetRepository.gs
 *
 * Versión: 0.3.0
 * Última actualización: 05/07/2026
 *
 * Repositorio genérico para acceder a hojas de cálculo.
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

  /**
   * Recarga los datos de la hoja.
   */
  reload() {

    this.data = this.sheet
      .getDataRange()
      .getValues();

    this.headers = this.data.shift();

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

    const index = this.headers.indexOf(name);

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

  /**
   * Busca el primer registro que coincida con un valor.
   *
   * @param {string} field
   * @param {*} value
   * @returns {Object|null}
   */
  findOne(field, value) {

    const index = this.getColumnIndex(field);

    const row = this.data.find(r => r[index] == value);

    if (!row) {
      return null;
    }

    return this.toObject(row);

  }

  /**
   * Devuelve todos los registros que coincidan.
   *
   * @param {string} field
   * @param {*} value
   * @returns {Object[]}
   */
  findAll(field, value) {

    const index = this.getColumnIndex(field);

    return this.data
      .filter(r => r[index] == value)
      .map(r => this.toObject(r));

  }

}