// validacoes/produtoValidacao.js
const Joi = require('joi');

const criarProdutoSchema = Joi.object({
  nome: Joi.string()
    .min(3)
    .max(100)
    .required()
    .pattern(/^[\p{L}\d\s.,:;!?()'-]+$/u)
    .messages({
      'string.pattern.base': 'Nome contém caracteres inválidos',
      'any.required': 'Nome é obrigatório',
      'string.empty': 'Nome não pode ser vazio',
    }),
  descricao: Joi.string().min(10).max(500).required().messages({
    'any.required': 'Descrição é obrigatória',
    'string.empty': 'Descrição não pode ser vazia',
  }),
  preco: Joi.number().positive().precision(2).max(1000000).required().messages({
    'number.max': 'Preço máximo permitido é R$ 1.000.000,00',
    'number.positive': 'Preço deve ser um valor positivo',
    'any.required': 'Preço é obrigatório',
  }),
}).options({ abortEarly: false, stripUnknown: true });

const atualizarProdutoSchema = Joi.object({
  nome: Joi.string().min(3).max(100),
  descricao: Joi.string().min(10).max(500),
  preco: Joi.number().positive().precision(2),
})
  .min(1)
  .options({ abortEarly: false, stripUnknown: true });

module.exports = {
  criarProdutoSchema,
  atualizarProdutoSchema,
};
