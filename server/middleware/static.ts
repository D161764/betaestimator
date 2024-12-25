import express from 'express';
import type { Express } from 'express';
import { paths } from '../config/index.js';

export function setupStatic(app: Express): void {
  // Serve static files from the client build directory
  app.use(express.static(paths.client));

  // Handle client-side routing by serving index.html for all routes
  app.get('*', (req, res) => {
    res.sendFile(paths.indexHtml);
  });
}