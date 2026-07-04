import { useState, useEffect, useRef, useCallback } from "react";

const C = {
  tealDeep:"#0B3535",teal:"#1B6B6B",tealMid:"#155555",tealLight:"#2A9090",
  coral:"#E8724A",coralLight:"#F0957A",sand:"#E8C97A",sandLight:"#F5E4A8",
  cream:"#FAF3E6",creamDark:"#F0E6D0",white:"#FFFFFF",charcoal:"#1A1A1A",
  muted:"#8A7B6A",mutedLight:"#B5A898",
};

const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,300;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');`;

// ─── TRANSLATIONS ─────────────────────────────────────────────────
const T = {
  en: {
    tagline:"The island in your pocket.",
    hero_sub:"Coco is Koh Samui's local AI concierge — multilingual, connected to live weather, available 24/7 for your guests at zero extra HR cost.",
    hero_cta1:"Talk to Coco →",hero_cta2:"View pricing",
    stats:[["6","Languages"],["24/7","Available"],["2s","Response"],["Real-time","AI"]],
    problem_badge:"The challenge",
    problem_title:"Your human concierge sleeps at 3am.\nCoco never does.",
    problem_sub:"Your guests ask questions at all hours, in six languages. Coco knows every answer.",
    before_title:"Before Coco",before_items:["No response after 10pm","Team overwhelmed by repetitive questions","Tourists lost without local guidance","Zero data on booking intentions"],
    after_title:"With Coco",after_items:["Instant replies 24/7, every day","Team freed for complex requests","Personalised experiences by profile + weather","Monthly leads and conversion report"],
    feat_badge:"Features",feat_title:"Everything your hotel needs.",feat_sub:"Intelligent, multilingual, always up to date. Live in 1 hour.",
    features:[
      {icon:"🌍",title:"6 languages",desc:"FR · EN · RU · DE · SV · ZH. Every guest feels at home."},
      {icon:"🌤️",title:"Live weather",desc:"Adapts suggestions automatically to today's conditions."},
      {icon:"⚡",title:"24/7",desc:"Responds in 2 seconds. Zero extra HR cost."},
      {icon:"🎯",title:"Guest profile",desc:"Remembers budget, group and preferences all session."},
      {icon:"🔗",title:"Plug & play",desc:"5 lines of code to embed Coco on your website."},
      {icon:"📊",title:"Lead analytics",desc:"Monthly report: interactions, intents, conversions."},
      {icon:"🏨",title:"Co-branding",desc:"Your name, your colours, your services prioritised."},
      {icon:"🔄",title:"Local content",desc:"Knowledge base updated monthly by a Samui expert."},
    ],
    demo_badge:"Live AI demo",demo_title:"Talk to Coco.\nRight now.",
    demo_sub:"This is not a simulation. Coco is powered by Claude AI (Anthropic) and responds in real time with genuine Koh Samui knowledge.",
    demo_features:[
      {icon:"🥥",title:"Real AI",desc:"Every response is generated live by Claude — not scripted."},
      {icon:"🌤️",title:"Local expertise",desc:"Coco knows prices, activities, restaurants and tips for Koh Samui."},
      {icon:"🌍",title:"Native multilingual",desc:"Write in any language. Coco detects and replies in yours."},
      {icon:"🎯",title:"Personalised",desc:"Tell Coco your profile and every recommendation adapts."},
      {icon:"🏨",title:"For your hotel",desc:"Embeddable on your site in 5 lines, with your own branding."},
    ],
    testimonials_title:"What hoteliers say.",
    testimonials:[
      {quote:"Our Russian guests now message us at 11pm to plan the next day. Coco replies perfectly — our teams are relieved.",name:"Sophie M.",role:"Guest Relations Manager · 5★ Resort Lamai"},
      {quote:"Within 3 weeks, Coco generated 40+ tracked bookings to our spa and restaurant. Immediate ROI.",name:"Theodore K.",role:"Director · Boutique Resort Bophut"},
      {quote:"What convinced me: Coco knows Samui like a local. It's credible — not a generic chatbot.",name:"Markus R.",role:"GM · Wellness Resort Maenam"},
    ],
    pricing_badge:"Pricing",pricing_title:"Simple. Transparent. Profitable.",pricing_sub:"14-day free trial — no commitment — cancel anytime.",
    pricing:[
      {name:"Starter",price:2500,desc:"To get started",color:C.sand,features:["Widget EN + FR","Full Samui database","Live weather","Monthly updates","Email support"],cta:"14-day free trial"},
      {name:"Partner",price:4500,desc:"Most popular",color:C.teal,highlight:true,features:["Everything in Starter +","6 full languages","Custom co-branding","Monthly leads report","Priority WhatsApp support"],cta:"Start now"},
      {name:"Premium",price:8000,desc:"For large hotels",color:C.coral,features:["Everything in Partner +","WhatsApp Business","In-room QR codes","Live analytics dashboard","Dedicated 7/7 support"],cta:"Contact us"},
    ],
    cta_title:"Ready to offer an entire island\nto your guests?",
    cta_sub:"15-min demo. Live in 1 hour. First guest served on day 1.",
    cta_btn:"Book your free demo →",
    cta_pills:["14-day free trial","No commitment","Setup in 1h","WhatsApp support"],
    form_hotel:"Your hotel name",form_email:"Your professional email",
    form_thanks_title:"Thank you",form_thanks_sub:"Cyril will contact you within 24h via WhatsApp or email to arrange the demo.",
    footer_links:["Privacy","Terms","Cookies"],footer_copy:"© 2026 Coconut Projects · Koh Samui, Thailand",
    nav:[{label:"Features",href:"#features"},{label:"Live demo",href:"#demo"},{label:"Pricing",href:"#pricing"},{label:"Contact",href:"#contact"}],
    nav_cta:"Try Coco →",
    hotels_ticker:["Banyan Tree","Santiburi","Anantara","Centara Reserve","Six Senses","Hansar","Silavadee","W Koh Samui","InterContinental","Ritz-Carlton","Four Seasons","Kamalaya"],
    chat_placeholder:"Write to Coco... (Enter to send)",
    chat_online:"ONLINE · REAL-TIME AI",
    chat_suggested:["We're on honeymoon, 5 days, mid-range budget 🌺","Family with 2 kids, what to do? 🏖️","Best diving spots on the island 🤿","Top restaurants with sea view 🍽️"],
    chat_restart:"↺ Restart demo",
    chat_error:"Temporarily unavailable. Please try again.",
    powered:"Powered by",
    scroll_hint:"Discover",
  },
  fr: {
    tagline:"L'île dans la poche.",
    hero_sub:"Coco est le concierge IA local de Koh Samui — multilingue, connecté à la météo en temps réel, disponible 24h/24 pour vos clients, sans coût RH supplémentaire.",
    hero_cta1:"Parler à Coco →",hero_cta2:"Voir les tarifs",
    stats:[["6","Langues"],["24h","Disponible"],["2s","Réponse"],["Temps","réel"]],
    problem_badge:"Le problème",
    problem_title:"Votre concierge humain dort à 3h.\nCoco, lui, ne dort jamais.",
    problem_sub:"Vos clients posent des questions à toute heure, dans six langues. Coco connaît toutes les réponses.",
    before_title:"Avant Coco",before_items:["Clients sans réponse après 22h","Équipe débordée par les questions répétitives","Touristes perdus sans recommandations","Aucune donnée sur les intentions"],
    after_title:"Avec Coco",after_items:["Réponses instantanées 24h/24, 7j/7","Équipe libérée pour les demandes complexes","Expériences personnalisées profil + météo","Rapport mensuel leads et conversions"],
    feat_badge:"Fonctionnalités",feat_title:"Tout ce dont votre hôtel a besoin.",feat_sub:"Intelligent, multilingue, toujours à jour. Prêt en 1 heure.",
    features:[
      {icon:"🌍",title:"6 langues",desc:"FR · EN · RU · DE · SV · ZH. Chaque voyageur se sent chez lui."},
      {icon:"🌤️",title:"Météo temps réel",desc:"Adapte automatiquement les suggestions aux conditions du jour."},
      {icon:"⚡",title:"24h/24",desc:"Répond en 2 secondes. Zéro coût RH supplémentaire."},
      {icon:"🎯",title:"Profil voyageur",desc:"Mémorise budget, groupe et préférences sur toute la session."},
      {icon:"🔗",title:"Plug & play",desc:"5 lignes de code pour intégrer Coco sur votre site web."},
      {icon:"📊",title:"Analytics leads",desc:"Rapport mensuel : interactions, intentions, conversions."},
      {icon:"🏨",title:"Co-branding",desc:"Votre nom, vos couleurs, vos services en priorité."},
      {icon:"🔄",title:"Contenu local",desc:"Base mise à jour chaque mois par un expert résidant à Samui."},
    ],
    demo_badge:"Démo IA en direct",demo_title:"Parlez à Coco.\nEn vrai, maintenant.",
    demo_sub:"Ce n'est pas une simulation. Coco est propulsé par Claude AI (Anthropic) et répond en temps réel avec de vraies informations sur Koh Samui.",
    demo_features:[
      {icon:"🥥",title:"Vraie IA",desc:"Chaque réponse est générée en direct par Claude — pas scriptée."},
      {icon:"🌤️",title:"Connaissance locale",desc:"Coco connaît les prix, activités, restaurants et conseils de Samui."},
      {icon:"🌍",title:"Multilingue natif",desc:"Écrivez dans n'importe quelle langue. Coco détecte et répond dans la vôtre."},
      {icon:"🎯",title:"Personnalisé",desc:"Donnez votre profil et chaque recommandation s'adapte."},
      {icon:"🏨",title:"Pour votre hôtel",desc:"Intégrable en 5 lignes de code, avec votre propre identité visuelle."},
    ],
    testimonials_title:"Ce qu'en disent les hôteliers.",
    testimonials:[
      {quote:"Nos clients russes nous écrivent à 23h pour planifier le lendemain. Coco répond parfaitement — nos équipes sont soulagées.",name:"Sophie M.",role:"Guest Relations Manager · Resort 5★ Lamai"},
      {quote:"En 3 semaines, Coco a généré 40+ réservations trackées vers notre spa. ROI immédiat.",name:"Théodore K.",role:"Directeur · Boutique Resort Bophut"},
      {quote:"Coco connaît Samui comme un local. C'est crédible — pas un chatbot générique.",name:"Markus R.",role:"GM · Wellness Resort Maenam"},
    ],
    pricing_badge:"Tarifs",pricing_title:"Simple. Transparent. Rentable.",pricing_sub:"14 jours d'essai gratuit — sans engagement — annulable à tout moment.",
    pricing:[
      {name:"Starter",price:2500,desc:"Pour se lancer",color:C.sand,features:["Widget FR + EN","Base de données Samui","Météo temps réel","Mises à jour mensuelles","Support email"],cta:"Essai 14 jours"},
      {name:"Partner",price:4500,desc:"Le plus populaire",color:C.teal,highlight:true,features:["Tout Starter +","6 langues complètes","Co-branding personnalisé","Rapport leads mensuel","Support WhatsApp prioritaire"],cta:"Démarrer maintenant"},
      {name:"Premium",price:8000,desc:"Pour les grands hôtels",color:C.coral,features:["Tout Partner +","WhatsApp Business intégré","QR codes chambre","Dashboard analytics live","Support dédié 7j/7"],cta:"Nous contacter"},
    ],
    cta_title:"Prêt à offrir une île entière\nà vos clients ?",
    cta_sub:"Démo en 15 min. Installation en 1h. Premier client servi dès le jour 1.",
    cta_btn:"Demander une démo gratuite →",
    cta_pills:["14 jours gratuits","Sans engagement","Installation 1h","Support WhatsApp"],
    form_hotel:"Nom de votre hôtel",form_email:"Votre email professionnel",
    form_thanks_title:"Merci !",form_thanks_sub:"Cyril vous contacte dans les 24h via WhatsApp ou email pour organiser la démo.",
    footer_links:["Confidentialité","CGU","Cookies"],footer_copy:"© 2026 Coconut Projects · Koh Samui, Thaïlande",
    nav:[{label:"Fonctionnalités",href:"#features"},{label:"Démo live",href:"#demo"},{label:"Tarifs",href:"#pricing"},{label:"Contact",href:"#contact"}],
    nav_cta:"Tester Coco →",
    hotels_ticker:["Banyan Tree","Santiburi","Anantara","Centara Reserve","Six Senses","Hansar","Silavadee","W Koh Samui","InterContinental","Ritz-Carlton","Four Seasons","Kamalaya"],
    chat_placeholder:"Écrivez à Coco... (Entrée pour envoyer)",
    chat_online:"EN LIGNE · IA TEMPS RÉEL",
    chat_suggested:["On est en couple pour 5 jours, budget moyen 🌺","Famille avec 2 enfants, que faire ? 🏖️","Meilleures plongées de l'île 🤿","Top restaurants avec vue mer 🍽️"],
    chat_restart:"↺ Relancer la démo",
    chat_error:"Connexion momentanément indisponible. Réessayez.",
    powered:"Propulsé par",
    scroll_hint:"Découvrir",
  }
};

