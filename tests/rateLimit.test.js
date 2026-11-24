import test from 'node:test';
import assert from 'node:assert/strict';
import { checkRateLimit } from '../lib/rateLimit.js';

test('checkRateLimit permite peticiones dentro del límite', async () => {
  const ip = 'test-ip-allow-' + Date.now();
  const res1 = await checkRateLimit(ip, { limit: 3, windowSeconds: 10 });
  assert.equal(res1.success, true);
  assert.equal(res1.remaining, 2);

  const res2 = await checkRateLimit(ip, { limit: 3, windowSeconds: 10 });
  assert.equal(res2.success, true);
  assert.equal(res2.remaining, 1);
});

test('checkRateLimit bloquea peticiones cuando se supera el límite', async () => {
  const ip = 'test-ip-block-' + Date.now();
  await checkRateLimit(ip, { limit: 2, windowSeconds: 10 });
  await checkRateLimit(ip, { limit: 2, windowSeconds: 10 });

  const res3 = await checkRateLimit(ip, { limit: 2, windowSeconds: 10 });
  assert.equal(res3.success, false);
  assert.equal(res3.remaining, 0);
});

