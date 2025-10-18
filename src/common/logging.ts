import pino from 'pino';
import { RequestContext } from '../middlewares/request_context';
import { LoggingData } from './interface';

function getCallerInfo(depth = 3) {
  const err = new Error();
  const stack = err.stack ? err.stack.split('\n').map((s) => s.trim()) : [];
  const frame = stack[depth] || '';
  const m = frame.match(/at\s+(?:(.+?)\s+\()?(.+):(\d+):(\d+)\)?$/);
  if (!m) return { fl: '', fn: '', ln: 0, fp: '' };
  const fn = m[1] || '<anonymous>';
  const fp = m[2] || '';
  const ln = parseInt(m[3], 10) || 0;
  const fl = fp.split('/').pop() || fp;
  return { fl, fn, ln, fp };
}

function formatTimestamp() {
  const d = new Date();
  const iso = d.toISOString();
  return iso.replace('T', ' ').replace('Z', '');
}

const logger = pino({ base: null });

function buildLogObject(level: string, data: LoggingData) {
  const caller = getCallerInfo(4);
  const base: Record<string, any> = {
    ts: formatTimestamp(),
    lv: level,
    request_id: RequestContext.getRequestId(),
    fl: caller.fl,
    fn: caller.fn,
    ln: caller.ln,
    fp: caller.fp,
  };
  return { ...base, ...data };
}

const logInfo = (data: LoggingData) => {
  const obj = buildLogObject('INFO', data);
  logger.info(obj, data.message);
};

const logWarning = (data: LoggingData) => {
  const obj = buildLogObject('WARN', data);
  logger.warn(obj, data.message);
};

const logError = (data: LoggingData) => {
  const obj = buildLogObject('ERROR', data);
  logger.error(obj, data.message);
};

const logDebug = (data: LoggingData) => {
  const obj = buildLogObject('DEBUG', data);
  logger.info(obj, data.message);
};

export const Logger = { logInfo, logWarning, logError, logDebug };
