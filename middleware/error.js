const ErrorResponse = require('../utils/errorResponse')

const errorHandler = (err, req, res, next) => {
  let error = {
    ...err
  }
  error.message = err.message

  //Log to console for dev
  console.log(err);

  //Mongoose Bad ObjectID Request Error
  if (err.name === 'CastError') {
    const message = `Bootcamp not found for ID:${err.value}`
    error = new ErrorResponse(message, 404)
  }

  //Duplicate Key Error
  if (err.code === 11000) {
    const message = 'Duplicate Field Value Entered!'
    error = new ErrorResponse(message, 400)
  }

  //Validation Errors
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(value => value.message)
    error = new ErrorResponse(message, 400)
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || 'Server Error'
  })
}

module.exports = errorHandler