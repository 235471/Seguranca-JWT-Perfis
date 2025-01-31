const { Router } = require('express');
const authMiddleware = require('../middleware/autenticado');
const SegurancaController = require('../controllers/segurancaController');
const roles = require('../middleware/roles');

const segurancaController = new SegurancaController();
const router = Router();

router.post('/seguranca/acl', authMiddleware, roles('Gerente'), (req, res, next) =>
  segurancaController.cadastrarAcl(req, res, next)
);
router.post('/seguranca/permissoes-roles', authMiddleware, roles('Gerente'), (req, res, next) =>
  segurancaController.cadastrarPermissoesRoles(req, res, next)
);

module.exports = router;
