const { criarProdutoSchema, atualizarProdutoSchema } = require('./produtoValidacao');
const { criarUsuarioSchema, atualizarUsuarioSchema } = require('./usuarioValidacao');
const { roleSchema } = require('./roleValidacao');
const { permissaoSchema } = require('./permissaoValidacao');

module.exports = {
  criarProdutoSchema,
  atualizarProdutoSchema,
  criarUsuarioSchema,
  atualizarUsuarioSchema,
  roleSchema,
  permissaoSchema,
};
