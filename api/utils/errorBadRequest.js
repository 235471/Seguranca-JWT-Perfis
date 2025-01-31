const BaseError = require('../Error/BaseError');

const badRequest = (message, code, details = '') => {
  throw new BaseError(message, code, details);
};

module.exports = badRequest;
