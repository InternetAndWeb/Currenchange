const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => {
  // URL 파싱
  const parsedUrl = url.parse(req.url);
  let filePath = '.' + decodeURIComponent(parsedUrl.pathname);

  if (filePath === './') {
    filePath = './currenchange.html';
  }

  const extname = String(path.extname(filePath)).toLowerCase();
  const mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.json': 'application/json',
    '.pdf': 'application/pdf',
    '.txt': 'text/plain',
    '.woff': 'application/font-woff',
    '.woff2': 'application/font-woff2',
    '.ttf': 'application/font-ttf',
    '.eot': 'application/vnd.ms-fontobject',
    '.otf': 'application/font-otf',
    '.wasm': 'application/wasm'
  };

  const contentType = mimeTypes[extname] || 'application/octet-stream';

  fs.readFile(filePath, (error, content) => {
    if (error) {
      if (error.code === 'ENOENT') {
        fs.readFile('./404.html', (error404, content404) => {
          if (error404) {
            res.writeHead(500);
            res.end('Sorry, error encountered: ' + error404.code + ' ..\n');
          } else {
            res.writeHead(404, { 'Content-Type': 'text/html' });
            res.end(content404, 'utf-8');
          }
        });
      } else {
        res.writeHead(500);
        res.end('Sorry, error encountered: ' + error.code + ' ..\n');
      }
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
