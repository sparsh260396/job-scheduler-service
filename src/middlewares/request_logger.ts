import { NextFunction, Request, Response } from 'express';
import { Logger } from '../common/logger';

const REDACT = new Set([
  'password',
  'token',
  'authorization',
  'secret',
  'accessToken',
  'refreshToken',
]);

function sanitizeBody(body: any) {
  if (!body || typeof body !== 'object') return body;
  const copy: any = Array.isArray(body) ? [...body] : { ...body };
  for (const k of Object.keys(copy)) {
    if (REDACT.has(k.toLowerCase())) copy[k] = '***REDACTED***';
    if (typeof copy[k] === 'string' && copy[k].length > 5000) {
      copy[k] = copy[k].slice(0, 5000) + '…[TRUNCATED]';
    }
  }
  return copy;
}

export function requestLogger(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  if (request.path === '/health') return next();
  const startTime = process.hrtime.bigint();
  const shouldLogBody =
    request.method === 'POST' ||
    request.method === 'PUT' ||
    request.method === 'PATCH';
  Logger.info({
    http_method: request.method,
    url: request.originalUrl,
    request_body: shouldLogBody ? sanitizeBody(request.body) : undefined,
  });
  response.on('finish', () => {
    const durationMs = Number(process.hrtime.bigint() - startTime) / 1e6;
    Logger.info({
      http_method: request.method,
      url: request.originalUrl,
      status_code: response.statusCode,
      duration_ms: Math.round(durationMs),
      message: 'Request completed',
    });
  });
  next();
}
