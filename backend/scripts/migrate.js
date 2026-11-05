'use strict';
const fs = require('fs');
const path = require('path');
const config = require('../src/config').default;
const { open } = require('../src/core/database/db');
const { migrate } = require('../src/core/database/migrate');
const { seedReferenceData } = require('../src/core/database/reference-data');

if (process.argv.includes('--reset')) {
  if (config.isProd) { console.error('Refusing to reset the database in production.'); process.exit(1); }
  for (const s of ['', '-wal', '-shm']) try { fs.unlinkSync(config.dbPath + s); } catch { /* not present */ }
  console.log('Development database reset.');
}
if (config.dbPath !== ':memory:') fs.mkdirSync(path.dirname(config.dbPath), { recursive: true });
const db = open(config.dbPath);
const n = migrate(db, (m) => console.log(m));
seedReferenceData(db);
console.log(`Migrations applied: ${n}. Reference data (roles, permissions, categories) is up to date. Database: ${config.dbPath}`);
db.close();
