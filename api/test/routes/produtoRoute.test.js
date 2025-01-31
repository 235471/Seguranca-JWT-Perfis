/* eslint-disable no-undef */
const app = require('../../index');
const request = require('supertest');
const sequelize = require('../../config/sequelizeTesteConfig');
const dotenv = require('dotenv');

// Carregar variáveis de ambiente
dotenv.config();

let server;
global.jwtToken = ''; // Definindo uma variável global para armazenar o token
const fakeJwt = // Token fictício para testes com token inválido
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3RlMTIzQHRlc3RlLmNvbSIsInNlbmhhIjoiSm9obiBEb2UifQ.ax9gFU_Jez0siE94IUIVPdiMkiZA8l1iRVHS0hX-aL8';

// Inicializa a conexão com o banco e o servidor antes dos testes
beforeAll(async () => {
  await sequelize.authenticate(); // Conectar ao banco
  server = app.listen(0); // Iniciar o servidor na porta disponível

  // Faz login para obter o token e armazenar globalmente
  const loginMock = {
    email: 'teste@gmail.com',
    senha: 'teste123',
  };

  const response = await request(server).post('/auth/login').send(loginMock).expect(200);
  global.jwtToken = response.body.accessToken; // Salvar o token globalmente
});

// Encerra a conexão e o servidor após os testes
afterAll(async () => {
  await sequelize.close(); // Fechar a conexão com o banco
  await server.close(); // Fechar o servidor
});

