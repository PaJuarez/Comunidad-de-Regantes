/**
 * ==========================================================
 * Comunidad de Regantes
 * Menu.gs
 * ==========================================================
 */

/**
 * Se ejecuta automáticamente al abrir la hoja.
 */
function onOpen() {

  SpreadsheetApp.getUi()
    .createMenu("💧 Regantes")
    .addItem("🚀 Instalar proyecto", "installProject")
    .addSeparator()
    .addItem("🔄 Sincronizar contadores", "syncContadores")
    .addItem("📄 Crear campaña", "crearCampania")
    .addSeparator()
    .addItem("ℹ Información", "showInfo")
    .addToUi();

}

/**
 * Muestra información del proyecto.
 */
function showInfo() {

  SpreadsheetApp.getUi().alert(
    CONFIG.APP.NAME +
    "\nVersión: " +
    CONFIG.APP.VERSION
  );

}

/**
 * Funciones provisionales.
 * Se implementarán en próximas versiones.
 */

function syncContadores() {

  SpreadsheetApp.getUi().alert(
    "Disponible en la versión 0.3.0"
  );

}

function crearCampania() {

  SpreadsheetApp.getUi().alert(
    "Disponible en la versión 0.4.0"
  );

}