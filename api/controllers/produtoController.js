const ProdutoService = require('../services/produtoService');
const Controller = require('./Controller');

class ProdutoController extends Controller {
  constructor() {
    super(new ProdutoService());
  }
}

module.exports = ProdutoController;
