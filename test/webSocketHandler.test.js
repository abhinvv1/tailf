import { expect } from 'chai';
import { WebSocket } from 'ws';
import http from 'http';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { setupWebSocket } from '../src/webSocketHandler.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe('webSocketHandler', () => {
  const testFilePath = path.join(__dirname, 'test.log');
  let server;
  let wss;

  beforeEach(async () => {
    await fs.writeFile(testFilePath, '1\n2\n3\n');
    server = http.createServer();
    wss = setupWebSocket(server, testFilePath);
    await new Promise(resolve => server.listen(0, resolve));
  });

  it('should send initial lines when a client connects', (done) => {
    const port = server.address().port;
    const ws = new WebSocket(`ws://localhost:${port}`);
    const receivedMessages = [];

    ws.on('message', (message) => {
      const parsed = JSON.parse(message.toString());
      receivedMessages.push(parsed.data);
      
      if (receivedMessages.length === 3) {
        expect(receivedMessages).to.deep.equal(['1', '2', '3']);
        ws.close();
        done();
      }
    });
  });
});