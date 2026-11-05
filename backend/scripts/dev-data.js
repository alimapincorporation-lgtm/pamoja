'use strict';
/* Development data: a super admin (random one-time password) and a few clearly-labelled DEMO businesses, onboarded through the real API rules.
   Usage: npm run dev-data      (never run in production; refuses when NODE_ENV=production) */
const crypto = require('crypto');
const { createApp } = require('../src/app');
const password = require('../src/core/security/password');
const { now } = require('../src/core/database/db');

(async () => {
  const app = createApp();
  if (app.config.isProd) { console.error('Refusing to create demo data in production.'); process.exit(1); }
  const email = 'admin@pamoja.test', pw = crypto.randomBytes(12).toString('base64url');
  const existing = app.db.get('SELECT id FROM users WHERE email = ?', [email]), ts = now();
  const hash = await password.hash(pw);
  let uid = existing && existing.id;
  if (uid) app.db.run('UPDATE users SET password_hash = ?, failed_logins = 0, locked_until = NULL, status = ? WHERE id = ?', [hash, 'active', uid]);
  else { uid = crypto.randomUUID(); app.db.run('INSERT INTO users (id, email, name, password_hash, email_verified_at, created_at, updated_at) VALUES (?,?,?,?,?,?,?)', [uid, email, 'Demo Administrator', hash, ts, ts, ts]); }
  app.db.run('INSERT OR IGNORE INTO user_roles (user_id, role_id, created_at) VALUES (?,?,?)', [uid, 'super_admin', ts]);

  const addr = await app.listen(0), base = `http://127.0.0.1:${addr.port}/api/v1`;
  const jar = {}; let csrf = null;
  async function call(method, path, body) {
    const h = { 'content-type': 'application/json' }; if (Object.keys(jar).length) h.cookie = Object.entries(jar).map(([k, v]) => `${k}=${v}`).join('; '); if (csrf && method !== 'GET') h['x-csrf-token'] = csrf;
    const r = await fetch(base + path, { method, headers: h, body: body ? JSON.stringify(body) : undefined });
    for (const c of r.headers.getSetCookie()) { const [kv] = c.split(';'); const i = kv.indexOf('='); jar[kv.slice(0, i)] = decodeURIComponent(kv.slice(i + 1)); }
    const j = await r.json().catch(() => ({})); if (j.csrfToken) csrf = j.csrfToken; return { status: r.status, body: j };
  }
  await call('POST', '/auth/login', { email, password: pw });
  const demo = [
    { name: 'Demo Pearl Hotel', category: 'hotel', country: 'UG', city: 'Kampala', lat: 0.3136, lng: 32.5811, phone: '+256 700 000 001', summary: 'Demo hotel record for testing.', hours: 'Front desk 24 hours', services: ['Rooms', 'Breakfast', 'Airport pickup'], ownerEmail: 'owner@pamoja.test' },
    { name: 'Demo Central Pharmacy', category: 'medical', country: 'UG', city: 'Kampala', lat: 0.316, lng: 32.5822, phone: '+256 700 000 002', summary: 'Demo pharmacy record for testing.', hours: 'Mon–Sat 08:00–20:00', services: ['Medicines', 'First-aid supplies'] },
    { name: 'Demo Nairobi Crafts', category: 'retail', country: 'KE', city: 'Nairobi', lat: -1.2921, lng: 36.8219, phone: '+254 700 000 003', summary: 'Demo craft shop record for testing.', hours: 'Daily 09:00–18:00', services: ['Crafts', 'Gifts'] },
    { name: 'Demo Zanzibar Grill', category: 'restaurant', country: 'TZ', city: 'Zanzibar', lat: -6.165, lng: 39.193, phone: '+255 700 000 004', summary: 'Demo restaurant record for testing.', hours: 'Evenings', services: ['Seafood', 'Grill'] }
  ];
  let link = null;
  for (const b of demo) {
    const r = await call('POST', '/admin/businesses', b);
    if (r.status === 409) { console.log(`skip (exists): ${b.name}`); continue; }
    if (r.status !== 201) { console.error('create failed', r.body); continue; }
    if (r.body.invitation && r.body.invitation.activationUrl) link = r.body.invitation.activationUrl;
    await call('POST', `/admin/businesses/${r.body.id}/verification`, { status: 'approved', note: 'DEMO DATA: no real evidence checked' });
    await call('POST', `/admin/businesses/${r.body.id}/location-verification`, { status: 'verified' });
    await call('POST', `/admin/businesses/${r.body.id}/publish`);
    console.log(`created + published: ${b.name}`);
  }
  console.log(`\nAdmin sign-in:  ${email}\nOne-time password: ${pw}\n(New each time you run this script.)`);
  if (link) console.log(`\nDemo owner activation link (owner@pamoja.test):\n${link.replace(app.config.publicAppUrl, 'http://localhost:' + app.config.port)}`);
  console.log('\nThese are DEMO records. Delete the database file (npm run migrate -- --reset) before any real use.');
  await app.close();
})();
