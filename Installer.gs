/**
 * ==========================================================
 * Installer.gs
 * ==========================================================
 */

function installProject() {

  try {

    createConfigSheet();

    createLogSheet();

    validateProject();

    SpreadsheetApp
      .getUi()
      .alert(
        "Instalación finalizada correctamente."
      );

    AppLogger.info(
      "Instalación"
    );

  }

  catch (error) {

    ErrorHandler.handle(error);

  }

}