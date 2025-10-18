import { NextFunction, Request, Response } from 'express';

export function notFound(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  response.status(404).json({
    error: {
      message: `Route ${request.originalUrl} not found`,
    },
  });
}
