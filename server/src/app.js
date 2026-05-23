'use strict';

const express = require('express');
const apiRouter = require('./routes');
const { notFoundHandler } = require('./middleware/not-found');
const { errorHandler } = require('./middleware/error-handler');

const app = express();

app.use(express.json({ limit: '1mb' }));

app.use('/api', apiRouter);
app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
