import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { setupWebSocket } from './webSocketHandler.js';

const LOG_FILE = '/Users/abhinavpandey/Documents/browserstack/tailf/logfile.log';
const PORT = 8080;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const server = http.createServer((req, res) => {
  if (req.url === '/log') {
    fs.readFile(path.join(__dirname, '../client/client.html'), (err, data) => {
      if (err) {
        res.writeHead(500);
        res.end('Error loading client.html');
      } else {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(data);
      }
    });
  } else {
    res.writeHead(404);
    res.end('Not found');
  }
});

setupWebSocket(server, LOG_FILE);

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});