import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const config = {
  port: process.env.PORT || 8080,
  staticDir: join(__dirname, '..', 'dist'),
  indexHtml: join(__dirname, '..', 'dist', 'index.html')
};