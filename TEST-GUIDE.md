# Test guide

Run: `cd frontend && python3 -m http.server 8080`, then open http://localhost:8080/ . (Opening files directly also works.)
All data is **sample data** from `frontend/js/services/sample-data.js`. Forms store submissions in your browser only (localStorage), never send anything.

## Pages (32)
| Page | URL | Try this |
|---|---|---|
| Home | `index.html` | Header links, theme toggle, mobile menu (narrow window) |
| Explore | `pages/public/explore.html` | Category tiles, search box → search page |
| Hotels | `hotels.html` | Search “kintu”; max price 200000 UGX; Available only; Sort; **Map** toggle; Load more; Clear filters; try “zzzz” for the empty state |
| Hotel details | `hotel-details.html?id=kintu-court` | Request this room (validation, then reference); Send enquiry; Get directions; also `?id=pearl-plaza` (fully booked → alternatives), `?id=lakeside-guest` (stale availability), `?id=nope` (not found) |
| Destinations / details | `destinations.html`, `destination-details.html?id=bwindi` | Related tours and hotels |
| Tours / details | `tours.html`, `tour-details.html?id=murchison-3day` | Itinerary, includes, Request a booking |
| Transport / details | `transport.html`, `transport-details.html?id=swift-transfers` | Request a quote (pickup, destination, date…) |
| Businesses / details | `businesses.html`, `business-details.html?id=pearl-market-crafts` | Call/WhatsApp show a “no published number” notice in sample mode |
| Restaurants | `restaurants.html` | View menu dialog; Request a table |
| Events | `events.html` | Add to calendar (downloads .ics); Free only |
| News | `news.html` | Read (article dialog) |
| Match centre | `football.html` (deep links: `#matches`, `#table`, `#stats`) | Overview, Matches (matchday picker, tap a match for details and calendar), Table, Stats (goals/assists), Follow; arrow keys switch tabs |
| Search | `search.html?q=kampala` | Grouped results with “See all” |
| Stadiums | `stadiums.html` | Map toggle |
| Stadium pages | `stadium-details.html?id=mandela`, `stadium-facilities.html`, `stadium-events.html`, `stadium-travel.html` | Switch stadium; Get directions |
| AI assistant | `ai-assistant.html` | Suggested prompts; “hotels in Nairobi under 5000 KES” shows an honest no-match |
| Sign in / Register / Forgot / Reset / Activate | `login.html`, `register.html`, `forgot-password.html`, `reset-password.html?token=sample`, `activate-account.html?token=sample` | Empty submit shows errors; any valid email + 8-char password signs in (sample session); header then shows “Sign out” |
| About / Contact / Help | `about.html`, `contact.html`, `help.html` | Contact form validation; FAQ search |
| Privacy / Terms | `privacy.html`, `terms.html` | Draft outlines for legal review |

## What to check on every page
Responsive at ~390, 768, 1024, 1280 widths · light and dark theme · keyboard only (Tab, Enter, Esc closes dialogs) · loading, empty and error states · no console errors.

## Live map
On any detail or stadium page: the map should load from Google (needs internet). Try “Show route” with a start point such as “Entebbe airport”, and “Use my location” (the browser asks permission). “Open in Google Maps” opens the same route.

## Testing the backend flows (start with `cd backend && npm run migrate && npm run dev-data && npm start`)
Open http://localhost:3000/ (the site then uses the live backend for businesses, accounts, enquiries, contact and reports).

1. **Public directory** — `pages/public/businesses.html` lists the demo businesses from the database. Open one → "Send an enquiry" → you get a reference.
2. **Admin** — `dev/console.html` → sign in with `admin@pamoja.test` and the one-time password printed by `dev-data`.
3. **Onboard a business** — "Create a business" with an owner email. The response shows the activation link (development only; in production it is emailed). Try **Publish** before verification: it is refused and tells you what is missing. Then **Approve verification**, **Verify location**, **Publish** → it appears on the public Businesses page.
4. **Owner** — open the activation link (the real `activate-account.html` page), set a password, then sign in on `login.html`. The header shows "Sign out".
5. **Business dashboard** — back on `dev/console.html` as the owner: your business only, edit hours/summary, see the enquiry you sent in step 1, mark it read/replied. Invite a staff member; try inviting someone as "Owner" while signed in as a manager (refused).
6. **Safety checks** — try the same admin buttons as an owner (refused); open another business's id in the owner session (404); sign in with a wrong password 5 times (account locks); use `forgot-password.html` (the email text is printed in the server console).
7. **Audit and tickets** — on the console press "Show audit trail" and "Show tickets" (submit the Contact form or a "Report" first).
8. **Bulk import** — paste CSV (`name,category,country,city,phone`) and press **Dry run**, then **Import**.
