const ErrorResponse = require('../utils/ErrorResponse');

const errorResponse = (message, statusCode) => new ErrorResponse(message, statusCode);

const errorHandler = (err, req, res, next) => {
    let error = {...err};
    error.message = err.message;

    if (err.name === 'CastError') error = errorResponse('The requested resource was not found', 404);
    if (err.code === 11000) error = errorResponse('Email address is already registered', 400);
    if (err.name === 'ValidationError') {
        message = Object.values(err.errors).map(value => value.message);
        error = errorResponse(message, 400);
    };

    res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || 'Internal Server Error',
        stack: process.env.NODE_END === 'production' ? null : err.stack
    });
}

module.exports = { errorHandler, errorResponse };
