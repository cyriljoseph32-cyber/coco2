import React, { useState, useEffect, useRef, useCallback } from "react";

/* ─── DESIGN TOKENS ─────────────────────────────────────────────────────── */
const C = {
tealDeep: "#0B3535", teal: "#1B6B6B", tealMid: "#155555",
tealLight: "#2A9090", tealPale: "#E8F5F5",
coral: "#E8724A", coralLight: "#F4956D",
sand: "#E8C97A", sandLight: "#F5E3A8",
cream: "#FAF3E6", white: "#FFFFFF",
textDark: "#1A2E2E", textMid: "#3D6060", textLight: "#6B9090",
border: "#C5E0E0",
};

/* ─── COPY (FR / EN) ────────────────────────────────────────────────────── */
const T = {
fr: {
nav_demo: "Voir la démo", nav_hotels: "Hôtels partenaires", nav_pricing: "Tarifs",
hero_tag: "Intelligence locale • Koh Samui",
hero_h1: "Votre concierge IA local\nsur Koh Samui 🥥",
hero_sub: "Coco connaît chaque plage, chaque restaurant, chaque site de plongée. Disponible 24h/24, en 6 langues, prêt à s'intégrer sur votre site hôtelier.",
hero_cta1: "Essayer Coco gratuitement", hero_cta2: "Pour les hôtels →",
stats: [
{ n: "42", l: "hôtels répertoriés" }, { n: "48", l: "restaurants" },
{ n: "15", l: "sites de plongée" }, { n: "6", l: "langues" },
],
feat_h2: "Tout ce que Coco sait faire",
features: [
{ icon: "🤿", t: "Expert plongée local", d: "Sail Rock, Chumphon Pinnacle, 15 sites de plongée — conseils d'instructeur PADI professionnel." },
{ icon: "🌦️", t: "Météo adaptative", d: "Si la mer est agitée, Coco bascule automatiquement vers spa, temples et cours de cuisine." },
{ icon: "👨‍👩‍👧", t: "Profils sur mesure", d: "Famille avec enfants, lune de miel, solo aventurier — recommandations personnalisées en temps réel." },
{ icon: "💬", t: "6 langues", d: "Français, English, Русский, Deutsch, Svenska, 中文 — détection automatique de la langue." },
{ icon: "🏨", t: "Widget hôtel blanc", d: "3 lignes de code pour intégrer Coco sur votre site. Couleurs et nom personnalisables." },
{ icon: "📊", t: "Leads trackés", d: "Chaque réservation générée est tracée. Rapport mensuel inclus dans l'abonnement." },
],
demo_h2: "Essayez Coco maintenant",
demo_sub: "Posez n'importe quelle question sur Koh Samui — plages, hôtels, plongée, restaurants, itinéraires...",
demo_placeholder: "Ex: Je cherche un hotel romantique avec vue mer...",
hotels_h2: "Pour les hôtels & resorts",
hotels_sub: "Offrez à vos clients un concierge IA disponible 24h/24, multilingue, qui connaît Samui comme un local.",
hotels_features: [
"Widget intégrable en 3 lignes de code",
"Couleurs et nom de votre marque",
"Recommandations prioritaires pour votre hôtel",
"Rapport mensuel des leads générés",
"Support WhatsApp prioritaire",
"Essai gratuit 14 jours — sans engagement",
],
hotels_price: "3 500 THB / mois",
hotels_cta: "Demander une démo →",
how_h2: "Comment ça marche",
steps: [
{ n: "1", t: "Votre client arrive", d: "Un voyageur visite votre site hôtelier. Il voit le widget Coco en bas à droite." },
{ n: "2", t: "Il pose sa question", d: "\"Où dîner romantique ce soir ?\" — Coco répond instantanément en 6 langues." },
{ n: "3", t: "Coco recommande", d: "Basé sur le profil, la météo, la saison — 3 recommandations personnalisées avec prix en THB." },
{ n: "4", t: "Vous mesurez", d: "Chaque interaction trackée. Rapport mensuel avec leads et satisfactions." },
],
pricing_h2: "Tarifs simples",
plans: [
{ name: "Essai", price: "Gratuit", duration: "14 jours", features: ["Widget full fonctionnel", "50 conversations incluses", "Support email"], cta: "Démarrer l'essai", highlight: false },
{ name: "Partenaire", price: "3 500 THB", duration: "/ mois", features: ["Conversations illimitées", "6 langues", "Widget marque blanche", "Rapport mensuel leads", "Support WhatsApp prioritaire"], cta: "Contacter →", highlight: true },
{ name: "Sur mesure", price: "Nous contacter", duration: "", features: ["Réseau d'hôtels", "API directe", "Intégrations sur mesure", "SLA garanti"], cta: "Discutons →", highlight: false },
],
faq_h2: "Questions fréquentes",
faqs: [
{ q: "Coco parle-t-il vraiment 6 langues ?", a: "Oui — français, anglais, russe, allemand, suédois, chinois. Détection automatique dès le premier message." },
{ q: "Faut-il des compétences techniques pour intégrer le widget ?", a: "Non. Un copier-coller de 3 lignes de HTML suffit. Nous gérons tout le reste." },
{ q: "Les données de mes clients sont-elles protégées ?", a: "Coco ne stocke aucune donnée personnelle. Les conversations ne sont pas archivées." },
{ q: "Que se passe-t-il à la fin des 14 jours d'essai ?", a: "Le widget se désactive automatiquement. Aucune facturation sans votre accord." },
],
footer_tagline: "L'intelligence locale de Koh Samui",
footer_contact: "Contact & partenariats :",
cta_final_h2: "Prêt à offrir une expérience locale à vos clients ?",
cta_final_sub: "Essai gratuit 14 jours — aucune carte bancaire requise.",
cta_final_btn: "Démarrer maintenant →",
},
en: {
nav_demo: "Try demo", nav_hotels: "Hotel partners", nav_pricing: "Pricing",
hero_tag: "Local intelligence • Koh Samui",
hero_h1: "Your local AI concierge\non Koh Samui 🥥",
hero_sub: "Coco knows every beach, restaurant, and dive site. Available 24/7 in 6 languages, ready to embed on your hotel website.",
hero_cta1: "Try Coco for free", hero_cta2: "For hotels →",
stats: [
{ n: "42", l: "listed hotels" }, { n: "48", l: "restaurants" },
{ n: "15", l: "dive sites" }, { n: "6", l: "languages" },
],
feat_h2: "Everything Coco knows",
features: [
{ icon: "🤿", t: "Local dive expert", d: "Sail Rock, Chumphon Pinnacle, 15 dive sites — advice from a professional PADI instructor." },
{ icon: "🌦️", t: "Weather-adaptive", d: "If the sea is rough, Coco automatically pivots to spas, temples and cooking classes." },
{ icon: "👨‍👩‍👧", t: "Personalized profiles", d: "Family with kids, honeymoon, solo adventure — tailored recommendations in real time." },
{ icon: "💬", t: "6 languages", d: "French, English, Russian, German, Swedish, Chinese — automatic language detection." },
{ icon: "🏨", t: "White-label widget", d: "3 lines of code to embed Coco on your site. Colors and name fully customizable." },
{ icon: "📊", t: "Lead tracking", d: "Every referral tracked. Monthly report included in your subscription." },
],
demo_h2: "Try Coco now",
demo_sub: "Ask anything about Koh Samui — beaches, hotels, diving, restaurants, itineraries...",
demo_placeholder: "E.g. I'm looking for a romantic sea-view hotel...",
hotels_h2: "For hotels & resorts",
hotels_sub: "Give your guests a 24/7 multilingual AI concierge that knows Samui like a local.",
hotels_features: [
"Embeddable widget in 3 lines of code",
"Your brand colors and name",
"Priority recommendations for your hotel",
"Monthly lead generation report",
"Priority WhatsApp support",
"Free 14-day trial — no commitment",
],
hotels_price: "3,500 THB / month",
hotels_cta: "Request a demo →",
how_h2: "How it works",
steps: [
{ n: "1", t: "Guest arrives", d: "A traveler visits your hotel website. They see the Coco widget in the bottom right." },
{ n: "2", t: "They ask a question", d: "\"Where to have a romantic dinner?\" — Coco answers instantly in 6 languages." },
{ n: "3", t: "Coco recommends", d: "Based on profile, weather, season — 3 personalized recommendations with prices in THB." },
{ n: "4", t: "You measure", d: "Every interaction tracked. Monthly report with leads and satisfaction scores." },
],
pricing_h2: "Simple pricing",
plans: [
{ name: "Trial", price: "Free", duration: "14 days", features: ["Fully functional widget", "50 conversations included", "Email support"], cta: "Start trial", highlight: false },
{ name: "Partner", price: "3,500 THB", duration: "/ month", features: ["Unlimited conversations", "6 languages", "White-label widget", "Monthly leads report", "Priority WhatsApp support"], cta: "Contact →", highlight: true },
{ name: "Custom", price: "Contact us", duration: "", features: ["Hotel groups", "Direct API", "Custom integrations", "Guaranteed SLA"], cta: "Let's talk →", highlight: false },
],
faq_h2: "Frequently asked questions",
faqs: [
{ q: "Does Coco really speak 6 languages?", a: "Yes — French, English, Russian, German, Swedish, Chinese. Auto-detected from the very first message." },
{ q: "Do I need technical skills to add the widget?", a: "No. A simple 3-line HTML paste. We handle everything else." },
{ q: "Is my guests' data protected?", a: "Coco stores no personal data. Conversations are not archived." },
{ q: "What happens after the 14-day trial?", a: "The widget deactivates automatically. No billing without your agreement." },
],
footer_tagline: "Koh Samui's local intelligence",
footer_contact: "Contact & partnerships:",
cta_final_h2: "Ready to give guests a local experience?",
cta_final_sub: "Free 14-day trial — no credit card required.",
cta_final_btn: "Get started →",
},
};

