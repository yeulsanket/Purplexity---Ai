import { ENV } from '../config/env.js';
import ApiError from '../utils/ApiError.js';

export const errorHandler = (err, req, res, next) => {
  let error = err;

  if (!(error instanceof ApiError)) {
    const statusCode = error.statusCode || mongooseErrorStatus(error) || 500;
    const message = error.message || 'Something went wrong';
    error = new ApiError(statusCode, message, false, err.stack);
  }

  const response = {
    success: false,
    message: error.message,
    code: error.code,
    ...(ENV.NODE_ENV === 'development' && { stack: error.stack }),
  };

  res.status(error.statusCode || 500).json(response);
};

// Helper for generic mongoose errors if any
const mongooseErrorStatus = (err) => {
  if (err.name === 'ValidationError') return 400;
  if (err.name === 'CastError') return 400;
  if (err.code === 11000) return 409;
  return null;
};
