const dataSource = require('../models');
const handleError = require('../utils/errorHandler'); // Função de tratamento de erro
const BaseError = require('../Error/BaseError'); // Classe BaseError
const applyPagination = require('../utils/applyPagination');
const queryBuild = require('../utils/queryBuild');
class Services {
  constructor(modelName) {
    this.model = modelName;
  }

  // Obtém todos os registros
  async getAllRegisters(where = {}, includes = [], query) {
    try {
      // Cria os parâmetros de paginação e offset a partir do `query`
      const paginationOptions = applyPagination(query);
      const records = await dataSource[this.model].findAll({ where: { ...where }, include: includes, ...paginationOptions });

      return records;
    } catch (error) {
      handleError(error); // Chama a função para tratar o erro
    }
  }

  // Obtém registros por escopo
  async getRegisterByScope(scope) {
    try {
      const records = await dataSource[this.model].scope(scope).findAll();
      if (!records || records.length === 0) {
        throw new BaseError('Nenhum registro encontrado para o escopo fornecido', 404);
      }
      return records;
    } catch (error) {
      handleError(error);
    }
  }

  // Obtém um registro por ID
  async getOneById(id) {
    try {
      const record = await dataSource[this.model].findByPk(id);
      if (!record) {
        throw new BaseError('Registro não encontrado', 404);
      }
      return record;
    } catch (error) {
      handleError(error); // Chama a função para tratar o erro
    }
  }

  // Obtém um único registro de acordo com uma condição
  async getOne(where, scope = null) {
    try {
      const query = { where: { ...where } };

      let model = dataSource[this.model]; // Obtém o modelo

      if (scope) {
        model = model.scope(scope); // Aplica o scope *ao modelo*
      }

      const record = await model.findOne(query);

      return record;
    } catch (error) {
      handleError(error); // Chama a função para tratar o erro
    }
  }

  async getByQuery(query, scope = null) {
    try {
      let model = dataSource[this.model]; // Obtém o modelo

      if (scope) {
        model = model.scope(scope); // Aplica o scope *ao modelo*
      }
      // Extrai os parâmetros de paginação e remove da query
      const { page, limit, ...filteredQuery } = query; // Filtra page/limit

      // Cria os parâmetros de paginação e offset a partir do `query`
      const paginationOptions = applyPagination({ page, limit });

      // Construa o filtro (where) usando a query
      const where = queryBuild(filteredQuery);

      // Combina a paginação com o filtro `where`
      const queryOptions = {
        ...paginationOptions,
        where,
      };

      const record = await model.findAll(queryOptions);

      return record;
    } catch (error) {
      handleError(error); // Chama a função para tratar o erro
    }
  }

  // Conta registros com base nas opções fornecidas
  async getCountRegisters(options) {
    try {
      const result = await dataSource[this.model].findAndCountAll({ ...options });
      if (result.count === 0) {
        throw new BaseError('Nenhum registro encontrado para contagem', 404);
      }
      return result;
    } catch (error) {
      handleError(error); // Chama a função para tratar o erro
    }
  }

  // Cria um novo registro
  async createRegister(register) {
    try {
      const newRegister = await dataSource[this.model].create(register);
      return newRegister;
    } catch (error) {
      handleError(error); // Chama a função para tratar o erro
    }
  }

  // Atualiza um registro baseado em uma condição
  async updateRegister(register, where) {
    try {
      const updatedRegisterList = await dataSource[this.model].update(register, {
        where: { ...where },
      });

      if (updatedRegisterList[0] === 0) {
        throw new BaseError('Nenhum registro atualizado', 404);
      }
      return updatedRegisterList;
    } catch (error) {
      handleError(error); // Chama a função para tratar o erro
    }
  }

  // Deleta um registro baseado em uma condição
  async deleteRegister(where) {
    try {
      const register = await dataSource[this.model].findOne({ where: { ...where } });
      if (!register) {
        throw new BaseError('Registro não encontrado para exclusão', 404);
      }

      await register.destroy();
      return true;
    } catch (error) {
      handleError(error); // Chama a função para tratar o erro
    }
  }
}

module.exports = Services;
