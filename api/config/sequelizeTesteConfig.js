// config/constantsSequelize.js

const { Sequelize } = require('sequelize');
const config = require('./config.json');
require('dotenv').config(); // Carregar variáveis de ambiente

const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];

dbConfig.username = process.env.DB_USER || dbConfig.username;
dbConfig.password = process.env.DB_PASSWORD || dbConfig.password;
dbConfig.database = process.env.DB_NAME || dbConfig.database;
dbConfig.host = process.env.DB_HOST || dbConfig.host;
dbConfig.port = process.env.DB_PORT || dbConfig.port;
dbConfig.dialect = process.env.DB_DIALECT || dbConfig.dialect;

const sequelize = new Sequelize(dbConfig);

module.exports = sequelize;