const COCO_SYSTEM=`You are Coco 🥥, the local AI travel concierge for Koh Samui, Thailand. You are embedded on a hotel partner's website.

IDENTITY: You are warm, precise, local — like a friend who has lived on the island for 10 years. You always respond with: short description + price in THB + practical tip or link. You use exactly 1 emoji per message. You suggest maximum 3 recommendations per response. You automatically detect the guest's language (FR, EN, RU, DE, SV) and reply in their language.

KOH SAMUI KNOWLEDGE:
ZONES: Bophut (fishing village, Fisherman's Village, romantic), Chaweng (lively, 7km beach, nightlife), Lamai (relaxed, local, wellness), Maenam (calm, family-friendly, cheaper), Choeng Mon (turquoise premium water), Plai Laem/Big Buddha (culture, temples), Taling Ngam (west coast, spectacular sunsets)

TOP ACTIVITIES:
- Ang Thong Marine Park: 1,800 THB adult, 1,200 THB child. 42 pristine islands, snorkeling, kayak. Departs 8am Bophut Pier. Calm sea required
- Diving Koh Tao: 2-tank fun dive 3,500 THB, PADI OWD 12,000 THB. Best diving in the Gulf
- Na Muang Waterfalls: 100 THB entry. Na Muang 1 (easy, swimming) + Na Muang 2 (45min trek)
- Samui Elephant Sanctuary: 2,500 THB adult, 1,800 THB child. Ethical, no riding
- Sunrise Pagoda Khao Hua Jook: free, depart 5:30am, 360° view
- Fisherman's Village Market: free, Friday 5pm-10pm, best event on the island
- Thai cooking class Pai Cookery: 1,800 THB, includes market visit + 4 dishes
- Jungle Club dinner: ~800 THB/person, book for sunset at 6:30pm
- Sunset cruise: 2,200 THB adult, 1,500 THB child

TOP SPAS:
- Tamarind Springs (Lamai): 1,800 THB. Jungle, natural pools. Best on the island
- Ban Sabai Spa (Chaweng): 400 THB. Best value for money
- Vikasa Yoga: 600 THB per class, panoramic view
- Kamalaya: 4,500 THB. Best wellness resort in SE Asia

SECRET SPOTS:
- Silver Beach (between Chaweng and Lamai): most beautiful, least known. Access via 10min trail
- Bang Po (West Maenam): ultra-local, best fresh seafood from fishermen
- Choeng Mon: best water quality on the island

PRACTICAL INFO:
- Currency: Thai Baht (THB). 1 EUR ≈ 38-40 THB
- SIM: AIS recommended, 299 THB/30 days unlimited data
- Emergencies: Tourist Police 1155, Ambulance 1669
- Hospital: Bangkok Hospital Samui +66 77 429 500

WEATHER & SEASONS:
- High season (Dec-Apr): ideal, calm sea → all activities recommended
- Shoulder (May-Jun, Nov): some showers, still good
- Rainy season (Jul-Oct): rough sea, suggest spa/cooking/temples in bad weather

Always be proactive: if someone says 'couple' → suggest romantic options, 'family' → think about children, 'adventure' → diving and excursions, 'wellness' → Kamalaya or Tamarind Springs.`;

