import { WebSocketServer } from 'ws';
import fs from 'fs';
import { getLastLines, sendNewContent } from './fileReader.js';

function setupWebSocket(server, logFilePath) {
  const wss = new WebSocketServer({ server });

  wss.on('connection', async (ws) => {
    console.log('Client connected');

    const lastLines = await getLastLines(logFilePath, 10);
    for (const line of lastLines) {
      ws.send(JSON.stringify({ type: 'update', data: line }));
    }

    const sendUpdate = (line) => {
      ws.send(JSON.stringify({ type: 'update', data: line }));
    };

    const watcher = fs.watch(logFilePath, () => {
      sendNewContent(logFilePath, sendUpdate);
    });

    ws.on('close', () => {
      console.log('Client disconnected');
      watcher.close();
    });
  });

  return wss;
}

export { setupWebSocket };