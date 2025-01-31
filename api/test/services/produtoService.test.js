/* eslint-disable no-undef */
const ProdutoService = require('../../services/produtoService');
const BaseError = require('../../Error/BaseError');

jest.mock('../../services/Services'); // Mock do service genérico

describe('ProdutoService - Cadastro', () => {
  let produtoService;

  beforeEach(() => {
    produtoService = new ProdutoService();
  });

  it('Deve lançar erro ao cadastrar produto duplicado', async () => {
    // Mock da verificação de produto existente
    produtoService.getOne = jest.fn().mockResolvedValue({ id: '1', nome: 'Produto Teste' });

    await expect(produtoService.cadastrar({ nome: 'Produto Teste' })).rejects.toThrow(BaseError);

    expect(produtoService.getOne).toHaveBeenCalledWith({ nome: 'Produto Teste' });
  });
});
