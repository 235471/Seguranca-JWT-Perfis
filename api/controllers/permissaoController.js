const PermissaoService = require('../services/permissaoService');
const Controller = require('./Controller');

const permissaoService = new PermissaoService();

class PermissaoController extends Controller {
  constructor() {
    super(permissaoService);
  }
}

module.exports = PermissaoController;
