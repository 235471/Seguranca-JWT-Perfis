const { verify, decode } = require('jsonwebtoken');
const BaseError = require('../Error/BaseError');

module.exports = async (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return next(new BaseError('Access token não informado', 401));
  }

  const [, accessToken] = token.split(' ');

  try {
    verify(accessToken, process.env.SECRET_KEY);

    const { id, email } = await decode(accessToken);
    req.usuarioId = id;
    req.usuarioEmail = email;

    return next();
    // eslint-disable-next-line no-unused-vars
  } catch (error) {
    return next(new BaseError('Usuário não autorizado', 401));
  }
};
