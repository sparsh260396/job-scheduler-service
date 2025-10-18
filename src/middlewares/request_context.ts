import { AsyncLocalStorage } from 'async_hooks';
import crypto from 'crypto';
import { NextFunction, Request, Response } from 'express';

type Store = {
  [key: string]: string | undefined;
};

const als = new AsyncLocalStorage<Store>();

const RequestContext = {
  middleware(request: Request, response: Response, next: NextFunction) {
    const requestId =
      (request.headers['x-request-id'] as string) ||
      (request.headers['x-correlation-id'] as string) ||
      (request.headers['request-id'] as string) ||
      crypto.randomUUID();
    const store: Store = { requestId };
    response.setHeader('x-request-id', requestId);
    als.run(store, () => next());
  },

  getRequestId(): string {
    return als.getStore()?.requestId || '';
  },

  set(key: string, value: string) {
    const store = als.getStore();
    if (store) store[key] = value;
  },

  get(key: string): string | undefined {
    return als.getStore()?.[key];
  },
};

export { RequestContext };
