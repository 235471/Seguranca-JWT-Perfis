/* eslint-disable no-useless-catch */
const Services = require('./Services');
const badRequest = require('../utils/errorBadRequest');
const { v4: uuidv4 } = require('uuid');
class PermissaoService extends Services {
  constructor() {
    super('permissoes');
  }
  async cadastrar(dto) {
    try {
      // Verificar se o permissão já está cadastrada
      const permissao = await this.getOne({ nome: dto.nome });

      if (permissao) {
        badRequest('Permissão já cadastrada', 400, dto.nome); // Duplicidade de permissão
      }

      const novaPermissao = await this.createRegister({
        id: uuidv4(), // Gera um UUID único para o usuário
        nome: dto.nome,
        descricao: dto.descricao,
      });

      return novaPermissao;
    } catch (error) {
      throw error;
    }
  }

  async buscarTodos(query) {
    try {
      const userList = await this.getAllRegisters(undefined, undefined, query);
      return userList;
    } catch (error) {
      throw error;
    }
  }

  async buscarPorId(id) {
    try {
      const user = await this.getOneById(id);

      return user;
    } catch (error) {
      throw error;
    }
  }

  async atualizar(dto, id) {
    try {
      await this.getOneById(id);

      const updatedUser = await this.updateRegister(dto, { id });

      return updatedUser;
    } catch (error) {
      throw error;
    }
  }

  async remover(id) {
    try {
      const isDeleted = await this.deleteRegister({ id });

      if (isDeleted) return true;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = PermissaoService;
