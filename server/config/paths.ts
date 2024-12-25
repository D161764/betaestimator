import { join } from 'path';

export const paths = {
  root: process.cwd(),
  client: join(process.cwd(), 'dist', 'client'),
  static: join(process.cwd(), 'dist', 'client', 'static'),
  publicDir: join(process.cwd(), 'public'),
  indexHtml: join(process.cwd(), 'dist', 'client', 'index.html')
};