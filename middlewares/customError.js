const BaseError = require('../handlers/baseError/baseError');
const customErrorHandler = (err, req, res, next) => {
    let customError = err;

    if (err.name === 'ValidationError') {
        customError = new BaseError(err.message, 400, false);
    }
    if (err.code === 11000) {
        customError = new BaseError('Duplicate Key Found!: Check your email address', 400,false);
    }
    res.status(customError.statusCode || 500).json({
        success: false,
        message: customError.message,
        isOperationel: customError.isOperationel,
    });
};
module.exports = customErrorHandler;