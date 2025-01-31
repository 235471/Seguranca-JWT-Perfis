class BaseError extends Error {
  constructor(message, code, details = null) {
    super(message);
    this.code = code;
    this.details = details;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = BaseError;