const Palm=({size=48,color=C.teal,opacity=1})=>(
  <svg width={size} height={size*1.2} viewBox="0 0 60 72" fill="none" style={{opacity}}>
    <path d="M30 68 C30 68 28 42 30 24" stroke={color} strokeWidth="2.2" strokeLinecap="round"/>
    <path d="M30 24 C26 14 14 9 8 16 C18 15 25 20 30 28" fill={color}/>
    <path d="M30 26 C34 14 46 9 52 16 C42 15 35 20 30 30" fill={color} opacity="0.85"/>
    <path d="M30 30 C20 22 10 26 9 35 C17 30 26 30 30 38" fill={color} opacity="0.7"/>
    <path d="M30 32 C40 24 50 28 51 37 C43 32 34 32 30 40" fill={color} opacity="0.6"/>
    <ellipse cx="30" cy="68" rx="9" ry="3.5" fill={color} opacity="0.15"/>
  </svg>
);

const CocoMark=({dark=true,size="md"})=>{
  const s={sm:{palm:22,text:18,sub:8},md:{palm:32,text:26,sub:9},lg:{palm:48,text:40,sub:12}}[size];
  const tc=dark?C.white:C.tealDeep,ac=dark?C.sand:C.coral,pc=dark?C.sand:C.teal;
  return(
    <div style={{display:"flex",alignItems:"center",gap:s.palm*0.35}}>
      <div style={{position:"relative",flexShrink:0}}>
        <Palm size={s.palm} color={pc}/>
        <div style={{position:"absolute",bottom:8,right:-4,width:s.palm*0.38,height:s.palm*0.38,background:ac,borderRadius:"50%",border:`2px solid ${dark?C.tealDeep:C.white}`}}/>
      </div>
      <div style={{lineHeight:1}}>
        <div style={{fontFamily:"'Cormorant Garamond',Georgia,serif",fontSize:s.text,fontWeight:700,color:tc,letterSpacing:"0.14em",textTransform:"uppercase"}}>Coco</div>
        {size!=="sm"&&<div style={{fontFamily:"'DM Sans',sans-serif",fontSize:s.sub,fontWeight:400,color:dark?"rgba(255,255,255,0.5)":C.muted,letterSpacing:"0.22em",textTransform:"uppercase",marginTop:3}}>Samui Concierge AI</div>}
      </div>
    </div>
  );
};

function useInView(ref){const[v,setV]=useState(false);useEffect(()=>{const el=ref.current;if(!el)return;const obs=new IntersectionObserver(([e])=>{if(e.isIntersecting)setV(true);},{threshold:0.12});obs.observe(el);return()=>obs.disconnect();},[]);return v;}
function FadeIn({children,delay=0,style={}}){const ref=useRef();const v=useInView(ref);return<div ref={ref} style={{opacity:v?1:0,transform:v?"translateY(0)":"translateY(28px)",transition:`opacity 0.7s ease ${delay}s, transform 0.7s ease ${delay}s`,...style}}>{children}</div>;}

