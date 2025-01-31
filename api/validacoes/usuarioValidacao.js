const Joi = require('joi');

const criarUsuarioSchema = Joi.object({
  nome: Joi.string().min(3).max(100).required().messages({
    'any.required': 'Nome é obrigatório',
    'string.empty': 'Nome não pode ser vazio',
  }),
  email: Joi.string().email().required().messages({
    'string.email': 'Email inválido',
    'any.required': 'Email é obrigatório',
  }),
  senha: Joi.string()
    .min(8)
    .pattern(/^(?=.*[A-Za-z])(?=.*\d)/)
    .required()
    .messages({
      'string.min': 'deve ter pelo menos 8 caracteres e conter letras e números',
      'string.pattern.base': 'deve ter pelo menos 8 caracteres e conter letras e números',
      'any.required': 'Senha é obrigatória',
    }),
}).options({ abortEarly: false, stripUnknown: true });

const atualizarUsuarioSchema = Joi.object({
  nome: Joi.string().min(3).max(100),
  email: Joi.string().email(),
  senha: Joi.string()
    .min(8)
    .pattern(/^(?=.*[A-Za-z])(?=.*\d)/)
    .messages({
      'string.min': 'deve ter pelo menos 8 caracteres e conter letras e números',
      'string.pattern.base': 'deve ter pelo menos 8 caracteres e conter letras e números',
    }),
})
  .min(1)
  .messages({
    'object.min': 'Nenhum campo válido para atualização', // Mensagem customizada para atualização vazia
  })
  .options({ abortEarly: false, stripUnknown: true });

module.exports = {
  criarUsuarioSchema,
  atualizarUsuarioSchema,
};
