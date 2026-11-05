'use strict';
const { token, hashToken, uuid } = require('../security/tokens');
const { now, inHours } = require('../database/db');

function create(db, config, userId, { ip, userAgent, mfaOk = false, mfaPending = false } = {}) {
  const raw = token(32), csrf = token(24), id = uuid();
  db.run('INSERT INTO sessions (id, user_id, token_hash, csrf_hash, mfa_ok, mfa_pending, ip, user_agent, created_at, expires_at, last_seen_at) VALUES (?,?,?,?,?,?,?,?,?,?,?)',
    [id, userId, hashToken(raw), hashToken(csrf), mfaOk, mfaPending, ip || null, (userAgent || '').slice(0, 200), now(), inHours(config.session.ttlHours), now()]);
  return { id, token: raw, csrf };
}
/* Returns { session, user } for a valid cookie token, otherwise null. Enforces absolute and idle expiry. */
function load(db, config, raw) {
  if (!raw) return null;
  const s = db.get('SELECT * FROM sessions WHERE token_hash = ?', [hashToken(raw)]);
  if (!s || s.revoked_at) return null;
  const t = Date.now();
  if (Date.parse(s.expires_at) < t || t - Date.parse(s.last_seen_at) > config.session.idleMinutes * 60000) { db.run('UPDATE sessions SET revoked_at = ? WHERE id = ?', [now(), s.id]); return null; }
  const user = db.get('SELECT id, email, name, status, email_verified_at, mfa_enabled FROM users WHERE id = ?', [s.user_id]);
  if (!user || user.status !== 'active') return null;
  if (t - Date.parse(s.last_seen_at) > 60000) db.run('UPDATE sessions SET last_seen_at = ? WHERE id = ?', [now(), s.id]);
  return { session: s, user };
}
const revoke = (db, id) => db.run('UPDATE sessions SET revoked_at = ? WHERE id = ? AND revoked_at IS NULL', [now(), id]);
const revokeAllForUser = (db, userId, exceptId = null) => db.run('UPDATE sessions SET revoked_at = ? WHERE user_id = ? AND revoked_at IS NULL AND id != ?', [now(), userId, exceptId || '']);
module.exports = { create, load, revoke, revokeAllForUser };
