import express from 'express';
import { pinoHttp } from 'pino-http';
import { MAX_PRECISION, MIN_PRECISION, toBucket, validateCoordinates } from './bucket.js';

export function createApp({ logger = true } = {}) {
  const app = express();
  app.disable('x-powered-by');

  if (logger) {
    app.use(pinoHttp({ level: process.env.LOG_LEVEL || 'info', autoLogging: { ignore: (req) => req.url.startsWith('/healthz') || req.url.startsWith('/readyz') } }));
  }

  app.get('/healthz', (req, res) => res.json({ status: 'ok' }));
  app.get('/readyz', (req, res) => res.json({ status: 'ready' }));

  app.get('/api/geo/bucket', (req, res) => {
    const lat = Number(req.query.lat ?? NaN);
    const lng = Number(req.query.lng ?? NaN);
    const precision = req.query.precision === undefined ? 1 : Number(req.query.precision);

    const errors = validateCoordinates(lat, lng);
    if (!Number.isInteger(precision) || precision < MIN_PRECISION || precision > MAX_PRECISION) {
      errors.push(`precision must be an integer between ${MIN_PRECISION} and ${MAX_PRECISION}`);
    }
    if (errors.length) return res.status(400).json({ errors });

    res.json(toBucket(lat, lng, precision));
  });

  app.use((req, res) => res.status(404).json({ error: 'Not found' }));

  return app;
}
