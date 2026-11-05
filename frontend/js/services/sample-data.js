/* SAMPLE DATA for frontend testing only. All businesses, prices, availability, fixtures and articles are fictional unless a real
   place/venue name is used for orientation; real venue details are NOT verified. Replace with the backend via js/core/api-client.js. */
window.PAMOJA = window.PAMOJA || {};
(function (P) {
  var CUR = { UG: "UGX", KE: "KES", TZ: "TZS" };
  var CNAME = { UG: "Uganda", KE: "Kenya", TZ: "Tanzania" };
  function day(n) { var d = new Date(); d.setHours(0, 0, 0, 0); d.setDate(d.getDate() + n); return d.toISOString().slice(0, 10); }
  var phone = "Not published in sample";

  var hotels = [
    { id: "kintu-court", name: "Kintu Court Hotel", country: "UG", city: "Kampala", lat: 0.3136, lng: 32.5811, distanceKm: 2, stadium: "Mandela National Stadium", priceFrom: 150000, stars: 3,
      summary: "Quiet mid-range hotel with airport pick-up and breakfast included, about 2 km from the stadium road.",
      description: "A sample mid-range hotel used to test the hotel pages. Rooms, prices and availability are illustrative and will be replaced by provider-entered data.",
      facilities: ["Wi-Fi", "Breakfast", "Secure parking", "Airport pickup", "Restaurant"], policies: "Free cancellation up to 48 hours before check-in (sample policy).",
      rooms: [ { name: "Standard double", price: 150000, sleeps: 2, availability: "available", updatedDaysAgo: 0 }, { name: "Family room", price: 210000, sleeps: 4, availability: "limited", updatedDaysAgo: 0 } ] },
    { id: "lakeside-guest", name: "Lakeside Guest House", country: "UG", city: "Kampala", lat: 0.2895, lng: 32.6322, distanceKm: 4, stadium: "Mandela National Stadium", priceFrom: 120000, stars: 2,
      summary: "Budget-friendly guest house near the lake, with a shared lounge and simple rooms.",
      description: "A sample budget guest house. Its availability was last updated several days ago, which the platform flags so visitors confirm before booking.",
      facilities: ["Wi-Fi", "Breakfast", "Shared lounge"], policies: "Cancellation terms to be confirmed with the guest house (sample).",
      rooms: [ { name: "Single room", price: 120000, sleeps: 1, availability: "available", updatedDaysAgo: 3 }, { name: "Double room", price: 150000, sleeps: 2, availability: "unknown", updatedDaysAgo: 10 } ] },
    { id: "pearl-plaza", name: "Pearl Plaza Suites", country: "UG", city: "Kampala", lat: 0.3163, lng: 32.5822, distanceKm: 1, stadium: "Mandela National Stadium", priceFrom: 280000, stars: 5,
      summary: "Upmarket suites with a pool and conference space, closest of the sample hotels to the stadium.",
      description: "A sample upscale hotel. All of its rooms are shown as fully booked so you can test the “alternatives” experience.",
      facilities: ["Wi-Fi", "Pool", "Gym", "Restaurant", "Accessible rooms", "Secure parking"], policies: "Non-refundable rates available at a discount (sample policy).",
      rooms: [ { name: "Executive suite", price: 320000, sleeps: 2, availability: "full", updatedDaysAgo: 0 }, { name: "Deluxe room", price: 280000, sleeps: 2, availability: "full", updatedDaysAgo: 0 } ] },
    { id: "nairobi-garden", name: "Nairobi Garden Lodge", country: "KE", city: "Nairobi", lat: -1.2921, lng: 36.8219, distanceKm: 6, stadium: "Kasarani Stadium", priceFrom: 9500, stars: 3,
      summary: "Garden lodge with quiet rooms and a shuttle on match days.",
      description: "A sample lodge in Nairobi for testing multi-country listings and Kenyan shilling pricing.",
      facilities: ["Wi-Fi", "Breakfast", "Garden", "Shuttle service"], policies: "Free cancellation up to 72 hours before arrival (sample policy).",
      rooms: [ { name: "Garden room", price: 9500, sleeps: 2, availability: "available", updatedDaysAgo: 1 }, { name: "Twin room", price: 11000, sleeps: 2, availability: "available", updatedDaysAgo: 1 } ] },
    { id: "westlands-business", name: "Westlands Business Hotel", country: "KE", city: "Nairobi", lat: -1.2676, lng: 36.8108, distanceKm: 9, stadium: "Kasarani Stadium", priceFrom: 14500, stars: 4,
      summary: "City hotel aimed at business travellers, with meeting rooms and a rooftop restaurant.",
      description: "A sample business hotel. Booking is by request so the hotel can confirm.",
      facilities: ["Wi-Fi", "Meeting rooms", "Restaurant", "Gym", "Accessible rooms"], policies: "Cancellation terms shown before you confirm (sample).",
      rooms: [ { name: "Superior room", price: 14500, sleeps: 2, availability: "limited", updatedDaysAgo: 0 }, { name: "Business suite", price: 21000, sleeps: 3, availability: "full", updatedDaysAgo: 0 } ] },
    { id: "indian-ocean-rest", name: "Indian Ocean Rest", country: "TZ", city: "Dar es Salaam", lat: -6.7924, lng: 39.2083, distanceKm: 5, stadium: "Benjamin Mkapa Stadium", priceFrom: 140000, stars: 3,
      summary: "Relaxed hotel close to the waterfront with a small pool and sea-view terrace.",
      description: "A sample hotel in Dar es Salaam for testing Tanzanian shilling pricing.",
      facilities: ["Wi-Fi", "Pool", "Breakfast", "Airport pickup"], policies: "Free cancellation up to 48 hours before check-in (sample policy).",
      rooms: [ { name: "Sea-view double", price: 165000, sleeps: 2, availability: "available", updatedDaysAgo: 2 }, { name: "Standard room", price: 140000, sleeps: 2, availability: "available", updatedDaysAgo: 2 } ] },
    { id: "msasani-bay", name: "Msasani Bay Apartments", country: "TZ", city: "Dar es Salaam", lat: -6.7476, lng: 39.2745, distanceKm: 12, stadium: "Benjamin Mkapa Stadium", priceFrom: 185000, stars: 4,
      summary: "Self-catering apartments for groups and longer stays, with a kitchen and balcony.",
      description: "Sample serviced apartments. Availability has not been updated recently, so visitors are asked to confirm.",
      facilities: ["Kitchen", "Wi-Fi", "Washing machine", "Secure parking"], policies: "Minimum two-night stay (sample policy).",
      rooms: [ { name: "Two-bedroom apartment", price: 185000, sleeps: 4, availability: "unknown", updatedDaysAgo: 8 } ] },
    { id: "stone-town-courtyard", name: "Stone Town Courtyard", country: "TZ", city: "Zanzibar", lat: -6.1659, lng: 39.1925, distanceKm: 0, stadium: "", priceFrom: 160000, stars: 3,
      summary: "Small courtyard hotel in the old town, within walking distance of the waterfront.",
      description: "A sample boutique hotel for testing destination-linked stays outside the match cities.",
      facilities: ["Wi-Fi", "Breakfast", "Courtyard", "Air conditioning"], policies: "Free cancellation up to 7 days before arrival (sample policy).",
      rooms: [ { name: "Courtyard room", price: 160000, sleeps: 2, availability: "available", updatedDaysAgo: 1 }, { name: "Terrace suite", price: 230000, sleeps: 3, availability: "limited", updatedDaysAgo: 1 } ] }
  ];

  var destinations = [
    { id: "bwindi", name: "Bwindi Impenetrable Forest", country: "UG", city: "Kanungu", category: "wildlife", lat: -1.0446, lng: 29.7000, summary: "Ancient rainforest in south-western Uganda, known for mountain gorilla trekking.",
      description: "Bwindi is a dense highland forest and a famous gorilla-trekking destination. Treks are permit-based and need advance planning; permit rules, prices and seasons must be confirmed with the park authority or a licensed operator.",
      bestFor: ["Wildlife", "Hiking", "Nature photography"], tips: ["Book permits well ahead.", "Pack waterproofs and sturdy boots.", "Confirm access roads with your operator."], tours: ["murchison-3day"] },
    { id: "murchison", name: "Murchison Falls National Park", country: "UG", city: "Masindi", category: "wildlife", lat: 2.2800, lng: 31.6900, summary: "Uganda's largest national park, where the Nile squeezes through a narrow gorge before dropping over the falls.",
      description: "A classic safari destination with game drives, boat trips on the Nile and views of the falls. Check current entry fees and road conditions with a provider.",
      bestFor: ["Safari", "Boat trips", "Birdwatching"], tips: ["Ask whether game drives or boat trips are included.", "Carry water and sun protection."], tours: ["murchison-3day"] },
    { id: "jinja", name: "Jinja and the Source of the Nile", country: "UG", city: "Jinja", category: "nature", lat: 0.4244, lng: 33.2042, summary: "Adventure town on Lake Victoria with rafting, boat trips and riverside cafés.",
      description: "Jinja is a popular day trip or weekend stop from Kampala, known for activities on and around the Nile. Operators set their own safety briefings and age limits.",
      bestFor: ["Adventure", "Relaxing", "Food"], tips: ["Check operator safety briefings.", "Allow extra time for traffic out of Kampala."], tours: ["jinja-adventure"] },
    { id: "nairobi-park", name: "Nairobi National Park", country: "KE", city: "Nairobi", category: "wildlife", lat: -1.3733, lng: 36.8581, summary: "A wildlife park on the edge of Nairobi, with the city skyline in the background.",
      description: "Easy to combine with a city stay. Check opening hours, fees and any seasonal closures with the park or your operator.",
      bestFor: ["Short trips", "Families", "Wildlife"], tips: ["Go early for the best chance of seeing animals.", "Confirm transport before you go."], tours: ["nairobi-day"] },
    { id: "maasai-mara", name: "Maasai Mara National Reserve", country: "KE", city: "Narok", category: "wildlife", lat: -1.4061, lng: 35.1018, summary: "Famous savannah reserve known for big cats and the seasonal wildebeest migration.",
      description: "A multi-day safari destination. Migration timing varies year to year, so confirm expectations with your operator rather than relying on fixed dates.",
      bestFor: ["Safari", "Photography", "Cultural visits"], tips: ["Plan at least two to three nights.", "Ask about conservancy fees."], tours: ["mara-3day"] },
    { id: "stone-town", name: "Stone Town, Zanzibar", country: "TZ", city: "Zanzibar", category: "culture", lat: -6.1630, lng: 39.1900, summary: "Historic old town of narrow lanes, markets and waterfront on Zanzibar island.",
      description: "A walkable heritage district with markets, old houses and seafront dining. Dress modestly and check ferry or flight timings in advance.",
      bestFor: ["History", "Food", "Beaches nearby"], tips: ["Carry small notes for markets.", "Book ferries early in busy periods."], tours: ["stone-town-walk"] },
    { id: "serengeti", name: "Serengeti National Park", country: "TZ", city: "Mara Region", category: "wildlife", lat: -2.3333, lng: 34.8333, summary: "Vast plains in northern Tanzania, famous for large herds and predators.",
      description: "A bucket-list safari destination best planned with a licensed operator. Distances are large and itineraries are usually several days.",
      bestFor: ["Safari", "Photography"], tips: ["Plan several days.", "Ask about seasonal road conditions."], tours: [] }
  ];

  var tours = [
    { id: "kampala-city", name: "Kampala city and culture day", provider: "Pearl Trails", country: "UG", city: "Kampala", category: "city", days: 1, priceFrom: 180000, lat: 0.3476, lng: 32.5825,
      summary: "A guided day through Kampala's markets, museums and viewpoints, with lunch and transport.",
      itinerary: [ { day: "Morning", title: "Old town and markets", text: "Guided walk with time for local snacks." }, { day: "Midday", title: "Lunch stop", text: "Local lunch at a partner restaurant." }, { day: "Afternoon", title: "Museum and viewpoint", text: "Visit a cultural site and city viewpoint, then return to your hotel." } ],
      includes: ["Guide", "Transport", "Lunch"], excludes: ["Personal expenses", "Tips"], dates: [day(6), day(8), day(13)], capacity: 12 },
    { id: "murchison-3day", name: "Murchison Falls 3-day safari", provider: "Pearl Trails", country: "UG", city: "Masindi", category: "wildlife", days: 3, priceFrom: 1450000, lat: 2.2800, lng: 31.6900,
      summary: "Game drives, a Nile boat trip and a visit to the top of the falls, with lodge accommodation.",
      itinerary: [ { day: "Day 1", title: "Kampala to the park", text: "Road transfer with a stop for lunch." }, { day: "Day 2", title: "Game drive and boat trip", text: "Morning game drive and afternoon boat trip on the Nile." }, { day: "Day 3", title: "Falls and return", text: "Visit the falls, then return to Kampala." } ],
      includes: ["Lodge accommodation", "Park transfers", "Guide", "Meals as listed by the operator"], excludes: ["Park fees unless listed", "Drinks", "Tips"], dates: [day(10), day(17), day(24)], capacity: 8 },
    { id: "jinja-adventure", name: "Jinja Nile adventure day", provider: "Nile Active Tours", country: "UG", city: "Jinja", category: "adventure", days: 1, priceFrom: 260000, lat: 0.4244, lng: 33.2042,
      summary: "A day of activities near the Source of the Nile, with safety briefing and lunch.",
      itinerary: [ { day: "Morning", title: "Transfer and briefing", text: "Travel from Kampala and receive a safety briefing." }, { day: "Midday", title: "Activity", text: "Choose from the activities offered by the operator." }, { day: "Afternoon", title: "Lunch and return", text: "Lunch by the river, then return transfer." } ],
      includes: ["Transfers", "Briefing and equipment", "Lunch"], excludes: ["Photos", "Tips"], dates: [day(5), day(9), day(12)], capacity: 10 },
    { id: "nairobi-day", name: "Nairobi city and park day", provider: "Savannah Link Tours", country: "KE", city: "Nairobi", category: "wildlife", days: 1, priceFrom: 12500, lat: -1.3733, lng: 36.8581,
      summary: "Morning game drive in Nairobi National Park and an afternoon city highlights tour.",
      itinerary: [ { day: "Morning", title: "Park game drive", text: "Early drive in the national park." }, { day: "Afternoon", title: "City highlights", text: "Guided stops at central sights and a market." } ],
      includes: ["Guide", "Vehicle"], excludes: ["Park fees", "Lunch"], dates: [day(4), day(7), day(11)], capacity: 7 },
    { id: "mara-3day", name: "Maasai Mara 3-day safari", provider: "Savannah Link Tours", country: "KE", city: "Narok", category: "wildlife", days: 3, priceFrom: 58000, lat: -1.4061, lng: 35.1018,
      summary: "Three days of game drives in the Mara with camp accommodation.",
      itinerary: [ { day: "Day 1", title: "Nairobi to the Mara", text: "Road transfer to camp." }, { day: "Day 2", title: "Full-day game drives", text: "Morning and afternoon drives." }, { day: "Day 3", title: "Return to Nairobi", text: "Morning drive and transfer back." } ],
      includes: ["Camp accommodation", "Game drives", "Guide"], excludes: ["Conservancy fees unless listed", "Drinks"], dates: [day(14), day(21)], capacity: 6 },
    { id: "stone-town-walk", name: "Stone Town walking tour", provider: "Spice Lane Guides", country: "TZ", city: "Zanzibar", category: "culture", days: 1, priceFrom: 45000, lat: -6.1630, lng: 39.1900,
      summary: "A half-day guided walk through the lanes, markets and waterfront of Stone Town.",
      itinerary: [ { day: "Morning", title: "Lanes and markets", text: "Guided walk with stops for local snacks." }, { day: "Late morning", title: "Waterfront", text: "Finish at the seafront with free time." } ],
      includes: ["Guide"], excludes: ["Entry fees", "Food and drink"], dates: [day(3), day(5), day(6), day(10)], capacity: 14 }
  ];

  var transport = [
    { id: "swift-transfers", name: "Swift Transfers Uganda", type: "Airport transfer", country: "UG", city: "Entebbe", lat: 0.0510, lng: 32.4637, areas: ["Entebbe airport", "Kampala", "Mandela National Stadium area"],
      vehicles: [ { type: "Saloon car", seats: 3, luggage: 2 }, { type: "Minivan", seats: 8, luggage: 6 } ], hours: "24 hours (sample)", priceNote: "Indicative from UGX 80,000 per trip", summary: "Airport pick-ups and drop-offs between Entebbe and Kampala, with flight monitoring.", features: ["Meet and greet", "Child seats on request"] },
    { id: "pearl-shuttle", name: "Pearl Match-Day Shuttle", type: "Shuttle service", country: "UG", city: "Kampala", lat: 0.3136, lng: 32.5811, areas: ["Central Kampala hotels", "Mandela National Stadium"],
      vehicles: [ { type: "Coach", seats: 30, luggage: 10 } ], hours: "Match days only (sample)", priceNote: "Indicative from UGX 15,000 per seat", summary: "Group shuttles between central hotels and the stadium on match days.", features: ["Fixed pick-up points", "Return trip after the match"] },
    { id: "kampala-private-hire", name: "Kampala Private Hire", type: "Private hire", country: "UG", city: "Kampala", lat: 0.3476, lng: 32.5825, areas: ["Kampala", "Jinja", "Entebbe"],
      vehicles: [ { type: "SUV", seats: 4, luggage: 3 }, { type: "Minivan", seats: 8, luggage: 6 } ], hours: "06:00 – 22:00 (sample)", priceNote: "Quote on request", summary: "Cars with drivers for city trips, day tours and longer journeys.", features: ["Driver speaks English", "Wheelchair-accessible vehicle on request"] },
    { id: "nairobi-airport-cabs", name: "Nairobi Airport Cabs", type: "Airport transfer", country: "KE", city: "Nairobi", lat: -1.3192, lng: 36.9278, areas: ["Jomo Kenyatta airport", "Nairobi city", "Kasarani area"],
      vehicles: [ { type: "Saloon car", seats: 3, luggage: 2 }, { type: "Minivan", seats: 7, luggage: 5 } ], hours: "24 hours (sample)", priceNote: "Indicative from KES 3,000 per trip", summary: "Fixed-price airport transfers to hotels across Nairobi.", features: ["Flight tracking", "Card or mobile payment (to be confirmed)"] },
    { id: "dar-car-hire", name: "Dar Car Hire", type: "Car hire", country: "TZ", city: "Dar es Salaam", lat: -6.8160, lng: 39.2803, areas: ["Dar es Salaam", "Airport", "Bagamoyo road"],
      vehicles: [ { type: "Compact car", seats: 4, luggage: 2 }, { type: "4x4", seats: 5, luggage: 4 } ], hours: "07:00 – 19:00 (sample)", priceNote: "Quote on request", summary: "Self-drive and chauffeur options for city and regional trips.", features: ["Driver available", "Insurance details to be confirmed"] }
  ];

  var businesses = [
    { id: "kampala-central-pharmacy", name: "Central Care Pharmacy", category: "Medical", country: "UG", city: "Kampala", lat: 0.3160, lng: 32.5822, hours: "Mon–Sat 08:00–20:00 (sample)", summary: "Neighbourhood pharmacy with over-the-counter medicines and first-aid supplies.", services: ["Over-the-counter medicines", "First-aid supplies", "Travel health items"] },
    { id: "pearl-market-crafts", name: "Pearl Market Crafts", category: "Retail", country: "UG", city: "Kampala", lat: 0.3138, lng: 32.5780, hours: "Daily 09:00–19:00 (sample)", summary: "Handmade crafts, fabrics and gifts from local makers.", services: ["Crafts", "Gifts", "Custom orders"] },
    { id: "kasarani-sports-shop", name: "Kasarani Sports Corner", category: "Retail", country: "KE", city: "Nairobi", lat: -1.2200, lng: 36.8900, hours: "Daily 09:00–18:00 (sample)", summary: "Football boots, scarves and fan accessories close to the stadium road.", services: ["Fan accessories", "Football equipment"] },
    { id: "westlands-money-desk", name: "Westlands Money & SIM Desk", category: "Services", country: "KE", city: "Nairobi", lat: -1.2676, lng: 36.8108, hours: "Mon–Sat 08:30–18:00 (sample)", summary: "Currency exchange and SIM cards for visitors. Rates are set at the desk.", services: ["SIM cards", "Currency exchange"] },
    { id: "msasani-clinic", name: "Msasani Family Clinic", category: "Medical", country: "TZ", city: "Dar es Salaam", lat: -6.7476, lng: 39.2745, hours: "Mon–Sat 08:00–17:00 (sample)", summary: "General outpatient clinic. Not an emergency service; call local emergency numbers in an emergency.", services: ["General consultations", "Vaccinations (to be confirmed)"] },
    { id: "zanzibar-dhow-cruises", name: "Zanzibar Sunset Dhow Cruises", category: "Entertainment", country: "TZ", city: "Zanzibar", lat: -6.1659, lng: 39.1925, hours: "Daily from 16:00 (sample)", summary: "Evening dhow trips along the Stone Town coast.", services: ["Sunset cruise", "Private charter"] },
    { id: "kampala-fun-bowl", name: "Fun Bowl Kampala", category: "Entertainment", country: "UG", city: "Kampala", lat: 0.3330, lng: 32.6000, hours: "Daily 12:00–23:00 (sample)", summary: "Bowling, arcade and a family-friendly café.", services: ["Bowling", "Arcade", "Café"] },
    { id: "nairobi-laundry", name: "Fresh Press Laundry", category: "Services", country: "KE", city: "Nairobi", lat: -1.2950, lng: 36.8200, hours: "Mon–Sat 07:30–18:30 (sample)", summary: "Same-day laundry and ironing for travellers.", services: ["Same-day laundry", "Ironing"] }
  ];

  var restaurants = [
    { id: "pearl-grill", name: "Pearl Grill & Kitchen", cuisine: "East African grill", price: "$$", country: "UG", city: "Kampala", lat: 0.3150, lng: 32.5790, hours: "Daily 11:00–23:00 (sample)", reservations: true, summary: "Grilled meats, matooke and fresh juices close to central hotels.", menu: [ { item: "Grilled tilapia", price: "UGX 32,000" }, { item: "Beef stew with matooke", price: "UGX 24,000" }, { item: "Rolex (egg wrap)", price: "UGX 6,000" } ] },
    { id: "lakeview-cafe", name: "Lakeview Café", cuisine: "Café and brunch", price: "$$", country: "UG", city: "Kampala", lat: 0.2900, lng: 32.6300, hours: "Daily 07:00–18:00 (sample)", reservations: false, summary: "Breakfast, coffee and light lunches with a lake view.", menu: [ { item: "Full breakfast", price: "UGX 22,000" }, { item: "Ugandan coffee", price: "UGX 7,000" } ] },
    { id: "karibu-nyama", name: "Karibu Nyama Choma", cuisine: "Kenyan nyama choma", price: "$$", country: "KE", city: "Nairobi", lat: -1.2300, lng: 36.8800, hours: "Daily 11:00–23:30 (sample)", reservations: true, summary: "Roast meat, ugali and kachumbari, popular on match days.", menu: [ { item: "Nyama choma (half kg)", price: "KES 1,400" }, { item: "Ugali and sukuma", price: "KES 350" } ] },
    { id: "westlands-bistro", name: "Westlands Bistro", cuisine: "International", price: "$$$", country: "KE", city: "Nairobi", lat: -1.2680, lng: 36.8120, hours: "Daily 12:00–23:00 (sample)", reservations: true, summary: "Pasta, grills and vegetarian dishes in a city-centre setting.", menu: [ { item: "Pasta of the day", price: "KES 1,800" }, { item: "Vegetable curry", price: "KES 1,500" } ] },
    { id: "msasani-seafood", name: "Msasani Seafood House", cuisine: "Swahili seafood", price: "$$", country: "TZ", city: "Dar es Salaam", lat: -6.7480, lng: 39.2750, hours: "Daily 12:00–22:30 (sample)", reservations: true, summary: "Coconut curries, grilled fish and fresh juices by the bay.", menu: [ { item: "Grilled kingfish", price: "TZS 28,000" }, { item: "Coconut fish curry", price: "TZS 24,000" } ] },
    { id: "forodhani-bites", name: "Forodhani Bites", cuisine: "Street food", price: "$", country: "TZ", city: "Zanzibar", lat: -6.1650, lng: 39.1930, hours: "Evenings (sample)", reservations: false, summary: "Evening seafront stalls with grilled skewers, Zanzibar pizza and sugarcane juice.", menu: [ { item: "Zanzibar pizza", price: "TZS 8,000" }, { item: "Seafood skewers", price: "TZS 10,000" } ] }
  ];

  var events = [
    { id: "fan-meetup", title: "Fan meet-up and watch party", type: "Fan event", country: "UG", city: "Kampala", venue: "Sample riverside park", dayOffset: 7, time: "17:00", free: true, lat: 0.3200, lng: 32.5800, summary: "Community watch party with food stalls. Sample event for testing." },
    { id: "heritage-night", title: "Heritage and music night", type: "Culture", country: "UG", city: "Kampala", venue: "Sample cultural centre", dayOffset: 9, time: "19:00", free: false, lat: 0.3150, lng: 32.5830, summary: "Live traditional and contemporary music. Sample event for testing." },
    { id: "street-football", title: "Street football festival", type: "Sport", country: "KE", city: "Nairobi", venue: "Sample community ground", dayOffset: 12, time: "10:00", free: true, lat: -1.2700, lng: 36.8200, summary: "Five-a-side tournament for local teams. Sample event for testing." },
    { id: "food-market", title: "Match-week food market", type: "Food", country: "KE", city: "Nairobi", venue: "Sample market square", dayOffset: 13, time: "11:00", free: true, lat: -1.2300, lng: 36.8850, summary: "Street food and local producers. Sample event for testing." },
    { id: "coast-festival", title: "Coastal sounds evening", type: "Music", country: "TZ", city: "Dar es Salaam", venue: "Sample beach venue", dayOffset: 15, time: "18:30", free: false, lat: -6.7500, lng: 39.2700, summary: "Live Swahili music by the sea. Sample event for testing." },
    { id: "spice-tour-fair", title: "Spice and craft fair", type: "Market", country: "TZ", city: "Zanzibar", venue: "Sample old-town courtyard", dayOffset: 18, time: "10:00", free: true, lat: -6.1650, lng: 39.1910, summary: "Local spices, crafts and demonstrations. Sample event for testing." }
  ];

  var news = [
    { id: "n1", title: "How to plan a match-week visit to Kampala", tag: "Travel guide", author: "Sample editorial desk", dayOffset: -2, summary: "A sample guide to getting around, where to stay and what to book early.",
      body: ["This is sample article text used to test the news page and reader. It is not real reporting.", "A real article would carry the author, publication date, sources, and any corrections. Photos and quotes would only appear with the right permissions."] },
    { id: "n2", title: "Sample match preview: Kampala Lions v Nairobi Falcons", tag: "Match preview", author: "Sample editorial desk", dayOffset: -1, summary: "A sample preview of a fictional fixture between two fictional clubs.",
      body: ["Both clubs and the competition in this preview are fictional and exist only to test the layout.", "Official fixtures and results will appear once an authorised data source is connected."] },
    { id: "n3", title: "Eating well on match days: a sample food guide", tag: "Food", author: "Sample editorial desk", dayOffset: -4, summary: "Sample tips for finding quick, local food near venues.",
      body: ["This is sample copy. A published version would list venues that have been verified by Alimap."] },
    { id: "n4", title: "Getting to the stadium: sample transport tips", tag: "Transport", author: "Sample editorial desk", dayOffset: -5, summary: "Sample advice on shuttles, pick-up points and travelling in groups.",
      body: ["Transport options, timings and costs in a real version would come from participating providers and be dated."] },
    { id: "n5", title: "Beyond the match: a sample weekend itinerary", tag: "Itinerary", author: "Sample editorial desk", dayOffset: -7, summary: "A sample two-day plan combining a match with a nearby attraction.",
      body: ["Itineraries in the live platform will link to real tours, hotels and directions, each with its own last-updated date."] }
  ];

  /* Sample competition: six fictional clubs, double round-robin. Matchdays 1-5 are played, 6-10 are upcoming. */
  var CLUBS = [
    { id: "kampala-lions", name: "Kampala Lions", short: "KAM", color: "#C98A00", venue: "mandela" },
    { id: "entebbe-eagles", name: "Entebbe Eagles", short: "ENT", color: "#1F4E9E", venue: "mandela" },
    { id: "nairobi-falcons", name: "Nairobi Falcons", short: "NAI", color: "#B42318", venue: "kasarani" },
    { id: "mombasa-mariners", name: "Mombasa Mariners", short: "MOM", color: "#0E7C86", venue: "kasarani" },
    { id: "dar-sharks", name: "Dar Sharks", short: "DAR", color: "#374151", venue: "benjamin-mkapa" },
    { id: "zanzibar-waves", name: "Zanzibar Waves", short: "ZAN", color: "#6D28D9", venue: "benjamin-mkapa" }
  ];
  var PLAYERS = {
    "kampala-lions": ["D. Okello", "M. Ssebunya"], "entebbe-eagles": ["R. Kato", "A. Namuli"], "nairobi-falcons": ["B. Otieno", "J. Wanjiru"],
    "mombasa-mariners": ["S. Mwangi", "K. Achieng"], "dar-sharks": ["H. Mushi", "T. Kileo"], "zanzibar-waves": ["I. Haji", "Z. Suleiman"]
  };
  var matches = (function () {
    var out = [], arr = [0, 1, 2, 3, 4, 5], seed = 7, n = 0;
    function rnd() { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; }
    var rounds = [];
    for (var r = 0; r < 5; r++) {
      var pairs = [];
      for (var i = 0; i < 3; i++) { var h = arr[i], a = arr[5 - i]; if ((r + i) % 2 === 1) { var t = h; h = a; a = t; } pairs.push([h, a]); }
      rounds.push(pairs); arr = [arr[0], arr[5], arr[1], arr[2], arr[3], arr[4]];
    }
    for (var md = 1; md <= 10; md++) {
      var base = md <= 5 ? rounds[md - 1] : rounds[md - 6].map(function (p) { return [p[1], p[0]]; });
      base.forEach(function (p, idx) {
        n++; var H = CLUBS[p[0]], A = CLUBS[p[1]], done = md <= 5;
        var m = { id: "m" + n, competition: "Sample Cup", matchday: md, stage: "Matchday " + md, home: H.name, away: A.name, homeId: H.id, awayId: A.id, dayOffset: (md - 5) * 7 - 2 + (idx % 2), time: idx === 0 ? "16:00" : idx === 1 ? "19:00" : "13:00", stadium: H.venue, status: done ? "finished" : "upcoming" };
        if (done) { var hs = Math.floor(rnd() * 4), as = Math.floor(rnd() * 3); m.hs = hs; m.as = as; m.score = hs + " – " + as; }
        out.push(m);
      });
    }
    return out;
  })();
  function clubById(id) { return CLUBS.filter(function (c) { return c.id === id; })[0]; }
  function standings() {
    var t = {}; CLUBS.forEach(function (c) { t[c.id] = { club: c, mp: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: 0, pts: 0, form: [] }; });
    matches.filter(function (m) { return m.status === "finished"; }).sort(function (a, b) { return a.matchday - b.matchday; }).forEach(function (m) {
      var H = t[m.homeId], A = t[m.awayId]; H.mp++; A.mp++; H.gf += m.hs; H.ga += m.as; A.gf += m.as; A.ga += m.hs;
      if (m.hs > m.as) { H.w++; A.l++; H.pts += 3; H.form.push("W"); A.form.push("L"); } else if (m.hs < m.as) { A.w++; H.l++; A.pts += 3; A.form.push("W"); H.form.push("L"); } else { H.d++; A.d++; H.pts++; A.pts++; H.form.push("D"); A.form.push("D"); }
    });
    var rows = Object.keys(t).map(function (k) { var r = t[k]; r.gd = r.gf - r.ga; r.form = r.form.slice(-5); return r; });
    rows.sort(function (a, b) { return b.pts - a.pts || b.gd - a.gd || b.gf - a.gf || a.club.name.localeCompare(b.club.name); });
    rows.forEach(function (r, i) { r.rank = i + 1; }); return rows;
  }
  function playerStats(stat) {
    var rows = []; standings().forEach(function (r) {
      var names = PLAYERS[r.club.id], share = stat === "goals" ? [0.4, 0.25] : [0.3, 0.2];
      names.forEach(function (nm, i) { rows.push({ name: nm, club: r.club, value: Math.round(r.gf * share[i]) }); });
    });
    rows.sort(function (a, b) { return b.value - a.value || a.name.localeCompare(b.name); });
    var rank = 0, prev = null; rows.forEach(function (r, i) { if (r.value !== prev) { rank = i + 1; prev = r.value; } r.rank = rank; });
    return rows.filter(function (r) { return r.value > 0; }).slice(0, 10);
  }

  var TBC = "To be confirmed by the venue operator";
  var stadiums = [
    { id: "mandela", name: "Mandela National Stadium", alias: "Namboole", country: "UG", city: "Kampala", lat: 0.3640, lng: 32.6570, mapsQuery: "Mandela National Stadium, Kampala, Uganda",
      summary: "Large multi-purpose stadium on the eastern edge of Kampala. Details below are placeholders until the venue operator confirms them.",
      capacity: TBC,
      facilities: [ { name: "Toilets", detail: TBC }, { name: "First aid point", detail: TBC }, { name: "Food and drink", detail: TBC }, { name: "Cash machines", detail: TBC } ],
      accessibility: [ { name: "Step-free entrance", detail: TBC }, { name: "Accessible seating", detail: TBC }, { name: "Accessible toilets", detail: TBC } ],
      entrances: [ { name: "Main entrance", note: "Approved entrance details will be published by the venue operator." } ],
      parking: [ { name: "Visitor parking", note: "Approved parking areas will be published by the venue operator." } ],
      travel: [ { mode: "By car", note: "Use the Get directions link; allow extra time on match days." }, { mode: "By shuttle", note: "Participating shuttle providers are listed on the Transport page." } ] },
    { id: "kasarani", name: "Kasarani Stadium", alias: "Moi International Sports Centre", country: "KE", city: "Nairobi", lat: -1.2186, lng: 36.8903, mapsQuery: "Kasarani Stadium, Nairobi, Kenya",
      summary: "Major sports complex on the north-east side of Nairobi. Details below are placeholders until the venue operator confirms them.",
      capacity: TBC,
      facilities: [ { name: "Toilets", detail: TBC }, { name: "First aid point", detail: TBC }, { name: "Food and drink", detail: TBC } ],
      accessibility: [ { name: "Step-free entrance", detail: TBC }, { name: "Accessible seating", detail: TBC } ],
      entrances: [ { name: "Main entrance", note: "Approved entrance details will be published by the venue operator." } ],
      parking: [ { name: "Visitor parking", note: "Approved parking areas will be published by the venue operator." } ],
      travel: [ { mode: "By car", note: "Use the Get directions link; expect traffic on match days." }, { mode: "By shuttle", note: "Participating shuttle providers are listed on the Transport page." } ] },
    { id: "benjamin-mkapa", name: "Benjamin Mkapa Stadium", alias: "", country: "TZ", city: "Dar es Salaam", lat: -6.8506, lng: 39.2548, mapsQuery: "Benjamin Mkapa Stadium, Dar es Salaam, Tanzania",
      summary: "National stadium in Dar es Salaam. Details below are placeholders until the venue operator confirms them.",
      capacity: TBC,
      facilities: [ { name: "Toilets", detail: TBC }, { name: "First aid point", detail: TBC }, { name: "Food and drink", detail: TBC } ],
      accessibility: [ { name: "Step-free entrance", detail: TBC }, { name: "Accessible seating", detail: TBC } ],
      entrances: [ { name: "Main entrance", note: "Approved entrance details will be published by the venue operator." } ],
      parking: [ { name: "Visitor parking", note: "Approved parking areas will be published by the venue operator." } ],
      travel: [ { mode: "By car", note: "Use the Get directions link; allow extra time on match days." }, { mode: "By taxi or shuttle", note: "Participating transport providers are listed on the Transport page." } ] }
  ];

  var data = { hotels: hotels, destinations: destinations, tours: tours, transport: transport, businesses: businesses, restaurants: restaurants, events: events, news: news, matches: matches, stadiums: stadiums };

  // Per-resource search/price configuration
  var cfg = {
    hotels:       { text: ["name", "city", "summary", "facilities"], price: "priceFrom" },
    destinations: { text: ["name", "city", "summary", "category"] },
    tours:        { text: ["name", "city", "summary", "provider", "category"], price: "priceFrom" },
    transport:    { text: ["name", "city", "summary", "type", "areas"] },
    businesses:   { text: ["name", "city", "summary", "category", "services"] },
    restaurants:  { text: ["name", "city", "summary", "cuisine"] },
    events:       { text: ["title", "city", "summary", "type", "venue"] },
    news:         { text: ["title", "summary", "tag"] },
    matches:      { text: ["home", "away", "stage", "competition"] },
    stadiums:     { text: ["name", "alias", "city", "summary"] }
  };

  function decorate(resource, it) {
    var o = Object.assign({}, it);
    o.currency = CUR[o.country] || "";
    o.countryName = CNAME[o.country] || "";
    if (resource === "events" || resource === "news" || resource === "matches") o.date = day(o.dayOffset);
    if (resource === "matches") { var s = stadiums.filter(function (x) { return x.id === o.stadium; })[0]; o.stadiumName = s ? s.name : ""; o.city = s ? s.city : ""; o.country = s ? s.country : ""; o.homeClub = clubById(o.homeId); o.awayClub = clubById(o.awayId); }
    if (resource === "hotels") o.rooms = o.rooms.map(function (r) { return Object.assign({}, r, { currency: o.currency }); });
    return o;
  }
  function hay(it, fields) { return fields.map(function (f) { var v = it[f]; return Array.isArray(v) ? v.join(" ") : (v || ""); }).join(" ").toLowerCase(); }

  function query(resource, p) {
    p = p || {};
    if (resource === "standings") { var st = standings(); return { items: st, total: st.length, page: 1, pageSize: st.length }; }
    if (resource === "playerstats") { var ps = playerStats(p.stat === "assists" ? "assists" : "goals"); return { items: ps, total: ps.length, page: 1, pageSize: ps.length }; }
    var c = cfg[resource], list = (data[resource] || []).map(function (i) { return decorate(resource, i); });
    if (!c) return { items: [], total: 0, page: 1, pageSize: 12 };
    if (p.q) { var terms = String(p.q).toLowerCase().split(/\s+/).filter(Boolean); list = list.filter(function (i) { var h = hay(i, c.text); return terms.every(function (t) { return h.indexOf(t) > -1; }); }); }
    ["country", "city", "category", "type", "tag", "cuisine", "status", "stage"].forEach(function (k) { if (p[k]) list = list.filter(function (i) { return String(i[k] || "").toLowerCase() === String(p[k]).toLowerCase(); }); });
    if (p.stadium) list = list.filter(function (i) { return i.stadium === p.stadium; });
    if (p.maxPrice && c.price) { var max = Number(p.maxPrice), cur = p.currency; list = list.filter(function (i) { return (!cur || i.currency === cur) && i[c.price] <= max; }); }
    if (p.available === "1" && resource === "hotels") list = list.filter(function (h) { return h.rooms.some(function (r) { return r.availability === "available" || r.availability === "limited"; }); });
    if (p.free === "1") list = list.filter(function (i) { return i.free; });
    if (p.sort === "price-asc" && c.price) list.sort(function (a, b) { return a[c.price] - b[c.price]; });
    else if (p.sort === "price-desc" && c.price) list.sort(function (a, b) { return b[c.price] - a[c.price]; });
    else if (p.sort === "distance") list.sort(function (a, b) { return (a.distanceKm || 0) - (b.distanceKm || 0); });
    else if (resource === "events" || resource === "matches" || resource === "news") list.sort(function (a, b) { return (resource === "news" || p.status === "finished" ? -1 : 1) * (a.date.localeCompare(b.date) || (a.time || "").localeCompare(b.time || "")); });
    var size = Number(p.pageSize) || 9, page = Number(p.page) || 1, total = list.length;
    return { items: list.slice(0, size * page), total: total, page: page, pageSize: size };
  }
  function get(resource, id) { var f = (data[resource] || []).filter(function (i) { return i.id === id; })[0]; return f ? decorate(resource, f) : null; }

  var KEY = "pamoja-sample-submissions", SES = "pamoja-sample-session";
  function ref(prefix) { return prefix + "-" + Math.random().toString(36).slice(2, 8).toUpperCase(); }
  function submit(path, body) {
    var out = { sample: true, receivedAt: new Date().toISOString() };
    if (path === "/auth/login") { out.user = { email: body.email }; try { sessionStorage.setItem(SES, JSON.stringify(out.user)); } catch (e) {} return out; }
    if (path === "/auth/logout") { try { sessionStorage.removeItem(SES); } catch (e) {} return out; }
    out.reference = ref({ "/enquiries": "ENQ", "/bookings": "REQ", "/contact": "MSG", "/reports": "RPT" }[path] || "REF");
    var safe = Object.assign({}, body); delete safe.password; delete safe.confirmPassword;
    try { var all = JSON.parse(localStorage.getItem(KEY) || "[]"); all.push({ path: path, ref: out.reference, at: out.receivedAt, body: safe }); localStorage.setItem(KEY, JSON.stringify(all.slice(-50))); } catch (e) {}
    return out;
  }
  function session() { try { return JSON.parse(sessionStorage.getItem(SES) || "null"); } catch (e) { return null; } }

  P.sample = { data: data, query: query, get: get, submit: submit, session: session, currencies: CUR, countries: CNAME, day: day };
})(window.PAMOJA);
