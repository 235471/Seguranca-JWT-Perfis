const { ValidationError, DatabaseError, UniqueConstraintError } = require('sequelize');
const BaseError = require('../Error/BaseError');

const handleError = (error) => {
  // Se o erro for de validação do Sequelize (campos inválidos)
  if (error instanceof ValidationError) {
    throw new BaseError(
      'Erro de validação',
      400,
      error.errors.map((e) => e.message)
    );
  }

  // Se for erro do tipo UniqueConstraintError (duplicação de dados, como email já registrado)
  if (error instanceof UniqueConstraintError) {
    throw new BaseError(
      'Conflito de dados (registro duplicado)',
      400,
      error.errors.map((e) => e.message)
    );
  }

  // Se for erro do banco de dados (erro na execução de uma query, falha no DB)
  if (error instanceof DatabaseError) {
    throw new BaseError('Erro interno do banco de dados', 500, error.original ? error.original.message : 'Erro desconhecido');
  }

  // Caso o erro seja genérico ou inesperado
  throw new BaseError('Erro inesperado no servidor', 500, error.message || 'Erro desconhecido');
};

module.exports = handleError;
