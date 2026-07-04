// _affiliates.js — Master affiliate link table for Coco Samui AI
//
// RULE: each business type maps to the CORRECT platform.
//   activity / tour  → Viator (primary), Klook, GetYourGuide
//   dive_shop        → direct booking URL first, then Viator
//   hotel            → Booking.com affiliate
//   transport        → Klook, then direct
//   spa              → direct website, optionally Klook
//   restaurant       → NO affiliate platform (not bookable on OTAs)
//   attraction       → Viator only (tours that include the attraction)
//
// NEW ENV VARS needed (add to Vercel → Settings → Environment Variables):
//   BOOKING_AFFILIATE_ID  ← get from https://partners.booking.com (Programme d'affiliation)
//   VIATOR_AFFILIATE_PID  ← existing
//   KLOOK_AFFILIATE_ID    ← existing
//   GETYOURGUIDE_PARTNER_ID ← existing

// ─── URL builders — append affiliate IDs at runtime ─────────────────────────

function viatorUrl(text) {
  const base = `https://www.viator.com/searchResults/all?text=${encodeURIComponent(text)}`;
  const pid = process.env.VIATOR_AFFILIATE_PID;
  return pid ? `${base}&pid=${pid}` : base;
}

function klookUrl(query) {
  const base = `https://www.klook.com/en-US/search/?query=${encodeURIComponent(query)}`;
  const aid = process.env.KLOOK_AFFILIATE_ID;
  return aid ? `${base}&aid=${aid}` : base;
}

function gygUrl(path) {
  // path = category slug like "ang-thong-national-marine-park-tc102/"
  // or a full search like "?q=Koh+Samui+cooking+class"
  const base = path.startsWith("?")
    ? `https://www.getyourguide.com/koh-samui-l35004/${path}`
    : `https://www.getyourguide.com/koh-samui-l35004/${path}`;
  const pid = process.env.GETYOURGUIDE_PARTNER_ID;
  return pid ? `${base}${path.includes("?") ? "&" : "?"}partner_id=${pid}` : base;
}

function bookingUrl(path) {
  // path = hotel page like "/hotel/th/four-seasons-resort-koh-samui.html"
  // or search like "/searchresults.html?ss=Koh+Samui"
  const base = `https://www.booking.com${path}`;
  const aid = process.env.BOOKING_AFFILIATE_ID;
  return aid ? `${base}${path.includes("?") ? "&" : "?"}aid=${aid}` : base;
}

// ─── AFFILIATE MAP ───────────────────────────────────────────────────────────
// Array of entries. Order matters — more specific entries FIRST.
// keywords: array of lowercase strings to match against combined text
// type:     used for display grouping and dedup logic
// links:    function returning array of { provider, url, emoji }
// noFallback: if true, suppresses generic hotel/activity fallback for this match

