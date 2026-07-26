class ApiError extends Error {
  constructor(statusCode, message, isOperational = true, stack = '') {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    
    // Convert status code to consistent string code (e.g. 401 -> "UNAUTHORIZED")
    this.code = this._getCodeFromStatus(statusCode);

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  _getCodeFromStatus(statusCode) {
    const statusCodes = {
      400: 'BAD_REQUEST',
      401: 'UNAUTHORIZED',
      403: 'FORBIDDEN',
      404: 'NOT_FOUND',
      409: 'CONFLICT',
      429: 'TOO_MANY_REQUESTS',
      500: 'SERVER_ERROR',
      503: 'SERVICE_UNAVAILABLE',
    };
    return statusCodes[statusCode] || 'SERVER_ERROR';
  }
}

export default ApiError;
