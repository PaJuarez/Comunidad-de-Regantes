/**
 * ==========================================================
 * BaseService.gs
 * Clase base para todos los servicios
 * ==========================================================
 */

class BaseService {

  constructor(moduleName) {
    this.moduleName = moduleName;
  }

  info(action) {
    AppLogger.info(this.moduleName, action);
  }

  error(action, error) {
    AppLogger.error(this.moduleName, action, error);
  }

}