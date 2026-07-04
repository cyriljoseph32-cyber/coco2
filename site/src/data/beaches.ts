export interface Beach {
  name: string;
  slugQ: string; // question sent to Coco
  zone: string;
  tag: string;
  vibe: "lively" | "family" | "romantic" | "quiet" | "hidden" | "sunset";
  grad: [string, string];
  desc: string;
  bestFor: string;
}

export const BEACHES: Beach[] = [
  { name: "Chaweng", zone: "East", tag: "Most lively · 7 km", vibe: "lively", grad: ["#0a9396", "#023047"],
    desc: "The island's main event — 7 km of white sand, calm swimming, beach clubs and the best nightlife access. North Chaweng is noticeably quieter.",
    bestFor: "First-timers, nightlife, watersports",
    slugQ: "Tell me about Chaweng Beach — best spots, facilities and who it's best for." },
  { name: "Chaweng Noi", zone: "East", tag: "Boutique · Viewpoints", vibe: "quiet", grad: ["#127a7d", "#0a2540"],
    desc: "Chaweng's small southern sister behind the headland. Upscale resorts, fewer vendors, and the famous coastal viewpoint on the road to Lamai.",
    bestFor: "Couples wanting Chaweng access without the noise",
    slugQ: "Tell me about Chaweng Noi Beach — hotels, vibe, how it compares to Chaweng." },
  { name: "Lamai", zone: "Southeast", tag: "Romantic · Relaxed", vibe: "romantic", grad: ["#e9c46a", "#f4a261"],
    desc: "The second-largest beach, softer pace than Chaweng, good value resorts and a genuine night market. Grandfather & Grandmother rocks at the south end.",
    bestFor: "Couples, wellness stays, value seekers",
    slugQ: "Tell me about Lamai Beach — vibe, facilities, best for who?" },
  { name: "Maenam", zone: "North", tag: "Family friendly · Calm", vibe: "family", grad: ["#94d2bd", "#0a9396"],
    desc: "Long, quiet and shallow — the safest swimming for young children. Views over to Koh Phangan and a very local Thursday market.",
    bestFor: "Families with young kids, long quiet stays",
    slugQ: "Tell me about Maenam Beach — is it good for families with kids?" },
  { name: "Bophut", zone: "North", tag: "Charming · Fisherman's Village", vibe: "romantic", grad: ["#5b8c5a", "#1b4332"],
    desc: "Calm water fronting the Sino-Portuguese lanes of Fisherman's Village — boutique hotels, the island's best Friday walking street, easy pier access.",
    bestFor: "Food lovers, boutique stays, Friday nights",
    slugQ: "Tell me about Bophut Beach and Fisherman's Village — hotels, restaurants, Friday market." },
  { name: "Bangrak", zone: "Northeast", tag: "Big Buddha · Piers", vibe: "quiet", grad: ["#48749c", "#0a2540"],
    desc: "The Big Buddha beach — departure point for Koh Phangan and Koh Tao ferries. Not the best swimming, but sunset views of Wat Phra Yai are special.",
    bestFor: "Ferry access, temple views, dive-trip mornings",
    slugQ: "Tell me about Bangrak Beach — ferries, Big Buddha, is it worth staying there?" },
  { name: "Choeng Mon", zone: "Northeast", tag: "Upscale · Calm waters", vibe: "family", grad: ["#52b788", "#1b4332"],
    desc: "A sheltered cove ringed by 5-star resorts. Clear, calm, clean — the island's most polished beach without feeling private.",
    bestFor: "Luxury stays, families, calm swimmers",
    slugQ: "Tell me about Choeng Mon Beach — best resorts and activities nearby?" },
  { name: "Silver Beach", zone: "Southeast", tag: "Hidden gem · Turquoise", vibe: "hidden", grad: ["#48cae4", "#0077b6"],
    desc: "Crystal Bay — a pocket of granite boulders and genuinely turquoise water between Chaweng and Lamai. Small, photogenic, snorkel-friendly.",
    bestFor: "Snorkeling, photos, day visits",
    slugQ: "Tell me about Silver Beach Crystal Bay — is it worth visiting?" },
  { name: "Lipa Noi", zone: "West", tag: "Best sunsets · Shallow", vibe: "sunset", grad: ["#f4a261", "#e76f51"],
    desc: "The sunset coast — kilometres of shallow, sandbar-soft water and the island's most cinematic evenings. Almost no development noise.",
    bestFor: "Sunsets, small kids (very shallow), slow days",
    slugQ: "Tell me about Lipa Noi Beach — best sunsets and which hotels are there?" },
  { name: "Taling Ngam", zone: "Southwest", tag: "Wild · Five Islands views", vibe: "sunset", grad: ["#b5651d", "#432818"],
    desc: "Rugged and residential, with postcard views of the Five Islands. Home to clifftop luxury (InterContinental, Conrad nearby) and honest local seafood.",
    bestFor: "Escaping crowds, dramatic sunset dinners",
    slugQ: "Tell me about Taling Ngam Beach — views, restaurants, hotels on the southwest coast." },
  { name: "Bang Por", zone: "Northwest", tag: "Local · Long & quiet", vibe: "quiet", grad: ["#6a994e", "#386641"],
    desc: "A long, local stretch the crowds skip. Shallow reef at low tide, sunset views to Koh Phangan and some of the island's best-value beachfront rentals.",
    bestFor: "Long stays, remote workers, local food",
    slugQ: "Tell me about Bang Por Beach — is it good for a quiet long stay?" },
  { name: "Laem Set", zone: "South", tag: "Secluded · Reef", vibe: "hidden",
    grad: ["#7678ed", "#3d348b"],
    desc: "The quiet south — reef-protected water, no bars, no jet skis. Near the Samui Aquarium and Laem Sor Pagoda; a different, slower Samui.",
    bestFor: "Total quiet, snorkelers, culture nearby",
    slugQ: "Tell me about Laem Set Beach and the quiet south coast of Koh Samui." },
];
