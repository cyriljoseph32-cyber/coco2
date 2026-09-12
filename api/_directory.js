// ─────────────────────────────────────────────────────────────
// Coco — annuaire vérifié de Koh Samui (data/concierge-db)
//
// 201 fiches, 20 catégories, vérifiées à la main. Jusqu'ici ce dossier n'était
// référencé par aucun code exécutable : le chat répondait uniquement depuis le
// prompt statique. C'est la fuite n°5 de l'audit — 201 fiches de données mortes.
//
// Ce module les rend vivantes, SANS gonfler le prompt : l'annuaire complet fait
// ~450 Ko (bien trop pour un system prompt). On charge l'index une fois au
// démarrage à froid, on note les fiches par rapport à la question du visiteur,
// et on n'injecte que les meilleures.
//
// Règle tenue ici : on n'invente rien. Les fiches sortent telles quelles
// (adresse, horaires, téléphone, lien Maps) et le prompt dit explicitement au
// modèle de préférer ces valeurs à sa mémoire.
// ─────────────────────────────────────────────────────────────

import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const DB_DIR = join(process.cwd(), "data", "concierge-db");

/** Mots vides FR/EN : ils feraient matcher tout avec tout. */
const STOP = new Set([
  "the","a","an","and","or","of","in","to","for","with","is","are","me","my","we","you","your",
  "what","where","which","how","can","do","does","i","it","at","on","best","good","some","any",
  "le","la","les","un","une","des","du","de","et","ou","en","au","aux","pour","avec","est","sont",
  "je","tu","nous","vous","quoi","ou","que","qui","comment","peux","peut","plus","meilleur",
  "meilleure","meilleurs","bon","bonne","sur","dans","par","pas","ce","cette","mon","ma","mes",
]);

/**
 * Aliases : ce que le visiteur écrit → les mots qui apparaissent réellement dans
 * les fiches. Sans cette table, « scooter » ne trouve pas « location de
 * scooters, voitures et vans » et « dive » ne trouve pas « plongée ».
 */
const ALIASES = {
  dive: ["plongee", "diving", "snorkeling"],
  diving: ["plongee", "snorkeling"],
  snorkel: ["snorkeling", "plongee"],
  scooter: ["scooters", "location", "moto", "bike", "motorbike"],
  motorbike: ["scooters", "location"],
  car: ["voitures", "location", "van"],
  taxi: ["transferts", "transport", "chauffeur"],
  transfer: ["transferts", "transport", "aeroport"],
  airport: ["aeroport", "transferts"],
  eat: ["restaurants", "restaurant", "cuisine"],
  food: ["restaurants", "cuisine", "thailandais"],
  dinner: ["restaurants", "diner"],
  lunch: ["restaurants", "cafes"],
  breakfast: ["cafes", "brunchs", "boulangeries"],
  brunch: ["cafes", "brunchs"],
  coffee: ["cafes", "cafe"],
  bakery: ["boulangeries", "cafes"],
  drink: ["bars", "cocktails", "rooftops"],
  bar: ["bars", "vie", "nocturne"],
  party: ["bars", "vie", "nocturne", "beach", "clubs"],
  nightlife: ["bars", "vie", "nocturne"],
  beach: ["beach", "clubs", "plage"],
  massage: ["massages", "spas", "wellness"],
  spa: ["spas", "massages", "wellness"],
  yoga: ["yoga", "retraites", "wellness"],
  gym: ["fitness", "muay", "thai"],
  boxing: ["muay", "thai", "fitness"],
  muaythai: ["muay", "thai"],
  boat: ["excursions", "bateau", "yachts", "iles"],
  island: ["iles", "excursions", "bateau"],
  tour: ["tours", "guides", "excursions"],
  kids: ["enfants", "famille", "ecoles"],
  kid: ["enfants", "famille"],
  child: ["enfants", "famille"],
  family: ["famille", "enfants"],
  school: ["ecoles", "famille"],
  babysitter: ["baby-sitting", "famille"],
  doctor: ["cliniques", "hopitaux", "sante"],
  hospital: ["hopitaux", "cliniques", "sante"],
  dentist: ["dentistes", "sante"],
  pharmacy: ["pharmacies", "sante"],
  clinic: ["cliniques", "sante"],
  hotel: ["hotels", "resorts", "villas"],
  villa: ["villas", "immobilier", "locations"],
  rent: ["locations", "immobilier", "location"],
  shopping: ["shopping", "marches", "artisanat"],
  market: ["marches", "shopping"],
  souvenir: ["souvenirs", "artisanat", "shopping"],
  hair: ["coiffeurs", "barbiers", "beaute"],
  nails: ["onglerie", "beaute"],
  barber: ["barbiers", "coiffeurs"],
  laundry: ["blanchisserie", "services", "pratiques"],
  coworking: ["coworking", "services", "pratiques"],
  wedding: ["wedding", "planners", "photographie"],
  photographer: ["photographie", "wedding"],
};