describe('Teste rota de produtos', () => {
  // Testa a listagem de produtos com token válido
  it('Será validado a rota de listagem de produtos com um token válido', async () => {
    const response = await request(server).get('/produto').set('Authorization', `Bearer ${global.jwtToken}`).expect(200);

    // Verifica se a resposta contém um array

    expect(response.body).toEqual(expect.any(Array));
  });

  // Testa a listagem de produto por ID com token válido
  it('Será validado a rota de listagem de produtos por ID com um token válido', async () => {
    const response = await request(server).get('/produto').set('Authorization', `Bearer ${global.jwtToken}`).expect(200);

    const produto = response.body[0];

    // Verifica se consegue listar um produto por ID

    const responseProduto = await request(server)
      .get(`/produto/id/${produto.id}`)
      .set('Authorization', `Bearer ${global.jwtToken}`)
      .expect(200);

    expect(responseProduto.body).toEqual({
      id: produto.id,
      nome: produto.nome,
      descricao: produto.descricao,
      preco: produto.preco,
      createdAt: produto.createdAt,
      updatedAt: produto.updatedAt,
    });
  });

  // Testa a criação de produto com token válido
  it('Será validado que é possível acessar a rota de cadastro de produtos e criar um novo produto baseado em roles e permissões', async () => {
    const produtoMock = {
      nome: 'Produto Teste',
      preco: 100.0,
      descricao: 'Descrição do produto teste',
    };

    // Cria o produto com o token
    const responseProduto = await request(server)
      .post('/produto')
      .send(produtoMock)
      .set('Authorization', `Bearer ${global.jwtToken}`)
      .expect(201);

    // Verifica as propriedades do produto criado
    expect(responseProduto.body).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        nome: produtoMock.nome,
        descricao: produtoMock.descricao,
        preco: produtoMock.preco,
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      })
    );

    // Deleta o produto após criação
    await request(server)
      .delete(`/produto/id/${responseProduto.body.id}`)
      .set('Authorization', `Bearer ${global.jwtToken}`)
      .expect(204);
  });

  it('Será validado que não é possível cadastrar um produto com o mesmo nome', async () => {
    const produtoMock = {
      nome: 'Smartphone Galaxy S23',
      preco: 500.0,
      descricao: 'Celular samsung',
    };

    // Tenta criar o produto com o mesmo nome
    const produtoResponse = await request(server)
      .post('/produto')
      .send(produtoMock)
      .set('Authorization', `Bearer ${global.jwtToken}`)
      .expect(400);

    // Verifica se a resposta de erro contém a mensagem esperada
    expect(produtoResponse.body).toMatchObject({
      message: 'Produto já cadastrado',
      details: `Já existe um produto com nome ${produtoMock.nome}`,
    });
  });

  // Testa acesso sem token
  it('Não é possível acessar a rota de produtos sem um token', async () => {
    await request(server).get('/produto').expect(401);
  });

  // Testa acesso com token inválido
  it('Não é possível acessar a rota de produtos com um token inválido', async () => {
    await request(server).get('/produto').set('Authorization', `Bearer ${fakeJwt}`).expect(401);
  });

  // Testa atualização de produto com permissão insuficiente
  it('Não é possível acessar a rota de atualização de produtos com um token válido, mas sem a permissão adequada', async () => {
    const loginMock = {
      email: 'marcelo@gmail.com',
      senha: 'teste123',
    };

    const response = await request(server).post('/auth/login').send(loginMock).expect(200);
    let token = response.body.accessToken;

    // Obtém o primeiro produto da lista
    const produtoResponse = await request(server).get('/produto').set('Authorization', `Bearer ${token}`).expect(200);
    const produto = produtoResponse.body[0];

    // Tenta atualizar o produto sem permissão
    await request(server)
      .put(`/produto/id/${produto.id}`)
      .send({ nome: 'Produto Atualizado' })
      .set('Authorization', `Bearer ${token}`)
      .expect(401);
  });

  it('Será validado que é possivel acessar a rota de atualização e atualizar produto com um token válido e com a permissão adequada', async () => {
    // Obtém o primeiro produto da lista
    const produtoResponse = await request(server).get('/produto').set('Authorization', `Bearer ${global.jwtToken}`).expect(200);
    const produto = produtoResponse.body[0];

    // Atualiza o produto
    const produtoUpdated = await request(server)
      .put(`/produto/id/${produto.id}`)
      .send({ nome: `${produto.nome}.` })
      .set('Authorization', `Bearer ${global.jwtToken}`)
      .expect(200);

    // Verifica se o produto foi atualizado
    expect(produtoUpdated.body.message).toBe('Registro atualizado com sucesso.');

    await request(server)
      .put(`/produto/id/${produto.id}`)
      .send({ nome: `${produto.nome}` })
      .set('Authorization', `Bearer ${global.jwtToken}`)
      .expect(200);
  });

  it('Será validado que não é possivel cadastrar um produto com campo nome vazio', async () => {
    const produtoMock = {
      nome: '',
      preco: 100.0,
      descricao: 'Descrição do produto teste',
    };

    const responseProduto = await request(server)
      .post('/produto')
      .send(produtoMock)
      .set('Authorization', `Bearer ${global.jwtToken}`)
      .expect(400);

    // Verifica se a resposta de erro contém a mensagem esperada
    expect(responseProduto.body).toMatchObject({
      message: 'Erro de validação',
      details: {
        erros: expect.arrayContaining([
          expect.objectContaining({
            campo: 'nome',
            mensagem: 'Nome não pode ser vazio',
          }),
        ]),
      },
    });
  });

  it('Será validado que não é possivel cadastrar um produto com campo preco vazio', async () => {
    const produtoMock = {
      nome: 'Produto Teste',
      descricao: 'Descrição do produto teste',
    };

    const responseProduto = await request(server)
      .post('/produto')
      .send(produtoMock)
      .set('Authorization', `Bearer ${global.jwtToken}`)
      .expect(400);

    // Verifica se a resposta de erro contém a mensagem esperada
    expect(responseProduto.body).toMatchObject({
      message: 'Erro de validação',
      details: {
        erros: expect.arrayContaining([
          expect.objectContaining({
            campo: 'preco',
            mensagem: 'Preço é obrigatório',
          }),
        ]),
      },
    });
  });

  it('Será validado que não é possivel cadastrar um produto com campo descricao vazio', async () => {
    const produtoMock = {
      nome: 'Produto Teste',
      preco: 100.0,
      descricao: '',
    };

    const responseProduto = await request(server)
      .post('/produto')
      .send(produtoMock)
      .set('Authorization', `Bearer ${global.jwtToken}`)
      .expect(400);

    // Verifica se a resposta de erro contém a mensagem esperada
    expect(responseProduto.body).toMatchObject({
      message: 'Erro de validação',
      details: {
        erros: expect.arrayContaining([
          expect.objectContaining({
            campo: 'descricao',
            mensagem: 'Descrição não pode ser vazia',
          }),
        ]),
      },
    });
  });

  it('Deve retornar erro ao criar produto com preço negativo', async () => {
    const produtoMock = {
      nome: 'Produto Válido',
      descricao: 'Descrição adequada',
      preco: -10.5,
    };

    const responseProduto = await request(server)
      .post('/produto')
      .send(produtoMock)
      .set('Authorization', `Bearer ${global.jwtToken}`)
      .expect(400);

    expect(responseProduto.body).toMatchObject({
      message: 'Erro de validação',
      details: {
        erros: expect.arrayContaining([
          expect.objectContaining({
            campo: 'preco',
            mensagem: 'Preço deve ser um valor positivo',
          }),
        ]),
      },
    });
  });

  it('Deve remover campos não definidos no schema', async () => {
    const produtoMock = {
      nome: 'Produto Válido',
      descricao: 'Descrição válida',
      preco: 100,
      campoExtra: 'valor', // Campo deve ser removido
    };

    const responseProduto = await request(app)
      .post('/produto')
      .set('Authorization', `Bearer ${global.jwtToken}`)
      .send(produtoMock);

    // Verifica retorno da API:
    // 1. Campos obrigatórios gerados pelo Sequelize (id e datas)
    // 2. Campos enviados correspondem aos valores esperados
    // 3. CampoExtra foi removido
    expect(responseProduto.body).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        nome: produtoMock.nome,
        descricao: produtoMock.descricao,
        preco: produtoMock.preco,
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      })
    );

    // Deleta o produto após criação
    await request(server)
      .delete(`/produto/id/${responseProduto.body.id}`)
      .set('Authorization', `Bearer ${global.jwtToken}`)
      .expect(204);
  });
});
