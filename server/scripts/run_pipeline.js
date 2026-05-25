#!/usr/bin/env node
'use strict';

const { startPipeline } = require('./pipeline/workflow');

startPipeline().catch((error) => {
  process.stderr.write(`${new Date().toISOString()} [ERROR] [pipeline] fatal error: ${error.message}\n`);
  process.exit(1);
});
