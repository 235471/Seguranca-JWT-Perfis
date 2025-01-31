const constants = require('../config/constants');
const database = require('../models');
const BaseError = require('../Error/BaseError');
const permissoes = (permissioesLista) => {
  return async (req, res, next) => {
    const { usuarioId } = req;
    try {
      const user = await database.usuarios.findByPk(usuarioId, {
        include: [
          {
            model: database.permissoes,
            as: constants.USER_PERMISSIONS_ALIAS,
            attributes: ['id', 'nome'],
          },
        ],
        attributes: [],
      });

      if (!user) {
        throw new BaseError('Usuário não cadastrado', 401);
      }

      const permissoes = user[constants.USER_PERMISSIONS_ALIAS]
        .map((permissao) => permissao.nome)
        .some((permissao) => permissioesLista.includes(permissao));

      if (!permissoes) {
        throw new BaseError('Usuário não tem permissão para essa rota', 401);
      }

      return next();
    } catch (error) {
      next(error);
    }
  };
};

module.exports = permissoes;
