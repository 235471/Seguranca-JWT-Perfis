const { Router } = require('express');
const UsuarioController = require('../controllers/usuarioController');
const authMiddleware = require('../middleware/autenticado'); // Importando o middleware
const permissoesRoles = require('../middleware/permissoesRoles');
const validacaoMiddleware = require('../middleware/validacaoMiddleware');
const usuarioController = new UsuarioController();

const { criarUsuarioSchema, atualizarUsuarioSchema } = require('../validacoes/index');
const router = Router();

router.post(
  '/usuarios',
  authMiddleware,
  permissoesRoles(['adicionar usuario']),
  validacaoMiddleware(criarUsuarioSchema),
  usuarioController.createRegister.bind(usuarioController)
);
router.get('/usuarios', authMiddleware, permissoesRoles(['listar usuario']), usuarioController.getAll.bind(usuarioController));

router.get(
  '/usuarios/search',
  authMiddleware,
  permissoesRoles(['listar usuario']),
  usuarioController.getByQuery.bind(usuarioController)
);

router.get(
  '/usuarios/id/:id',
  authMiddleware,
  permissoesRoles(['listar usuario']),
  usuarioController.getOneById.bind(usuarioController)
);

router.put(
  '/usuarios/id/:id',
  authMiddleware,
  permissoesRoles(['editar usuario']),
  validacaoMiddleware(atualizarUsuarioSchema),
  usuarioController.update.bind(usuarioController)
);

router.delete(
  '/usuarios/id/:id',
  authMiddleware,
  permissoesRoles(['remover usuario']),
  usuarioController.deleteRegister.bind(usuarioController)
);

module.exports = router;