export const AFFILIATE_MAP = [

  // ══════════════════════════════════════════════════════════════
  // 🤿 DIVE SHOPS — direct booking URL first, then Viator
  // ══════════════════════════════════════════════════════════════
  {
    keywords: ["discovery divers"],
    businessName: "Discovery Divers",
    type: "dive_shop",
    noFallback: true,
    links: () => [
      { provider: "📅 Book direct (FareHarbor)", url: "https://discoverydivers.com/book-now/" },
      { provider: "Viator", url: viatorUrl("Discovery Divers Koh Samui scuba diving") },
    ],
  },
  {
    keywords: ["silent divers"],
    businessName: "Silent Divers",
    type: "dive_shop",
    noFallback: true,
    links: () => [
      { provider: "📅 Book direct", url: "https://silentdivers.com" },
      { provider: "Viator", url: viatorUrl("Silent Divers Koh Samui") },
    ],
  },
  {
    keywords: ["dive point samui", "divepoint"],
    businessName: "Dive Point Samui",
    type: "dive_shop",
    noFallback: true,
    links: () => [
      { provider: "📅 Book direct", url: "https://divepoint-samui.com" },
    ],
  },
  {
    keywords: ["easy divers"],
    businessName: "Easy Divers",
    type: "dive_shop",
    noFallback: true,
    links: () => [
      { provider: "Viator", url: viatorUrl("Easy Divers Koh Samui") },
    ],
  },

  // ══════════════════════════════════════════════════════════════
  // 🌊 DIVING & SNORKELING ACTIVITIES
  // ══════════════════════════════════════════════════════════════
  {
    keywords: ["sail rock", "hin bai"],
    businessName: "Sail Rock Diving",
    type: "activity",
    links: () => [
      { provider: "Viator", url: viatorUrl("Sail Rock diving from Koh Samui") },
      { provider: "Klook", url: klookUrl("Sail Rock diving Koh Samui") },
    ],
  },
  {
    keywords: ["chumphon pinnacle"],
    businessName: "Chumphon Pinnacle Diving",
    type: "activity",
    links: () => [
      { provider: "Viator", url: viatorUrl("Chumphon Pinnacle scuba diving Koh Tao") },
      { provider: "Klook", url: klookUrl("Chumphon Pinnacle dive") },
    ],
  },
  {
    keywords: ["koh tao scuba", "koh tao diving", "koh tao scuba diving", "dive koh tao", "diving koh tao"],
    businessName: "Koh Tao Scuba Diving Day Trip",
    type: "activity",
    links: () => [
      { provider: "Viator", url: viatorUrl("Koh Tao scuba diving day trip from Koh Samui") },
      { provider: "Klook", url: klookUrl("Koh Tao scuba diving from Samui") },
      { provider: "GetYourGuide", url: gygUrl("scuba-diving-tc90/") },
    ],
  },
  {
    keywords: ["koh tao snorkel", "koh tao snorkeling", "snorkel koh tao"],
    businessName: "Koh Tao Snorkeling Day Trip",
    type: "activity",
    links: () => [
      { provider: "Viator", url: viatorUrl("Koh Tao snorkeling day trip from Koh Samui") },
      { provider: "Klook", url: klookUrl("Koh Tao snorkeling Samui") },
      { provider: "GetYourGuide", url: gygUrl("koh-tao-tc55/") },
    ],
  },
  {
    keywords: ["koh nang yuan", "nang yuan"],
    businessName: "Koh Nang Yuan",
    type: "activity",
    links: () => [
      { provider: "Viator", url: viatorUrl("Koh Nang Yuan snorkeling day trip") },
      { provider: "Klook", url: klookUrl("Koh Nang Yuan tour") },
    ],
  },
  {
    keywords: ["discover scuba", "try dive", "try scuba", "initiation plongée", "initiation plongee"],
    businessName: "Discover Scuba Diving",
    type: "activity",
    links: () => [
      { provider: "Viator", url: viatorUrl("Discover Scuba Diving Koh Samui beginner") },
      { provider: "Klook", url: klookUrl("discover scuba diving Koh Samui") },
    ],
  },
  {
    keywords: ["padi open water", "open water diver course", "open water course"],
    businessName: "PADI Open Water Course",
    type: "activity",
    links: () => [
      { provider: "Viator", url: viatorUrl("PADI Open Water Diver course Koh Samui") },
      { provider: "Klook", url: klookUrl("PADI Open Water course Samui") },
    ],
  },

  // ══════════════════════════════════════════════════════════════
  // 🏝️ ISLAND TOURS & SEA EXCURSIONS
  // ══════════════════════════════════════════════════════════════
  {
    keywords: ["ang thong"],
    businessName: "Ang Thong Marine Park Tour",
    type: "activity",
    links: () => [
      { provider: "Viator", url: viatorUrl("Ang Thong Marine Park tour from Koh Samui") },
      { provider: "Klook", url: klookUrl("Ang Thong Marine Park Koh Samui") },
      { provider: "GetYourGuide", url: gygUrl("ang-thong-national-marine-park-tc102/") },
    ],
  },
  {
    keywords: ["koh phangan day trip", "koh phangan tour", "pha ngan day trip"],
    businessName: "Koh Phangan Day Trip",
    type: "activity",
    links: () => [
      { provider: "Viator", url: viatorUrl("Koh Phangan day trip from Koh Samui") },
      { provider: "Klook", url: klookUrl("Koh Phangan day trip from Samui") },
    ],
  },
  {
    keywords: ["koh tean", "koh taen", "pig island", "koh madsum"],
    businessName: "Koh Tean / Pig Island Tour",
    type: "activity",
    links: () => [
      { provider: "Viator", url: viatorUrl("Koh Tean snorkeling tour Koh Samui") },
      { provider: "Klook", url: klookUrl("Pig Island Koh Samui tour") },
    ],
  },
  {
    keywords: ["sunset cruise", "dinner cruise", "sunset dinner cruise", "catamaran cruise"],
    businessName: "Samui Sunset Dinner Cruise",
    type: "activity",
    links: () => [
      { provider: "Viator", url: viatorUrl("Koh Samui sunset dinner cruise catamaran") },
      { provider: "Klook", url: klookUrl("Koh Samui sunset cruise") },
      { provider: "GetYourGuide", url: gygUrl("?q=Koh+Samui+sunset+cruise") },
    ],
  },
  {
    keywords: ["fishing charter", "deep sea fishing", "squid fishing", "night fishing"],
    businessName: "Fishing Charter",
    type: "activity",
    links: () => [
      { provider: "Viator", url: viatorUrl("Koh Samui fishing charter deep sea") },
      { provider: "Klook", url: klookUrl("Koh Samui fishing charter") },
    ],
  },
  {
    keywords: ["private boat", "boat charter", "yacht charter", "private charter"],
    businessName: "Private Boat Charter",
    type: "activity",
    links: () => [
      { provider: "Viator", url: viatorUrl("Koh Samui private boat charter") },
      { provider: "Klook", url: klookUrl("Koh Samui private boat rental") },
    ],
  },

  // ══════════════════════════════════════════════════════════════
  // 🐘 WILDLIFE & NATURE
  // ══════════════════════════════════════════════════════════════
  {
    keywords: ["elephant sanctuary", "samui elephant sanctuary"],
    businessName: "Samui Elephant Sanctuary",
    type: "activity",
    links: () => [
      { provider: "Viator", url: viatorUrl("Samui Elephant Sanctuary ethical half-day") },
      { provider: "Klook", url: klookUrl("Samui Elephant Sanctuary") },
      { provider: "GetYourGuide", url: gygUrl("elephant-sanctuary-tc242/") },
    ],
  },
  {
    keywords: ["namuang safari park", "safari park", "elephant show samui"],
    businessName: "Namuang Safari Park",
    type: "activity",
    links: () => [
      { provider: "Viator", url: viatorUrl("Namuang Safari Park Koh Samui") },
      { provider: "Klook", url: klookUrl("Namuang Safari Park Samui") },
    ],
  },
  {
    keywords: ["na muang waterfall", "namuang waterfall", "waterfall tour"],
    businessName: "Na Muang Waterfall",
    type: "attraction",
    links: () => [
      { provider: "Viator", url: viatorUrl("Na Muang Waterfall tour Koh Samui") },
    ],
  },
  {
    keywords: ["big buddha tour", "big buddha island tour"],
    businessName: "Big Buddha Island Tour",
    type: "activity",
    links: () => [
      { provider: "Viator", url: viatorUrl("Koh Samui Big Buddha island tour temples") },
      { provider: "Klook", url: klookUrl("Koh Samui island tour Big Buddha") },
    ],
  },

  // ══════════════════════════════════════════════════════════════
  // 🏄 ADVENTURE & SPORT
  // ══════════════════════════════════════════════════════════════
  {
    keywords: ["atv tour", "atv jungle", "quad bike samui", "quad samui"],
    businessName: "ATV Jungle Tour",
    type: "activity",
    links: () => [
      { provider: "Viator", url: viatorUrl("ATV quad bike jungle tour Koh Samui") },
      { provider: "Klook", url: klookUrl("ATV jungle tour Koh Samui") },
    ],
  },
  {
    keywords: ["zipline", "canopy adventure", "flying squirrel"],
    businessName: "Zipline Canopy Adventure",
    type: "activity",
    links: () => [
      { provider: "Viator", url: viatorUrl("zipline canopy adventure Koh Samui") },
      { provider: "Klook", url: klookUrl("zipline Koh Samui") },
    ],
  },
  {
    keywords: ["muay thai training", "muay thai class", "muay thai lesson"],
    businessName: "Muay Thai Training",
    type: "activity",
    links: () => [
      { provider: "Viator", url: viatorUrl("Muay Thai training class Koh Samui") },
      { provider: "Klook", url: klookUrl("Muay Thai Koh Samui class") },
      { provider: "GetYourGuide", url: gygUrl("?q=Muay+Thai+Koh+Samui") },
    ],
  },
  {
    keywords: ["jet ski", "ocean safari", "jetski"],
    businessName: "Jet Ski / Ocean Safari",
    type: "activity",
    links: () => [
      { provider: "Viator", url: viatorUrl("jet ski tour Koh Samui ocean safari") },
      { provider: "Klook", url: klookUrl("jet ski Koh Samui") },
    ],
  },
  {
    keywords: ["sea kayak", "kayaking tour", "kayak tour"],
    businessName: "Sea Kayaking Tour",
    type: "activity",
    links: () => [
      { provider: "Viator", url: viatorUrl("sea kayaking tour Koh Samui") },
      { provider: "Klook", url: klookUrl("kayak Koh Samui") },
    ],
  },
  {
    keywords: ["thai cooking class", "cooking class samui", "cooking school samui", "cours de cuisine"],
    businessName: "Thai Cooking Class",
    type: "activity",
    links: () => [
      { provider: "Viator", url: viatorUrl("Thai cooking class Koh Samui") },
      { provider: "Klook", url: klookUrl("Thai cooking class Koh Samui") },
      { provider: "GetYourGuide", url: gygUrl("cooking-classes-tc40/") },
    ],
  },

  // ══════════════════════════════════════════════════════════════
  // 🧖 SPAS & WELLNESS — direct website first
  // ══════════════════════════════════════════════════════════════
  {
    keywords: ["tamarind springs", "tamarind forest spa"],
    businessName: "Tamarind Springs Forest Spa",
    type: "spa",
    noFallback: true,
    links: () => [
      { provider: "🌿 Book direct", url: "https://www.tamarindsprings.com" },
    ],
  },
  {
    keywords: ["kamalaya wellness", "kamalaya spa", "kamalaya retreat"],
    businessName: "Kamalaya Wellness Sanctuary",
    type: "spa",
    noFallback: true,
    links: () => [
      { provider: "🌿 Book direct", url: "https://www.kamalaya.com" },
      { provider: "Klook", url: klookUrl("Kamalaya wellness program Koh Samui") },
    ],
  },
  {
    keywords: ["banyan tree spa"],
    businessName: "Banyan Tree Spa",
    type: "spa",
    noFallback: true,
    links: () => [
      { provider: "🌿 Book direct", url: "https://www.banyantreespa.com/spa-samui" },
    ],
  },
  {
    keywords: ["massage samui", "thai massage", "spa samui", "wellness samui"],
    businessName: "Spa & Massage",
    type: "spa",
    links: () => [
      { provider: "Klook", url: klookUrl("massage spa Koh Samui") },
      { provider: "Viator", url: viatorUrl("Thai massage spa Koh Samui") },
    ],
  },

  // ══════════════════════════════════════════════════════════════
  // 🏨 HOTELS — Booking.com affiliate only (NOT Viator)
  // Specific hotels first, generic search as last fallback
  // ══════════════════════════════════════════════════════════════
  {
    keywords: ["four seasons koh samui", "four seasons samui", "four seasons resort koh"],
    businessName: "Four Seasons Resort Koh Samui",
    type: "hotel",
    noFallback: true,
    links: () => [
      { provider: "Booking.com", url: bookingUrl("/hotel/th/four-seasons-resort-koh-samui.html") },
    ],
  },
  {
    keywords: ["banyan tree samui"],
    businessName: "Banyan Tree Samui",
    type: "hotel",
    noFallback: true,
    links: () => [
      { provider: "Booking.com", url: bookingUrl("/hotel/th/banyan-tree-samui.html") },
    ],
  },
  {
    keywords: ["six senses samui"],
    businessName: "Six Senses Samui",
    type: "hotel",
    noFallback: true,
    links: () => [
      { provider: "Booking.com", url: bookingUrl("/hotel/th/six-senses-samui.html") },
    ],
  },
  {
    keywords: ["ritz-carlton koh samui", "ritz carlton koh samui", "ritz-carlton samui"],
    businessName: "Ritz-Carlton Koh Samui",
    type: "hotel",
    noFallback: true,
    links: () => [
      { provider: "Booking.com", url: bookingUrl("/hotel/th/ritz-carlton-koh-samui.html") },
    ],
  },
  {
    keywords: ["kimpton kitalay"],
    businessName: "Kimpton Kitalay Samui",
    type: "hotel",
    noFallback: true,
    links: () => [
      { provider: "Booking.com", url: bookingUrl("/hotel/th/kimpton-kitalay-samui.html") },
    ],
  },
  {
    keywords: ["vana belle"],
    businessName: "Vana Belle",
    type: "hotel",
    noFallback: true,
    links: () => [
      { provider: "Booking.com", url: bookingUrl("/hotel/th/vana-belle-a-luxury-collection-resort.html") },
    ],
  },
  {
    keywords: ["cape fahn"],
    businessName: "Cape Fahn Hotel",
    type: "hotel",
    noFallback: true,
    links: () => [
      { provider: "Booking.com", url: bookingUrl("/hotel/th/cape-fahn.html") },
    ],
  },
  {
    keywords: ["zazen boutique", "zazen resort"],
    businessName: "Zazen Boutique Resort",
    type: "hotel",
    noFallback: true,
    links: () => [
      { provider: "Booking.com", url: bookingUrl("/hotel/th/zazen-boutique-resort-spa.html") },
    ],
  },
  {
    keywords: ["centara reserve samui"],
    businessName: "Centara Reserve Samui",
    type: "hotel",
    noFallback: true,
    links: () => [
      { provider: "Booking.com", url: bookingUrl("/hotel/th/centara-reserve-samui.html") },
    ],
  },
  {
    keywords: ["sala samui chaweng"],
    businessName: "Sala Samui Chaweng",
    type: "hotel",
    noFallback: true,
    links: () => [
      { provider: "Booking.com", url: bookingUrl("/hotel/th/sala-samui-chaweng-beach-resort.html") },
    ],
  },
  {
    keywords: ["the library hotel", "the library samui"],
    businessName: "The Library Hotel",
    type: "hotel",
    noFallback: true,
    links: () => [
      { provider: "Booking.com", url: bookingUrl("/hotel/th/the-library.html") },
    ],
  },
  {
    keywords: ["amari koh samui", "amari samui"],
    businessName: "Amari Koh Samui",
    type: "hotel",
    noFallback: true,
    links: () => [
      { provider: "Booking.com", url: bookingUrl("/hotel/th/amari-koh-samui.html") },
    ],
  },
  {
    keywords: ["silavadee"],
    businessName: "Silavadee Pool Spa Resort",
    type: "hotel",
    noFallback: true,
    links: () => [
      { provider: "Booking.com", url: bookingUrl("/hotel/th/silavadee-pool-spa-resort.html") },
    ],
  },
  {
    keywords: ["anantara bophut"],
    businessName: "Anantara Bophut",
    type: "hotel",
    noFallback: true,
    links: () => [
      { provider: "Booking.com", url: bookingUrl("/hotel/th/anantara-bophut-koh-samui-resort.html") },
    ],
  },
  {
    keywords: ["hansar samui", "hansar resort"],
    businessName: "Hansar Samui Resort",
    type: "hotel",
    noFallback: true,
    links: () => [
      { provider: "Booking.com", url: bookingUrl("/hotel/th/hansar-samui.html") },
    ],
  },
  {
    keywords: ["le meridien koh samui", "le méridien koh samui"],
    businessName: "Le Méridien Koh Samui",
    type: "hotel",
    noFallback: true,
    links: () => [
      { provider: "Booking.com", url: bookingUrl("/hotel/th/le-meridien-koh-samui-resort-spa.html") },
    ],
  },
  {
    keywords: ["belmond napasai", "napasai"],
    businessName: "Belmond Napasai",
    type: "hotel",
    noFallback: true,
    links: () => [
      { provider: "Booking.com", url: bookingUrl("/hotel/th/napasai.html") },
    ],
  },
  {
    keywords: ["w koh samui", "w hotel samui"],
    businessName: "W Koh Samui",
    type: "hotel",
    noFallback: true,
    links: () => [
      { provider: "Booking.com", url: bookingUrl("/hotel/th/w-koh-samui.html") },
    ],
  },
  {
    keywords: ["santiburi koh samui", "santiburi resort"],
    businessName: "Santiburi Koh Samui",
    type: "hotel",
    noFallback: true,
    links: () => [
      { provider: "Booking.com", url: bookingUrl("/hotel/th/santiburi-koh-samui-the-leading-hotels-of-the-world.html") },
    ],
  },
  {
    keywords: ["tongsai bay", "garrya samui"],
    businessName: "The Tongsai Bay",
    type: "hotel",
    noFallback: true,
    links: () => [
      { provider: "Booking.com", url: bookingUrl("/hotel/th/tongsai-bay.html") },
    ],
  },
  {
    keywords: ["conrad koh samui", "conrad samui"],
    businessName: "Conrad Koh Samui",
    type: "hotel",
    noFallback: true,
    links: () => [
      { provider: "Booking.com", url: bookingUrl("/hotel/th/hilton-koh-samui.html") },
    ],
  },
  {
    keywords: ["intercontinental koh samui"],
    businessName: "InterContinental Koh Samui",
    type: "hotel",
    noFallback: true,
    links: () => [
      { provider: "Booking.com", url: bookingUrl("/hotel/th/intercontinental-koh-samui-resort.html") },
    ],
  },
  {
    keywords: ["briza beach resort"],
    businessName: "Briza Beach Resort",
    type: "hotel",
    noFallback: true,
    links: () => [
      { provider: "Booking.com", url: bookingUrl("/hotel/th/briza-beach-resort-koh-samui.html") },
    ],
  },
  // Generic hotel fallback — triggered by accommodation intent words
  {
    keywords: ["book a hotel", "find a hotel", "best hotel", "luxury hotel", "budget hotel",
               "resort samui", "where to stay", "accommodation", "hébergement", "où dormir",
               "übernachten", "hotel samui", "resort koh samui", "villa samui"],
    businessName: "Hotels in Koh Samui",
    type: "hotel",
    links: () => [
      { provider: "Booking.com", url: bookingUrl("/searchresults.html?ss=Koh+Samui%2C+Thailand") },
    ],
  },

  // ══════════════════════════════════════════════════════════════
  // 🚌 TRANSPORT — Klook first
  // ══════════════════════════════════════════════════════════════
  {
    keywords: ["airport transfer", "airport taxi", "airport pickup", "from the airport",
               "from samui airport", "to the airport", "transfer from airport"],
    businessName: "Airport Transfer",
    type: "transport",
    links: () => [
      { provider: "Klook", url: klookUrl("Koh Samui airport transfer private") },
      { provider: "Viator", url: viatorUrl("Koh Samui airport transfer") },
    ],
  },
  {
    keywords: ["lomprayah", "speed ferry koh tao", "speed ferry koh phangan",
               "ferry to koh tao", "ferry to koh phangan", "ferry ticket samui"],
    businessName: "Lomprayah Ferry",
    type: "transport",
    links: () => [
      { provider: "Klook", url: klookUrl("Lomprayah ferry Koh Samui Koh Tao Koh Phangan") },
      { provider: "📅 Book direct", url: "https://www.lomprayah.com" },
    ],
  },
  {
    keywords: ["seatran ferry", "raja ferry", "car ferry samui", "ferry donsak"],
    businessName: "Car Ferry",
    type: "transport",
    links: () => [
      { provider: "📅 Book direct", url: "https://www.seatranferry.com" },
    ],
  },

  // ══════════════════════════════════════════════════════════════
  // 🍽️ FINE DINING — direct reservation only, NO OTA affiliate
  // ══════════════════════════════════════════════════════════════
  {
    keywords: ["dining on the rocks"],
    businessName: "Dining on the Rocks",
    type: "restaurant",
    noFallback: true,
    links: () => [
      { provider: "📞 Reserve", url: "https://www.sixsenses.com/en/resorts/samui/dining" },
    ],
  },
  {
    keywords: ["tree tops sky dining", "treetops anantara"],
    businessName: "Tree Tops Sky Dining",
    type: "restaurant",
    noFallback: true,
    links: () => [
      { provider: "📞 Reserve", url: "https://www.anantara.com/en/bophut-koh-samui/restaurants/tree-tops" },
    ],
  },
  {
    keywords: ["fishhouse kimpton", "fish house kimpton"],
    businessName: "FishHouse at Kimpton",
    type: "restaurant",
    noFallback: true,
    links: () => [
      { provider: "📞 Reserve", url: "https://www.kimptonkitalaysamui.com/dining" },
    ],
  },
  {
    keywords: ["club zazen", "zazen restaurant"],
    businessName: "The Club by Zazen",
    type: "restaurant",
    noFallback: true,
    links: () => [
      { provider: "📞 Reserve", url: "https://www.samuizazen.com/dining" },
    ],
  },
  {
    keywords: ["moon silavadee", "moon restaurant"],
    businessName: "Moon at Silavadee",
    type: "restaurant",
    noFallback: true,
    links: () => [
      { provider: "📞 Reserve", url: "https://www.silavadee.com/dining/moon-restaurant" },
    ],
  },
  // NOTE: Local restaurants (Sa Being Lae, Noo Beer Garden, etc.) → NO affiliate link.
  // Coco should mention phone number / address only. They are not on OTA platforms.

];

