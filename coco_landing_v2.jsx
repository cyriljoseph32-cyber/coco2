import { useState, useEffect, useRef, useCallback } from "react";

// ─── DESIGN TOKENS ───────────────────────────────────────────────
const C = {
  tealDeep: "#0B3535", teal: "#1B6B6B", tealMid: "#155555",
  tealLight: "#2A9090", coral: "#E8724A", coralLight: "#F0957A",
  sand: "#E8C97A", sandLight: "#F5E4A8", cream: "#FAF3E6",
  creamDark: "#F0E6D0", white: "#FFFFFF", charcoal: "#1A1A1A",
  muted: "#8A7B6A", mutedLight: "#B5A898",
};

const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,300;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');`;

// ─── COCO SYSTEM PROMPT ──────────────────────────────────────────
const COCO_SYSTEM = `Tu es Coco 🥥, l'assistant de voyage local IA de Koh Samui. Tu es intégré sur le site d'un hôtel partenaire à Koh Samui, Thaïlande.

IDENTITÉ:
- Tu es chaleureux, précis, local — comme un ami qui vit sur l'île depuis 10 ans
- Tu réponds toujours avec: description courte + prix en THB + lien ou conseil pratique
- Tu utilises exactement 1 emoji par message (jamais 0, jamais plus de 2)
- Tu proposes maximum 3 recommandations par réponse
- Tu détectes automatiquement la langue du client (FR, EN, RU, DE, SV) et tu réponds dans sa langue

RÈGLES ABSOLUES:
- Toujours inclure les prix en THB (Baht thaïlandais)
- Jamais inventer un prix — indiquer "Prix à confirmer directement" si incertain
- Adapter les suggestions au profil détecté (budget, groupe, envies)
- Si la météo est mentionnée ou si la saison est mauvaise → adapter les recommandations
- Premier message: toujours te présenter chaleureusement et demander le profil du voyageur

CONNAISSANCE DE KOH SAMUI:

ZONES: Bophut (village pêcheurs, Fisherman's Village, romantique), Chaweng (animé, 7km de plage, nightlife), Lamai (détendu, local, wellness), Maenam (calme, familial, moins cher), Choeng Mon (eau turquoise premium), Plai Laem/Big Buddha (culture, temples), Taling Ngam (côte ouest, couchers de soleil spectaculaires)

ACTIVITÉS INCONTOURNABLES:
- Ang Thong Marine Park: 1 800 THB adulte, 1 200 THB enfant. 42 îles vierges, snorkeling, kayak. Départ 8h Bophut Pier. Météo: mer calme requis
- Plongée Koh Tao: fun dive 2 tanks 3 500 THB, PADI OWD 12 000 THB. Meilleure plongée du Golfe
- Cascades Na Muang: 100 THB entrée. Na Muang 1 (facile, baignade) + Na Muang 2 (45min trek)
- Secret Buddha Garden: 80 THB. Route très escarpée, 4x4 recommandé
- Samui Elephant Sanctuary: 2 500 THB adulte, 1 800 THB enfant. Éthique, aucun dressage
- Sunrise Pagode Khao Hua Jook: gratuit, départ 5h30, vue 360°
- Fisherman's Village Market: gratuit, vendredi 17h-22h, meilleur événement de Samui
- Cours cuisine thaïe Pai Cookery: 1 800 THB, inclus marché + 4 plats
- Dîner Jungle Club: ~800 THB/pers, réserver pour coucher de soleil 18h30
- Croisière sunset: 2 200 THB adulte, 1 500 THB enfant

SPAS TOP:
- Tamarind Springs (Lamai): 1 800 THB. Jungle, piscines naturelles. Le meilleur de l'île
- Ban Sabai Spa (Chaweng): 400 THB. Meilleur rapport qualité-prix
- Vikasa Yoga: 600 THB cours, vue panoramique
- Kamalaya: 4 500 THB. Meilleur wellness resort d'Asie du SE

PLAGES SECRÈTES:
- Silver Beach (entre Chaweng et Lamai): la plus belle, la moins connue. Accès par sentier 10min
- Bang Po (Maenam Ouest): ultra-locale, meilleurs fruits de mer des pêcheurs
- Choeng Mon: meilleure qualité d'eau de l'île

TRANSPORTS:
- Songthaew (pickup partagé): 50-150 THB. Toujours négocier avant
- Scooter: 250 THB/jour. ⚠️ Casque obligatoire, permis requis
- Grab (appli VTC): 10-20% moins cher que taxis
- Taxi: toujours négocier avant, pas de compteur

INFOS PRATIQUES:
- Monnaie: Baht (THB). 1 EUR ≈ 38-40 THB
- SIM: AIS recommandé, 299 THB/30j données illimitées
- Urgences: Police touriste 1155, Ambulance 1669
- Hôpital: Bangkok Hospital Samui +66 77 429 500

MÉTÉO ET SAISONS:
- Haute saison (Déc-Avr): idéal, mer calme → toutes activités recommandées
- Épaule (Mai-Juin, Nov): quelques averses, encore bien
- Saison pluies (Juil-Oct): mer agitée, conseiller spa/cuisine/temples en cas de pluie
- Si mauvaise météo → proposer: spa, cours cuisine, temples, shopping, muay thai indoor

GASTRONOMIE:
- Street food locale: 60-150 THB/repas
- Mid-range restaurants: 400-800 THB/pers
- Gastronomique: 800-2500 THB/pers
- Meilleur marché: Nathon (matin 6h-12h, prix locaux)

PRIX HÉBERGEMENT:
- Budget: <1 500 THB/nuit
- Moyen: 1 500-5 000 THB/nuit  
- Luxe: >5 000 THB/nuit (Banyan Tree 14 000, Ritz-Carlton 18 000, Six Senses 22 000)

Sois toujours proactif: si quelqu'un dit "couple" → suggère le romantique, si "famille" → pense aux enfants, si "aventure" → plongée et excursions, si "wellness" → Kamalaya ou Tamarind Springs.`;

