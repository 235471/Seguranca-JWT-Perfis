const { Router } = require('express');
const ProdutoController = require('../controllers/produtoController');
const authMiddleware = require('../middleware/autenticado'); // Importando o middleware
const permissoesRoles = require('../middleware/permissoesRoles');
const validacaoMiddleware = require('../middleware/validacaoMiddleware');
const produtoController = new ProdutoController();
const router = Router();

const { criarProdutoSchema, atualizarProdutoSchema } = require('../validacoes/index');

router.post(
  '/produto',
  authMiddleware,
  permissoesRoles(['adicionar produto']),
  validacaoMiddleware(criarProdutoSchema),
  produtoController.createRegister.bind(produtoController)
);

router.get('/produto', authMiddleware, permissoesRoles(['listar produto']), produtoController.getAll.bind(produtoController));

router.get(
  '/produto/search',
  authMiddleware,
  permissoesRoles(['listar produto']),
  produtoController.getByQuery.bind(produtoController)
);

router.get(
  '/produto/id/:id',
  authMiddleware,
  permissoesRoles(['listar produto']),
  produtoController.getOneById.bind(produtoController)
);

router.delete(
  '/produto/id/:id',
  authMiddleware,
  permissoesRoles(['remover produto']),
  produtoController.deleteRegister.bind(produtoController)
);

router.put(
  '/produto/id/:id',
  authMiddleware,
  permissoesRoles(['editar produto']),
  validacaoMiddleware(atualizarProdutoSchema),
  produtoController.update.bind(produtoController)
);

module.exports = router;
