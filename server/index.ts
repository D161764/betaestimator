import express from 'express';
import { env } from './config/index.js';
import { setupMiddleware } from './middleware/index.js';

async function startServer() {
  try {
    const app = express();

    // Setup all middleware
    setupMiddleware(app);

    // Start server
    app.listen(env.port, () => {
      console.log(`Server running on port ${env.port}`);
      console.log(`Environment: ${env.nodeEnv}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();