/* eslint-disable no-useless-catch */
const Services = require('./Services');
const BaseError = require('../Error/BaseError');
const { compare } = require('bcryptjs');
const { sign } = require('jsonwebtoken');
class AuthService extends Services {
  constructor() {
    super('usuarios');
  }
  async login(dto) {
    if (!dto.email) {
      throw new BaseError('O campo "email" é obrigatório', 400);
    }
    try {
      const user = await this.getOne({ email: dto.email }, 'withPassword');

      if (!user) {
        this.invalidCredentials();
      }
      console.log(dto.senha, user.senha);
      const isPassword = await compare(dto.senha, user.senha);

      if (!isPassword) {
        this.invalidCredentials();
      }
      const accessToken = sign(
        {
          id: user.id,
          email: user.email,
        },
        process.env.SECRET_KEY,
        { expiresIn: '1d' }
      );
      return { accessToken };
    } catch (error) {
      throw error;
    }
  }

  invalidCredentials() {
    throw new BaseError('Credenciais inválidas', 401);
  }
}

module.exports = AuthService;
