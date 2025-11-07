import pino from 'pino';
import { RequestContext } from '../middlewares/request_context';

interface LoggingData {
  http_method?: string;
  url?: string;
  request_body?: string;
  duration_ms?: number;
  status_code?: number;
  message?: string;
  error_stack?: string;
  error_message?: string;
  lead_id?: string;
  anonymous_lead_id?: string;
  client_code?: string;
  chat_entity_id?: string;
  chat_entity_type?: string;
  key1?: string;
  key1_value?: string;
  key2?: string;
  key2_value?: string;
  key3?: string;
  key3_value?: string;
  num_key1?: string;
  num_key1_value?: number;
  num_key2?: string;
  num_key2_value?: number;
  num_key3?: string;
  num_key3_value?: number;
}

const getCallerInfo = (depth = 3) => {
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
};

const formatTimestamp = () => {
  const d = new Date();
  const iso = d.toISOString();
  return iso.replace('T', ' ').replace('Z', '');
};

const logger = pino({ base: null });

const buildLogObject = (level: string, data: LoggingData) => {
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
};

const info = (data: LoggingData) => {
  const obj = buildLogObject('INFO', data);
  logger.info(obj, data.message);
};

const warning = (data: LoggingData) => {
  const obj = buildLogObject('WARN', data);
  logger.warn(obj, data.message);
};

const error = (data: LoggingData) => {
  const obj = buildLogObject('ERROR', data);
  logger.error(obj, data.message);
};

const debug = (data: LoggingData) => {
  const obj = buildLogObject('DEBUG', data);
  logger.info(obj, data.message);
};

export const Logger = { info, warning, error, debug };
