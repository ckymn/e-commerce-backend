class ApiError extends Error {
  constructor(message, statusCode,data) {
    super(message);
    this.message = message;
    this.status = statusCode;
    this.data = data;
  }
}

module.exports = ApiError;
