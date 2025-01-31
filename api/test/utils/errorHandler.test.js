/* eslint-disable no-undef */
const handleError = require('../../utils/errorHandler');
const { ValidationError, UniqueConstraintError } = require('sequelize');
const BaseError = require('../../Error/BaseError');

describe('handleError', () => {
  it('Deve converter ValidationError em BaseError', () => {
    const validationError = new ValidationError('Erro de validação', [{ message: 'Nome inválido', path: 'nome' }]);

    expect(() => handleError(validationError)).toThrow(BaseError);
  });

  it('Deve converter UniqueConstraintError em BaseError', () => {
    const uniqueConstraintError = new UniqueConstraintError({
      message: 'Erro de validação',
      errors: [{ message: 'Nome inválido', path: 'nome' }],
      fields: { nome: 'valor' }, // Campo que causou o erro
    });

    expect(() => handleError(uniqueConstraintError)).toThrow(BaseError);
  });

  it('Deve manter erros desconhecidos como BaseError genérico', () => {
    const genericError = new Error('Erro inesperado');

    expect(() => handleError(genericError)).toThrow(BaseError);

    // Verificando o conteúdo do erro
    try {
      handleError(genericError);
    } catch (error) {
      expect(error).toEqual(
        expect.objectContaining({
          code: 500,
          message: 'Erro inesperado no servidor',
        })
      );
    }
  });
});
