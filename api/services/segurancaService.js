const handleError = require('../utils/errorHandler');
const database = require('../models');
const BaseError = require('../Error/BaseError'); // Classe BaseError
const Sequelize = require('sequelize');
const { generateUserIncludeOptions, generateRoleIncludeOptions } = require('../utils/generateIncludeOptions');

class SegurancaService {
  // Função para buscar usuário com include e um parâmetro opcional para o "through"
  async findUserById(id, includePivot = false) {
    const includeOptions = generateUserIncludeOptions(includePivot);

    return await database.usuarios.findByPk(id, {
      include: includeOptions,
    });
  }

  // Função para buscar role com include e um parâmetro opcional para o "through"
  async findRoleById(id, includePivot = false) {
    const includeOptions = generateRoleIncludeOptions(includePivot);

    return await database.roles.findByPk(id, {
      include: includeOptions,
    });
  }
  async cadastrarAcl(dto) {
    try {
      const { usuarioId, roles } = dto;
      // Buscar o usuário com roles e permissoes (sem o "through" na primeira consulta)
      const user = await this.findUserById(usuarioId, false);

      if (!user) {
        throw new BaseError('Usuário não encontrado', 404);
      }

      const rolesCadastradas = await database.roles.findAll({
        where: {
          id: {
            [Sequelize.Op.in]: roles,
          },
        },
      });

      // Associa os papéis ao usuário
      await user.setUsuario_roles(rolesCadastradas);

      // Agora associamos as permissões dos papéis ao usuário
      for (const role of rolesCadastradas) {
        const permissoesAssociadas = await role.getRoles_das_permissoes(); // Get permissões associadas ao papel
        await user.addUsuario_permissoes(permissoesAssociadas); // Adiciona permissões associadas ao usuário
      }

      return await this.findUserById(usuarioId, true); // Retorna o usuário com todas as permissões
    } catch (error) {
      handleError(error);
    }
  }

  async cadastrarPermissoesRoles(dto) {
    try {
      const { roleId, permissoes } = dto;
      // Buscar a role com as permissões associadas (sem o "through" na primeira consulta)
      const role = await this.findRoleById(roleId, false);

      if (!role) {
        throw new BaseError('Role não cadastrada', 404);
      }

      const permissoesCadastradas = await database.permissoes.findAll({
        where: {
          id: {
            [Sequelize.Op.in]: permissoes,
          },
        },
      });

      await role.setRoles_das_permissoes(permissoesCadastradas);

      // Buscar e retornar a role atualizada com as permissões, incluindo os atributos do "through"
      return await this.findRoleById(roleId, true);
    } catch (error) {
      handleError(error);
    }
  }
}

module.exports = SegurancaService;
