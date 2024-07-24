import { expect } from 'chai';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { getLastLines, sendNewContent } from '../src/fileReader.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe('fileReader', () => {
  const testFilePath = path.join(__dirname, 'test.log');

  beforeEach(async () => {
    await fs.writeFile(testFilePath, '1\n2\n3\n4\n5\n');
  });

  afterEach(async () => {
    await fs.unlink(testFilePath);
  });

  describe('getLastLines', () => {
    it('should return the last n lines of a file', async () => {
      const lines = await getLastLines(testFilePath, 3);
      expect(lines).to.deep.equal(['3', '4', '5']);
    });

    it('should return all lines if n is greater than file line count', async () => {
      const lines = await getLastLines(testFilePath, 10);
      expect(lines).to.deep.equal(['1', '2', '3', '4', '5']);
    });
  });

  describe('sendNewContent', () => {
    it('should send new content when file is updated', async () => {
      const receivedLines = [];
      const callback = (line) => receivedLines.push(line);

      await sendNewContent(testFilePath, callback);
      expect(receivedLines).to.deep.equal(['1', '2', '3', '4', '5']);

      await fs.appendFile(testFilePath, '6\n7\n');
      await sendNewContent(testFilePath, callback);
      expect(receivedLines).to.deep.equal(['1', '2', '3', '4', '5', '6', '7']);
    });
  });
});