const express = require('express');
const { execFile } = require('child_process');
const paths = require('../config/paths');

const app = express();
const port = process.env.PORT || 3000;
const cppDir = paths.CPP_DIR;

const parserConfigs = {
  ffm8: {
    label: 'FFM/8',
    binary: paths.PARSER_BINARIES.ffm8,
    input: paths.SAMPLE_INPUTS.ffm8,
  },
  fwb17: {
    label: 'FWB/17',
    binary: paths.PARSER_BINARIES.fwb17,
    input: paths.SAMPLE_INPUTS.fwb17,
  },
  fhl4: {
    label: 'FHL/4',
    binary: paths.PARSER_BINARIES.fhl4,
    input: paths.SAMPLE_INPUTS.fhl4,
  },
};

app.use(express.json({ limit: '1mb' }));

function escapeHtml(value) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function renderPage(title, body) {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeHtml(title)}</title>
    <style>
      body {
        font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
        margin: 0;
        padding: 24px;
        background: #f5f7fb;
        color: #1f2937;
      }
      main {
        max-width: 960px;
        margin: 0 auto;
      }
      a {
        color: #0f62fe;
        text-decoration: none;
      }
      a:hover {
        text-decoration: underline;
      }
      .card {
        background: #ffffff;
        border: 1px solid #dbe3f0;
        border-radius: 12px;
        padding: 20px;
        box-shadow: 0 8px 24px rgba(15, 23, 42, 0.06);
      }
      pre {
        overflow: auto;
        white-space: pre-wrap;
        word-break: break-word;
        line-height: 1.5;
        margin: 0;
      }
      ul {
        padding-left: 18px;
      }
      li + li {
        margin-top: 10px;
      }
      .meta {
        color: #6b7280;
        margin-bottom: 16px;
      }
      .error {
        color: #991b1b;
        background: #fef2f2;
        border-color: #fecaca;
      }
    </style>
  </head>
  <body>
    <main>${body}</main>
  </body>
</html>`;
}

function runParser(parserKey) {
  const config = parserConfigs[parserKey];

  return new Promise((resolve, reject) => {
    execFile(
      config.binary,
      ['-file', config.input],
      { cwd: cppDir, maxBuffer: 1024 * 1024 },
      (error, stdout, stderr) => {
        if (error) {
          reject(new Error(stderr || stdout || error.message));
          return;
        }

        try {
          resolve(JSON.parse(stdout));
        } catch (parseError) {
          reject(new Error(`Invalid JSON from parser: ${parseError.message}`));
        }
      }
    );
  });
}

app.get('/', (_req, res) => {
  res.type('html').send(renderPage(
    'endpoints',
    `<div class="card">
      <h1>test results</h1>
      <ul>
        <li><a href="/results/ffm8">/results/ffm8</a> - FFM/8 sample output</li>
        <li><a href="/results/fwb17">/results/fwb17</a> - FWB/17 sample output</li>
        <li><a href="/results/fhl4">/results/fhl4</a> - FHL/4 sample output</li>
      </ul>
    </div>`
  ));
});

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.get('/results/:parserKey', async (req, res) => {
  const { parserKey } = req.params;
  const config = parserConfigs[parserKey];

  if (!config) {
    res.status(404).type('html').send(renderPage(
      'Unknown Parser',
      `<div class="card error"><h1>Unknown parser</h1><pre>${escapeHtml(parserKey)}</pre></div>`
    ));
    return;
  }

  try {
    const parsed = await runParser(parserKey);
    res.type('html').send(renderPage(
      `${config.label} Output`,
      `<div class="card">
        <h1>${escapeHtml(config.label)} Output</h1>
        <p class="meta"><a href="/">Back to index</a></p>
        <pre>${escapeHtml(JSON.stringify(parsed, null, 2))}</pre>
      </div>`
    ));
  } catch (error) {
    res.status(500).type('html').send(renderPage(
      `${config.label} Error`,
      `<div class="card error">
        <h1>${escapeHtml(config.label)} Error</h1>
        <p class="meta"><a href="/">Back to index</a></p>
        <pre>${escapeHtml(error.message)}</pre>
      </div>`
    ));
  }
});

app.post('/parse-results', (req, res) => {
  res.status(202).json({
    status: 'accepted',
    received: req.body,
  });
});

app.listen(port, () => {
  console.log(`Backend listening on port ${port}`);
});
