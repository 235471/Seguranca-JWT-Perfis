/* eslint-disable no-undef */
const app = require('../../index'); // o arquivo onde seu Express app é exportado
const request = require('supertest');
const sequelize = require('../../config/sequelizeTesteConfig'); // Importa a configuração do Sequelize
const dotenv = require('dotenv');

// Carregar variáveis de ambiente
dotenv.config();

let server;

beforeAll(async () => {
  // Aqui abrimos a conexão com o banco de dados
  await sequelize.authenticate(); // Conectar ao banco de dados
  // Inicia o servidor para rodar as requisições no teste
  server = app.listen(0);
});

afterAll(async () => {
  // Aqui fechamos a conexão com o banco de dados
  await sequelize.close(); // Fechar a conexão com o banco após o teste
  await server.close();
});

describe('Teste rota de autenticação', () => {
  it('Será validado que é possível fazer login', async () => {
    const loginMock = {
      email: 'teste@gmail.com',
      senha: 'teste123',
    };

    const response = await request(server).post('/auth/login').send(loginMock).expect(200);

    expect(response.body).toHaveProperty('accessToken');
    const tokenParts = response.body.accessToken.split('.');
    expect(tokenParts.length).toBe(3); // Validar se é um token JWT
  });

  it('Será validado que não é possível fazer login com email incorreto', async () => {
    const loginMock = {
      email: '',
      senha: 'teste123',
    };

    await request(server)
      .post('/auth/login')
      .send(loginMock)
      .expect(400)
      .expect((res) => res.body.message === 'O campo "email" é obrigatório');
  });

  it('Será validado que não é possível fazer login com senha incorreta', async () => {
    const loginMock = {
      email: 'teste@gmail.com',
      senha: 'teste1234',
    };

    await request(server)
      .post('/auth/login')
      .send(loginMock)
      .expect(401)
      .expect((res) => res.body.message === 'Credenciais inválidas');
  });

  it('Será validado que não é possível fazer login com email inexistente ou errado', async () => {
    const loginMock = {
      email: 'teste1@gmail.com',
      senha: 'teste123',
    };

    await request(server)
      .post('/auth/login')
      .send(loginMock)
      .expect(401)
      .expect((res) => res.body.message === 'Credenciais inválidas');
  });
});
