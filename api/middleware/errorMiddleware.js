const BaseError = require('../Error/BaseError'); // A classe BaseError

// eslint-disable-next-line no-unused-vars
const errorMiddleware = (error, req, res, next) => {
  if (error instanceof BaseError) {
    // Se for um erro customizado (BaseError), retornamos o código e a mensagem
    return res.status(error.code || 500).json({
      message: error.message,
      details: error.details || null, // Detalhes adicionais se houver
    });
  }

  // Para erros inesperados ou genéricos
  return res.status(500).json({
    message: 'Erro interno do servidor',
  });
};

module.exports = errorMiddleware;
