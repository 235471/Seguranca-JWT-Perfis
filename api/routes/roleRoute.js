const { Router } = require('express');
const authMiddleware = require('../middleware/autenticado');
const RoleController = require('../controllers/roleController');
const roles = require('../middleware/roles');
const validacaoMiddleware = require('../middleware/validacaoMiddleware');
const { roleSchema } = require('../validacoes/index');

const roleController = new RoleController();

const router = Router();

router.post(
  '/roles',
  authMiddleware,
  roles('Gerente'),
  validacaoMiddleware(roleSchema),
  roleController.createRegister.bind(roleController)
);

router.get('/roles', authMiddleware, roleController.getAll.bind(roleController));

router.get('/roles/search', authMiddleware, roleController.getByQuery.bind(roleController));

router.get('/roles/id/:id', authMiddleware, roleController.getOneById.bind(roleController));

router.put('/roles/id/:id', authMiddleware, roles('Gerente'), roleController.update.bind(roleController));

router.delete('/roles/id/:id', authMiddleware, roles('Gerente'), roleController.deleteRegister.bind(roleController));

module.exports = router;