type TDict = typeof T.fr;

/* ─── UTILS ────────────────────────────────────────────────────────────── */
function useInView(threshold = 0.15) {
const ref = useRef(null);
const [visible, setVisible] = useState(false);
useEffect(() => {
const obs = new IntersectionObserver(([e]) => e.isIntersecting && setVisible(true), { threshold });
if (ref.current) obs.observe(ref.current);
return () => obs.disconnect();
}, [threshold]);
return [ref, visible];
}

function FadeIn({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
const [ref, visible] = useInView();
return (
<div ref={ref as React.RefObject<HTMLDivElement>} className={className} style={{
opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(28px)",
transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms`,
}}>{children}</div>
);
}

/* ─── ICONS ────────────────────────────────────────────────────────────── */
const CocoMark = ({ size = 44 }: { size?: number }) => (
<svg width={size} height={size} viewBox="0 0 44 44" fill="none">
<circle cx="22" cy="22" r="22" fill={C.teal} />
<path d="M22 8 C16 8 12 14 13 20 C14 26 18 30 22 34 C26 30 30 26 31 20 C32 14 28 8 22 8Z" fill={C.sandLight} />
<circle cx="22" cy="21" r="4" fill={C.teal} />
<circle cx="18" cy="12" r="2.5" fill={C.teal} />
<circle cx="26" cy="12" r="2.5" fill={C.teal} />
</svg>
);

const Send = ({ size = 18 }: { size?: number }) => (
<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
<line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
</svg>
);

/* ─── CHAT COMPONENT ────────────────────────────────────────────────────── */
function CocoChat({ t }: { t: TDict }) {
const [messages, setMessages] = useState([
{ role: "assistant", content: "Bonjour ! Je suis Coco 🥥 Votre guide local sur Koh Samui 🌴\n\nJe connais chaque plage secrète, les meilleurs restos, sites de plongée et hôtels. Combien de temps restez-vous ? Êtes-vous en couple, en famille, ou en solo ?" }
]);
const [input, setInput] = useState("");
const [loading, setLoading] = useState(false);
const [error, setError] = useState<string | null>(null);
const endRef = useRef<HTMLDivElement>(null);
const inputRef = useRef<HTMLInputElement>(null);

useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

const send = useCallback(async (text?: string) => {
const msg = text || input.trim();
if (!msg || loading) return;
setInput("");
setError(null);
const next = [...messages, { role: "user", content: msg }];
setMessages(next);
setLoading(true);
try {
const res = await fetch("/api/chat", {
method: "POST",
headers: { "Content-Type": "application/json" },
body: JSON.stringify({ messages: next }),
});
const data = await res.json();
if (!res.ok) throw new Error(data.error || "Error");
const reply = data?.content?.[0]?.text || "...";
setMessages(m => [...m, { role: "assistant", content: reply }]);
} catch (e) {
setError("Service momentanément indisponible. Réessayez dans quelques secondes.");
} finally {
setLoading(false);
setTimeout(() => inputRef.current?.focus(), 100);
}
}, [input, messages, loading]);

const handleKey = (e: React.KeyboardEvent<HTMLInputElement>) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } };

const quickReplies = [
"🏖️ Meilleures plages ?", "🤿 Plongée Sail Rock ?", "🍜 Top restaurants ?", "🗺️ Itinéraire 7 jours"
];

return (
<div style={{ background: C.white, borderRadius: 20, overflow: "hidden", boxShadow: "0 8px 40px rgba(11,53,53,.15)", border: `1px solid ${C.border}`, maxWidth: 560, margin: "0 auto" }}>
{/* Header */}
<div style={{ background: `linear-gradient(135deg, ${C.teal}, ${C.tealDeep})`, padding: "16px 20px", display: "flex", alignItems: "center", gap: 12 }}>
<CocoMark size={38} />
<div>
<div style={{ color: C.white, fontWeight: 700, fontSize: 16, fontFamily: "Cormorant Garamond, serif", letterSpacing: ".5px" }}>Coco 🥥</div>
<div style={{ color: C.tealPale, fontSize: 12 }}>Guide local Koh Samui • En ligne</div>
</div>
<div style={{ marginLeft: "auto", width: 8, height: 8, borderRadius: "50%", background: "#4ADE80", boxShadow: "0 0 6px #4ADE80" }} />
</div>

{/* Messages */}
<div style={{ height: 360, overflowY: "auto", padding: "16px 16px 8px", display: "flex", flexDirection: "column", gap: 12, background: C.tealPale }}>
{messages.map((m, i) => (
<div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start", alignItems: "flex-end", gap: 8 }}>
{m.role === "assistant" && <CocoMark size={28} />}
<div style={{
background: m.role === "user" ? `linear-gradient(135deg, ${C.teal}, ${C.tealLight})` : C.white,
color: m.role === "user" ? C.white : C.textDark,
padding: "10px 14px", borderRadius: m.role === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
maxWidth: "78%", fontSize: 14, lineHeight: 1.55, whiteSpace: "pre-wrap",
boxShadow: "0 2px 8px rgba(0,0,0,.08)"
}}>{m.content}</div>
</div>
))}
{loading && (
<div style={{ display: "flex", alignItems: "flex-end", gap: 8 }}>
<CocoMark size={28} />
<div style={{ background: C.white, padding: "10px 16px", borderRadius: "16px 16px 16px 4px", display: "flex", gap: 5 }}>
{[0, 1, 2].map(i => <div key={i} style={{ width: 7, height: 7, borderRadius: "50%", background: C.tealLight, animation: `bounce 1.2s ${i * 0.2}s infinite` }} />)}
</div>
</div>
)}
{error && <div style={{ background: "#FFF3F0", border: "1px solid #F4B8A8", color: "#C0503A", padding: "8px 12px", borderRadius: 8, fontSize: 13 }}>{error}</div>}
<div ref={endRef} />
</div>

{/* Quick replies */}
{messages.length < 3 && (
<div style={{ padding: "8px 12px 0", display: "flex", gap: 6, flexWrap: "wrap", background: C.tealPale }}>
{quickReplies.map(q => (
<button key={q} onClick={() => send(q)} style={{ background: C.white, border: `1px solid ${C.border}`, color: C.teal, padding: "5px 10px", borderRadius: 20, fontSize: 12, cursor: "pointer", whiteSpace: "nowrap" }}>
{q}
</button>
))}
</div>
)}

{/* Input */}
<div style={{ padding: "12px 12px 14px", background: C.white, borderTop: `1px solid ${C.border}`, display: "flex", gap: 8, alignItems: "center" }}>
<input
ref={inputRef}
value={input}
onChange={e => setInput(e.target.value)}
onKeyDown={handleKey}
placeholder={t.demo_placeholder}
style={{ flex: 1, border: `1.5px solid ${C.border}`, borderRadius: 24, padding: "10px 16px", fontSize: 14, outline: "none", background: C.tealPale, color: C.textDark, fontFamily: "DM Sans, sans-serif" }}
/>
<button
onClick={() => send()}
disabled={!input.trim() || loading}
style={{ width: 40, height: 40, borderRadius: "50%", background: input.trim() ? `linear-gradient(135deg, ${C.coral}, ${C.coralLight})` : C.border, border: "none", cursor: input.trim() ? "pointer" : "default", display: "flex", alignItems: "center", justifyContent: "center", color: C.white, transition: "all .2s" }}
>
<Send size={16} />
</button>
</div>

<style>{`@keyframes bounce { 0%,80%,100%{transform:scale(0)} 40%{transform:scale(1)} }`}</style>
</div>
);
}

/* ─── MAIN LANDING ──────────────────────────────────────────────────────── */
export default function CocoLanding() {
const [lang, setLang] = useState("fr");
const t = T[lang as keyof typeof T];
const wa = "https://wa.me/66633753316?text=" + encodeURIComponent(lang === "fr" ? "Bonjour ! Je voudrais en savoir plus sur Coco AI Concierge pour mon hôtel." : "Hello! I'd like to learn more about Coco AI Concierge for my hotel.");

const scrollTo = (id: string) => { document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }); };

return (
<div style={{ fontFamily: "DM Sans, sans-serif", color: C.textDark, background: C.cream, overflowX: "hidden" }}>
<style>{`
* { box-sizing: border-box; margin: 0; padding: 0; }
body { background: ${C.cream}; }
a { text-decoration: none; }
button { cursor: pointer; }
h1,h2,h3 { font-family: 'Cormorant Garamond', serif; }
::-webkit-scrollbar { width: 6px; } ::-webkit-scrollbar-thumb { background: ${C.border}; border-radius: 3px; }
@media (max-width: 768px) {
.hero-grid { grid-template-columns: 1fr !important; }
.hotels-grid { grid-template-columns: 1fr !important; }
.stats-grid { grid-template-columns: 1fr 1fr !important; }
}
`}</style>

{/* ── NAV ─────────────────────────────────────────────────────── */}
<nav style={{ position: "sticky", top: 0, zIndex: 100, background: "rgba(250,243,230,.96)", backdropFilter: "blur(12px)", borderBottom: `1px solid ${C.border}`, padding: "0 24px" }}>
<div style={{ maxWidth: 1100, margin: "0 auto", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
<div style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }} onClick={() => scrollTo("hero")}>
<CocoMark size={36} />
<span style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 22, fontWeight: 700, color: C.tealDeep, letterSpacing: ".5px" }}>Coco</span>
<span style={{ fontSize: 11, background: C.tealPale, color: C.teal, border: `1px solid ${C.border}`, borderRadius: 20, padding: "2px 8px", fontWeight: 600 }}>Samui AI</span>
</div>
<div style={{ display: "flex", alignItems: "center", gap: 8 }}>
<div style={{ display: "flex", gap: 4, background: C.tealPale, borderRadius: 20, padding: 3, marginRight: 6 }}>
{["fr","en"].map(l => (
<button key={l} onClick={() => setLang(l)} style={{ padding: "4px 12px", borderRadius: 16, border: "none", background: lang === l ? C.teal : "transparent", color: lang === l ? C.white : C.tealMid, fontWeight: 600, fontSize: 12, transition: "all .2s" }}>
{l.toUpperCase()}
</button>
))}
</div>
<button onClick={() => scrollTo("demo")} style={{ padding: "8px 16px", borderRadius: 20, background: "transparent", border: `1.5px solid ${C.teal}`, color: C.teal, fontWeight: 600, fontSize: 13 }}>
{t.nav_demo}
</button>
<a href={wa} target="_blank" rel="noopener noreferrer"
style={{ padding: "8px 18px", borderRadius: 20, background: `linear-gradient(135deg, ${C.coral}, ${C.coralLight})`, color: C.white, fontWeight: 700, fontSize: 13 }}>
{t.nav_hotels}
</a>
</div>
</div>
</nav>

{/* ── HERO ────────────────────────────────────────────────────── */}
<section id="hero" style={{ minHeight: "90vh", display: "flex", alignItems: "center", background: `linear-gradient(160deg, ${C.tealDeep} 0%, ${C.tealMid} 55%, ${C.teal} 100%)`, padding: "80px 24px 60px", position: "relative", overflow: "hidden" }}>
<div style={{ position: "absolute", top: -100, right: -100, width: 600, height: 600, borderRadius: "50%", background: "rgba(255,255,255,.03)", pointerEvents: "none" }} />
<div style={{ position: "absolute", bottom: -80, left: -80, width: 400, height: 400, borderRadius: "50%", background: "rgba(232,200,122,.06)", pointerEvents: "none" }} />

<div className="hero-grid" style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "center", width: "100%" }}>
<div>
<FadeIn>
<div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,.12)", border: "1px solid rgba(255,255,255,.2)", borderRadius: 24, padding: "6px 16px", marginBottom: 24 }}>
<span style={{ width: 8, height: 8, borderRadius: "50%", background: "#4ADE80", display: "inline-block" }} />
<span style={{ color: C.sandLight, fontSize: 13, fontWeight: 600 }}>{t.hero_tag}</span>
</div>
</FadeIn>
<FadeIn delay={100}>
<h1 style={{ fontSize: "clamp(36px,5vw,58px)", fontWeight: 700, color: C.white, lineHeight: 1.1, marginBottom: 24, whiteSpace: "pre-line" }}>{t.hero_h1}</h1>
</FadeIn>
<FadeIn delay={200}>
<p style={{ fontSize: 18, color: "rgba(255,255,255,.8)", lineHeight: 1.7, marginBottom: 36, maxWidth: 480 }}>{t.hero_sub}</p>
</FadeIn>
<FadeIn delay={300}>
<div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
<button onClick={() => scrollTo("demo")} style={{ padding: "14px 28px", borderRadius: 30, background: `linear-gradient(135deg, ${C.coral}, ${C.coralLight})`, color: C.white, fontWeight: 700, fontSize: 15, border: "none", boxShadow: "0 4px 20px rgba(232,114,74,.4)" }}>
{t.hero_cta1}
</button>
<a href={wa} target="_blank" rel="noopener noreferrer" style={{ padding: "14px 28px", borderRadius: 30, background: "transparent", border: "2px solid rgba(255,255,255,.4)", color: C.white, fontWeight: 700, fontSize: 15 }}>
{t.hero_cta2}
</a>
</div>
</FadeIn>
</div>

<FadeIn delay={200}>
<div className="stats-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
{t.stats.map((s, i) => (
<div key={i} style={{ background: "rgba(255,255,255,.1)", border: "1px solid rgba(255,255,255,.15)", borderRadius: 16, padding: "24px 20px", textAlign: "center", backdropFilter: "blur(8px)" }}>
<div style={{ fontSize: 42, fontFamily: "Cormorant Garamond, serif", fontWeight: 700, color: C.sandLight, lineHeight: 1 }}>{s.n}</div>
<div style={{ fontSize: 13, color: "rgba(255,255,255,.7)", marginTop: 6 }}>{s.l}</div>
</div>
))}
</div>
</FadeIn>
</div>
</section>

{/* ── FEATURES ────────────────────────────────────────────────── */}
<section style={{ padding: "80px 24px", background: C.cream }}>
<div style={{ maxWidth: 1100, margin: "0 auto" }}>
<FadeIn>
<h2 style={{ fontSize: "clamp(28px,4vw,42px)", textAlign: "center", color: C.tealDeep, marginBottom: 12 }}>{t.feat_h2}</h2>
<p style={{ textAlign: "center", color: C.textLight, marginBottom: 56, fontSize: 16 }}>Une connaissance locale exhaustive, disponible 24h/24</p>
</FadeIn>
<div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24 }}>
{t.features.map((f, i) => (
<FadeIn key={i} delay={i * 80}>
<div style={{ background: C.white, borderRadius: 16, padding: "28px 24px", border: `1px solid ${C.border}`, transition: "box-shadow .2s", height: "100%" }}
onMouseEnter={(e: React.MouseEvent<HTMLDivElement>) => (e.currentTarget.style.boxShadow = "0 8px 30px rgba(11,53,53,.1)")}
onMouseLeave={(e: React.MouseEvent<HTMLDivElement>) => (e.currentTarget.style.boxShadow = "none")}>
<div style={{ fontSize: 36, marginBottom: 14 }}>{f.icon}</div>
<h3 style={{ fontSize: 18, fontWeight: 700, color: C.tealDeep, marginBottom: 10, fontFamily: "Cormorant Garamond, serif" }}>{f.t}</h3>
<p style={{ fontSize: 14, color: C.textMid, lineHeight: 1.65 }}>{f.d}</p>
</div>
</FadeIn>
))}
</div>
</div>
</section>

{/* ── DEMO ────────────────────────────────────────────────────── */}
<section id="demo" style={{ padding: "80px 24px", background: `linear-gradient(180deg, ${C.tealPale} 0%, ${C.cream} 100%)` }}>
<div style={{ maxWidth: 1100, margin: "0 auto" }}>
<FadeIn>
<h2 style={{ fontSize: "clamp(28px,4vw,42px)", textAlign: "center", color: C.tealDeep, marginBottom: 12 }}>{t.demo_h2}</h2>
<p style={{ textAlign: "center", color: C.textLight, marginBottom: 48, fontSize: 16 }}>{t.demo_sub}</p>
</FadeIn>
<FadeIn delay={100}><CocoChat t={t} /></FadeIn>
</div>
</section>

{/* ── HOW IT WORKS ────────────────────────────────────────────── */}
<section style={{ padding: "80px 24px", background: C.cream }}>
<div style={{ maxWidth: 1100, margin: "0 auto" }}>
<FadeIn>
<h2 style={{ fontSize: "clamp(28px,4vw,42px)", textAlign: "center", color: C.tealDeep, marginBottom: 56 }}>{t.how_h2}</h2>
</FadeIn>
<div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 32 }}>
{t.steps.map((s, i) => (
<FadeIn key={i} delay={i * 100}>
<div style={{ textAlign: "center", padding: "0 12px" }}>
<div style={{ width: 56, height: 56, borderRadius: "50%", background: `linear-gradient(135deg, ${C.teal}, ${C.tealLight})`, color: C.white, fontSize: 22, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", fontFamily: "Cormorant Garamond, serif" }}>{s.n}</div>
<h3 style={{ fontSize: 18, color: C.tealDeep, marginBottom: 10, fontFamily: "Cormorant Garamond, serif" }}>{s.t}</h3>
<p style={{ fontSize: 14, color: C.textMid, lineHeight: 1.65 }}>{s.d}</p>
</div>
</FadeIn>
))}
</div>
</div>
</section>

{/* ── HOTELS B2B ──────────────────────────────────────────────── */}
<section id="hotels" style={{ padding: "80px 24px", background: `linear-gradient(135deg, ${C.tealDeep} 0%, ${C.teal} 100%)` }}>
<div className="hotels-grid" style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "center" }}>
<FadeIn>
<div style={{ display: "inline-flex", background: "rgba(255,255,255,.15)", borderRadius: 20, padding: "4px 14px", marginBottom: 16 }}>
<span style={{ color: C.sandLight, fontSize: 12, fontWeight: 700 }}>🏨 PARTENARIATS HÔTELS</span>
</div>
<h2 style={{ fontSize: "clamp(28px,4vw,44px)", color: C.white, marginBottom: 16, lineHeight: 1.1 }}>{t.hotels_h2}</h2>
<p style={{ color: "rgba(255,255,255,.8)", fontSize: 17, lineHeight: 1.7, marginBottom: 32 }}>{t.hotels_sub}</p>
<ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 12, marginBottom: 36 }}>
{t.hotels_features.map((f, i) => (
<li key={i} style={{ display: "flex", alignItems: "center", gap: 12, color: "rgba(255,255,255,.9)", fontSize: 15 }}>
<span style={{ width: 22, height: 22, borderRadius: "50%", background: C.coral, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, flexShrink: 0 }}>✓</span>
{f}
</li>
))}
</ul>
<div style={{ display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
<div style={{ fontSize: 28, fontFamily: "Cormorant Garamond, serif", fontWeight: 700, color: C.sandLight }}>{t.hotels_price}</div>
<a href={wa} target="_blank" rel="noopener noreferrer"
style={{ padding: "12px 24px", borderRadius: 24, background: `linear-gradient(135deg, ${C.coral}, ${C.coralLight})`, color: C.white, fontWeight: 700, fontSize: 15 }}>
{t.hotels_cta}
</a>
</div>
</FadeIn>

<FadeIn delay={150}>
<div style={{ background: C.white, borderRadius: 20, padding: "28px 24px", boxShadow: "0 20px 60px rgba(0,0,0,.2)" }}>
<div style={{ fontSize: 13, color: C.textLight, marginBottom: 16, fontWeight: 600 }}>INTÉGRATION 3 LIGNES</div>
<pre style={{ background: C.tealDeep, borderRadius: 12, padding: "16px 18px", fontSize: 12, color: "#88D4D4", overflowX: "auto", lineHeight: 1.7 }}>{`<script
src="https://coco-samui.vercel.app/widget.js"
data-hotel-id="VOTRE_ID"
data-lang="fr"
data-color="${C.teal}">
</script>`}</pre>
<div style={{ marginTop: 20, display: "flex", gap: 10 }}>
{["🇫🇷","🇬🇧","🇷🇺","🇩🇪","🇸🇪","🇨🇳"].map(f => <span key={f} style={{ fontSize: 22 }}>{f}</span>)}
</div>
<div style={{ marginTop: 12, fontSize: 13, color: C.textLight }}>Langues supportées — détection automatique</div>
<div style={{ marginTop: 20, padding: "14px 16px", background: C.tealPale, borderRadius: 12, display: "flex", gap: 12, alignItems: "center" }}>
<span style={{ fontSize: 28 }}>🥥</span>
<div>
<div style={{ fontSize: 14, fontWeight: 700, color: C.tealDeep }}>Essai 14 jours gratuit</div>
<div style={{ fontSize: 12, color: C.textLight }}>Sans carte bancaire • Sans engagement</div>
</div>
</div>
</div>
</FadeIn>
</div>
</section>

{/* ── PRICING ─────────────────────────────────────────────────── */}
<section id="pricing" style={{ padding: "80px 24px", background: C.cream }}>
<div style={{ maxWidth: 1100, margin: "0 auto" }}>
<FadeIn>
<h2 style={{ fontSize: "clamp(28px,4vw,42px)", textAlign: "center", color: C.tealDeep, marginBottom: 48 }}>{t.pricing_h2}</h2>
</FadeIn>
<div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24, alignItems: "stretch" }}>
{t.plans.map((p, i) => (
<FadeIn key={i} delay={i * 100}>
<div style={{
background: p.highlight ? `linear-gradient(160deg, ${C.teal}, ${C.tealDeep})` : C.white,
borderRadius: 20, padding: "32px 28px",
border: p.highlight ? "none" : `1.5px solid ${C.border}`,
boxShadow: p.highlight ? "0 20px 50px rgba(11,53,53,.2)" : "none",
display: "flex", flexDirection: "column",
transform: p.highlight ? "scale(1.04)" : "scale(1)", position: "relative",
}}>
{p.highlight && <div style={{ position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)", background: C.coral, color: C.white, padding: "4px 16px", borderRadius: 20, fontSize: 12, fontWeight: 700, whiteSpace: "nowrap" }}>⭐ RECOMMANDÉ</div>}
<div style={{ fontSize: 15, fontWeight: 700, color: p.highlight ? C.sandLight : C.textMid, marginBottom: 8 }}>{p.name}</div>
<div style={{ fontSize: 36, fontFamily: "Cormorant Garamond, serif", fontWeight: 700, color: p.highlight ? C.white : C.tealDeep, lineHeight: 1 }}>{p.price}</div>
<div style={{ fontSize: 14, color: p.highlight ? "rgba(255,255,255,.7)" : C.textLight, marginBottom: 28 }}>{p.duration}</div>
<ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 10, marginBottom: 32, flex: 1 }}>
{p.features.map((f, j) => (
<li key={j} style={{ display: "flex", gap: 10, fontSize: 14, color: p.highlight ? "rgba(255,255,255,.9)" : C.textMid, alignItems: "flex-start" }}>
<span style={{ color: p.highlight ? C.sandLight : C.coral, flexShrink: 0, marginTop: 1 }}>✓</span>
{f}
</li>
))}
</ul>
<a href={wa} target="_blank" rel="noopener noreferrer" style={{
padding: "12px 20px", borderRadius: 24, fontWeight: 700, fontSize: 14, textAlign: "center",
background: p.highlight ? `linear-gradient(135deg, ${C.coral}, ${C.coralLight})` : "transparent",
border: p.highlight ? "none" : `1.5px solid ${C.teal}`,
color: p.highlight ? C.white : C.teal,
}}>{p.cta}</a>
</div>
</FadeIn>
))}
</div>
</div>
</section>

{/* ── FAQ ─────────────────────────────────────────────────────── */}
<section style={{ padding: "60px 24px", background: C.tealPale }}>
<div style={{ maxWidth: 800, margin: "0 auto" }}>
<FadeIn>
<h2 style={{ fontSize: "clamp(24px,3.5vw,38px)", textAlign: "center", color: C.tealDeep, marginBottom: 40 }}>{t.faq_h2}</h2>
</FadeIn>
<div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
{t.faqs.map((f, i) => (
<FadeIn key={i} delay={i * 80}>
<div style={{ background: C.white, borderRadius: 14, padding: "20px 24px", border: `1px solid ${C.border}` }}>
<div style={{ fontWeight: 700, color: C.tealDeep, marginBottom: 8, fontSize: 15 }}>{f.q}</div>
<div style={{ color: C.textMid, fontSize: 14, lineHeight: 1.65 }}>{f.a}</div>
</div>
</FadeIn>
))}
</div>
</div>
</section>

{/* ── CTA FINAL ───────────────────────────────────────────────── */}
<section style={{ padding: "80px 24px", background: `linear-gradient(135deg, ${C.tealDeep} 0%, ${C.teal} 100%)`, textAlign: "center" }}>
<FadeIn>
<h2 style={{ fontSize: "clamp(28px,4.5vw,52px)", color: C.white, marginBottom: 16, lineHeight: 1.1 }}>{t.cta_final_h2}</h2>
<p style={{ fontSize: 17, color: "rgba(255,255,255,.8)", marginBottom: 36 }}>{t.cta_final_sub}</p>
<div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
<a href={wa} target="_blank" rel="noopener noreferrer"
style={{ padding: "16px 36px", borderRadius: 32, background: `linear-gradient(135deg, ${C.coral}, ${C.coralLight})`, color: C.white, fontWeight: 700, fontSize: 16, boxShadow: "0 8px 30px rgba(232,114,74,.4)" }}>
{t.cta_final_btn}
</a>
<button onClick={() => scrollTo("demo")}
style={{ padding: "16px 36px", borderRadius: 32, background: "transparent", border: "2px solid rgba(255,255,255,.4)", color: C.white, fontWeight: 700, fontSize: 16 }}>
{t.nav_demo}
</button>
</div>
<div style={{ marginTop: 40, color: "rgba(255,255,255,.6)", fontSize: 14 }}>
📞 WhatsApp: <a href={wa} target="_blank" rel="noopener noreferrer" style={{ color: C.sandLight }}>+66 633 753 316</a>
&nbsp;•&nbsp; {t.footer_contact} <a href="mailto:CYRIL.JOSEPH32@gmail.com" style={{ color: C.sandLight }}>CYRIL.JOSEPH32@gmail.com</a>
</div>
</FadeIn>
</section>

{/* ── FOOTER ──────────────────────────────────────────────────── */}
<footer style={{ background: C.tealDeep, padding: "28px 24px", textAlign: "center" }}>
<div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 8 }}>
<CocoMark size={28} />
<span style={{ fontFamily: "Cormorant Garamond, serif", color: C.white, fontWeight: 700, fontSize: 18 }}>Coco</span>
</div>
<p style={{ color: "rgba(255,255,255,.5)", fontSize: 13 }}>{t.footer_tagline} • Koh Samui, Thailand 🌴</p>
<p style={{ color: "rgba(255,255,255,.35)", fontSize: 12, marginTop: 6 }}>© 2026 Coconut Projects — Cyril Joseph</p>
</footer>

{/* WhatsApp floating button */}
<a href={wa} target="_blank" rel="noopener noreferrer"
style={{ position: "fixed", bottom: 24, right: 24, zIndex: 999, width: 56, height: 56, borderRadius: "50%", background: "#25D366", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 20px rgba(37,211,102,.4)", fontSize: 26 }}>
💬
</a>
</div>
);
}
