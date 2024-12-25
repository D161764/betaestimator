import type { Express, Request, Response, NextFunction } from 'express';

export function setupErrorHandling(app: Express): void {
  // Handle 404
  app.use((req: Request, res: Response, next: NextFunction) => {
    res.status(404).json({ error: 'Not Found' });
  });

  // Handle errors
  app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal Server Error' });
  });
}