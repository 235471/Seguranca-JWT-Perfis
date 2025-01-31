const constants = require('../config/constants');
const database = require('../models');
const BaseError = require('../Error/BaseError');
const roles = (rolesList) => {
  return async (req, res, next) => {
    const { usuarioId } = req;
    try {
      console.log(usuarioId);
      const user = await database.usuarios.findByPk(usuarioId, {
        include: [
          {
            model: database.roles,
            as: constants.USER_ROLES_ALIAS,
            attributes: ['id', 'nome'],
          },
        ],
        attributes: [],
      });

      if (!user) {
        throw new BaseError('Usuário não cadastrado', 401);
      }

      const roles = user[constants.USER_ROLES_ALIAS].map((role) => role.nome).some((role) => rolesList.includes(role));

      if (!roles) {
        throw new BaseError('Usuário não tem permissão para essa rota', 401);
      }

      return next();
    } catch (error) {
      next(error);
    }
  };
};

module.exports = roles;
