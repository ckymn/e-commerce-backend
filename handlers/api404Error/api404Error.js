const httpStatusCodes = require("../httpStatusCodes/httpStatusCodes");
const BaseError = require("../baseError/baseError");

class Api404Error extends BaseError {
  constructor(
    message = "Not found.",
    statusCode = httpStatusCodes.NOT_FOUND,
    isOperational = true
  ) {
    super(message,statusCode ,isOperational);
  }
}

module.exports = Api404Error;
