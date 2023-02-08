const AppError = require('../utils/appError');

const handleCastError22P02 = err => {
  message = 'Some type of data sent does not match was expected ';
  return new AppError(message, 400);
};
const sendErrorDev = (err, res) => {
  res.status(res.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};
const sendErrorProd = (err, res) => {
  // Operational, trustted error: send message to client
  if (err.isOperational) {
    res.status(res.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    console.error('ERROR DINAMITA');
    res.status(500).json({
      status: 'fail',
      message: 'Something went very wrong!',
    });
  }
};
const globalErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'fail';
  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  }
  if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    if (error.parent.code === '22P02') error = handleCastError22P02();
    sendErrorProd(error, res);
  }
};
module.exports = globalErrorHandler;
