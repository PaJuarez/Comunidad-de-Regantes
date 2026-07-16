/**
 * ==========================================================
 * Comunidad de Regantes - Sistema de Gestión
 * Archivo: SpreadsheetService.gs
 *
 * Versión: 0.4.4
 * Última actualización: 07/07/2026
 *
 * Servicio para gestionar el libro de Google Sheets.
 * ==========================================================
 */

class SpreadsheetService {

    constructor() {

        this.spreadsheet =
            SpreadsheetApp.getActiveSpreadsheet();

    }

    /**
     * Devuelve el Spreadsheet activo.
     */
    getSpreadsheet() {

        return this.spreadsheet;

    }

    /**
     * Devuelve la hoja activa.
     */
    getActiveSheet() {

        return this.spreadsheet.getActiveSheet();

    }

    /**
     * Devuelve una hoja por nombre.
     */
    getSheet(nombre) {

        return this.spreadsheet.getSheetByName(nombre);

    }

    /**
     * Comprueba si existe una hoja.
     */
    exists(nombre) {

        return this.getSheet(nombre) !== null;

    }

    /**
     * Crea una hoja.
     */
    createSheet(nombre) {

        if (this.exists(nombre)) {

            throw new Error(
                `Ya existe una hoja llamada "${nombre}".`
            );

        }

        return this.spreadsheet.insertSheet(nombre);

    }

    /**
     * Elimina una hoja.
     */
    deleteSheet(nombre) {

        const hoja = this.getSheet(nombre);

        if (!hoja) {

            return false;

        }

        this.spreadsheet.deleteSheet(hoja);

        return true;

    }

    /**
     * Devuelve todas las hojas.
     */
    getSheets() {

        return this.spreadsheet.getSheets();

    }

}