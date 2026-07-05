/**
 * ==========================================================
 * Logger.gs
 * ==========================================================
 */

class AppLogger {

  static get sheet() {
    return SpreadsheetApp
      .getActive()
      .getSheetByName(CONFIG.SHEETS.LOG);
  }

  static info(module, action, result = "OK") {

    if (!this.sheet) return;

    this.sheet.appendRow([
      new Date(),
      Session.getActiveUser().getEmail(),
      module,
      action,
      result
    ]);

  }

  static error(module, action, error) {

    this.info(
      module,
      action,
      error.message
    );

  }

}