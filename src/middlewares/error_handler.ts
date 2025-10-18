import { NextFunction, Request, Response } from 'express';

export function errorHandler(
  err: any,
  request: Request,
  response: Response,
  next: NextFunction,
) {
  const status = err.code === 'NOT_FOUND' ? 404 : err.status || 500;
  response.status(status).json({
    error: {
      message: err.message || 'Internal Server Error',
      code: err.code || 'INTERNAL',
    },
  });
}
