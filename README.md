# AFCON PAMOJA

Independent sports, tourism, travel and event platform by Alimap Incorporation (https://www.alimapincorporation.org). Not affiliated with or endorsed by CAF, AFCON, any organising committee, stadium operator or government body.

## Status
| Part | State |
|---|---|
| Frontend: shared design system, homepage + 32 public pages, match centre, live Google Maps embeds | built (sample data for most listings) |
| Backend foundation: accounts, MFA, roles/permissions, tenant isolation, business onboarding (create → verify → publish → invite → activate), public directory, enquiries, contact/reports, audit trail | built and tested |
| Developer test console (stand-in for the Command Centre / Business CMS) | built |
| Command Centre, Business CMS, customer account, stadium, workforce and AI pages; bookings, payments, hotel/tour/transport inventory | not built yet |

## Quick start (3 commands, Node 22.13+)
```bash
cd backend && npm run migrate && npm run dev-data && npm start
```
Then open **http://localhost:3000/** and **http://localhost:3000/dev/console.html**. Full instructions: `docs/installation-guide.md`. How to test every page and flow: `TEST-GUIDE.md`. Results: `docs/testing-report.md`.

## Folders
`frontend/` website (plain HTML/CSS/JS, see `frontend/README` notes in `docs/`) · `backend/` API · `docs/` architecture, API, database, permissions, install, test report · `.env.example`.

## Honest limitations
- Hotels, tours, transport, restaurants, events, news, fixtures and stadium details are still **sample data**; only the business directory, accounts, enquiries, contact and reports use the backend.
- Email is logged to the console in development; a real mail transport is required before launch.
- SQLite (Node's built-in, flagged experimental) suits development and a pilot; plan PostgreSQL for production scale.
- Official CAF/AFCON branding, data and media are not used. Hero photos' rights are unconfirmed (`frontend/assets/images/CREDITS.md`).
- Privacy and terms pages are drafts for legal review.
