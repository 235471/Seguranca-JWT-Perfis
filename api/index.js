const express = require('express');
const routes = require('./routes');
const errorMiddleware = require('./middleware/errorMiddleware');
const YAML = require('yamljs');
const swaggerUi = require('swagger-ui-express');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = 3000;

// Load YALM document
// eslint-disable-next-line no-undef
const swaggerDocument = YAML.load(path.join(__dirname, 'docs', 'api-docs.yaml'));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

routes(app);

app.use(errorMiddleware);

app.listen(PORT, () => console.log(`servidor está rodando na porta ${PORT}`));

module.exports = app;
