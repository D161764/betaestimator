import type { Express } from 'express';
import { setupCompression } from './compression.js';
import { setupSecurity } from './security.js';
import { setupStatic } from './static.js';
import { setupErrorHandling } from './errorHandling.js';

export function setupMiddleware(app: Express): void {
  setupSecurity(app);
  setupCompression(app);
  setupStatic(app);
  setupErrorHandling(app);
}