/* eslint-disable no-useless-catch */
const { v4: uuidv4 } = require('uuid');
const Services = require('./Services');
const badRequest = require('../utils/errorBadRequest');

class ProdutoService extends Services {
  constructor() {
    super('produtos');
  }

  // Cadastro de um novo produto
  async cadastrar(dto) {
    try {
      // Verifica se o produto existe utilizando o método genérico getOneById
      const produtoExistente = await this.getOne({ nome: dto.nome });

      // Se o produto já existir, o método getOne retornará o registro e lançará um erro.
      if (produtoExistente) {
        badRequest('Produto já cadastrado', 400, `Já existe um produto com nome ${dto.nome}`);
      }
      const newProduto = await this.createRegister({
        id: uuidv4(), // Gera um UUID único para o produto
        nome: dto.nome,
        descricao: dto.descricao,
        preco: dto.preco,
      });

      return newProduto;
    } catch (error) {
      throw error;
    }
  }

  async buscarTodos(query) {
    try {
      const produtos = await this.getAllRegisters(undefined, undefined, query);

      return produtos;
    } catch (error) {
      throw error;
    }
  }
  // Busca um produto pelo ID e lança erro caso não encontre
  async buscarPorId(id) {
    try {
      const produto = await this.getOneById(id);

      return produto;
    } catch (error) {
      throw error;
    }
  }

  async remover(id) {
    try {
      // Chama o método deleteRegister da classe base, passando apenas o ID como parte do where
      const isDeleted = await this.deleteRegister({ id });

      // Se a exclusão for bem-sucedida, retornamos a mensagem de sucesso
      if (isDeleted) return true;
    } catch (error) {
      throw error;
    }
  }

  async atualizar(dto, id) {
    try {
      // Verifica se o produto existe utilizando o método genérico getOneById
      const nomeExistente = await this.getOne({ nome: dto.nome });

      // Se o produto já existir, o método getOne retornará o registro e lançará um erro.
      if (nomeExistente) {
        badRequest('Produto já cadastrado', 400, `Já existe um produto com nome ${dto.nome}`);
      }

      const produtoExistente = await this.getOneById(id);

      const updatedProdutoData = { ...produtoExistente.toJSON(), ...dto };
      // Atualiza o produto com os novos dados (não precisamos de save(), pois o updateRegister irá fazer isso)
      const updatedProduto = await this.updateRegister(updatedProdutoData, { id });

      return updatedProduto;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = ProdutoService;