// ─── SVG COMPONENTS ──────────────────────────────────────────────
const Palm = ({ size = 48, color = C.teal, opacity = 1 }) => (
  <svg width={size} height={size * 1.2} viewBox="0 0 60 72" fill="none" style={{ opacity }}>
    <path d="M30 68 C30 68 28 42 30 24" stroke={color} strokeWidth="2.2" strokeLinecap="round"/>
    <path d="M30 24 C26 14 14 9 8 16 C18 15 25 20 30 28" fill={color}/>
    <path d="M30 26 C34 14 46 9 52 16 C42 15 35 20 30 30" fill={color} opacity="0.85"/>
    <path d="M30 30 C20 22 10 26 9 35 C17 30 26 30 30 38" fill={color} opacity="0.7"/>
    <path d="M30 32 C40 24 50 28 51 37 C43 32 34 32 30 40" fill={color} opacity="0.6"/>
    <ellipse cx="30" cy="68" rx="9" ry="3.5" fill={color} opacity="0.15"/>
  </svg>
);

const Send = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path d="M22 2L11 13M22 2L15 22L11 13L2 9L22 2Z" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const CocoMark = ({ dark = true, size = "md" }) => {
  const s = { sm:{palm:22,text:18,sub:8}, md:{palm:32,text:26,sub:9}, lg:{palm:48,text:40,sub:12} }[size];
  const tc = dark ? C.white : C.tealDeep;
  const ac = dark ? C.sand : C.coral;
  const pc = dark ? C.sand : C.teal;
  return (
    <div style={{ display:"flex", alignItems:"center", gap: s.palm*0.35 }}>
      <div style={{ position:"relative", flexShrink:0 }}>
        <Palm size={s.palm} color={pc}/>
        <div style={{ position:"absolute", bottom:8, right:-4, width:s.palm*0.38, height:s.palm*0.38, background:ac, borderRadius:"50%", border:`2px solid ${dark?C.tealDeep:C.white}` }}/>
      </div>
      <div style={{ lineHeight:1 }}>
        <div style={{ fontFamily:"'Cormorant Garamond',Georgia,serif", fontSize:s.text, fontWeight:700, color:tc, letterSpacing:"0.14em", textTransform:"uppercase" }}>Coco</div>
        {size!=="sm" && <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:s.sub, fontWeight:400, color:dark?"rgba(255,255,255,0.5)":C.muted, letterSpacing:"0.22em", textTransform:"uppercase", marginTop:3 }}>Samui Concierge AI</div>}
      </div>
    </div>
  );
};

// ─── INTERSECTION OBSERVER HOOK ───────────────────────────────────
function useInView(ref) {
  const [v, setV] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setV(true); }, { threshold: 0.12 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return v;
}
function FadeIn({ children, delay=0, style={} }) {
  const ref = useRef(); const v = useInView(ref);
  return <div ref={ref} style={{ opacity:v?1:0, transform:v?"translateY(0)":"translateY(28px)", transition:`opacity 0.7s ease ${delay}s, transform 0.7s ease ${delay}s`, ...style }}>{children}</div>;
}

