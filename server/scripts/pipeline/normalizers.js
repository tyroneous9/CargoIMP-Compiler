'use strict';

function normalizeBody(parsedEmail) {
  const textBody = (parsedEmail.text || '').replace(/\r\n/g, '\n').trim();
  if (textBody) return textBody;
  return (parsedEmail.html || '').toString().replace(/\r\n/g, '\n').trim();
}

module.exports = {
  normalizeBody,
};