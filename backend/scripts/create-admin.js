'use strict';
/* Creates (or promotes) a platform staff account. Usage:
     npm run create-admin -- you@example.com "Your Name" [super_admin|alimap_admin|alimap_verifier|alimap_support]
   A random one-time password is printed once. Change it after signing in, and enable MFA. */
const crypto = require('crypto');
const config = require('../src/config').default;
const { open, now } = require('../src/core/database/db');
const { migrate } = require('../src/core/database/migrate');
const { seedReferenceData } = require('../src/core/database/reference-data');
const password = require('../src/core/security/password');

(async () => {
  const [email, name = 'Alimap Administrator', role = 'super_admin'] = process.argv.slice(2);
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { console.error('Usage: npm run create-admin -- email@example.com "Full Name" [role]'); process.exit(1); }
  const db = open(config.dbPath); migrate(db); seedReferenceData(db);
  if (!db.get("SELECT 1 AS x FROM roles WHERE id = ? AND scope = 'platform'", [role])) { console.error(`Unknown platform role: ${role}`); process.exit(1); }
  let u = db.get('SELECT id FROM users WHERE email = ?', [email.toLowerCase()]), pw = null;
  if (!u) {
    pw = crypto.randomBytes(12).toString('base64url'); const id = crypto.randomUUID(), ts = now();
    db.run('INSERT INTO users (id, email, name, password_hash, email_verified_at, created_at, updated_at) VALUES (?,?,?,?,?,?,?)', [id, email.toLowerCase(), name, await password.hash(pw), ts, ts, ts]); u = { id };
  }
  db.run('INSERT OR IGNORE INTO user_roles (user_id, role_id, created_at) VALUES (?,?,?)', [u.id, role, now()]);
  db.run("INSERT INTO audit_logs (at, action, entity_type, entity_id, details) VALUES (?, 'role.granted', 'user', ?, ?)", [now(), u.id, JSON.stringify({ role, via: 'cli' })]);
  console.log(pw ? `Created ${role}: ${email}\nOne-time password: ${pw}\n(Shown once. Sign in, change it, and enable MFA.)` : `${email} already existed; granted role ${role}.`);
  db.close();
})();
