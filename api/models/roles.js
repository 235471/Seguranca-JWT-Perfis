'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Roles extends Model {
    static associate(models) {
      Roles.belongsToMany(models.usuarios, {
        through: models.usuarios_roles,
        as: 'roles_do_usuarios',
        foreignKey: 'role_id',
      });

      Roles.belongsToMany(models.permissoes, {
        through: models.roles_permissoes,
        as: 'roles_das_permissoes',
        foreignKey: 'role_id',
      });
    }
  }
  Roles.init(
    {
      nome: DataTypes.STRING,
      descricao: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'roles',
    }
  );
  return Roles;
};
