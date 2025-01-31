/* eslint-disable no-undef */
const Service = require('../../services/Services');
const { UniqueConstraintError } = require('sequelize');
const BaseError = require('../../Error/BaseError');

describe('Service - createRegister', () => {
  const mockModel = {
    create: jest.fn(),
  };

  it('Deve lançar BaseError para UniqueConstraintError', async () => {
    const service = new Service(mockModel);
    const uniqueError = new UniqueConstraintError({
      fields: ['nome'],
      message: 'Duplicate entry',
    });

    // Mock do Sequelize para lançar erro
    mockModel.create.mockRejectedValue(uniqueError);

    await expect(service.createRegister({ nome: 'Duplicado' })).rejects.toThrow(BaseError);
  });
});
