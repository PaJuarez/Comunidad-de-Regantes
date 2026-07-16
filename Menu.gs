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

/**
 * Crea una nueva campaña.
 */
function crearCampania() {

  const ui = SpreadsheetApp.getUi();

  const sugerencia = obtenerNombreCampaniaSugerido();

  const respuesta = ui.prompt(
    "Crear campaña",
    "Introduzca el nombre de la campaña.\n\nSugerencia: " + sugerencia,
    ui.ButtonSet.OK_CANCEL
  );

  if (respuesta.getSelectedButton() !== ui.Button.OK) {
    return;
  }

  let nombre = respuesta.getResponseText().trim();

  // Si el usuario deja el campo vacío,
  // utilizamos la sugerencia automáticamente.
  if (!nombre) {
    nombre = sugerencia;
  }

  const campanias = new CampaniasService();

  const hoja = campanias.crearCampania(nombre);

  if (!hoja) {
    return;
  }

  ui.alert(
    `La campaña "${nombre}" se ha creado correctamente.`
  );

  /**
 * Devuelve el nombre sugerido para una campaña.
 */
  function obtenerNombreCampaniaSugerido() {

    const hoy = new Date();

    const anio = hoy.getFullYear();

    const semestre =
      (hoy.getMonth() < 6)
        ? "Primer semestre"
        : "Segundo semestre";

    return `Lecturas ${anio} - ${semestre}`;

  }
}

