const Controller = require('./Controller');
const SegurancaService = require('../services/segurancaService');

const segurancaService = new SegurancaService();
class SegurancaController extends Controller {
  constructor() {
    super(segurancaService);
  }

  async cadastrarAcl(req, res, next) {
    try {
      const { roles, permissoes } = req.body;
      const { usuarioId } = req;

      const acl = await segurancaService.cadastrarAcl({ roles, permissoes, usuarioId });
      return res.status(201).json(acl);
    } catch (error) {
      next(error);
    }
  }

  async cadastrarPermissoesRoles(req, res, next) {
    try {
      const { roleId, permissoes } = req.body;

      const permissoesRoles = await segurancaService.cadastrarPermissoesRoles({ roleId, permissoes });
      return res.status(201).json(permissoesRoles);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = SegurancaController;
