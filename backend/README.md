# AFCON PAMOJA backend

Node.js modular monolith with no third-party dependencies. See `../docs/installation-guide.md` to run it and `../docs/api-documentation.md` for the endpoints.

    npm run migrate && npm run dev-data && npm start     # then open http://localhost:3000/
    npm test                                              # 29 tests

Layout: `src/` (core, modules, integrations), `database/migrations/`, `scripts/` (migrate, create-admin, dev-data), `tests/`.
