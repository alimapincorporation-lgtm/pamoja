'use strict';
const { now } = require('./database/db');
/* Append an audit event. Never put passwords, tokens or message bodies in `details`. */
function audit(db, ctx, { action, entityType = null, entityId = null, organisationId = null, details = null, actorUserId }) {
  db.run('INSERT INTO audit_logs (at, actor_user_id, actor_ip, action, entity_type, entity_id, organisation_id, details) VALUES (?,?,?,?,?,?,?,?)',
    [now(), actorUserId !== undefined ? actorUserId : (ctx && ctx.user ? ctx.user.id : null), ctx ? ctx.ip : null, action, entityType, entityId, organisationId, details ? JSON.stringify(details) : null]);
}
module.exports = { audit };