// ─── REAL AI CHAT COMPONENT ───────────────────────────────────────
function CocoChat({ embedded = false }) {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Bonjour ! Je suis Coco 🥥 Votre guide local sur Koh Samui. Dites-moi tout — budget, envies, durée de séjour — je vous compose un séjour sur mesure !" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const endRef = useRef();
  const inputRef = useRef();

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = useCallback(async () => {
    const text = input.trim();
    if (!text || loading) return;
    setInput("");
    setError(null);

    const userMsg = { role: "user", content: text };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setLoading(true);

    try {
      const apiMessages = newMessages.map(m => ({ role: m.role, content: m.content }));
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: COCO_SYSTEM,
          messages: apiMessages,
        }),
      });

      if (!res.ok) throw new Error(`Erreur API: ${res.status}`);
      const data = await res.json();
      const reply = data.content?.map(b => b.text || "").join("") || "Désolé, je n'ai pas pu répondre.";
      setMessages(prev => [...prev, { role: "assistant", content: reply }]);
    } catch (e) {
      setError("Connexion momentanément indisponible. Réessayez dans quelques secondes.");
    } finally {
      setLoading(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [input, messages, loading]);

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  const SUGGESTED = [
    "On est en couple pour 5 jours, budget moyen 🌺",
    "Famille avec 2 enfants, que faire ? 🏖️",
    "Je cherche les meilleures plongées 🤿",
    "Top restaurants avec vue mer 🍽️",
  ];

  return (
    <div style={{ background: C.white, borderRadius: embedded ? 0 : 28, overflow: "hidden", boxShadow: embedded ? "none" : `0 28px 80px rgba(11,53,53,0.2)`, display: "flex", flexDirection: "column", height: embedded ? "100%" : 580, width: "100%" }}>
      {/* Header */}
      <div style={{ background: `linear-gradient(135deg, ${C.tealDeep} 0%, ${C.teal} 100%)`, padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 40, height: 40, borderRadius: 13, background: "rgba(255,255,255,0.12)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Palm size={24} color={C.sand}/>
          </div>
          <div>
            <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 19, fontWeight: 700, color: C.white, letterSpacing: "0.12em" }}>COCO</div>
            <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#4ADE80", boxShadow: "0 0 7px #4ADE80", animation: "pulse 2s infinite" }}/>
              <span style={{ fontSize: 9, color: "rgba(255,255,255,0.55)", letterSpacing: "0.2em" }}>EN LIGNE · IA TEMPS RÉEL</span>
            </div>
          </div>
        </div>
        <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", letterSpacing: "0.15em", textAlign: "right" }}>
          Powered by<br/>
          <span style={{ color: "rgba(255,255,255,0.55)", fontWeight: 600 }}>Claude AI</span>
        </div>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: "auto", padding: "16px", background: "#F2EAD8", display: "flex", flexDirection: "column", gap: 12 }}>
        {messages.map((m, i) => (
          <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start", gap: 8 }}>
            {m.role === "assistant" && (
              <div style={{ width: 28, height: 28, borderRadius: 9, background: C.teal, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, alignSelf: "flex-end" }}>
                <Palm size={15} color={C.sand}/>
              </div>
            )}
            <div style={{ maxWidth: "78%", background: m.role === "assistant" ? C.white : C.teal, color: m.role === "assistant" ? C.charcoal : C.white, borderRadius: m.role === "assistant" ? "4px 16px 16px 16px" : "16px 4px 16px 16px", padding: "11px 15px", fontSize: 13, lineHeight: 1.65, boxShadow: "0 2px 10px rgba(0,0,0,0.07)", whiteSpace: "pre-wrap", fontFamily: "'DM Sans',sans-serif", wordBreak: "break-word" }}>
              {m.content}
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {loading && (
          <div style={{ display: "flex", gap: 8, alignItems: "flex-end" }}>
            <div style={{ width: 28, height: 28, borderRadius: 9, background: C.teal, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Palm size={15} color={C.sand}/>
            </div>
            <div style={{ background: C.white, borderRadius: "4px 16px 16px 16px", padding: "13px 16px", display: "flex", gap: 5, boxShadow: "0 2px 10px rgba(0,0,0,0.07)" }}>
              {[0,1,2].map(i => (
                <div key={i} style={{ width: 7, height: 7, borderRadius: "50%", background: C.teal, opacity: 0.5, animation: `bounce 1.2s ease-in-out ${i*0.2}s infinite` }}/>
              ))}
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div style={{ background: "#FFF0EE", border: `1px solid ${C.coral}30`, borderRadius: 12, padding: "10px 14px", fontSize: 12, color: C.coral, textAlign: "center" }}>
            ⚠️ {error}
          </div>
        )}

        {/* Suggested prompts — only show at start */}
        {messages.length === 1 && !loading && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 7, marginTop: 4 }}>
            {SUGGESTED.map(s => (
              <button key={s} onClick={() => { setInput(s); setTimeout(sendMessage, 0); inputRef.current && (inputRef.current.value = s); setInput(s); }} style={{ background: C.white, border: `1px solid ${C.tealLight}25`, borderRadius: 20, padding: "7px 13px", fontSize: 11.5, color: C.teal, cursor: "pointer", fontFamily: "'DM Sans',sans-serif", fontWeight: 500, transition: "all 0.2s" }} onMouseEnter={e => { e.target.style.background = `${C.teal}10`; e.target.style.borderColor = `${C.teal}50`; }} onMouseLeave={e => { e.target.style.background = C.white; e.target.style.borderColor = `${C.tealLight}25`; }}>
                {s}
              </button>
            ))}
          </div>
        )}
        <div ref={endRef}/>
      </div>

      {/* Input */}
      <div style={{ padding: "12px 14px", background: C.white, borderTop: `1px solid ${C.creamDark}`, display: "flex", gap: 10, alignItems: "flex-end", flexShrink: 0 }}>
        <textarea
          ref={inputRef}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKey}
          placeholder="Écrivez à Coco... (Entrée pour envoyer)"
          rows={1}
          style={{ flex: 1, border: "none", background: C.cream, borderRadius: 16, padding: "11px 16px", fontSize: 13, color: C.charcoal, outline: "none", fontFamily: "'DM Sans',sans-serif", resize: "none", lineHeight: 1.5, maxHeight: 100, overflowY: "auto" }}
        />
        <button onClick={sendMessage} disabled={!input.trim() || loading} style={{ width: 40, height: 40, borderRadius: 13, background: (!input.trim() || loading) ? C.mutedLight : C.coral, border: "none", cursor: (!input.trim() || loading) ? "default" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all 0.2s", boxShadow: (!input.trim() || loading) ? "none" : `0 4px 16px ${C.coral}55` }}>
          <Send/>
        </button>
      </div>
    </div>
  );
}

// ─── SECTION & ANIMATION HELPERS ──────────────────────────────────
const FEATURES = [
  { icon:"🌍", title:"6 langues", desc:"FR · EN · RU · DE · SV · ZH. Chaque voyageur se sent chez lui." },
  { icon:"🌤️", title:"Météo temps réel", desc:"Adapte automatiquement les suggestions aux conditions du jour." },
  { icon:"⚡", title:"24h/24 · 7j/7", desc:"Répond en 2 secondes. Zéro coût RH supplémentaire." },
  { icon:"🎯", title:"Profil voyageur", desc:"Mémorise budget, groupe et préférences sur toute la session." },
  { icon:"🔗", title:"Plug & play", desc:"5 lignes de code pour intégrer Coco sur votre site web." },
  { icon:"📊", title:"Analytics leads", desc:"Rapport mensuel: interactions, intentions, conversions générées." },
  { icon:"🏨", title:"Co-branding", desc:"Votre nom, vos couleurs, vos services mis en avant en priorité." },
  { icon:"🔄", title:"Contenu local", desc:"Base mise à jour chaque mois par un expert résident à Samui." },
];

const PRICING = [
  { name:"Starter", price:2500, color:C.sand, features:["Widget chatbot FR + EN","Base de données Samui","Météo temps réel","Mises à jour mensuelles","Support email"], cta:"Essai 14 jours" },
  { name:"Partner", price:4500, color:C.teal, highlight:true, features:["Tout Starter +","6 langues complètes","Co-branding personnalisé","Services hôtel prioritaires","Rapport leads mensuel","Support WhatsApp"], cta:"Démarrer maintenant" },
  { name:"Premium", price:8000, color:C.coral, features:["Tout Partner +","WhatsApp Business","QR codes chambre","Dashboard analytics","Affiliés intégrés","Support 7j/7 dédié"], cta:"Nous contacter" },
];

const TESTIMONIALS = [
  { quote:"Nos clients russes nous écrivent à 23h pour planifier le lendemain. Coco répond parfaitement — nos équipes sont soulagées.", name:"Sophie M.", role:"Guest Relations · Resort 5★ Lamai" },
  { quote:"En 3 semaines, Coco a généré plus de 40 réservations trackées vers notre spa. ROI immédiat.", name:"Théodore K.", role:"Directeur · Boutique Resort Bophut" },
  { quote:"Coco connaît Samui comme un local. C'est crédible — pas un chatbot générique comme les autres.", name:"Markus R.", role:"GM · Wellness Resort Maenam" },
];

const HOTELS = ["Banyan Tree","Santiburi","Anantara","Centara Reserve","Six Senses","Hansar","Silavadee","W Koh Samui","InterContinental","Ritz-Carlton","Four Seasons","Kamalaya"];

// ─── MAIN COMPONENT ──────────────────────────────────────────────
export default function CocoLanding() {
  const [scrolled, setScrolled] = useState(false);
  const [formData, setFormData] = useState({ hotel: "", email: "" });
  const [formSent, setFormSent] = useState(false);

  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = FONTS + `
      *{box-sizing:border-box;margin:0;padding:0;}
      html{scroll-behavior:smooth;}
      body{background:${C.cream};overflow-x:hidden;}
      @keyframes fadeUp{from{opacity:0;transform:translateY(18px);}to{opacity:1;transform:translateY(0);}}
      @keyframes bounce{0%,80%,100%{transform:translateY(0);}40%{transform:translateY(-7px);}}
      @keyframes floatA{0%,100%{transform:translateY(0) rotate(0deg);}50%{transform:translateY(-14px) rotate(2deg);}}
      @keyframes floatB{0%,100%{transform:translateY(0) rotate(0deg);}50%{transform:translateY(-10px) rotate(-1.5deg);}}
      @keyframes pulse{0%,100%{opacity:1;}50%{opacity:0.4;}}
      @keyframes scroll{0%{transform:translateX(0);}100%{transform:translateX(-50%);}}
      ::-webkit-scrollbar{width:4px;}::-webkit-scrollbar-thumb{background:${C.teal}40;border-radius:2px;}
      textarea::placeholder{color:${C.mutedLight};}
      input::placeholder{color:${C.mutedLight};}
    `;
    document.head.appendChild(style);
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => { document.head.removeChild(style); window.removeEventListener("scroll", onScroll); };
  }, []);

  const navLinks = [
    {label:"Fonctionnalités", href:"#features"},
    {label:"Démo live", href:"#demo"},
    {label:"Tarifs", href:"#pricing"},
    {label:"Contact", href:"#contact"},
  ];

  return (
    <div style={{ fontFamily:"'DM Sans',sans-serif", background:C.cream, overflowX:"hidden" }}>

      {/* ── NAVBAR ── */}
      <nav style={{ position:"fixed", top:0, left:0, right:0, zIndex:1000, padding: scrolled ? "12px 40px":"22px 40px", background: scrolled ? `rgba(11,53,53,0.96)`:"transparent", backdropFilter: scrolled ? "blur(20px)":"none", borderBottom: scrolled ? "1px solid rgba(255,255,255,0.07)":"none", transition:"all 0.3s ease", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <CocoMark dark size="sm"/>
        <div style={{ display:"flex", alignItems:"center", gap:28 }}>
          {navLinks.map(l => (
            <a key={l.label} href={l.href} style={{ color:"rgba(255,255,255,0.7)", fontSize:13, fontWeight:500, textDecoration:"none", letterSpacing:"0.04em", transition:"color 0.2s" }} onMouseEnter={e=>e.target.style.color=C.sand} onMouseLeave={e=>e.target.style.color="rgba(255,255,255,0.7)"}>
              {l.label}
            </a>
          ))}
          <a href="#demo" style={{ padding:"10px 22px", background:C.coral, color:C.white, borderRadius:24, fontSize:13, fontWeight:600, textDecoration:"none", boxShadow:`0 4px 18px ${C.coral}50`, transition:"all 0.2s" }} onMouseEnter={e=>{e.target.style.transform="translateY(-1px)";e.target.style.boxShadow=`0 8px 24px ${C.coral}60`;}} onMouseLeave={e=>{e.target.style.transform="";e.target.style.boxShadow=`0 4px 18px ${C.coral}50`;}}>
            Tester Coco →
          </a>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section style={{ minHeight:"100vh", background:`linear-gradient(155deg, ${C.tealDeep} 0%, ${C.tealMid} 45%, #0D4545 75%, #183030 100%)`, display:"flex", alignItems:"center", position:"relative", overflow:"hidden", padding:"120px 40px 80px" }}>
        {/* BG palms */}
        {[
          {size:240,op:0.06,top:"-10%",right:"1%",cls:"floatA"},
          {size:170,op:0.05,top:"12%",right:"20%",cls:"floatB"},
          {size:300,op:0.04,bottom:"-18%",right:"-3%",cls:"floatA"},
          {size:150,op:0.04,top:"58%",left:"2%",cls:"floatB"},
        ].map((p,i) => (
          <div key={i} style={{ position:"absolute", top:p.top, bottom:p.bottom, left:p.left, right:p.right, opacity:p.op, pointerEvents:"none", animation:`${p.cls} ${6+i*2}s ease-in-out ${i}s infinite` }}>
            <Palm size={p.size} color={C.sand}/>
          </div>
        ))}
        {/* Grain */}
        <div style={{ position:"absolute", inset:0, backgroundImage:`url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E")`, pointerEvents:"none", opacity:0.6 }}/>

        <div style={{ maxWidth:1200, margin:"0 auto", width:"100%", display:"flex", alignItems:"center", gap:64, flexWrap:"wrap" }}>
          {/* Left */}
          <div style={{ flex:"1 1 460px" }}>
            <div style={{ display:"inline-flex", alignItems:"center", gap:8, background:"rgba(232,201,122,0.12)", border:"1px solid rgba(232,201,122,0.25)", borderRadius:24, padding:"7px 16px", marginBottom:28, animation:"fadeUp 0.7s ease both" }}>
              <div style={{ width:6, height:6, borderRadius:"50%", background:C.sand }}/>
              <span style={{ fontSize:11, color:C.sand, fontWeight:500, letterSpacing:"0.2em", textTransform:"uppercase" }}>Assistant IA · Koh Samui · Temps réel</span>
            </div>
            <h1 style={{ fontFamily:"'Cormorant Garamond',Georgia,serif", fontSize:"clamp(44px,6vw,78px)", fontWeight:600, color:C.white, lineHeight:1.04, marginBottom:24, animation:"fadeUp 0.7s ease 0.1s both" }}>
              L'île dans<br/>
              <em style={{ color:C.sand, fontStyle:"italic", fontWeight:300 }}>la poche.</em>
            </h1>
            <p style={{ fontSize:17, color:"rgba(255,255,255,0.6)", lineHeight:1.78, maxWidth:480, marginBottom:44, animation:"fadeUp 0.7s ease 0.2s both", fontWeight:300 }}>
              Coco est le concierge IA local de Koh Samui. <strong style={{ color:"rgba(255,255,255,0.85)", fontWeight:600 }}>Multilingue, connecté en temps réel, disponible 24h/24</strong> — sans coût RH supplémentaire.
            </p>
            <div style={{ display:"flex", gap:14, flexWrap:"wrap", animation:"fadeUp 0.7s ease 0.3s both", marginBottom:52 }}>
              <a href="#demo" style={{ padding:"15px 32px", background:C.coral, color:C.white, borderRadius:28, fontSize:14, fontWeight:600, textDecoration:"none", boxShadow:`0 6px 28px ${C.coral}60`, transition:"all 0.25s", letterSpacing:"0.03em" }} onMouseEnter={e=>{e.target.style.transform="translateY(-2px)";e.target.style.boxShadow=`0 10px 36px ${C.coral}70`;}} onMouseLeave={e=>{e.target.style.transform="";e.target.style.boxShadow=`0 6px 28px ${C.coral}60`;}}>
                Parler à Coco →
              </a>
              <a href="#pricing" style={{ padding:"15px 32px", background:"rgba(255,255,255,0.08)", color:"rgba(255,255,255,0.82)", borderRadius:28, fontSize:14, fontWeight:500, textDecoration:"none", border:"1px solid rgba(255,255,255,0.15)", backdropFilter:"blur(8px)", transition:"all 0.25s" }} onMouseEnter={e=>e.target.style.background="rgba(255,255,255,0.14)"} onMouseLeave={e=>e.target.style.background="rgba(255,255,255,0.08)"}>
                Voir les tarifs
              </a>
            </div>
            <div style={{ display:"flex", gap:36, flexWrap:"wrap", animation:"fadeUp 0.7s ease 0.4s both" }}>
              {[["6","Langues"],["24h","Disponible"],["2s","Réponse"],["IA","Temps réel"]].map(([v,l]) => (
                <div key={l}>
                  <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:30, fontWeight:700, color:C.sand, lineHeight:1 }}>{v}</div>
                  <div style={{ fontSize:10, color:"rgba(255,255,255,0.4)", letterSpacing:"0.18em", textTransform:"uppercase", marginTop:4 }}>{l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — live chat hero */}
          <div style={{ flex:"0 1 400px", animation:"fadeUp 0.8s ease 0.35s both" }}>
            <div style={{ marginBottom:12, display:"flex", alignItems:"center", gap:8 }}>
              <div style={{ width:8, height:8, borderRadius:"50%", background:"#4ADE80", boxShadow:"0 0 10px #4ADE80", animation:"pulse 2s infinite" }}/>
              <span style={{ fontSize:11, color:"rgba(255,255,255,0.5)", letterSpacing:"0.2em", textTransform:"uppercase" }}>Démo en direct — vraie IA</span>
            </div>
            <CocoChat/>
          </div>
        </div>

        {/* Scroll hint */}
        <div style={{ position:"absolute", bottom:28, left:"50%", transform:"translateX(-50%)", display:"flex", flexDirection:"column", alignItems:"center", gap:8, opacity:0.35 }}>
          <span style={{ fontSize:9, letterSpacing:"0.3em", textTransform:"uppercase", color:C.white }}>Découvrir</span>
          <div style={{ width:1, height:36, background:`linear-gradient(to bottom, ${C.white}, transparent)` }}/>
        </div>
      </section>

      {/* ── HOTELS TICKER ── */}
      <div style={{ background:C.tealDeep, padding:"16px 0", overflow:"hidden", borderBottom:"1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ display:"flex", animation:"scroll 28s linear infinite", width:"max-content" }}>
          {[...HOTELS,...HOTELS].map((h,i) => (
            <div key={i} style={{ display:"flex", alignItems:"center", gap:18, padding:"0 28px" }}>
              <Palm size={12} color={C.sand} opacity={0.45}/>
              <span style={{ fontSize:11, color:"rgba(255,255,255,0.35)", letterSpacing:"0.2em", textTransform:"uppercase", fontWeight:500, whiteSpace:"nowrap" }}>{h}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── PROBLEM / SOLUTION ── */}
      <section style={{ background:C.cream, padding:"96px 40px" }}>
        <div style={{ maxWidth:1000, margin:"0 auto" }}>
          <FadeIn style={{ textAlign:"center", marginBottom:60 }}>
            <div style={{ display:"inline-block", background:`${C.coral}14`, borderRadius:24, padding:"7px 18px", marginBottom:18 }}>
              <span style={{ fontSize:11, color:C.coral, fontWeight:600, letterSpacing:"0.2em", textTransform:"uppercase" }}>Le problème</span>
            </div>
            <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"clamp(30px,4vw,52px)", fontWeight:600, color:C.tealDeep, lineHeight:1.12, maxWidth:660, margin:"0 auto 18px" }}>
              Votre concierge humain dort à 3h.<br/>
              <em style={{ color:C.coral, fontStyle:"italic" }}>Coco, lui, ne dort jamais.</em>
            </h2>
            <p style={{ fontSize:15, color:C.muted, maxWidth:520, margin:"0 auto", lineHeight:1.75 }}>
              Vos clients posent des questions à toute heure, dans six langues. Coco connaît chaque réponse.
            </p>
          </FadeIn>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(280px, 1fr))", gap:20 }}>
            {[
              { icon:"😰", title:"Avant Coco", dark:false, items:["Clients sans réponse après 22h","Équipe débordée par les questions répétitives","Touristes perdus, expérience décevante","Aucune donnée sur les intentions"] },
              { icon:"🥥", title:"Avec Coco", dark:true, items:["Réponses instantanées 24h/24, 7j/7","Équipe libérée pour les demandes complexes","Expériences personnalisées selon profil + météo","Rapport mensuel leads et conversions"] },
            ].map(col => (
              <FadeIn key={col.title} delay={col.dark?0.1:0}>
                <div style={{ background:col.dark?`linear-gradient(135deg,${C.tealDeep},${C.teal})`:C.white, borderRadius:20, padding:"32px 28px", border:col.dark?"none":`1px solid ${C.creamDark}`, boxShadow:col.dark?`0 16px 48px ${C.teal}28`:"0 4px 24px rgba(0,0,0,0.06)", height:"100%" }}>
                  <div style={{ fontSize:32, marginBottom:12 }}>{col.icon}</div>
                  <h3 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:26, fontWeight:600, color:col.dark?C.white:C.tealDeep, marginBottom:20 }}>{col.title}</h3>
                  {col.items.map((item,i) => (
                    <div key={i} style={{ display:"flex", alignItems:"flex-start", gap:10, marginBottom:12 }}>
                      <div style={{ width:18, height:18, borderRadius:"50%", background:col.dark?`${C.sand}22`:`${C.coral}14`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, marginTop:1 }}>
                        <span style={{ fontSize:9, color:col.dark?C.sand:C.coral, fontWeight:700 }}>{col.dark?"✓":"✗"}</span>
                      </div>
                      <span style={{ fontSize:13.5, color:col.dark?"rgba(255,255,255,0.78)":C.charcoal, lineHeight:1.55 }}>{item}</span>
                    </div>
                  ))}
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" style={{ background:C.tealDeep, padding:"96px 40px" }}>
        <div style={{ maxWidth:1100, margin:"0 auto" }}>
          <FadeIn style={{ textAlign:"center", marginBottom:60 }}>
            <div style={{ display:"inline-block", background:`${C.sand}20`, borderRadius:24, padding:"7px 18px", marginBottom:18 }}>
              <span style={{ fontSize:11, color:C.sand, fontWeight:600, letterSpacing:"0.2em", textTransform:"uppercase" }}>Fonctionnalités</span>
            </div>
            <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"clamp(28px,4vw,48px)", fontWeight:600, color:C.white, lineHeight:1.15, marginBottom:14 }}>Tout ce dont votre hôtel a besoin.</h2>
            <p style={{ fontSize:14, color:"rgba(255,255,255,0.45)", maxWidth:440, margin:"0 auto" }}>Intelligent, multilingue, toujours à jour. Prêt en 1 heure.</p>
          </FadeIn>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(230px, 1fr))", gap:14 }}>
            {FEATURES.map((f,i) => (
              <FadeIn key={f.title} delay={i*0.06}>
                <div style={{ background:"rgba(255,255,255,0.05)", borderRadius:18, padding:"22px 18px", border:"1px solid rgba(255,255,255,0.07)", transition:"all 0.25s", cursor:"default" }} onMouseEnter={e=>{e.currentTarget.style.background="rgba(255,255,255,0.09)";e.currentTarget.style.transform="translateY(-3px)";}} onMouseLeave={e=>{e.currentTarget.style.background="rgba(255,255,255,0.05)";e.currentTarget.style.transform="";}}>
                  <div style={{ fontSize:26, marginBottom:10 }}>{f.icon}</div>
                  <div style={{ fontSize:13.5, fontWeight:600, color:C.sand, marginBottom:7 }}>{f.title}</div>
                  <div style={{ fontSize:12, color:"rgba(255,255,255,0.48)", lineHeight:1.65 }}>{f.desc}</div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── DEMO SECTION ── */}
      <section id="demo" style={{ background:C.cream, padding:"96px 40px" }}>
        <div style={{ maxWidth:1160, margin:"0 auto" }}>
          <FadeIn style={{ textAlign:"center", marginBottom:56 }}>
            <div style={{ display:"inline-flex", alignItems:"center", gap:8, background:`${C.teal}14`, borderRadius:24, padding:"7px 18px", marginBottom:18 }}>
              <div style={{ width:7, height:7, borderRadius:"50%", background:"#4ADE80", boxShadow:"0 0 8px #4ADE80", animation:"pulse 2s infinite" }}/>
              <span style={{ fontSize:11, color:C.teal, fontWeight:600, letterSpacing:"0.2em", textTransform:"uppercase" }}>Démo IA en direct — vraies réponses</span>
            </div>
            <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"clamp(28px,4vw,50px)", fontWeight:600, color:C.tealDeep, lineHeight:1.12, marginBottom:16 }}>
              Parlez à Coco.<br/>
              <em style={{ color:C.coral, fontStyle:"italic" }}>En vrai, maintenant.</em>
            </h2>
            <p style={{ fontSize:15, color:C.muted, maxWidth:520, margin:"0 auto" }}>
              Ce n'est pas une simulation. Coco est propulsé par l'IA Claude d'Anthropic et répond en temps réel, dans votre langue, avec de vraies informations sur Koh Samui.
            </p>
          </FadeIn>

          <div style={{ display:"flex", gap:40, alignItems:"flex-start", flexWrap:"wrap" }}>
            {/* Big chat */}
            <FadeIn delay={0.1} style={{ flex:"0 1 480px", height:600 }}>
              <CocoChat embedded/>
            </FadeIn>

            {/* Side info */}
            <FadeIn delay={0.2} style={{ flex:"1 1 300px" }}>
              <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
                {[
                  { icon:"🥥", title:"Vraie IA", desc:"Coco est propulsé par Claude (Anthropic). Chaque réponse est générée en temps réel, pas scriptée." },
                  { icon:"🌤️", title:"Connaissance locale", desc:"Coco connaît les prix, les zones, les activités, les restaurants et les conseils pratiques de Koh Samui." },
                  { icon:"🌍", title:"Multilingue natif", desc:"Écrivez en français, anglais, russe, allemand ou suédois. Coco détecte et répond dans votre langue." },
                  { icon:"🎯", title:"Personnalisé pour vous", desc:"Dites votre profil (couple, famille, budget...) et Coco adapte chaque recommandation." },
                  { icon:"🏨", title:"Pour votre hôtel", desc:"Intégrable sur votre site en 5 lignes de code, personnalisé avec votre identité visuelle." },
                ].map((item,i) => (
                  <div key={i} style={{ background:C.white, borderRadius:16, padding:"18px 18px", display:"flex", gap:14, alignItems:"flex-start", boxShadow:"0 2px 16px rgba(0,0,0,0.05)", borderLeft:`3px solid ${C.teal}30` }}>
                    <span style={{ fontSize:22, flexShrink:0 }}>{item.icon}</span>
                    <div>
                      <div style={{ fontSize:13.5, fontWeight:600, color:C.tealDeep, marginBottom:5 }}>{item.title}</div>
                      <div style={{ fontSize:12, color:C.muted, lineHeight:1.6 }}>{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section style={{ background:`linear-gradient(135deg,${C.tealDeep},#0D4848)`, padding:"96px 40px" }}>
        <div style={{ maxWidth:1100, margin:"0 auto" }}>
          <FadeIn style={{ textAlign:"center", marginBottom:52 }}>
            <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"clamp(26px,4vw,44px)", fontWeight:600, color:C.white, lineHeight:1.2 }}>
              Ce qu'en disent<br/><em style={{ color:C.sand, fontStyle:"italic" }}>les hôteliers.</em>
            </h2>
          </FadeIn>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(290px, 1fr))", gap:18 }}>
            {TESTIMONIALS.map((t,i) => (
              <FadeIn key={i} delay={i*0.1}>
                <div style={{ background:"rgba(255,255,255,0.06)", borderRadius:20, padding:"26px 22px", border:"1px solid rgba(255,255,255,0.07)", height:"100%", display:"flex", flexDirection:"column" }}>
                  <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:40, color:C.sand, opacity:0.5, lineHeight:1, marginBottom:14 }}>"</div>
                  <p style={{ fontSize:13.5, color:"rgba(255,255,255,0.72)", lineHeight:1.78, flex:1, fontStyle:"italic" }}>{t.quote}</p>
                  <div style={{ marginTop:18, paddingTop:18, borderTop:"1px solid rgba(255,255,255,0.09)" }}>
                    <div style={{ fontSize:13, fontWeight:600, color:C.sand }}>{t.name}</div>
                    <div style={{ fontSize:11, color:"rgba(255,255,255,0.38)", marginTop:2 }}>{t.role}</div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section id="pricing" style={{ background:C.cream, padding:"96px 40px" }}>
        <div style={{ maxWidth:980, margin:"0 auto" }}>
          <FadeIn style={{ textAlign:"center", marginBottom:60 }}>
            <div style={{ display:"inline-block", background:`${C.coral}14`, borderRadius:24, padding:"7px 18px", marginBottom:18 }}>
              <span style={{ fontSize:11, color:C.coral, fontWeight:600, letterSpacing:"0.2em", textTransform:"uppercase" }}>Tarifs</span>
            </div>
            <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"clamp(28px,4vw,48px)", fontWeight:600, color:C.tealDeep, lineHeight:1.12, marginBottom:12 }}>Simple. Transparent. Rentable.</h2>
            <p style={{ fontSize:14, color:C.muted }}>14 jours d'essai gratuit — sans engagement — annulable à tout moment.</p>
          </FadeIn>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3, 1fr)", gap:20 }}>
            {PRICING.map((p,i) => (
              <FadeIn key={p.name} delay={i*0.1}>
                <div style={{ background:p.highlight?`linear-gradient(155deg,${C.tealDeep},${C.teal})`:C.white, borderRadius:24, overflow:"hidden", boxShadow:p.highlight?`0 20px 60px ${C.teal}35`:"0 4px 24px rgba(0,0,0,0.07)", border:p.highlight?"none":`1px solid ${C.creamDark}`, transform:p.highlight?"scale(1.04)":"scale(1)", position:"relative" }}>
                  {p.highlight && <div style={{ position:"absolute", top:0, left:0, right:0, height:3, background:`linear-gradient(90deg,${C.sand},${C.coral})` }}/>}
                  <div style={{ padding:"26px 22px 0" }}>
                    {p.highlight && <div style={{ display:"inline-block", background:`${C.sand}22`, borderRadius:20, padding:"4px 12px", marginBottom:12 }}><span style={{ fontSize:9, color:C.sand, fontWeight:700, letterSpacing:"0.15em" }}>⭐ POPULAIRE</span></div>}
                    <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:24, fontWeight:700, color:p.highlight?C.white:C.tealDeep }}>{p.name}</div>
                    <div style={{ display:"flex", alignItems:"baseline", gap:5, margin:"12px 0 20px" }}>
                      <span style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:40, fontWeight:700, color:p.highlight?C.sand:p.color, lineHeight:1 }}>{p.price.toLocaleString()}</span>
                      <span style={{ fontSize:11, color:p.highlight?"rgba(255,255,255,0.38)":C.muted }}>THB/mois</span>
                    </div>
                  </div>
                  <div style={{ padding:"0 22px 26px" }}>
                    <div style={{ width:"100%", height:1, background:p.highlight?"rgba(255,255,255,0.1)":C.creamDark, marginBottom:18 }}/>
                    {p.features.map((f,j) => (
                      <div key={j} style={{ display:"flex", alignItems:"flex-start", gap:9, marginBottom:10 }}>
                        <span style={{ fontSize:10, color:p.highlight?C.sand:p.color, marginTop:2, fontWeight:700 }}>✓</span>
                        <span style={{ fontSize:12.5, color:p.highlight?"rgba(255,255,255,0.7)":C.charcoal, lineHeight:1.5 }}>{f}</span>
                      </div>
                    ))}
                    <a href="#contact" style={{ display:"block", width:"100%", padding:"13px", borderRadius:14, border:p.highlight?"none":`1.5px solid ${p.color}`, background:p.highlight?C.coral:"transparent", color:p.highlight?C.white:p.color, fontFamily:"'DM Sans',sans-serif", fontSize:13, fontWeight:600, cursor:"pointer", textAlign:"center", textDecoration:"none", marginTop:18, transition:"all 0.2s", boxShadow:p.highlight?`0 6px 20px ${C.coral}50`:"none" }} onMouseEnter={e=>{if(p.highlight){e.target.style.transform="translateY(-1px)";}else{e.target.style.background=`${p.color}12`;}}} onMouseLeave={e=>{e.target.style.transform="";if(!p.highlight)e.target.style.background="transparent";}}>
                      {p.cta}
                    </a>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONTACT CTA ── */}
      <section id="contact" style={{ background:`linear-gradient(135deg,${C.tealDeep} 0%,#0D4040 55%,${C.tealMid} 100%)`, padding:"96px 40px", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", right:-60, bottom:-60, opacity:0.04, animation:"floatB 10s ease-in-out infinite" }}>
          <Palm size={500} color={C.sand}/>
        </div>
        <div style={{ maxWidth:600, margin:"0 auto", textAlign:"center", position:"relative" }}>
          <FadeIn>
            <CocoMark dark size="md"/>
            <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"clamp(30px,4vw,52px)", fontWeight:600, color:C.white, lineHeight:1.1, margin:"26px 0 18px" }}>
              Prêt à offrir<br/>
              <em style={{ color:C.sand, fontStyle:"italic" }}>une île entière</em><br/>
              à vos clients ?
            </h2>
            <p style={{ fontSize:14, color:"rgba(255,255,255,0.5)", lineHeight:1.78, maxWidth:420, margin:"0 auto 40px" }}>
              Démo en 15 minutes. Installation en 1 heure. Vos clients servis dès le jour 1.
            </p>

            {!formSent ? (
              <div style={{ display:"flex", flexDirection:"column", gap:12, maxWidth:400, margin:"0 auto 32px" }}>
                <input value={formData.hotel} onChange={e=>setFormData(p=>({...p,hotel:e.target.value}))} placeholder="Nom de votre hôtel" style={{ padding:"15px 20px", borderRadius:14, border:"1px solid rgba(255,255,255,0.12)", background:"rgba(255,255,255,0.07)", color:C.white, fontSize:13.5, fontFamily:"'DM Sans',sans-serif", outline:"none", backdropFilter:"blur(8px)" }}/>
                <input value={formData.email} onChange={e=>setFormData(p=>({...p,email:e.target.value}))} placeholder="Votre email professionnel" style={{ padding:"15px 20px", borderRadius:14, border:"1px solid rgba(255,255,255,0.12)", background:"rgba(255,255,255,0.07)", color:C.white, fontSize:13.5, fontFamily:"'DM Sans',sans-serif", outline:"none", backdropFilter:"blur(8px)" }}/>
                <button onClick={()=>{ if(formData.hotel && formData.email) setFormSent(true); }} style={{ padding:"16px", borderRadius:14, border:"none", background:C.coral, color:C.white, fontSize:14, fontWeight:600, cursor:"pointer", fontFamily:"'DM Sans',sans-serif", boxShadow:`0 8px 32px ${C.coral}60`, transition:"all 0.25s" }} onMouseEnter={e=>{e.target.style.transform="translateY(-2px)";e.target.style.boxShadow=`0 12px 40px ${C.coral}70`;}} onMouseLeave={e=>{e.target.style.transform="";e.target.style.boxShadow=`0 8px 32px ${C.coral}60`;}}>
                  Demander une démo gratuite →
                </button>
              </div>
            ) : (
              <div style={{ background:"rgba(74,222,128,0.1)", border:"1px solid rgba(74,222,128,0.25)", borderRadius:16, padding:"24px", maxWidth:400, margin:"0 auto 32px", textAlign:"center" }}>
                <div style={{ fontSize:32, marginBottom:10 }}>🥥</div>
                <div style={{ fontSize:15, fontWeight:600, color:C.white, marginBottom:6 }}>Merci {formData.hotel} !</div>
                <div style={{ fontSize:13, color:"rgba(255,255,255,0.55)" }}>Cyril vous contacte dans les 24h via WhatsApp ou email pour organiser la démo.</div>
              </div>
            )}

            <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:20, flexWrap:"wrap", marginBottom:32 }}>
              {["14 jours gratuits","Sans engagement","Installation 1h","Support WhatsApp"].map(i=>(
                <div key={i} style={{ display:"flex", alignItems:"center", gap:5 }}>
                  <span style={{ fontSize:10, color:C.sand }}>✓</span>
                  <span style={{ fontSize:11.5, color:"rgba(255,255,255,0.42)" }}>{i}</span>
                </div>
              ))}
            </div>

            <div style={{ paddingTop:24, borderTop:"1px solid rgba(255,255,255,0.08)", display:"flex", justifyContent:"center", gap:28, flexWrap:"wrap" }}>
              <a href="https://wa.me/66633753316" style={{ display:"flex", alignItems:"center", gap:7, color:"rgba(255,255,255,0.45)", textDecoration:"none", fontSize:12.5, transition:"color 0.2s" }} onMouseEnter={e=>e.currentTarget.style.color=C.sand} onMouseLeave={e=>e.currentTarget.style.color="rgba(255,255,255,0.45)"}>
                <span>📱</span> +66 633 753 316
              </a>
              <span style={{ color:"rgba(255,255,255,0.15)" }}>·</span>
              <a href="mailto:coco@coconutprojects.com" style={{ display:"flex", alignItems:"center", gap:7, color:"rgba(255,255,255,0.45)", textDecoration:"none", fontSize:12.5, transition:"color 0.2s" }} onMouseEnter={e=>e.currentTarget.style.color=C.sand} onMouseLeave={e=>e.currentTarget.style.color="rgba(255,255,255,0.45)"}>
                <span>✉️</span> coco@coconutprojects.com
              </a>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ background:"#050F0F", padding:"32px 40px", display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:16 }}>
        <CocoMark dark size="sm"/>
        <div style={{ display:"flex", gap:24 }}>
          {["Confidentialité","CGU","Cookies"].map(l=>(
            <a key={l} href="#" style={{ fontSize:11, color:"rgba(255,255,255,0.26)", textDecoration:"none", letterSpacing:"0.08em", transition:"color 0.2s" }} onMouseEnter={e=>e.target.style.color="rgba(255,255,255,0.55)"} onMouseLeave={e=>e.target.style.color="rgba(255,255,255,0.26)"}>{l}</a>
          ))}
        </div>
        <div style={{ fontSize:11, color:"rgba(255,255,255,0.18)", letterSpacing:"0.06em" }}>© 2026 Coconut Projects · Koh Samui</div>
      </footer>

    </div>
  );
}