function CocoChat({t}){
  const[messages,setMessages]=useState([{role:"assistant",content:t.lang==="en"?"Hi! I'm Coco 🥥 Your local guide on Koh Samui. Tell me everything — budget, interests, trip length — and I'll craft something unforgettable!":"Bonjour ! Je suis Coco 🥥 Votre guide local sur Koh Samui. Dites-moi tout — budget, envies, durée — je vous compose un séjour sur mesure !"}]);
  const[input,setInput]=useState("");const[loading,setLoading]=useState(false);const[error,setError]=useState(null);
  const endRef=useRef();const inputRef=useRef();
  useEffect(()=>{endRef.current?.scrollIntoView({behavior:"smooth"});},[messages,loading]);
  const sendMessage=useCallback(async()=>{
    const text=input.trim();if(!text||loading)return;
    setInput("");setError(null);
    const userMsg={role:"user",content:text};
    const newMessages=[...messages,userMsg];
    setMessages(newMessages);setLoading(true);
    try{
      const res=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1000,system:COCO_SYSTEM,messages:newMessages.map(m=>({role:m.role,content:m.content}))})});
      if(!res.ok)throw new Error();
      const data=await res.json();
      const reply=data.content?.map(b=>b.text||"").join("")||"Sorry, I could not respond.";
      setMessages(prev=>[...prev,{role:"assistant",content:reply}]);
    }catch(e){setError(t.chat_error);}
    finally{setLoading(false);setTimeout(()=>inputRef.current?.focus(),100);}
  },[input,messages,loading,t]);
  const handleKey=(e)=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();sendMessage();}};

  return(
    <div style={{background:C.white,borderRadius:28,overflow:"hidden",boxShadow:`0 28px 80px rgba(11,53,53,0.2)`,display:"flex",flexDirection:"column",height:560,width:"100%"}}>
      <div style={{background:`linear-gradient(135deg,${C.tealDeep} 0%,${C.teal} 100%)`,padding:"16px 20px",display:"flex",alignItems:"center",justifyContent:"space-between",flexShrink:0}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div style={{width:40,height:40,borderRadius:13,background:"rgba(255,255,255,0.12)",display:"flex",alignItems:"center",justifyContent:"center"}}>
            <Palm size={24} color={C.sand}/>
          </div>
          <div>
            <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:19,fontWeight:700,color:C.white,letterSpacing:"0.12em"}}>COCO</div>
            <div style={{display:"flex",alignItems:"center",gap:5}}>
              <div style={{width:6,height:6,borderRadius:"50%",background:"#4ADE80",boxShadow:"0 0 7px #4ADE80",animation:"pulse 2s infinite"}}/>
              <span style={{fontSize:9,color:"rgba(255,255,255,0.55)",letterSpacing:"0.2em"}}>{t.chat_online}</span>
            </div>
          </div>
        </div>
        <div style={{fontSize:10,color:"rgba(255,255,255,0.3)",letterSpacing:"0.12em",textAlign:"right"}}>{t.powered}<br/><span style={{color:"rgba(255,255,255,0.55)",fontWeight:600}}>Claude AI</span></div>
      </div>
      <div style={{flex:1,overflowY:"auto",padding:"16px",background:"#F2EAD8",display:"flex",flexDirection:"column",gap:12}}>
        {messages.map((m,i)=>(
          <div key={i} style={{display:"flex",justifyContent:m.role==="user"?"flex-end":"flex-start",gap:8}}>
            {m.role==="assistant"&&<div style={{width:28,height:28,borderRadius:9,background:C.teal,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,alignSelf:"flex-end"}}><Palm size={15} color={C.sand}/></div>}
            <div style={{maxWidth:"78%",background:m.role==="assistant"?C.white:C.teal,color:m.role==="assistant"?C.charcoal:C.white,borderRadius:m.role==="assistant"?"4px 16px 16px 16px":"16px 4px 16px 16px",padding:"11px 15px",fontSize:13,lineHeight:1.65,boxShadow:"0 2px 10px rgba(0,0,0,0.07)",whiteSpace:"pre-wrap",fontFamily:"'DM Sans',sans-serif",wordBreak:"break-word"}}>{m.content}</div>
          </div>
        ))}
        {loading&&<div style={{display:"flex",gap:8,alignItems:"flex-end"}}><div style={{width:28,height:28,borderRadius:9,background:C.teal,display:"flex",alignItems:"center",justifyContent:"center"}}><Palm size={15} color={C.sand}/></div><div style={{background:C.white,borderRadius:"4px 16px 16px 16px",padding:"13px 16px",display:"flex",gap:5,boxShadow:"0 2px 10px rgba(0,0,0,0.07)"}}>{[0,1,2].map(i=><div key={i} style={{width:7,height:7,borderRadius:"50%",background:C.teal,opacity:0.5,animation:`bounce 1.2s ease-in-out ${i*0.2}s infinite`}}/>)}</div></div>}
        {error&&<div style={{background:"#FFF0EE",border:`1px solid ${C.coral}30`,borderRadius:12,padding:"10px 14px",fontSize:12,color:C.coral,textAlign:"center"}}>⚠️ {error}</div>}
        {messages.length===1&&!loading&&<div style={{display:"flex",flexWrap:"wrap",gap:7,marginTop:4}}>{t.chat_suggested.map(s=><button key={s} onClick={()=>{setInput(s);}} style={{background:C.white,border:`1px solid ${C.tealLight}25`,borderRadius:20,padding:"7px 13px",fontSize:11.5,color:C.teal,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",fontWeight:500}}>{s}</button>)}</div>}
        <div ref={endRef}/>
      </div>
      <div style={{padding:"12px 14px",background:C.white,borderTop:`1px solid ${C.creamDark}`,display:"flex",gap:10,alignItems:"flex-end",flexShrink:0}}>
        <textarea ref={inputRef} value={input} onChange={e=>setInput(e.target.value)} onKeyDown={handleKey} placeholder={t.chat_placeholder} rows={1} style={{flex:1,border:"none",background:C.cream,borderRadius:16,padding:"11px 16px",fontSize:13,color:C.charcoal,outline:"none",fontFamily:"'DM Sans',sans-serif",resize:"none",lineHeight:1.5,maxHeight:100,overflowY:"auto"}}/>
        <button onClick={sendMessage} disabled={!input.trim()||loading} style={{width:40,height:40,borderRadius:13,background:(!input.trim()||loading)?C.mutedLight:C.coral,border:"none",cursor:(!input.trim()||loading)?"default":"pointer",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,transition:"all 0.2s",boxShadow:(!input.trim()||loading)?"none":`0 4px 16px ${C.coral}55`}}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M22 2L11 13M22 2L15 22L11 13L2 9L22 2Z" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
      </div>
    </div>
  );
}

export default function CocoLandingBilingual(){
  const[lang,setLang]=useState("en");
  const[scrolled,setScrolled]=useState(false);
  const[formData,setFormData]=useState({hotel:"",email:""});
  const[formSent,setFormSent]=useState(false);
  const t={...T[lang],lang};

  useEffect(()=>{
    const style=document.createElement("style");
    style.textContent=FONTS+`*{box-sizing:border-box;margin:0;padding:0;}html{scroll-behavior:smooth;}body{background:${C.cream};overflow-x:hidden;}@keyframes fadeUp{from{opacity:0;transform:translateY(18px);}to{opacity:1;transform:translateY(0);}}@keyframes bounce{0%,80%,100%{transform:translateY(0);}40%{transform:translateY(-7px);}}@keyframes pulse{0%,100%{opacity:1;}50%{opacity:0.4;}}@keyframes scroll{0%{transform:translateX(0);}100%{transform:translateX(-50%);}}@keyframes floatA{0%,100%{transform:translateY(0);}50%{transform:translateY(-14px);}}::-webkit-scrollbar{width:4px;}::-webkit-scrollbar-thumb{background:${C.teal}40;border-radius:2px;}textarea::placeholder{color:${C.mutedLight};}input::placeholder{color:${C.mutedLight};}`;
    document.head.appendChild(style);
    const onScroll=()=>setScrolled(window.scrollY>60);
    window.addEventListener("scroll",onScroll);
    return()=>{document.head.removeChild(style);window.removeEventListener("scroll",onScroll);};
  },[]);

  return(
    <div style={{fontFamily:"'DM Sans',sans-serif",background:C.cream,overflowX:"hidden"}}>

      {/* NAV */}
      <nav style={{position:"fixed",top:0,left:0,right:0,zIndex:1000,padding:scrolled?"12px 32px":"20px 32px",background:scrolled?`rgba(11,53,53,0.96)`:"transparent",backdropFilter:scrolled?"blur(20px)":"none",borderBottom:scrolled?"1px solid rgba(255,255,255,0.07)":"none",transition:"all 0.3s ease",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <CocoMark dark size="sm"/>
        <div style={{display:"flex",alignItems:"center",gap:24}}>
          {t.nav.map(l=><a key={l.label} href={l.href} style={{color:"rgba(255,255,255,0.7)",fontSize:13,fontWeight:500,textDecoration:"none",transition:"color 0.2s"}} onMouseEnter={e=>e.target.style.color=C.sand} onMouseLeave={e=>e.target.style.color="rgba(255,255,255,0.7)"}>{l.label}</a>)}
          {/* Language toggle */}
          <div style={{display:"flex",gap:4,background:"rgba(255,255,255,0.1)",borderRadius:20,padding:"3px"}}>
            {["en","fr"].map(l=><button key={l} onClick={()=>setLang(l)} style={{padding:"5px 12px",borderRadius:16,border:"none",cursor:"pointer",fontSize:11,fontWeight:600,background:lang===l?"rgba(255,255,255,0.2)":"transparent",color:lang===l?C.white:"rgba(255,255,255,0.45)",fontFamily:"'DM Sans',sans-serif",transition:"all 0.2s",letterSpacing:"0.08em"}}>{l.toUpperCase()}</button>)}
          </div>
          <a href="#demo" style={{padding:"10px 20px",background:C.coral,color:C.white,borderRadius:24,fontSize:13,fontWeight:600,textDecoration:"none",boxShadow:`0 4px 18px ${C.coral}50`,transition:"all 0.2s"}} onMouseEnter={e=>{e.target.style.transform="translateY(-1px)";}} onMouseLeave={e=>{e.target.style.transform="";}}>{t.nav_cta}</a>
        </div>
      </nav>

      {/* HERO */}
      <section style={{minHeight:"100vh",background:`linear-gradient(155deg,${C.tealDeep} 0%,${C.tealMid} 45%,#0D4545 75%,#183030 100%)`,display:"flex",alignItems:"center",position:"relative",overflow:"hidden",padding:"120px 40px 80px"}}>
        {[{size:240,op:0.06,top:"-10%",right:"1%"},{size:170,op:0.05,top:"12%",right:"20%"},{size:300,op:0.04,bottom:"-18%",right:"-3%"}].map((p,i)=>(
          <div key={i} style={{position:"absolute",top:p.top,bottom:p.bottom,right:p.right,opacity:p.op,pointerEvents:"none",animation:`floatA ${6+i*2}s ease-in-out ${i}s infinite`}}><Palm size={p.size} color={C.sand}/></div>
        ))}
        <div style={{maxWidth:1200,margin:"0 auto",width:"100%",display:"flex",alignItems:"center",gap:64,flexWrap:"wrap"}}>
          <div style={{flex:"1 1 460px"}}>
            <div style={{display:"inline-flex",alignItems:"center",gap:8,background:"rgba(232,201,122,0.12)",border:"1px solid rgba(232,201,122,0.25)",borderRadius:24,padding:"7px 16px",marginBottom:28,animation:"fadeUp 0.7s ease both"}}>
              <div style={{width:6,height:6,borderRadius:"50%",background:C.sand}}/>
              <span style={{fontSize:11,color:C.sand,fontWeight:500,letterSpacing:"0.2em",textTransform:"uppercase"}}>AI Concierge · Koh Samui · Real-time</span>
            </div>
            <h1 style={{fontFamily:"'Cormorant Garamond',Georgia,serif",fontSize:"clamp(44px,6vw,78px)",fontWeight:600,color:C.white,lineHeight:1.04,marginBottom:24,animation:"fadeUp 0.7s ease 0.1s both"}}>
              {lang==="en"?"The island in":"L'île dans"}<br/>
              <em style={{color:C.sand,fontStyle:"italic",fontWeight:300}}>{lang==="en"?"your pocket.":"la poche."}</em>
            </h1>
            <p style={{fontSize:17,color:"rgba(255,255,255,0.6)",lineHeight:1.78,maxWidth:480,marginBottom:44,animation:"fadeUp 0.7s ease 0.2s both",fontWeight:300}}>{t.hero_sub}</p>
            <div style={{display:"flex",gap:14,flexWrap:"wrap",animation:"fadeUp 0.7s ease 0.3s both",marginBottom:52}}>
              <a href="#demo" style={{padding:"15px 32px",background:C.coral,color:C.white,borderRadius:28,fontSize:14,fontWeight:600,textDecoration:"none",boxShadow:`0 6px 28px ${C.coral}60`,transition:"all 0.25s"}} onMouseEnter={e=>e.target.style.transform="translateY(-2px)"} onMouseLeave={e=>e.target.style.transform=""}>{t.hero_cta1}</a>
              <a href="#pricing" style={{padding:"15px 32px",background:"rgba(255,255,255,0.08)",color:"rgba(255,255,255,0.82)",borderRadius:28,fontSize:14,fontWeight:500,textDecoration:"none",border:"1px solid rgba(255,255,255,0.15)",backdropFilter:"blur(8px)",transition:"all 0.25s"}}>{t.hero_cta2}</a>
            </div>
            <div style={{display:"flex",gap:36,flexWrap:"wrap",animation:"fadeUp 0.7s ease 0.4s both"}}>
              {t.stats.map(([v,l])=>(
                <div key={l}><div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:30,fontWeight:700,color:C.sand,lineHeight:1}}>{v}</div><div style={{fontSize:10,color:"rgba(255,255,255,0.4)",letterSpacing:"0.18em",textTransform:"uppercase",marginTop:4}}>{l}</div></div>
              ))}
            </div>
          </div>
          <div style={{flex:"0 1 400px",animation:"fadeUp 0.8s ease 0.35s both"}}><CocoChat t={t}/></div>
        </div>
      </section>

      {/* TICKER */}
      <div style={{background:C.tealDeep,padding:"16px 0",overflow:"hidden",borderBottom:"1px solid rgba(255,255,255,0.06)"}}>
        <div style={{display:"flex",animation:"scroll 28s linear infinite",width:"max-content"}}>
          {[...t.hotels_ticker,...t.hotels_ticker].map((h,i)=>(
            <div key={i} style={{display:"flex",alignItems:"center",gap:18,padding:"0 28px"}}>
              <Palm size={12} color={C.sand} opacity={0.45}/>
              <span style={{fontSize:11,color:"rgba(255,255,255,0.35)",letterSpacing:"0.2em",textTransform:"uppercase",fontWeight:500,whiteSpace:"nowrap"}}>{h}</span>
            </div>
          ))}
        </div>
      </div>

      {/* PROBLEM */}
      <section style={{background:C.cream,padding:"96px 40px"}}>
        <div style={{maxWidth:1000,margin:"0 auto"}}>
          <FadeIn style={{textAlign:"center",marginBottom:60}}>
            <div style={{display:"inline-block",background:`${C.coral}14`,borderRadius:24,padding:"7px 18px",marginBottom:18}}><span style={{fontSize:11,color:C.coral,fontWeight:600,letterSpacing:"0.2em",textTransform:"uppercase"}}>{t.problem_badge}</span></div>
            <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"clamp(28px,4vw,50px)",fontWeight:600,color:C.tealDeep,lineHeight:1.12,maxWidth:660,margin:"0 auto 18px",whiteSpace:"pre-line"}}>{t.problem_title}</h2>
            <p style={{fontSize:15,color:C.muted,maxWidth:520,margin:"0 auto",lineHeight:1.75}}>{t.problem_sub}</p>
          </FadeIn>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(280px, 1fr))",gap:20}}>
            {[{title:t.before_title,items:t.before_items,dark:false},{title:t.after_title,items:t.after_items,dark:true}].map(col=>(
              <FadeIn key={col.title} delay={col.dark?0.1:0}>
                <div style={{background:col.dark?`linear-gradient(135deg,${C.tealDeep},${C.teal})`:C.white,borderRadius:20,padding:"32px 28px",border:col.dark?"none":`1px solid ${C.creamDark}`,boxShadow:col.dark?`0 16px 48px ${C.teal}28`:"0 4px 24px rgba(0,0,0,0.06)",height:"100%"}}>
                  <div style={{fontSize:32,marginBottom:12}}>{col.dark?"🥥":"😰"}</div>
                  <h3 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:26,fontWeight:600,color:col.dark?C.white:C.tealDeep,marginBottom:20}}>{col.title}</h3>
                  {col.items.map((item,i)=>(
                    <div key={i} style={{display:"flex",alignItems:"flex-start",gap:10,marginBottom:12}}>
                      <div style={{width:18,height:18,borderRadius:"50%",background:col.dark?`${C.sand}22`:`${C.coral}14`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginTop:1}}><span style={{fontSize:9,color:col.dark?C.sand:C.coral,fontWeight:700}}>{col.dark?"✓":"✗"}</span></div>
                      <span style={{fontSize:13.5,color:col.dark?"rgba(255,255,255,0.78)":C.charcoal,lineHeight:1.55}}>{item}</span>
                    </div>
                  ))}
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" style={{background:C.tealDeep,padding:"96px 40px"}}>
        <div style={{maxWidth:1100,margin:"0 auto"}}>
          <FadeIn style={{textAlign:"center",marginBottom:60}}>
            <div style={{display:"inline-block",background:`${C.sand}20`,borderRadius:24,padding:"7px 18px",marginBottom:18}}><span style={{fontSize:11,color:C.sand,fontWeight:600,letterSpacing:"0.2em",textTransform:"uppercase"}}>{t.feat_badge}</span></div>
            <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"clamp(28px,4vw,48px)",fontWeight:600,color:C.white,lineHeight:1.15,marginBottom:14}}>{t.feat_title}</h2>
            <p style={{fontSize:14,color:"rgba(255,255,255,0.45)",maxWidth:440,margin:"0 auto"}}>{t.feat_sub}</p>
          </FadeIn>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(230px, 1fr))",gap:14}}>
            {t.features.map((f,i)=>(
              <FadeIn key={f.title} delay={i*0.06}>
                <div style={{background:"rgba(255,255,255,0.05)",borderRadius:18,padding:"22px 18px",border:"1px solid rgba(255,255,255,0.07)",transition:"all 0.25s"}} onMouseEnter={e=>{e.currentTarget.style.background="rgba(255,255,255,0.09)";e.currentTarget.style.transform="translateY(-3px)";}} onMouseLeave={e=>{e.currentTarget.style.background="rgba(255,255,255,0.05)";e.currentTarget.style.transform="";}}>
                  <div style={{fontSize:26,marginBottom:10}}>{f.icon}</div>
                  <div style={{fontSize:13.5,fontWeight:600,color:C.sand,marginBottom:7}}>{f.title}</div>
                  <div style={{fontSize:12,color:"rgba(255,255,255,0.48)",lineHeight:1.65}}>{f.desc}</div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* DEMO */}
      <section id="demo" style={{background:C.cream,padding:"96px 40px"}}>
        <div style={{maxWidth:1160,margin:"0 auto"}}>
          <FadeIn style={{textAlign:"center",marginBottom:56}}>
            <div style={{display:"inline-flex",alignItems:"center",gap:8,background:`${C.teal}14`,borderRadius:24,padding:"7px 18px",marginBottom:18}}>
              <div style={{width:7,height:7,borderRadius:"50%",background:"#4ADE80",boxShadow:"0 0 8px #4ADE80",animation:"pulse 2s infinite"}}/>
              <span style={{fontSize:11,color:C.teal,fontWeight:600,letterSpacing:"0.2em",textTransform:"uppercase"}}>{t.demo_badge}</span>
            </div>
            <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"clamp(28px,4vw,50px)",fontWeight:600,color:C.tealDeep,lineHeight:1.12,marginBottom:16,whiteSpace:"pre-line"}}>{t.demo_title}</h2>
            <p style={{fontSize:15,color:C.muted,maxWidth:520,margin:"0 auto"}}>{t.demo_sub}</p>
          </FadeIn>
          <div style={{display:"flex",gap:40,alignItems:"flex-start",flexWrap:"wrap"}}>
            <FadeIn delay={0.1} style={{flex:"0 1 480px",height:560}}><CocoChat t={t}/></FadeIn>
            <FadeIn delay={0.2} style={{flex:"1 1 300px"}}>
              <div style={{display:"flex",flexDirection:"column",gap:16}}>
                {t.demo_features.map((item,i)=>(
                  <div key={i} style={{background:C.white,borderRadius:16,padding:"18px 18px",display:"flex",gap:14,alignItems:"flex-start",boxShadow:"0 2px 16px rgba(0,0,0,0.05)",borderLeft:`3px solid ${C.teal}30`}}>
                    <span style={{fontSize:22,flexShrink:0}}>{item.icon}</span>
                    <div><div style={{fontSize:13.5,fontWeight:600,color:C.tealDeep,marginBottom:5}}>{item.title}</div><div style={{fontSize:12,color:C.muted,lineHeight:1.6}}>{item.desc}</div></div>
                  </div>
                ))}
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section style={{background:`linear-gradient(135deg,${C.tealDeep},#0D4848)`,padding:"96px 40px"}}>
        <div style={{maxWidth:1100,margin:"0 auto"}}>
          <FadeIn style={{textAlign:"center",marginBottom:52}}>
            <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"clamp(26px,4vw,44px)",fontWeight:600,color:C.white,lineHeight:1.2}}>{t.testimonials_title.split(".")[0]}.<br/><em style={{color:C.sand,fontStyle:"italic"}}>{t.testimonials_title.split(".")[1]?.trim()}</em></h2>
          </FadeIn>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(290px, 1fr))",gap:18}}>
            {t.testimonials.map((ts,i)=>(
              <FadeIn key={i} delay={i*0.1}>
                <div style={{background:"rgba(255,255,255,0.06)",borderRadius:20,padding:"26px 22px",border:"1px solid rgba(255,255,255,0.07)",height:"100%",display:"flex",flexDirection:"column"}}>
                  <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:40,color:C.sand,opacity:0.5,lineHeight:1,marginBottom:14}}>"</div>
                  <p style={{fontSize:13.5,color:"rgba(255,255,255,0.72)",lineHeight:1.78,flex:1,fontStyle:"italic"}}>{ts.quote}</p>
                  <div style={{marginTop:18,paddingTop:18,borderTop:"1px solid rgba(255,255,255,0.09)"}}>
                    <div style={{fontSize:13,fontWeight:600,color:C.sand}}>{ts.name}</div>
                    <div style={{fontSize:11,color:"rgba(255,255,255,0.38)",marginTop:2}}>{ts.role}</div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" style={{background:C.cream,padding:"96px 40px"}}>
        <div style={{maxWidth:980,margin:"0 auto"}}>
          <FadeIn style={{textAlign:"center",marginBottom:60}}>
            <div style={{display:"inline-block",background:`${C.coral}14`,borderRadius:24,padding:"7px 18px",marginBottom:18}}><span style={{fontSize:11,color:C.coral,fontWeight:600,letterSpacing:"0.2em",textTransform:"uppercase"}}>{t.pricing_badge}</span></div>
            <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"clamp(28px,4vw,48px)",fontWeight:600,color:C.tealDeep,lineHeight:1.12,marginBottom:12}}>{t.pricing_title}</h2>
            <p style={{fontSize:14,color:C.muted}}>{t.pricing_sub}</p>
          </FadeIn>
          <div style={{display:"grid",gridTemplateColumns:"repeat(3, 1fr)",gap:20}}>
            {t.pricing.map((p,i)=>(
              <FadeIn key={p.name} delay={i*0.1}>
                <div style={{background:p.highlight?`linear-gradient(155deg,${C.tealDeep},${C.teal})`:C.white,borderRadius:24,overflow:"hidden",boxShadow:p.highlight?`0 20px 60px ${C.teal}35`:"0 4px 24px rgba(0,0,0,0.07)",border:p.highlight?"none":`1px solid ${C.creamDark}`,transform:p.highlight?"scale(1.04)":"scale(1)",position:"relative"}}>
                  {p.highlight&&<div style={{position:"absolute",top:0,left:0,right:0,height:3,background:`linear-gradient(90deg,${C.sand},${C.coral})`}}/>}
                  <div style={{padding:"26px 22px 0"}}>
                    {p.highlight&&<div style={{display:"inline-block",background:`${C.sand}22`,borderRadius:20,padding:"4px 12px",marginBottom:12}}><span style={{fontSize:9,color:C.sand,fontWeight:700,letterSpacing:"0.15em"}}>⭐ POPULAR</span></div>}
                    <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:24,fontWeight:700,color:p.highlight?C.white:C.tealDeep}}>{p.name}</div>
                    <div style={{display:"flex",alignItems:"baseline",gap:5,margin:"12px 0 20px"}}>
                      <span style={{fontFamily:"'Cormorant Garamond',serif",fontSize:40,fontWeight:700,color:p.highlight?C.sand:p.color,lineHeight:1}}>{p.price.toLocaleString()}</span>
                      <span style={{fontSize:11,color:p.highlight?"rgba(255,255,255,0.38)":C.muted}}>THB/month</span>
                    </div>
                  </div>
                  <div style={{padding:"0 22px 26px"}}>
                    <div style={{width:"100%",height:1,background:p.highlight?"rgba(255,255,255,0.1)":C.creamDark,marginBottom:18}}/>
                    {p.features.map((f,j)=><div key={j} style={{display:"flex",alignItems:"flex-start",gap:9,marginBottom:10}}><span style={{fontSize:10,color:p.highlight?C.sand:p.color,marginTop:2,fontWeight:700}}>✓</span><span style={{fontSize:12.5,color:p.highlight?"rgba(255,255,255,0.7)":C.charcoal,lineHeight:1.5}}>{f}</span></div>)}
                    <a href="#contact" style={{display:"block",width:"100%",padding:"13px",borderRadius:14,border:p.highlight?"none":`1.5px solid ${p.color}`,background:p.highlight?C.coral:"transparent",color:p.highlight?C.white:p.color,fontFamily:"'DM Sans',sans-serif",fontSize:13,fontWeight:600,cursor:"pointer",textAlign:"center",textDecoration:"none",marginTop:18,transition:"all 0.2s",boxShadow:p.highlight?`0 6px 20px ${C.coral}50`:"none"}}>{p.cta}</a>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="contact" style={{background:`linear-gradient(135deg,${C.tealDeep} 0%,#0D4040 55%,${C.tealMid} 100%)`,padding:"96px 40px",position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",right:-60,bottom:-60,opacity:0.04,animation:"floatA 10s ease-in-out infinite"}}><Palm size={500} color={C.sand}/></div>
        <div style={{maxWidth:600,margin:"0 auto",textAlign:"center",position:"relative"}}>
          <FadeIn>
            <CocoMark dark size="md"/>
            <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"clamp(30px,4vw,52px)",fontWeight:600,color:C.white,lineHeight:1.1,margin:"26px 0 18px",whiteSpace:"pre-line"}}>{t.cta_title}</h2>
            <p style={{fontSize:14,color:"rgba(255,255,255,0.5)",lineHeight:1.78,maxWidth:420,margin:"0 auto 40px"}}>{t.cta_sub}</p>
            {!formSent?(
              <div style={{display:"flex",flexDirection:"column",gap:12,maxWidth:400,margin:"0 auto 32px"}}>
                <input value={formData.hotel} onChange={e=>setFormData(p=>({...p,hotel:e.target.value}))} placeholder={t.form_hotel} style={{padding:"15px 20px",borderRadius:14,border:"1px solid rgba(255,255,255,0.12)",background:"rgba(255,255,255,0.07)",color:C.white,fontSize:13.5,fontFamily:"'DM Sans',sans-serif",outline:"none"}}/>
                <input value={formData.email} onChange={e=>setFormData(p=>({...p,email:e.target.value}))} placeholder={t.form_email} style={{padding:"15px 20px",borderRadius:14,border:"1px solid rgba(255,255,255,0.12)",background:"rgba(255,255,255,0.07)",color:C.white,fontSize:13.5,fontFamily:"'DM Sans',sans-serif",outline:"none"}}/>
                <button onClick={()=>{if(formData.hotel&&formData.email)setFormSent(true);}} style={{padding:"16px",borderRadius:14,border:"none",background:C.coral,color:C.white,fontSize:14,fontWeight:600,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",boxShadow:`0 8px 32px ${C.coral}60`,transition:"all 0.25s"}} onMouseEnter={e=>e.target.style.transform="translateY(-2px)"} onMouseLeave={e=>e.target.style.transform=""}>{t.cta_btn}</button>
              </div>
            ):(
              <div style={{background:"rgba(74,222,128,0.1)",border:"1px solid rgba(74,222,128,0.25)",borderRadius:16,padding:"24px",maxWidth:400,margin:"0 auto 32px",textAlign:"center"}}>
                <div style={{fontSize:32,marginBottom:10}}>🥥</div>
                <div style={{fontSize:15,fontWeight:600,color:C.white,marginBottom:6}}>{t.form_thanks_title} {formData.hotel}!</div>
                <div style={{fontSize:13,color:"rgba(255,255,255,0.55)"}}>{t.form_thanks_sub}</div>
              </div>
            )}
            <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:20,flexWrap:"wrap",marginBottom:32}}>
              {t.cta_pills.map(pill=><div key={pill} style={{display:"flex",alignItems:"center",gap:5}}><span style={{fontSize:10,color:C.sand}}>✓</span><span style={{fontSize:11.5,color:"rgba(255,255,255,0.42)"}}>{pill}</span></div>)}
            </div>
            <div style={{paddingTop:24,borderTop:"1px solid rgba(255,255,255,0.08)",display:"flex",justifyContent:"center",gap:28,flexWrap:"wrap"}}>
              <a href="https://wa.me/66633753316" style={{display:"flex",alignItems:"center",gap:7,color:"rgba(255,255,255,0.45)",textDecoration:"none",fontSize:12.5,transition:"color 0.2s"}} onMouseEnter={e=>e.currentTarget.style.color=C.sand} onMouseLeave={e=>e.currentTarget.style.color="rgba(255,255,255,0.45)"}><span>📱</span> +66 633 753 316</a>
              <span style={{color:"rgba(255,255,255,0.15)"}}>·</span>
              <a href="mailto:coco@coconutprojects.com" style={{display:"flex",alignItems:"center",gap:7,color:"rgba(255,255,255,0.45)",textDecoration:"none",fontSize:12.5,transition:"color 0.2s"}} onMouseEnter={e=>e.currentTarget.style.color=C.sand} onMouseLeave={e=>e.currentTarget.style.color="rgba(255,255,255,0.45)"}><span>✉️</span> coco@coconutprojects.com</a>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{background:"#050F0F",padding:"32px 40px",display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:16}}>
        <CocoMark dark size="sm"/>
        <div style={{display:"flex",gap:24}}>{t.footer_links.map(l=><a key={l} href="#" style={{fontSize:11,color:"rgba(255,255,255,0.26)",textDecoration:"none",transition:"color 0.2s"}} onMouseEnter={e=>e.target.style.color="rgba(255,255,255,0.55)"} onMouseLeave={e=>e.target.style.color="rgba(255,255,255,0.26)"}>{l}</a>)}</div>
        <div style={{fontSize:11,color:"rgba(255,255,255,0.18)",letterSpacing:"0.06em"}}>{t.footer_copy}</div>
      </footer>
    </div>
  );
}
