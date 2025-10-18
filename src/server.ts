import mongoose from 'mongoose';
import { buildApp } from './app';
import { Logger } from './common/logger';
import { connectDB } from './startup/db';

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    await connectDB();
    const app = buildApp();
    const server = app.listen(PORT, () => {
      Logger.info({ message: `Server running on http://localhost:${PORT}` });
    });
    const shutdown = async (signal: string) => {
      try {
        Logger.info({
          message: `Received ${signal}. Gracefully shutting down...`,
        });
        // Stop accepting new connections
        server.close(async () => {
          Logger.info({ message: 'Closed HTTP server.' });
          // Close Mongo connection
          await mongoose.connection.close();
          Logger.info({ message: 'Disconnected from MongoDB.' });
          process.exit(0);
        });
        // Force exit after 10 seconds if shutdown hangs
        setTimeout(() => {
          Logger.error({ message: 'Forcing shutdown (timeout).' });
          process.exit(1);
        }, 10_000).unref();
      } catch (error: any) {
        Logger.error({
          message: 'Error during shutdown',
          error_message: error.message,
        });
        process.exit(1);
      }
    };
    process.on('SIGINT', () => shutdown('SIGINT'));
    process.on('SIGTERM', () => shutdown('SIGTERM'));
  } catch (error: any) {
    Logger.error({
      message: 'Failed to start server',
      error_message: error.message,
    });
    process.exit(1);
  }
}

startServer();
