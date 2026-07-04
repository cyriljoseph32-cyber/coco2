/** Experiences, practical guide, FAQ, categories — extracted from v1 site. */

export interface Experience {
  emoji: string;
  title: string;
  desc: string;
  price: string;
  q: string;
  cta: string;
}

export const EXPERIENCES: Experience[] = [
  { emoji: "🦈", title: "Dive Sail Rock", price: "From 2,500 THB/person", cta: "Book via Coco",
    desc: "The crown jewel of diving in the Gulf of Thailand. A vertical chimney swimthrough, massive barracuda schools, and whale sharks May–September. Bucket list material.",
    q: "How do I book a dive trip to Sail Rock from Koh Samui?" },
  { emoji: "🏝️", title: "Ang Thong Marine Park", price: "From 1,500 THB/person", cta: "Ask Coco",
    desc: "42 pristine islands with an emerald lagoon, kayaking, snorkeling over untouched coral — a full-day paradise just 31 km from Samui.",
    q: "Tell me everything about Ang Thong Marine Park — tours, timing, what to bring." },
  { emoji: "🐷", title: "Pig Island Day Trip", price: "From 1,500 THB/person", cta: "Ask Coco",
    desc: "Swim with pigs on Koh Madsum, snorkel pristine Koh Tean coral, eat fresh grilled seafood on a deserted beach. Samui's most unique day trip.",
    q: "How do I get to Pig Island Koh Madsum from Koh Samui?" },
  { emoji: "🌅", title: "Sunset Dinner Cruise", price: "From 2,000 THB/person", cta: "Ask Coco",
    desc: "Watch the sun dissolve into the Gulf from a catamaran. Cocktails, fresh seafood, golden hour light — the most romantic evening on the island.",
    q: "Best sunset cruise operators on Koh Samui?" },
  { emoji: "🧘", title: "Kamalaya Wellness Day", price: "From 3,500 THB/day", cta: "Ask Coco",
    desc: "World-famous sanctuary built around a monk's cave. Yoga, meditation, treatments, healthy cuisine — a full reset. Worth every baht.",
    q: "What Kamalaya day programs and treatments are available?" },
  { emoji: "🎆", title: "Fisherman's Village Friday", price: "Free entry", cta: "Ask Coco",
    desc: "Every Friday 5–11pm: street food, art, live music and boutique shopping in a charming Sino-Portuguese colonial street. The perfect evening out.",
    q: "What should I see and eat at Fisherman's Village walking street on Friday?" },
];

export interface Tip { emoji: string; title: string; text: string; q: string; }

export const GUIDE: Tip[] = [
  { emoji: "💰", title: "Currency & Money", q: "How much money should I budget per day on Koh Samui?",
    text: "Thai Baht (THB). 1 EUR ≈ 37–38 THB. ATMs everywhere (220 THB fee per withdrawal). Get larger amounts at once. Most tourist spots accept cards." },
  { emoji: "🚗", title: "Getting Around", q: "How do I get around Koh Samui? Taxi, ferry, motorbike, Grab?",
    text: "Songthaew (shared truck) 50–150 THB. Taxis 200–500 THB (negotiate). Grab app saves 20–30%. Motorbike 200–300 THB/day — drive carefully, high accident rate." },
  { emoji: "🌤️", title: "Best Time to Visit", q: "What is the best time of year to visit Koh Samui?",
    text: "Dec–April: dry season, clear blue skies, best for diving. May–Sept: warm, some rain but usually sunny. Oct–Nov: monsoon season, avoid if possible." },
  { emoji: "📱", title: "SIM & Connectivity", q: "What SIM card should I buy in Koh Samui?",
    text: "Buy AIS SIM at the airport (best coverage). 299 THB/30 days unlimited data. Download Grab before you arrive — you'll use it every day." },
  { emoji: "🛕", title: "Temple Etiquette", q: "What should I wear to visit temples in Koh Samui?",
    text: "Cover shoulders and knees. Remove shoes before entering. Don't point feet at Buddha images. A sarong or scarf can be bought near temples (~100 THB)." },
  { emoji: "🏥", title: "Health & Safety", q: "Which hospital should I go to on Koh Samui? Emergency numbers?",
    text: "Bangkok Hospital Samui (most reliable). Emergency: 1669. Tourist police (English): 1155. Travel insurance strongly recommended for diving and water activities." },
  { emoji: "🚢", title: "Ferries & Islands", q: "Ferry times and prices from Koh Samui to Koh Phangan and Koh Tao?",
    text: "Koh Phangan: 30 min, ~400 THB from Bangrak Pier. Koh Tao: 2 hrs, ~750 THB. Surat Thani mainland: 2.5 hrs, ~300 THB from Nathon Pier." },
  { emoji: "🌊", title: "Diving Safety", q: "How do I choose a safe dive operator on Koh Samui?",
    text: "Only dive with PADI 5-Star centres. Never dive after alcohol. Reef-safe biodegradable sunscreen only. Check weather before sea trips in Oct–Nov." },
];

