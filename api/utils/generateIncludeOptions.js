const database = require('../models');
const constants = require('../config/constants'); // Importando as constantes

const generateUserIncludeOptions = (includePivot = false) => [
  {
    model: database.roles,
    as: constants.USER_ROLES_ALIAS,
    attributes: constants.USER_ROLE_ATTRIBUTES,
    ...(includePivot && { through: { attributes: constants.ROLE_PIVOT_ATTRIBUTES } }),
  },
  {
    model: database.permissoes,
    as: constants.USER_PERMISSIONS_ALIAS,
    attributes: constants.USER_PERMISSION_ATTRIBUTES,
    ...(includePivot && { through: { attributes: constants.PERMISSION_PIVOT_ATTRIBUTES } }),
  },
];

const generateRoleIncludeOptions = (includePivot = false) => [
  {
    model: database.permissoes,
    as: constants.ROLE_PERMISSIONS_ALIAS,
    attributes: constants.ROLE_PERMISSION_ATTRIBUTES,
    ...(includePivot && { through: { attributes: constants.ROLE_PERMISSION_PIVOT_ATTRIBUTES } }),
  },
];

module.exports = { generateUserIncludeOptions, generateRoleIncludeOptions };
