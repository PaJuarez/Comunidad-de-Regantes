/**
 * ==========================================================
 * Comunidad de Regantes
 * Archivo: Test.gs
 *
 * Funciones de prueba del proyecto.
 * ==========================================================
 */

/**
 * Prueba SociosService
 */
function testSocios() {

  const socios = new SociosService();

  const socio = socios.getByNumero(2);

  Logger.log(socio);

}

/**
 * Prueba ContadoresService
 */
function testContadores() {

  const contadores = new ContadoresService();

  Logger.log(contadores.getAll());

}

/**
 * Prueba relación Contador -> Socio
 */
function testRelacionContadorSocio() {

  const socios = new SociosService();
  const contadores = new ContadoresService();

  const contador = contadores.getByNumero(1);

  if (!contador) {
    Logger.log("No existe el contador.");
    return;
  }

  const numeroSocio = contadores.getNumeroSocio(1);

  const socio = socios.getByNumero(numeroSocio);

  Logger.log("Contador:");
  Logger.log(contador);

  Logger.log("Socio:");
  Logger.log(socio);

}

/**
 * Prueba generación de campaña
 */
function testGenerarCampania() {

  const contadores = new ContadoresService();

  const filas = contadores.generarFilasCampania();

  Logger.log(filas);

}

/**
 * Crea una hoja temporal con los datos de la campaña.
 */
function testCrearHojaTemporal() {

  const nombreHoja = "TEST";

  const ss = SpreadsheetApp.getActiveSpreadsheet();

  let sheet = ss.getSheetByName(nombreHoja);

  if (sheet) {
    ss.deleteSheet(sheet);
  }

  sheet = ss.insertSheet(nombreHoja);

  const contadores = new ContadoresService();

  const datos = contadores.generarFilasCampania();

  // Cabecera
  datos.unshift([
    "Nº Orden Contador",
    "Nº Socio",
    "Nombre",
    "Nº Títulos"
  ]);

  sheet
    .getRange(1, 1, datos.length, datos[0].length)
    .setValues(datos);

  Logger.log("Hoja TEST creada correctamente.");

}