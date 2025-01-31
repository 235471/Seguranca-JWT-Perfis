/* eslint-disable no-useless-catch */
const Services = require('./Services');
const badRequest = require('../utils/errorBadRequest');
const { v4: uuidv4 } = require('uuid');

class RoleService extends Services {
  constructor() {
    super('roles');
  }

  async cadastrar(dto) {
    try {
      // Verificar se a role já está cadastrado
      const role = await this.getOne({ nome: dto.nome });

      if (role) {
        badRequest('Role já cadastrada', 400, dto.nome); // Duplicidade de role
      }

      const novaRole = await this.createRegister({
        id: uuidv4(), // Gera um UUID único para a role
        nome: dto.nome,
        descricao: dto.descricao,
      });

      return novaRole;
    } catch (error) {
      throw error;
    }
  }

  async buscarTodos(query) {
    try {
      const roleList = this.getAllRegisters(undefined, undefined, query);
      return roleList;
    } catch (error) {
      throw error;
    }
  }

  async buscarPorId(id) {
    try {
      const role = this.getOneById(id);

      return role;
    } catch (error) {
      throw error;
    }
  }

  async atualizar(dto, id) {
    try {
      await this.getOneById(id);

      const updatedRole = this.updateRegister(dto, { id });

      return updatedRole;
    } catch (error) {
      throw error;
    }
  }

  async remover(id) {
    try {
      const isDeleted = this.deleteRegister({ id });

      if (isDeleted) return true;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = RoleService;
