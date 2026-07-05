/**
 * ==========================================================
 * ErrorHandler.gs
 * ==========================================================
 */

class ErrorHandler {

  static handle(error) {

    console.error(error);

    SpreadsheetApp
      .getUi()
      .alert(
        "Se ha producido un error.\n\n" +
        error.message
      );

    AppLogger.info(
      "ERROR",
      error.message
    );

  }

}