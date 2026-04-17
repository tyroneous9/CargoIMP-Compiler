#!/usr/bin/env node
/**
 * auth_google.js
 *
 * One-time interactive OAuth2 authorisation for the Google Sheets uploader.
 * Run this once on any machine with a browser to generate a persistent token file.
 *
 * Usage:
 *   node scripts/auth_google.js
 *
 * What it does:
 *   1. Reads OAuth2 client credentials from GOOGLE_CLOUD_CREDENTIALS_FILE (.env)
 *   2. Starts a temporary local HTTP server on port 3456 to catch the redirect
 *   3. Prints an auth URL — open it in a browser and sign in as the sheet owner
 *   4. Google redirects back to localhost:3456 with an auth code
 *   5. Exchanges the code for access + refresh tokens
 *   6. Saves the tokens to GOOGLE_TOKEN_FILE (.env)
 *
 * After this script succeeds, upload_tables_to_sheets.js uses the token file
 * automatically and will silently refresh it when needed.
 */

'use strict';

const fs      = require('fs');
const http    = require('http');
const path    = require('path');
const { URL } = require('url');
const { auth: googleAuth } = require('@googleapis/sheets');
const { ENV_FILE } = require('../config/paths');

require('dotenv').config({ path: ENV_FILE });

const CREDENTIALS_FILE = process.env.GOOGLE_CLOUD_CREDENTIALS_FILE;
const TOKEN_FILE        = process.env.GOOGLE_TOKEN_FILE;

if (!CREDENTIALS_FILE) {
  console.error('GOOGLE_CLOUD_CREDENTIALS_FILE is not set in .env');
  process.exit(1);
}
if (!TOKEN_FILE) {
  console.error('GOOGLE_TOKEN_FILE is not set in .env');
  process.exit(1);
}

const REDIRECT_PORT = 3456;
const REDIRECT_URI  = `http://localhost:${REDIRECT_PORT}`;

// Resolve credentials path relative to server root if not absolute
const credsPath = path.isAbsolute(CREDENTIALS_FILE)
  ? CREDENTIALS_FILE
  : path.resolve(path.dirname(ENV_FILE), CREDENTIALS_FILE);

const tokenPath = path.isAbsolute(TOKEN_FILE)
  ? TOKEN_FILE
  : path.resolve(path.dirname(ENV_FILE), TOKEN_FILE);

const creds = JSON.parse(fs.readFileSync(credsPath, 'utf8'));
const { client_id, client_secret } = creds.installed;

const oauth2Client = new googleAuth.OAuth2(client_id, client_secret, REDIRECT_URI);

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];

const authUrl = oauth2Client.generateAuthUrl({
  access_type: 'offline',   // request refresh token
  prompt:      'consent',   // force consent screen so refresh token is always returned
  scope:       SCOPES,
});

console.log('\n──────────────────────────────────────────────────────');
console.log('Open this URL in a browser and sign in as the Google');
console.log('account that owns the target spreadsheet:\n');
console.log(authUrl);
console.log('\nWaiting for Google to redirect to localhost…');
console.log('──────────────────────────────────────────────────────\n');

// Spin up a temporary server to receive the redirect with the auth code
const server = http.createServer(async (req, res) => {
  try {
    const reqUrl = new URL(req.url, REDIRECT_URI);
    const code   = reqUrl.searchParams.get('code');
    const error  = reqUrl.searchParams.get('error');

    if (error) {
      res.writeHead(400);
      res.end(`Auth error: ${error}`);
      console.error(`\nAuth error returned by Google: ${error}`);
      server.close();
      process.exit(1);
    }

    if (!code) {
      res.writeHead(400);
      res.end('No auth code received.');
      return;
    }

    const { tokens } = await oauth2Client.getToken(code);
    fs.writeFileSync(tokenPath, JSON.stringify(tokens, null, 2));

    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end('<h2>Authorisation successful — you can close this tab.</h2>');

    console.log(`Token saved to: ${tokenPath}`);
    console.log('You can now run: node scripts/upload_tables_to_sheets.js\n');

    server.close();
  } catch (err) {
    res.writeHead(500);
    res.end(`Error: ${err.message}`);
    console.error('Failed to exchange auth code:', err.message);
    server.close();
    process.exit(1);
  }
});

server.listen(REDIRECT_PORT, 'localhost', () => {
  // Server is ready; waiting for redirect
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${REDIRECT_PORT} is already in use. Stop any process using it and retry.`);
  } else {
    console.error('Server error:', err.message);
  }
  process.exit(1);
});
