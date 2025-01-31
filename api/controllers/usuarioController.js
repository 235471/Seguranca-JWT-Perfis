const UsuarioService = require('../services/usuarioService');
const Controller = require('./Controller');

const usuarioService = new UsuarioService();

class UsuarioController extends Controller {
  constructor() {
    super(usuarioService);
  }
}

module.exports = UsuarioController;
