'use strict';

function notFoundHandler(req, res, _next) {
  res.status(404).json({
    error: 'NOT_FOUND',
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
}

module.exports = { notFoundHandler };
