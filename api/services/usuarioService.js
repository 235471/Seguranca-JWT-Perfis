/* eslint-disable no-useless-catch */
const { v4: uuidv4 } = require('uuid');
const { hash } = require('bcryptjs');
const Services = require('./Services');
const badRequest = require('../utils/errorBadRequest');
const { generateUserIncludeOptions } = require('../utils/generateIncludeOptions');

class UsuarioService extends Services {
  constructor() {
    super('usuarios');
  }
  async cadastrar(dto) {
    try {
      // Verificar se o email já está cadastrado
      const usuario = await this.getOne({ email: dto.email });

      if (usuario) {
        badRequest('Email já cadastrado', 400, `Já existe um usuário com email ${dto.email}`); // Duplicidade de email
      }

      const senhaHash = await hash(dto.senha, 8);

      // Caso o email não esteja duplicado, criar o novo usuário
      const novoUsuario = await this.createRegister({
        id: uuidv4(), // Gera um UUID único para o usuário
        nome: dto.nome,
        email: dto.email,
        senha: senhaHash,
      });

      return novoUsuario;
    } catch (error) {
      throw error;
    }
  }

  async buscarTodos(query) {
    try {
      const includeOptions = generateUserIncludeOptions(true);
      const userList = this.getAllRegisters({}, includeOptions, query);
      return userList;
    } catch (error) {
      throw error;
    }
  }

  async buscarPorId(id) {
    try {
      const user = this.getOneById(id);

      return user;
    } catch (error) {
      throw error;
    }
  }

  async atualizar(dto, id) {
    try {
      await this.getOneById(id);

      const updatedUser = this.updateRegister(dto, { id });

      return updatedUser;
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

module.exports = UsuarioService;
