'use strict';

function errorHandler(error, _req, res, _next) {
  const statusCode = Number(error.statusCode) || 500;
  const code = error.code || 'INTERNAL_ERROR';

  res.status(statusCode).json({
    error: code,
    message: error.message || 'Unexpected server error',
  });
}

module.exports = { errorHandler };
