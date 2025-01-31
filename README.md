# API Node.js com Sequelize e Autenticação JWT

![GitHub README Cover](./path-to-your-image.png)

## Visão Geral
Esta é uma API desenvolvida em **Node.js** utilizando **Express** e **Sequelize** para interagir com um banco de dados **PostgreSQL**. A API implementa um sistema de autenticação baseado em **JWT** e controle de acesso baseado em perfis e permissões.

## Tecnologias Utilizadas

- **Express**: Framework web para Node.js
- **Joi**: Validação e sanitização de dados
- **Jest/Supertest**: Testes unitários e de integração
- **Sequelize**: ORM para manipulação do banco de dados
- **Sequelize CLI**: Para gestão de migrações
- **PostgreSQL**: Banco de dados SQL
- **bcryptjs**: Hash de senhas
- **jsonwebtoken (JWT)**: Autenticação via token
- **Swagger/OpenAPI**: Documentação da API acessível em `/api-docs`
- **Modelo MVC com camada de Services**
- **Middlewares**:
  - Tratamento de erro
  - Autenticação JWT
  - Validação com Joi
  - Controle de acesso baseado em **perfis**, **permissões** e **perfis com permissão**

---

## Instalação e Configuração

### 1. Clonar o repositório
```sh
git clone https://github.com/seu-usuario/seu-repositorio.git
cd seu-repositorio
```

### 2. Instalar dependências
```sh
npm install
```

### 3. Configurar variáveis de ambiente
Crie um arquivo `.env` e defina suas credenciais do PostgreSQL e a chave JWT:
```
DB_HOST=localhost
DB_PORT=5432
DB_USER=seu_usuario
DB_PASSWORD=sua_senha
DB_NAME=seu_banco
JWT_SECRET=sua_chave_secreta
```

### 4. Executar as migrações
```sh
npx sequelize-cli db:migrate
```

---

## Uso da API

### 1. Criar Usuário e Role

Execute os seguintes comandos SQL para adicionar um usuário e uma role ao banco de dados:
```sql
INSERT INTO usuarios (id, nome, email, senha, createdAt, updatedAt)
VALUES (gen_random_uuid(), 'Admin', 'admin@email.com', '$2a$10$hashedpassword', now(), now());

INSERT INTO roles (id, nome, descricao, createdAt, updatedAt)
VALUES (gen_random_uuid(), 'Gerente', 'Responsável pela gestão', now(), now());
```

Associe a role ao usuário:
```sql
INSERT INTO usuarios_roles (usuario_id, role_id, createdAt, updatedAt)
VALUES ('uuid-do-usuario', 'uuid-da-role', now(), now());
```

### 2. Autenticação
Faça login na API com:
```http
POST /auth/login
Content-Type: application/json
{
  "email": "admin@email.com",
  "senha": "sua_senha"
}
```

A resposta conterá um `tokenJWT`.

### 3. Criar Permissões
Registre permissões na API:
```http
POST /permissao
Content-Type: application/json
Authorization: Bearer tokenJWT
{
  "nome": "adicionar usuario",
  "descricao": "Pode adicionar usuários ao sistema"
}
```
Repita para as demais permissões: listar usuario, editar usuario, remover usuario, adicionar produto, listar produto, editar produto, remover produto.

### 4. Associar Permissões a um Perfil
```http
POST /seguranca/permissoes-roles
Content-Type: application/json
Authorization: Bearer tokenJWT
{
  "roleId": "uuid-da-role",
  "permissoes": ["uuid-da-permissao1", "uuid-da-permissao2"]
}
```

### 5. Relacionar Usuário ao Perfil
```http
POST /seguranca/acl
Content-Type: application/json
Authorization: Bearer tokenJWT
{
  "roles": ["uuid-da-role"]
}
```

Isso cria relações na tabela `usuarios_permissoes`.

---

## Testes
Execute os testes com:
```sh
npm test
```

---

## Documentação
A documentação da API está disponível em:
```
http://localhost:3000/api-docs
```