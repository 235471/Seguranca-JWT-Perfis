const { Router } = require('express');
const authMiddleware = require('../middleware/autenticado');
const PermissaoController = require('../controllers/permissaoController');
const roles = require('../middleware/roles');
const validacaoMiddleware = require('../middleware/validacaoMiddleware');
const { permissaoSchema } = require('../validacoes/index');
const router = Router();

const permissaoController = new PermissaoController();

router.post(
  '/permissao',
  authMiddleware,
  roles('Gerente'),
  validacaoMiddleware(permissaoSchema),
  permissaoController.createRegister.bind(permissaoController)
);

router.get('/permissao', authMiddleware, roles('Gerente'), permissaoController.getAll.bind(permissaoController));

router.get('/permissao/search', authMiddleware, roles('Gerente'), permissaoController.getByQuery.bind(permissaoController));

router.get('/permissao/id/:id', authMiddleware, roles('Gerente'), permissaoController.getOneById.bind(permissaoController));

router.put('/permissao/id/:id', authMiddleware, roles('Gerente'), permissaoController.update.bind(permissaoController));

router.delete(
  '/permissao/id/:id',
  authMiddleware,
  roles('Gerente'),
  permissaoController.deleteRegister.bind(permissaoController)
);

module.exports = router;
