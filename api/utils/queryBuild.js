const { Op } = require('sequelize');

function queryBuild(query) {
  const dynamicWhere = {};

  // Itera sobre todas as chaves da `query` fornecida
  for (let key in query) {
    // Verifica se a chave contém 'Min' ou 'Max' para campos de intervalo (como precoMin, precoMax)
    if (key.toLowerCase().includes('min') || key.toLowerCase().includes('max')) {
      // Identifica a chave base para o filtro (como "preco")
      const baseKey = key.replace(/Min|Max/, ''); // Remove 'Min' ou 'Max' para identificar o campo base

      if (key.toLowerCase().includes('min') && query[key] !== undefined) {
        // Se contiver 'Min', aplica o filtro 'Op.gte' (maior ou igual) no campo base
        dynamicWhere[baseKey] = {
          [Op.gte]: query[key],
        };
      } else if (key.toLowerCase().includes('max') && query[key] !== undefined) {
        // Se contiver 'Max', aplica o filtro 'Op.lte' (menor ou igual) no campo base
        dynamicWhere[baseKey] = {
          [Op.lte]: query[key],
        };
      }
    }
    // Verifica se o valor do campo é uma string (para fazer busca de substring)
    else if (typeof query[key] === 'string') {
      dynamicWhere[key] = {
        [Op.iLike]: `%${query[key]}%`, // Busca por substring, insensível a maiúsculas/minúsculas
      };
    } else {
      // Caso o campo não seja string nem tenha 'Min' ou 'Max', apenas mantém o valor
      dynamicWhere[key] = query[key];
    }
  }

  return dynamicWhere;
}

module.exports = queryBuild;
