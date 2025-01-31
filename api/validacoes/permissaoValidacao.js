const Joi = require('joi');

const permissaoSchema = Joi.object({
  nome: Joi.string().min(3).max(50).required().messages({
    'string.empty': 'O nome da permissão não pode estar vazio',
    'any.required': 'O nome da permissão é obrigatório',
  }),

  descricao: Joi.string().min(10).max(200).required().messages({
    'string.empty': 'A descrição não pode estar vazia',
    'any.required': 'A descrição é obrigatória',
  }),
});

module.exports = {
  permissaoSchema,
};
