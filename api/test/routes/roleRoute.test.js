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

beforeAll(async () => {
  await sequelize.authenticate();
  server = app.listen(0);

  // Faz login para obter o token e armazenar globalmente
  const loginMock = {
    email: 'teste@gmail.com',
    senha: 'teste123',
  };

  const response = await request(server).post('/auth/login').send(loginMock).expect(200);
  global.jwtToken = response.body.accessToken;
});

afterAll(async () => {
  await sequelize.close();
  await server.close();
});

describe('Teste rota de permissão', () => {
  it('Será validado a rota de listagem de role com um token válido', async () => {
    const response = await request(server).get('/roles').set('Authorization', `Bearer ${global.jwtToken}`).expect(200);

    expect(response.body).toEqual(expect.any(Array));
  });

  it('Será validado a rota de listagem de produtos por ID com um token válido', async () => {
    const response = await request(server).get('/roles').set('Authorization', `Bearer ${global.jwtToken}`).expect(200);

    const role = response.body[0];

    const responserole = await request(server)
      .get(`/roles/id/${role.id}`)
      .set('Authorization', `Bearer ${global.jwtToken}`)
      .expect(200);

    expect(responserole.body).toEqual({
      id: role.id,
      nome: role.nome,
      descricao: role.descricao,
      createdAt: role.createdAt,
      updatedAt: role.updatedAt,
    });
  });

  it('Será validado que é possível acessar a rota de cadastro de permissão e criar uma nova permissão baseado em controle roles e permissões', async () => {
    const roleMock = {
      nome: 'teste',
      descricao: 'role teste',
    };

    const responserole = await request(server)
      .post('/roles')
      .send(roleMock)
      .set('Authorization', `Bearer ${global.jwtToken}`)
      .expect(201);

    // Verifica as propriedades do produto criado
    expect(responserole.body).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        nome: roleMock.nome,
        descricao: roleMock.descricao,
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      })
    );

    await request(server)
      .delete(`/roles/id/${responserole.body.id}`)
      .set('Authorization', `Bearer ${global.jwtToken}`)
      .expect(204);
  });

  it('Será validado que não é possível cadastrar uma role com o mesmo nome', async () => {
    const roleMock = {
      nome: 'Gerente',
      descricao: 'role de Gerente',
    };

    // Tenta criar o produto com o mesmo nome
    const roleResponse = await request(server)
      .post('/roles')
      .send(roleMock)
      .set('Authorization', `Bearer ${global.jwtToken}`)
      .expect(400);

    // Verifica se a resposta de erro contém a mensagem esperada
    expect(roleResponse.body).toMatchObject({
      message: 'Role já cadastrada',
      details: `${roleMock.nome}`,
    });
  });
});
