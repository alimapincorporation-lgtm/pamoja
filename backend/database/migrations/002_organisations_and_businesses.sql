-- Organisations (tenants), memberships, business profiles, verification, invitations.
CREATE TABLE organisations (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active','suspended')),
  created_by TEXT REFERENCES users(id),
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
CREATE TABLE memberships (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  organisation_id TEXT NOT NULL REFERENCES organisations(id) ON DELETE CASCADE,
  role_id TEXT NOT NULL REFERENCES roles(id),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active','removed')),
  created_at TEXT NOT NULL,
  UNIQUE (user_id, organisation_id)
);
CREATE INDEX idx_memberships_org ON memberships(organisation_id);

CREATE TABLE business_categories (
  id TEXT PRIMARY KEY,            -- slug, e.g. 'hotel'
  label TEXT NOT NULL,
  active INTEGER NOT NULL DEFAULT 1 CHECK (active IN (0,1))
);

CREATE TABLE business_profiles (
  id TEXT PRIMARY KEY,
  organisation_id TEXT NOT NULL UNIQUE REFERENCES organisations(id) ON DELETE CASCADE,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  category_id TEXT NOT NULL REFERENCES business_categories(id),
  country TEXT NOT NULL CHECK (country IN ('UG','KE','TZ')),
  region TEXT,
  city TEXT NOT NULL,
  address TEXT,
  lat REAL,
  lng REAL,
  maps_query TEXT,
  location_status TEXT NOT NULL DEFAULT 'unverified' CHECK (location_status IN ('unverified','verified')),
  location_verified_at TEXT,
  phone TEXT,
  whatsapp TEXT,
  email TEXT,
  website TEXT,
  hours TEXT,
  summary TEXT,
  description TEXT,
  services TEXT NOT NULL DEFAULT '[]',          -- JSON array of strings
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','published','unpublished','suspended')),
  verification_status TEXT NOT NULL DEFAULT 'pending' CHECK (verification_status IN ('pending','approved','rejected','suspended','expired')),
  created_by TEXT REFERENCES users(id),
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  published_at TEXT
);
CREATE INDEX idx_bp_status ON business_profiles(status);
CREATE INDEX idx_bp_city ON business_profiles(country, city);
CREATE INDEX idx_bp_category ON business_profiles(category_id);

-- History of verification decisions: never edited, a new row records each decision.
CREATE TABLE business_verifications (
  id TEXT PRIMARY KEY,
  business_id TEXT NOT NULL REFERENCES business_profiles(id) ON DELETE CASCADE,
  status TEXT NOT NULL CHECK (status IN ('pending','approved','rejected','suspended','expired')),
  evidence_note TEXT,
  decided_by TEXT REFERENCES users(id),
  expires_at TEXT,
  created_at TEXT NOT NULL
);
CREATE INDEX idx_bv_business ON business_verifications(business_id, created_at);

-- Time-limited, single-use activation invitations. Only a hash of the token is stored.
CREATE TABLE invitations (
  id TEXT PRIMARY KEY,
  organisation_id TEXT NOT NULL REFERENCES organisations(id) ON DELETE CASCADE,
  email TEXT NOT NULL COLLATE NOCASE,
  role_id TEXT NOT NULL REFERENCES roles(id),
  token_hash TEXT NOT NULL UNIQUE,
  expires_at TEXT NOT NULL,
  used_at TEXT,
  revoked_at TEXT,
  created_by TEXT REFERENCES users(id),
  created_at TEXT NOT NULL
);
CREATE INDEX idx_inv_org ON invitations(organisation_id);
