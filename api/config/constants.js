module.exports = {
  USER_ROLES_ALIAS: 'usuario_roles',
  USER_PERMISSIONS_ALIAS: 'usuario_permissoes',
  ROLE_PERMISSIONS_ALIAS: 'roles_das_permissoes',
  PERMISSION_ROLE_ALIAS: 'permissoes_da_role',

  USER_ROLE_ATTRIBUTES: ['id', 'nome', 'descricao'],
  USER_PERMISSION_ATTRIBUTES: ['id', 'nome', 'descricao'],
  ROLE_PERMISSION_ATTRIBUTES: ['id', 'nome', 'descricao'],

  ROLE_PIVOT_ATTRIBUTES: ['usuario_id', 'role_id', 'createdAt', 'updatedAt'],
  PERMISSION_PIVOT_ATTRIBUTES: ['usuario_id', 'permissao_id', 'createdAt', 'updatedAt'],
  ROLE_PERMISSION_PIVOT_ATTRIBUTES: ['role_id', 'permissao_id', 'createdAt', 'updatedAt'],
};
