// middlewares/validacaoMiddleware.js
const BaseError = require('../Error/BaseError');

const validacaoMiddleware = (schema, payloadLocation = 'body') => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req[payloadLocation], {
      abortEarly: false, // Captura todos os erros
      allowUnknown: false, // Não permite campos não definidos no schema
    });

    if (error) {
      const mensagensErro = error.details.map((detail) => ({
        campo: detail.context.key,
        mensagem: detail.message,
      }));

      return next(new BaseError('Erro de validação', 400, { erros: mensagensErro }));
    }

    req[payloadLocation] = value;

    next();
  };
};

module.exports = validacaoMiddleware;
