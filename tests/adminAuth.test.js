import test from 'node:test';
import assert from 'node:assert/strict';
import { isAdmin } from '../lib/auth/admin.js';

test('isAdmin retorna false para usuarios nulos o sin email', () => {
  assert.equal(isAdmin(null), false);
  assert.equal(isAdmin(undefined), false);
  assert.equal(isAdmin({}), false);
});

test('isAdmin retorna false para usuarios normales', () => {
  assert.equal(isAdmin({ email: 'cliente@gmail.com' }), false);
  assert.equal(isAdmin({ email: 'hacker@attacker.org', user_metadata: {} }), false);
});

test('isAdmin retorna true para correos en la lista autorizada', () => {
  assert.equal(isAdmin({ email: 'h.melotto@melottogroup.com' }), true);
  assert.equal(isAdmin({ email: 'H.MELOTTO@MELOTTOGROUP.COM' }), true); // Case-insensitive
  assert.equal(isAdmin({ email: 'hannah.melotto@melottogroup.com' }), true);
  assert.equal(isAdmin({ email: 'j.smolina.v10@gmail.com' }), true);
});

test('isAdmin retorna true para usuarios con rol admin en user_metadata o app_metadata', () => {
  assert.equal(isAdmin({ email: 'staff@zafhira.com', user_metadata: { role: 'admin' } }), true);
  assert.equal(isAdmin({ email: 'staff@zafhira.com', app_metadata: { role: 'admin' } }), true);
});

