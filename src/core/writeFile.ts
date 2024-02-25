import { promises as fs } from 'node:fs';

export const writeFile = async (path: string, content: string) => {
  await fs.writeFile(path, content, 'utf-8');
};