// ─── Main export: match text → correct affiliate links ───────────────────────
//
// Pass combined text of (user query + Coco's answer).
// Returns an array of { provider, url } deduplicated by provider.
// Max 4 links returned.
//
// Logic:
//   1. Scan text for keyword matches
//   2. Collect links from matched entries
//   3. If a specific hotel/dive_shop matched → suppress generic hotel fallback
//   4. Deduplicate by provider (first match wins)
//   5. Return max 4

export function getAffiliateLinks(text) {
  const t = (text || "").toLowerCase();

  const matched = [];
  const seenTypes = new Set();

  for (const entry of AFFILIATE_MAP) {
    if (entry.keywords.some((kw) => t.includes(kw))) {
      matched.push(entry);
      if (entry.noFallback) seenTypes.add(entry.type);
    }
  }

  // If we matched a specific hotel/dive entry (noFallback=true),
  // remove any generic fallback entries of the same type
  const filtered = matched.filter((entry) => {
    if (!entry.noFallback && seenTypes.has(entry.type)) return false;
    return true;
  });

  // Flatten links, deduplicate by provider (first wins)
  const seenProviders = new Set();
  const result = [];

  for (const entry of filtered) {
    for (const link of entry.links()) {
      if (!seenProviders.has(link.provider)) {
        seenProviders.add(link.provider);
        result.push(link);
      }
    }
  }

  return result.slice(0, 4);
}
