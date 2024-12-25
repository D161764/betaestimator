import type { Express } from 'express';

export function setupSecurity(app: Express): void {
  // Remove X-Powered-By header
  app.disable('x-powered-by');
  
  // Set security headers
  app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    next();
  });
}