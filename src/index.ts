import express, { NextFunction, Request, Response } from 'express';
import { RequestContext } from './middlewares';
import { initConfig } from './startup/aws_secrets';

const app = express();

app.use(express.json());
app.use(RequestContext.middleware);

app.get('/health', (request: Request, response: Response) => {
  return response.json({
    status: 'ok',
    request_id: RequestContext.getRequestId(),
  });
});

app.use(
  (err: any, request: Request, response: Response, next: NextFunction) => {
    console.error(err);
    response.status(500).json({ error: 'internal_server_error' });
  },
);

(async () => {
  await initConfig();
  const PORT = process.env.PORT || '3000';
  app.listen(Number(PORT), () => {
    console.log(`Server listening on ${PORT}`);
  });
})();

export default app;
