class ApiError extends Error {
  constructor(message, statusCode,data) {
    // super message degerimizi Error 'a gonderir
    // super() === new Error()
    super(message);
    this.message = message;
    this.status = statusCode;
    this.data = data;
  }

  // static notFound(){
  //   this.message = "Not Found Data";
  //   this.status = 404;
  // }
  // static badRequest(){}
}

module.exports = ApiError;
