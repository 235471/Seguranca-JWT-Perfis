// Função util apenas para calcular a paginação (limit e offset)
function applyPagination(queryParams) {
  // Garante que page e limit sejam números válidos e positivos
  const page = Math.max(1, parseInt(queryParams.page, 10) || 1);
  const limit = Math.max(1, parseInt(queryParams.limit, 10) || process.env.LIMIT || 10);

  // Cálculo do offset baseado na página
  const offset = (page - 1) * limit;

  // Retorna apenas os parâmetros de paginação (não inclui filtros ou where)
  return { limit, offset };
}

module.exports = applyPagination;
