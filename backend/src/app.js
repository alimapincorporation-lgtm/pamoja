'use strict';
/* Application factory (dependency injection): builds config, database, services and routes. Used by server.js and tests. */
const fs = require('fs');
const path = require('path');
const { build } = require('./config');
const { open } = require('./core/database/db');
const { migrate } = require('./core/database/migrate');
const { seedReferenceData } = require('./core/database/reference-data');
const { Router } = require('./core/http/router');
const { createServer } = require('./core/http/server');
const { createLimiter } = require('./core/security/rate-limit');
const { createMailer } = require('./integrations/mailer');
const { E, AppError } = require('./core/errors');

function createApp(overrides = {}) {
  const config = build(overrides);
  if (config.dbPath !== ':memory:') fs.mkdirSync(path.dirname(config.dbPath), { recursive: true });
  const db = open(config.dbPath);
  migrate(db);
  seedReferenceData(db);
  const app = { config, db, router: new Router(), limiter: createLimiter(), mailer: createMailer(config) };

  /* Guards (route middleware). They throw AppError; the server turns that into a JSON response. */
  app.guards = {
    user(ctx) {
      if (!ctx.user) throw E.unauthorized();
      if (ctx.session.mfa_pending) throw E.unauthorized('Enter your authentication code to continue.', 'MFA_PENDING');
    },
    platform(perm) {
      return (ctx) => {
        app.guards.user(ctx);
        if (!ctx.rbac().platformPerms.has(perm)) throw E.forbidden();
        if (config.security.mfaEnforce && !ctx.session.mfa_ok) throw new AppError(403, 'MFA_REQUIRED', 'Multi-factor authentication is required for this action.');
      };
    },
    /* Tenant isolation: a user who is not an active member of :orgId gets 404 (the organisation's existence is not revealed). */
    org(perm) {
      return (ctx) => {
        app.guards.user(ctx);
        const m = ctx.rbac().memberships.find((x) => x.organisationId === ctx.params.orgId);
        if (!m) throw E.notFound();
        if (m.organisationStatus !== 'active') throw E.forbidden('This organisation is suspended.', 'ORG_SUSPENDED');
        if (!m.perms.has(perm)) throw E.forbidden();
        ctx.membership = m;
      };
    }
  };

  router_health(app);
  for (const mod of ['auth', 'businesses', 'organisations', 'enquiries', 'administration']) require(`./modules/${mod}`).register(app);

  const server = createServer(app);
  app.server = server;
  app.listen = (port = config.port, host = config.host) => new Promise((resolve) => server.listen(port, host, () => resolve(server.address())));
  app.close = () => new Promise((resolve) => { server.close(() => { try { db.close(); } catch { /* closed */ } resolve(); }); if (server.closeAllConnections) server.closeAllConnections(); });
  return app;
}
function router_health(app) {
  app.router.get('/api/v1/health', () => ({ status: 'ok', time: new Date().toISOString() }));
}
module.exports = { createApp };
