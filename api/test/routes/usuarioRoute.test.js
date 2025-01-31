/* eslint-disable no-undef */
const app = require('../../index');
const request = require('supertest');
const sequelize = require('../../config/sequelizeTesteConfig');
const dotenv = require('dotenv');

dotenv.config();

let server;
global.jwtToken = '';
const fakeJwt =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3RlMTIzQHRlc3RlLmNvbSIsInNlbmhhIjoiSm9obiBEb2UifQ.ax9gFU_Jez0siE94IUIVPdiMkiZA8l1iRVHS0hX-aL8';

beforeAll(async () => {
  await sequelize.authenticate();
  server = app.listen(0);

  // Usa o mesmo login do teste de produtos
  const response = await request(server).post('/auth/login').send({ email: 'teste@gmail.com', senha: 'teste123' }).expect(200);
  global.jwtToken = response.body.accessToken;
});

afterAll(async () => {
  await sequelize.close();
  await server.close();
});

describe('Teste rotas de usuários', () => {
  // Testes de criação
  it('Deve criar usuário com dados válidos', async () => {
    const usuarioMock = {
      nome: 'Usuário Válido',
      email: 'novo_usuario@teste.com',
      senha: 'Senha1234',
    };

    const response = await request(server)
      .post('/usuarios')
      .set('Authorization', `Bearer ${global.jwtToken}`)
      .send(usuarioMock)
      .expect(201);

    expect(response.body).toEqual({
      id: expect.any(String),
      nome: usuarioMock.nome,
      email: usuarioMock.email,
      senha: expect.any(String),
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
    });

    // Limpeza
    await request(server).delete(`/usuarios/id/${response.body.id}`).set('Authorization', `Bearer ${global.jwtToken}`);
  });

  it('Deve falhar ao criar usuário com email duplicado', async () => {
    const usuarioMock = {
      nome: 'Marcelo',
      email: 'marcelo@gmail.com', // Já existe nos testes
      senha: 'Senha123',
    };

    const response = await request(server)
      .post('/usuarios')
      .set('Authorization', `Bearer ${global.jwtToken}`)
      .send(usuarioMock)
      .expect(400);

    expect(response.body).toEqual({
      message: 'Email já cadastrado',
      details: `Já existe um usuário com email ${usuarioMock.email}`,
    });
  });

  // Validações Joi
  it('Deve rejeitar criação sem campos obrigatórios', async () => {
    const response = await request(server)
      .post('/usuarios')
      .set('Authorization', `Bearer ${global.jwtToken}`)
      .send({})
      .expect(400);

    const erros = response.body.details.erros;
    expect(erros).toEqual(
      expect.arrayContaining([
        { campo: 'nome', mensagem: 'Nome é obrigatório' },
        { campo: 'email', mensagem: 'Email é obrigatório' },
        { campo: 'senha', mensagem: 'Senha é obrigatória' },
      ])
    );
  });

  it('Deve rejeitar email inválido', async () => {
    const response = await request(server)
      .post('/usuarios')
      .set('Authorization', `Bearer ${global.jwtToken}`)
      .send({
        nome: 'Teste',
        email: 'email-invalido',
        senha: 'Senha123',
      })
      .expect(400);

    expect(response.body.details.erros).toContainEqual({ campo: 'email', mensagem: 'Email inválido' });
  });

  it('Deve rejeitar senha fraca', async () => {
    const response = await request(server)
      .post('/usuarios')
      .set('Authorization', `Bearer ${global.jwtToken}`)
      .send({
        nome: 'Teste',
        email: 'senha_fraca@teste.com',
        senha: '123',
      })
      .expect(400);

    expect(response.body.details.erros).toContainEqual({
      campo: 'senha',
      mensagem: 'deve ter pelo menos 8 caracteres e conter letras e números',
    });
  });

  //   Testes de listagem
  it('Deve listar usuários SEM senhas', async () => {
    const response = await request(server).get('/usuarios').set('Authorization', `Bearer ${global.jwtToken}`).expect(200);

    response.body.forEach((usuario) => {
      expect(usuario).toEqual({
        id: expect.any(String),
        nome: expect.any(String),
        email: expect.any(String),
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
        // Campos das tabelas pivô
        usuario_roles: expect.any(Array),
        usuario_permissoes: expect.any(Array),
      });
    });

    // Garante que a senha não está presente
    expect(response.body.senha).toBeUndefined();
  });

  // Autenticação
  it('Deve bloquear acesso sem token', async () => {
    await request(server).get('/usuarios').expect(401);
  });

  it('Deve bloquear token inválido', async () => {
    await request(server).get('/usuarios').set('Authorization', `Bearer ${fakeJwt}`).expect(401);
  });

  // Atualização
  it('Deve atualizar usuário e remover campos extras', async () => {
    // Cria usuário temporário
    const usuario = await request(server)
      .post('/usuarios')
      .send({
        nome: 'Atualizável',
        email: 'atualizar@teste.com',
        senha: 'Senha1234',
      })
      .set('Authorization', `Bearer ${global.jwtToken}`);

    const response = await request(server)
      .put(`/usuarios/id/${usuario.body.id}`)
      .send({
        nome: 'Novo Nome',
        campoExtra: 'valor',
      })
      .set('Authorization', `Bearer ${global.jwtToken}`)
      .expect(200);

    expect(response.body).not.toHaveProperty('campoExtra');

    // Limpeza
    await request(server).delete(`/usuarios/id/${usuario.body.id}`).set('Authorization', `Bearer ${global.jwtToken}`);
  });

  it('Deve rejeitar atualização sem campos válidos', async () => {
    const usuario = await request(server).get('/usuarios').set('Authorization', `Bearer ${global.jwtToken}`);

    const response = await request(server)
      .put(`/usuarios/id/${usuario.body[0].id}`)
      .send({})
      .set('Authorization', `Bearer ${global.jwtToken}`)
      .expect(400);

    expect(response.body.details.erros).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          mensagem: 'Nenhum campo válido para atualização',
        }),
      ])
    );
  });
});
