export const SITE = {
  name: "Coco — AI Concierge Koh Samui",
  url: "https://coco-samui-ai.com",
  email: "hello@coco-samui-ai.com",
  whatsapp: "+66633753316",
  whatsappDisplay: "+66 633 753 316",
  waLink: (text: string) => `https://wa.me/66633753316?text=${encodeURIComponent(text)}`,
  languages: ["EN", "FR", "DE", "SV", "TH", "中文"],
  hotelPriceTHB: "3,500",
  founder: {
    name: "Cyril Joseph",
    title: "PADI Dive Instructor & Founder",
    perks: ["PADI Dive Instructor", "3,000+ dives · Gulf of Thailand", "Based on Koh Samui", "English & French spoken"],
  },
  stats: [
    { n: "40+", l: "Hotels" },
    { n: "15+", l: "Dive sites" },
    { n: "50+", l: "Restaurants" },
    { n: "30+", l: "Activities" },
    { n: "12", l: "Beaches" },
    { n: "6", l: "Languages" },
  ],
} as const;

export const NAV_LINKS = [
  { href: "/explore", label: "Explore" },
  { href: "/experiences", label: "Experiences" },
  { href: "/beaches", label: "Beaches" },
  { href: "/guide", label: "Guide" },
  { href: "/how-it-works", label: "How it works" },
] as const;
