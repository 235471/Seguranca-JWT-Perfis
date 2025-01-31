/* eslint-disable no-undef */
// Dependências
const badRequest = require('../../utils/errorBadRequest');
const ProdutoController = require('../../controllers/produtoController');
const ProdutoService = require('../../services/produtoService');

// Mocks
jest.mock('../../services/produtoService'); // Mock do ProdutoService
jest.mock('../../middleware/autenticado', () => jest.fn((req, res, next) => next()));
jest.mock('../../middleware/permissoesRoles', () => jest.fn(() => (req, res, next) => next()));
jest.mock('../../middleware/validacaoMiddleware', () => jest.fn(() => (req, res, next) => next()));

describe('Teste do ProdutoController - POST /produto', () => {
  let produtoController;
  let mockReq, mockRes, mockNext;

  beforeEach(() => {
    // Criar uma instância do ProdutoController
    produtoController = new ProdutoController();

    // Mock da requisição, resposta e próximo middleware
    mockReq = {
      body: {
        nome: 'Produto Existente',
        descricao: 'Produto Teste',
        preco: 100,
      },
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    mockNext = jest.fn();
  });

  it('Deve retornar erro 400 se o produto já estiver cadastrado', async () => {
    // Simular o método cadastrar no ProdutoService
    ProdutoService.prototype.cadastrar.mockImplementation(() => {
      badRequest('Produto já cadastrado', 400, `Já existe um produto com nome ${mockReq.body.nome}`);
    });

    // Executar o método do controlador
    await produtoController.createRegister(mockReq, mockRes, mockNext);

    // Verificar que o erro foi passado para o próximo middleware
    expect(mockRes.status).not.toHaveBeenCalled();
    expect(mockNext).toHaveBeenCalledWith(expect.any(Error));

    // Verificar detalhes do erro
    const errorCalled = mockNext.mock.calls[0][0];
    expect(errorCalled.message).toBe('Produto já cadastrado');
    expect(errorCalled.code).toBe(400);
    expect(errorCalled.details).toBe(`Já existe um produto com nome ${mockReq.body.nome}`);
  });
});

describe('Teste do ProdutoController GET /produto/search', () => {
  let produtoController;
  let mockReq, mockRes, mockNext;

  beforeEach(() => {
    // Inicializa os mocks para cada teste
    produtoController = new ProdutoController();
    mockReq = { query: { nome: 'Produto A' } }; // Inicializa mockReq com a query
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    mockNext = jest.fn();
  });

  it('Deve retornar registros filtrados no método search', async () => {
    // Simula o comportamento do método buscaComFiltros do ProdutoService
    ProdutoService.prototype.getByQuery.mockResolvedValue([{ id: 1, nome: 'Produto A', descricao: 'Teste' }]);

    // Chama o método search do controller
    await produtoController.getByQuery(mockReq, mockRes, mockNext);

    // Verifica se o status 200 foi chamado
    expect(mockRes.status).toHaveBeenCalledWith(200);

    // Verifica se os registros retornados são os esperados
    expect(mockRes.json).toHaveBeenCalledWith([{ id: 1, nome: 'Produto A', descricao: 'Teste' }]);
  });

  it('Deve chamar o next com erro em caso de falha no service', async () => {
    const erroMock = new Error('Erro no Service'); // Simula um erro
    ProdutoService.prototype.getByQuery.mockRejectedValue(erroMock);

    // Chama o método search do controller
    await produtoController.getByQuery(mockReq, mockRes, mockNext);

    // Verifica se o status não foi chamado
    expect(mockRes.status).not.toHaveBeenCalled();

    // Verifica se o next foi chamado com o erro
    expect(mockNext).toHaveBeenCalledWith(erroMock);
  });
});
