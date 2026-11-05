CREATE TABLE enquiries (
  id TEXT PRIMARY KEY,
  reference TEXT NOT NULL UNIQUE,
  business_id TEXT NOT NULL REFERENCES business_profiles(id) ON DELETE CASCADE,
  organisation_id TEXT NOT NULL REFERENCES organisations(id) ON DELETE CASCADE,
  user_id TEXT REFERENCES users(id) ON DELETE SET NULL,
  type TEXT NOT NULL CHECK (type IN ('enquiry','quote','booking_request','table_request')),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  message TEXT,
  details TEXT NOT NULL DEFAULT '{}',   -- JSON: dates, party size, pick-up, etc.
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new','read','replied','closed')),
  internal_note TEXT,
  consent_at TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
CREATE INDEX idx_enq_org ON enquiries(organisation_id, status, created_at);

CREATE TABLE support_tickets (
  id TEXT PRIMARY KEY,
  reference TEXT NOT NULL UNIQUE,
  kind TEXT NOT NULL CHECK (kind IN ('contact','report','location_correction')),
  name TEXT,
  email TEXT,
  topic TEXT,
  message TEXT NOT NULL,
  business_id TEXT REFERENCES business_profiles(id) ON DELETE SET NULL,
  user_id TEXT REFERENCES users(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open','in_progress','resolved')),
  assigned_to TEXT REFERENCES users(id),
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
CREATE INDEX idx_tickets_status ON support_tickets(status, created_at);
