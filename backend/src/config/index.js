'use strict';
const fs = require('fs');
const path = require('path');

function loadEnvFile(file) {
  if (!fs.existsSync(file)) return;
  for (const line of fs.readFileSync(file, 'utf8').split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
    if (!m || line.trim().startsWith('#')) continue;
    let v = m[2];
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) v = v.slice(1, -1);
    if (process.env[m[1]] === undefined) process.env[m[1]] = v;
  }
}
loadEnvFile(path.join(__dirname, '..', '..', '.env'));

const env = process.env;
const bool = (v, d) => (v === undefined ? d : /^(1|true|yes)$/i.test(v));
const list = (v, d) => (v || d).split(',').map((s) => s.trim()).filter(Boolean);

function build(overrides = {}) {
  const nodeEnv = env.NODE_ENV || 'development';
  const prod = nodeEnv === 'production';
  const cfg = {
    env: nodeEnv,
    isProd: prod,
    host: env.HOST || '127.0.0.1',
    port: Number(env.PORT) || 3000,
    trustProxy: bool(env.TRUST_PROXY, false),
    dbPath: env.DB_PATH || path.join(__dirname, '..', '..', 'data', 'pamoja.db'),
    appSecret: env.APP_SECRET || 'dev-only-insecure-secret-change-me-please-0000',
    serveFrontend: bool(env.SERVE_FRONTEND, !prod),
    frontendDir: env.FRONTEND_DIR || path.join(__dirname, '..', '..', '..', 'frontend'),
    publicAppUrl: env.PUBLIC_APP_URL || `http://localhost:${Number(env.PORT) || 3000}`,
    allowedOrigins: list(env.ALLOWED_ORIGINS, `http://localhost:${Number(env.PORT) || 3000},http://127.0.0.1:${Number(env.PORT) || 3000},http://localhost:8080,http://127.0.0.1:8080`),
    session: {
      cookieName: 'pamoja_session',
      csrfCookie: 'pamoja_csrf',
      ttlHours: Number(env.SESSION_TTL_HOURS) || 12,
      idleMinutes: Number(env.SESSION_IDLE_MINUTES) || 120,
      secure: bool(env.COOKIE_SECURE, prod),
      sameSite: env.COOKIE_SAMESITE || 'Lax'
    },
    security: {
      mfaEnforce: bool(env.MFA_ENFORCE, prod), // platform staff must use MFA in production
      maxFailedLogins: 5,
      lockMinutes: 15,
      inviteTtlHours: Number(env.INVITE_TTL_HOURS) || 168,
      resetTtlMinutes: 60,
      verifyTtlHours: 48,
      bodyLimit: 1_000_000
    },
    mail: { transport: env.MAIL_TRANSPORT || 'console', from: env.MAIL_FROM || 'AFCON PAMOJA <no-reply@example.invalid>' },
    exposeDevLinks: bool(env.EXPOSE_DEV_LINKS, !prod) // return activation links in API responses (development only)
  };
  const merged = { ...cfg, ...overrides };
  for (const k of ['session', 'security', 'mail']) merged[k] = { ...cfg[k], ...(overrides[k] || {}) };
  if (merged.isProd) {
    if (!env.APP_SECRET || env.APP_SECRET.length < 32) throw new Error('APP_SECRET (32+ characters) is required in production');
    if (merged.allowedOrigins.includes('*')) throw new Error('ALLOWED_ORIGINS must not contain * in production');
    if (merged.mail.transport === 'console') throw new Error('MAIL_TRANSPORT=console is not allowed in production; configure a real mail transport');
  }
  return merged;
}

module.exports = { build, default: build() };
