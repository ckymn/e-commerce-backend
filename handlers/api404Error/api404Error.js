const httpStatusCodes = require("../httpStatusCodes/httpStatusCodes");
const BaseError = require("../baseError/baseError");

class Api404Error extends BaseError {
  constructor(
    name,
    statusCode = httpStatusCodes.NOT_FOUND,
    description = "Not found.",
    isOperational = true
  ) {
    super(name, statusCode, isOperational, description);
  }
}

module.exports = Api404Error;