export interface Faq { q: string; a: string; }

export const FAQ: Faq[] = [
  { q: "Is Coco free for travellers?",
    a: "Yes — travellers can chat with Coco completely free, with no signup or app required. Just ask your question and get an instant answer about hotels, diving, restaurants, transport, or anything on Koh Samui." },
  { q: "What languages does Coco speak?",
    a: "Coco is fluent in English, French, German, Swedish, Thai and Chinese. It automatically detects the language you write in and replies in the same language — no settings needed." },
  { q: "How accurate is the information?",
    a: "Coco uses curated local knowledge from verified sources including official operator websites, tourism authorities and on-the-ground expertise from Cyril, a professional dive instructor based on Koh Samui. Prices are indicative in THB and should be confirmed directly with providers for booking. If Coco is unsure, it says so clearly." },
  { q: "How do I get from Koh Samui to Koh Tao or Sail Rock?",
    a: "The fastest option is a speedboat ferry (Lomprayah or Seatran) from Nathon or Maenam Pier — about 1.5–2 hours to Koh Tao for roughly 600–1,000 THB. For Sail Rock, day trips depart from Samui with dive operators like Discovery Divers. Ask Coco directly for live routing, timing and booking options." },
  { q: "Can Coco be added to my hotel or villa website?",
    a: "Absolutely. Coco can be embedded on your website or WhatsApp, or deployed via a trackable QR code in guest rooms — all configured to promote your own services first. Setup takes less than an hour. Start with a 14-day free trial, no card required. Contact Cyril on WhatsApp to get started." },
  { q: "What is the best time of year to visit Koh Samui?",
    a: "December through April is the dry season — clear blue skies and the best visibility for diving. May through September is warm with some rain but usually sunny. October and November are the monsoon months and best avoided, particularly for boat trips and diving. Ask Coco for month-specific advice based on your travel dates." },
  { q: "Is Coco's advice safety advice?",
    a: "No. Coco's answers are AI-generated and indicative — always confirm prices, schedules and conditions with the operator. For safety-critical activities like scuba diving and boat trips, follow the briefing of a qualified, certified operator." },
  { q: "Does Coco earn commission on bookings?",
    a: "Some booking links Coco shows are affiliate links (Viator, Klook, GetYourGuide, Booking.com). If you book through them, Coco may earn a commission at no extra cost to you — it never changes the price you pay." },
];

export interface Category { emoji: string; name: string; count: string; q: string; }

export const CATEGORIES: Category[] = [
  { emoji: "🏨", name: "Hotels & Resorts", count: "40+ options", q: "Best hotels and resorts on Koh Samui — luxury, boutique and budget options?" },
  { emoji: "🤿", name: "Diving & Snorkeling", count: "15+ dive sites", q: "Best diving and snorkeling sites around Koh Samui and Koh Tao?" },
  { emoji: "🍽️", name: "Restaurants & Food", count: "50+ venues", q: "Best restaurants in Koh Samui — romantic, seafood, local Thai and family-friendly?" },
  { emoji: "⛵", name: "Sea Tours & Trips", count: "Ang Thong, Pig Island +", q: "Best sea tours from Koh Samui — Ang Thong Marine Park, Pig Island, Koh Tao?" },
  { emoji: "🧘", name: "Wellness & Spa", count: "World-class retreats", q: "Best spas, yoga and wellness retreats on Koh Samui?" },
  { emoji: "🏄", name: "Activities & Sports", count: "Watersports, Muay Thai +", q: "Best activities on Koh Samui — watersports, Muay Thai, ATV, cooking class?" },
  { emoji: "🌙", name: "Nightlife", count: "Clubs, beach bars +", q: "What is the nightlife like in Koh Samui — beach clubs, bars, clubs?" },
  { emoji: "🛕", name: "Culture & Temples", count: "Big Buddha, markets +", q: "Best temples and cultural sites in Koh Samui to visit?" },
  { emoji: "🚗", name: "Transport & Ferries", count: "All the ways around", q: "How do I get around Koh Samui? Taxi, ferry, motorbike, Grab?" },
  { emoji: "🎣", name: "Fishing Charters", count: "Deep sea adventures", q: "Best fishing charters in Koh Samui — deep sea, half day, squid fishing?" },
];
