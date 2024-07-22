import fs from 'fs/promises';

async function getLastLines(filePath, numLines = 10) {
  const fileHandle = await fs.open(filePath, 'r');
  try {
    const { size } = await fileHandle.stat();
    let position = size;
    const dataQueue = [];
    let temp = "";

    while (position > 0 && dataQueue.length < numLines) {
      position--;
      const { buffer } = await fileHandle.read(Buffer.alloc(1), 0, 1, position);
      const newByte = buffer.toString('utf8');
      temp = newByte + temp;

      if (newByte === '\n' || position === 0) {
        if (temp.trim()) {
          dataQueue.unshift(temp.trim());
        }
        temp = "";
      }
    }

    return dataQueue;
  } finally {
    await fileHandle.close();
  }
}

let lastPosition = 0;

async function sendNewContent(filePath, callback) {
  const stats = await fs.stat(filePath);

  if (stats.size > lastPosition) {
    const fileHandle = await fs.open(filePath, 'r');
    try {
      const { buffer } = await fileHandle.read(Buffer.alloc(stats.size - lastPosition), 0, stats.size - lastPosition, lastPosition);
      const newContent = buffer.toString();
      const lines = newContent.split('\n');

      for (const line of lines) {
        if (line.trim()) {
          callback(line.trim());
        }
      }

      lastPosition = stats.size;
    } finally {
      await fileHandle.close();
    }
  }
}


export { getLastLines, sendNewContent };