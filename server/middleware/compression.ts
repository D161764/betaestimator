import compression from 'compression';
import type { Express } from 'express';

export function setupCompression(app: Express): void {
  app.use(compression());
}