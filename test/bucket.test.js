import { test } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import { toBucket } from '../src/bucket.js';
import { createApp } from '../src/app.js';

const app = createApp({ logger: false });

test('nearby points share a bucket', () => {
  assert.equal(toBucket(6.5244, 3.3792, 1).id, toBucket(6.5299, 3.3701, 1).id);
});

test('distant points land in different buckets', () => {
  assert.notEqual(toBucket(6.5244, 3.3792, 1).id, toBucket(5.6037, -0.187, 1).id);
});

test('bucket bounds contain the point', () => {
  const { bounds } = toBucket(-1.2921, 36.8219, 2);
  assert.ok(bounds.south <= -1.2921 && -1.2921 < bounds.north);
  assert.ok(bounds.west <= 36.8219 && 36.8219 < bounds.east);
});

test('GET /api/geo/bucket returns a bucket', async () => {
  const res = await request(app).get('/api/geo/bucket?lat=6.5244&lng=3.3792&precision=1');
  assert.equal(res.status, 200);
  assert.equal(res.body.id, '1:65:33');
});

test('GET /api/geo/bucket rejects invalid input', async () => {
  const res = await request(app).get('/api/geo/bucket?lat=200&lng=abc&precision=9');
  assert.equal(res.status, 400);
  assert.equal(res.body.errors.length, 3);
});

test('GET /healthz returns ok', async () => {
  const res = await request(app).get('/healthz');
  assert.equal(res.status, 200);
});
