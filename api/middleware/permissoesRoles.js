const constants = require('../config/constants');
const database = require('../models');
const Sequelize = require('sequelize');
const BaseError = require('../Error/BaseError');
const permissoesRoles = (permissoesList) => {
  return async (req, res, next) => {
    try {
      const { usuarioId } = req;

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

      const rolesIdList = user[constants.USER_ROLES_ALIAS].map((role) => role.id);

      if (rolesIdList.length == 0) {
        throw new BaseError('Usuário não tem permissão para essa rota', 401);
      }

      const roles = await database.roles.findAll({
        include: [
          {
            model: database.permissoes,
            as: constants.ROLE_PERMISSIONS_ALIAS,
            attributes: ['id', 'nome'],
          },
        ],
        where: {
          id: {
            [Sequelize.Op.in]: rolesIdList,
          },
        },
      });

      let permission = false;

      roles.map((role) => {
        permission = role[constants.ROLE_PERMISSIONS_ALIAS]
          .map((permissao) => permissao.nome)
          .some((permissao) => permissoesList.includes(permissao));
      });

      if (!permission) {
        throw new BaseError('Usuário não tem permissão para essa rota', 401);
      }

      return next();
    } catch (error) {
      next(error);
    }
  };
};

module.exports = permissoesRoles;
