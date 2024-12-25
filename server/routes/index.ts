import type { Express } from 'express';
import { config } from '../config.js';

export const setupRoutes = (app: Express): void => {
  // Handle all routes by serving index.html (for client-side routing)
  app.get('*', (req, res) => {
    res.sendFile(config.indexHtml);
  });
};