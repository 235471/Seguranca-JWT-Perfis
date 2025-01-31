const { ValidationError, DatabaseError, UniqueConstraintError } = require('sequelize');
const BaseError = require('../Error/BaseError');

const handleError = (error) => {
  // Se o erro for de validação do Sequelize (campos inválidos)
  if (error instanceof ValidationError) {
    return new BaseError(
      'Erro de validação',
      400,
      error.errors.map((e) => e.message)
    );
  }

  // Se for erro do tipo UniqueConstraintError (duplicação de dados, como email já registrado)
  if (error instanceof UniqueConstraintError) {
    return new BaseError(
      'Conflito de dados (registro duplicado)',
      400,
      error.errors.map((e) => e.message)
    );
  }

  // Se for erro do banco de dados (erro na execução de uma query, falha no DB)
  if (error instanceof DatabaseError) {
    return new BaseError('Erro interno do banco de dados', 500, error.original ? error.original.message : 'Erro desconhecido');
  }
  if (error.code == 404) return new BaseError(error.message, 404);
  // Caso o erro seja genérico ou inesperado
  return new BaseError('Erro inesperado no servidor', 500, error.message || 'Erro desconhecido');
};

module.exports = handleError;
