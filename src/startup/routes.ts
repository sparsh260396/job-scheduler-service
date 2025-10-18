import { Express } from 'express';
import v1 from '../routes/v1';

export function setupRoutes(app: Express) {
  app.use('/api/v1', v1);
}