/** Enlève les accents et la ponctuation : « plongée » et « plongee » sont un seul mot. */
function fold(text) {
  return String(text || "")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ");
}

function tokenise(text) {
  return fold(text)
    .split(/\s+/)
    .filter((w) => w.length > 2 && !STOP.has(w));
}

let CACHE = null;

/**
 * Charge l'annuaire et pré-calcule, pour chaque fiche, le sac de mots qui sert
 * à la noter. Fait une seule fois par instance (démarrage à froid).
 */
function load() {
  if (CACHE) return CACHE;
  const entries = [];
  try {
    for (const file of readdirSync(DB_DIR).filter((f) => f.endsWith(".json")).sort()) {
      let doc;
      try {
        doc = JSON.parse(readFileSync(join(DB_DIR, file), "utf8"));
      } catch (err) {
        console.warn("[COCO DIR] fiche illisible:", file, err && err.message);
        continue;
      }
      const category = doc.category || file.replace(/^\d+-|\.json$/g, "");
      for (const b of doc.businesses || []) {
        if (!b || !b.name) continue;
        const haystack = [
          b.name,
          b.business_type,
          category,
          b.area,
          (b.secondary_categories || []).join(" "),
          (b.key_services || []).join(" "),
          (b.ideal_for || []).join(" "),
          (b.highlights || []).join(" "),
          b.short_description_fr,
        ].join(" ");
        entries.push({
          category,
          words: new Set(tokenise(haystack)),
          score: Number(b.priority_score) || 50,
          b,
        });
      }
    }
  } catch (err) {
    console.warn("[COCO DIR] annuaire introuvable:", err && err.message);
  }
  CACHE = entries;
  return CACHE;
}

export function directorySize() {
  return load().length;
}

/** Les mots de la question, aliases compris. */
function queryWords(question) {
  const base = tokenise(question);
  const out = new Set(base);
  for (const w of base) {
    for (const alias of ALIASES[w] || []) out.add(fold(alias));
    // « restaurants » ↔ « restaurant » : le pluriel ne doit pas coûter un match.
    if (w.endsWith("s") && w.length > 4) out.add(w.slice(0, -1));
    else out.add(`${w}s`);
  }
  return out;
}

/**
 * Retourne les fiches les plus pertinentes pour une question.
 * Le score : nombre de mots communs (le poids réel) puis priority_score comme
 * départage — on ne classe jamais une fiche uniquement sur sa réputation.
 */
export function findBusinesses(question, limit = 8) {
  const wanted = queryWords(question);
  if (wanted.size === 0) return [];
  const scored = [];
  for (const entry of load()) {
    let hits = 0;
    for (const w of wanted) if (entry.words.has(w)) hits++;
    if (hits === 0) continue;
    scored.push({ hits, entry });
  }
  scored.sort((a, b) => b.hits - a.hits || b.entry.score - a.entry.score);
  // Deux fiches suffisent à prouver la pertinence ; en dessous d'un mot commun
  // sur une question longue, c'est du bruit — on coupe.
  return scored.slice(0, limit).map((s) => ({ category: s.entry.category, ...s.entry.b }));
}

function line(label, value) {
  return value ? ` · ${label}: ${value}` : "";
}

/** Une fiche, compacte, telle qu'elle entre dans le system prompt. */
function render(b) {
  const bits =
    `• ${b.name} — ${b.business_type || b.category}` +
    line("zone", b.area) +
    line("prix", b.price_level) +
    line("horaires", b.opening_hours) +
    line("tél", b.phone) +
    line("WhatsApp", b.whatsapp) +
    line("web", b.website_url) +
    line("réserver", b.booking_url) +
    line("Maps", b.google_maps_url) +
    (b.booking_required ? " · réservation conseillée" : "");
  const why = b.coco_concierge_recommendation || b.short_description_fr || "";
  return why ? `${bits}\n  ↳ ${why}` : bits;
}

/**
 * Le bloc à concaténer au system prompt. Vide si rien ne matche — on ne pousse
 * pas des fiches au hasard dans le contexte.
 */
export function directoryContext(question, limit = 8) {
  const hits = findBusinesses(question, limit);
  if (hits.length === 0) return "";
  return (
    "\n\n━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
    "📒 VERIFIED LOCAL DATABASE — Coco's own directory (data/concierge-db)\n" +
    "━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
    "These entries were verified by hand. When a guest asks about any of them, use THESE\n" +
    "details — address, hours, phone, booking link — over anything you remember. Never\n" +
    "invent a price, a phone number or an opening time that is not written here. If a field\n" +
    "is missing below, say you'll confirm it rather than guessing.\n\n" +
    hits.map(render).join("\n")
  );
}
