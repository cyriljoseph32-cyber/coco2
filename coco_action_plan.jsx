import { useState } from "react";

const C = {
  teal: "#1B6B6B", tealDeep: "#0B3535", coral: "#E8724A",
  sand: "#E8C97A", cream: "#FAF3E6", white: "#FFFFFF",
  charcoal: "#1A1A1A", muted: "#8A7B6A", green: "#22C55E",
  creamDark: "#F0E6D0",
};

const DAYS = [
  {
    id: "wed",
    day: "Mercredi",
    date: "3 juin · Aujourd'hui",
    color: C.coral,
    icon: "🚀",
    label: "DÉPLOIEMENT",
    objective: "Mettre la landing page en ligne avec une URL partageable",
    tasks: [
      {
        id: "w1", time: "14h00", duration: "30 min", priority: "CRITIQUE",
        title: "Créer un compte Vercel",
        description: "Aller sur vercel.com → Sign up with GitHub (créer GitHub si besoin)",
        steps: [
          "Ouvrir vercel.com dans le navigateur",
          "Cliquer 'Start Deploying' → 'Continue with GitHub'",
          "Créer compte GitHub si pas existant (2 min)",
          "Autoriser Vercel à accéder à GitHub",
        ],
        link: "https://vercel.com",
        output: "Compte Vercel actif",
      },
      {
        id: "w2", time: "14h30", duration: "20 min", priority: "CRITIQUE",
        title: "Préparer le projet React",
        description: "Créer le projet minimal pour héberger la landing page Coco",
        steps: [
          "Ouvrir StackBlitz.com (aucune installation requise)",
          "Choisir 'React' comme template",
          "Remplacer le contenu de App.jsx par le code coco_landing_v2.jsx",
          "Vérifier que la page s'affiche correctement dans la preview",
        ],
        link: "https://stackblitz.com",
        output: "Preview fonctionnelle",
        tip: "StackBlitz fonctionne 100% dans le navigateur — aucune installation nécessaire depuis Samui",
      },
      {
        id: "w3", time: "15h00", duration: "15 min", priority: "CRITIQUE",
        title: "Déployer sur Vercel",
        description: "Connecter StackBlitz à Vercel pour obtenir l'URL publique",
        steps: [
          "Dans StackBlitz, cliquer 'Deploy' (bouton en haut à droite)",
          "Choisir 'Deploy to Vercel'",
          "Autoriser la connexion",
          "Attendre 2-3 minutes → URL générée automatiquement",
        ],
        output: "URL type : coco-ai.vercel.app",
        tip: "Cette URL sera partageable immédiatement. Fonctionnelle sur mobile et desktop.",
      },
      {
        id: "w4", time: "15h30", duration: "15 min", priority: "IMPORTANT",
        title: "Tester le chatbot sur l'URL live",
        description: "Vérifier que Coco répond bien via l'URL publique",
        steps: [
          "Ouvrir l'URL sur ton téléphone",
          "Envoyer 3 messages test en FR, EN, RU",
          "Vérifier les réponses de Coco",
          "Vérifier que la page est bien lisible sur mobile",
        ],
        output: "URL de démo confirmée et fonctionnelle",
      },
      {
        id: "w5", time: "16h00", duration: "20 min", priority: "IMPORTANT",
        title: "Enregistrer le domaine coco-samui.com",
        description: "Acheter le domaine pour crédibiliser la présentation",
        steps: [
          "Aller sur namecheap.com",
          "Chercher 'coco-samui.com' (~12$/an)",
          "Alternatives si pris : cocosamui.ai · askcoco.io · cocosamuiai.com",
          "Payer et connecter à Vercel (DNS Settings)",
        ],
        link: "https://www.namecheap.com",
        output: "Domaine acheté et connecté (propagation 24h)",
        tip: "Le domaine Vercel suffit pour cette semaine. Le domaine custom est un plus mais pas bloquant.",
      },
      {
        id: "w6", time: "17h00", duration: "30 min", priority: "IMPORTANT",
        title: "Préparer la vidéo démo (Loom)",
        description: "Enregistrer une démo de 2 min de Coco en action pour les emails",
        steps: [
          "Installer Loom (loom.com) sur ordinateur ou téléphone",
          "Enregistrer l'écran pendant une conversation avec Coco",
          "Montrer : FR → EN → suggestions d'activités → tarifs",
          "Obtenir le lien Loom partageable",
        ],
        link: "https://www.loom.com",
        output: "Vidéo démo 2 min avec lien partageable",
        tip: "Une vidéo de 2 min vaut mille mots. Les hôteliers voient immédiatement ce qu'ils achètent.",
      },
    ],
  },
  {
    id: "thu",
    day: "Jeudi",
    date: "4 juin",
    color: C.teal,
    icon: "📋",
    label: "PROSPECTION",
    objective: "Préparer tous les outils de contact et lancer la prospection",
    tasks: [
      {
        id: "t1", time: "9h00", duration: "30 min", priority: "CRITIQUE",
        title: "Finaliser la liste de contacts prioritaires",
        description: "6 hôtels à contacter en priorité — emails déjà compilés",
        steps: [
          "Anantara Bophut → bophutsamui@anantara.com",
          "Bandara Resort → stay@bandarasamui.com",
          "Hansar Samui → reservation@hansarsamui.com",
          "Amari Koh Samui → reservations.kohsamui@amari.com",
          "Santiburi → info@santiburisamui.com",
          "Centara Reserve → crs@chr.co.th",
        ],
        output: "Liste de 6 contacts validés",
        tip: "Commencer par les 4★ : décision plus rapide que les 5★. Bandara et Hansar sont les plus accessibles.",
      },
      {
        id: "t2", time: "9h30", duration: "45 min", priority: "CRITIQUE",
        title: "Personnaliser les 6 emails de contact",
        description: "Adapter le template d'email à chaque hôtel avec le nom du directeur si connu",
        steps: [
          "Ouvrir le template email déjà rédigé",
          "Personnaliser : [Nom hôtel], [Nom contact si connu], [Zone géographique]",
          "Ajouter l'URL de démo + lien vidéo Loom",
          "Attacher le PDF du pitch deck (exporter depuis PPTX)",
          "Relire attentivement chaque email avant envoi",
        ],
        output: "6 emails personnalisés prêts à l'envoi",
      },
      {
        id: "t3", time: "10h30", duration: "30 min", priority: "CRITIQUE",
        title: "Configurer WhatsApp Business",
        description: "Créer un profil WhatsApp Business pour les échanges professionnels",
        steps: [
          "Télécharger WhatsApp Business (si pas déjà installé)",
          "Créer le profil : 'Coco · Samui Concierge AI'",
          "Photo de profil : logo Coco (extraire du brand kit)",
          "Description : 'Assistant IA local pour hôtels · Koh Samui'",
          "Configurer message de bienvenue automatique",
        ],
        output: "WhatsApp Business configuré et professionnel",
      },
      {
        id: "t4", time: "11h00", duration: "15 min", priority: "CRITIQUE",
        title: "Envoyer les 6 emails priorité rouge",
        description: "Envoyer les emails personnalisés depuis ton email professionnel",
        steps: [
          "Envoyer depuis une adresse pro (cyril@coconutprojects.com ou similaire)",
          "Objet : 'Un concierge IA pour vos clients – disponible 24h/24, multilingue, sans coût RH'",
          "BCC toi-même pour avoir une trace",
          "Espacer les envois de 5-10 min pour éviter les filtres spam",
        ],
        output: "6 emails envoyés · Suivi dans agenda",
        tip: "Le mardi-jeudi matin entre 9h-11h = meilleur taux d'ouverture pour les décideurs.",
      },
      {
        id: "t5", time: "14h00", duration: "1h", priority: "IMPORTANT",
        title: "Démarchage terrain — hôtels Bophut & Lamai",
        description: "Se présenter physiquement à 2-3 hôtels de proximité",
        steps: [
          "Imprimer 5 exemplaires du pitch deck couleur",
          "Préparer la démo sur téléphone (URL live de Coco)",
          "Demander à parler au Guest Relations Manager ou Digital Manager",
          "Pitch en 5 min : problème → solution → démo live → tarifs",
          "Laisser le pitch deck imprimé + carte de visite",
        ],
        output: "2-3 rencontres physiques + leads chauds identifiés",
        tip: "La démo live sur téléphone est ton meilleur argument. Faire parler Coco en russe ou allemand devant eux = effet immédiat.",
      },
      {
        id: "t6", time: "16h00", duration: "30 min", priority: "IMPORTANT",
        title: "Contacter les conciergeries locales",
        description: "Les conciergeries peuvent devenir des prescripteurs ou partenaires",
        steps: [
          "MrSamui.com → formulaire contact sur le site",
          "Private Concierge Samui → via private-concierge-samui.com",
          "Samui & Koh → via samui-and-koh.com",
          "Proposition : partenariat (commission sur les clients référés)",
        ],
        output: "3 conciergeries contactées",
      },
      {
        id: "t7", time: "17h00", duration: "30 min", priority: "BONUS",
        title: "Créer une carte de visite digitale",
        description: "QR code renvoyant vers la démo Coco — parfait pour les rencontres terrain",
        steps: [
          "Aller sur qr-code-generator.com",
          "Générer un QR code vers l'URL de démo Coco",
          "Télécharger en haute résolution",
          "Imprimer 10 cartes chez l'imprimeur local ou sur A4 plastifié",
        ],
        link: "https://www.qr-code-generator.com",
        output: "QR code + mini-cartes imprimées",
      },
    ],
  },
  {
    id: "fri",
    day: "Vendredi",
    date: "5 juin",
    color: "#22C55E",
    icon: "🤝",
    label: "DÉMOS & CLOSING",
    objective: "Faire des démos live et signer les premiers contrats",
    tasks: [
      {
        id: "f1", time: "9h00", duration: "30 min", priority: "CRITIQUE",
        title: "Relances WhatsApp — contacts jeudi",
        description: "Relancer par WhatsApp tous les hôtels contactés la veille",
        steps: [
          "Message court : 'Bonjour [nom], je me permets de relancer suite à mon email d'hier concernant Coco, votre futur concierge IA. Disponible pour une démo de 15 min aujourd'hui ?'",
          "Inclure le lien vers la démo directement dans le message",
          "Ne pas appeler avant 10h — respecter les horaires hôteliers",
          "Objectif : 2-3 rendez-vous confirmés pour vendredi/lundi",
        ],
        output: "2-3 RDV démo confirmés",
        tip: "WhatsApp a un taux d'ouverture de 98% vs 25% pour les emails. C'est ton canal prioritaire sur Samui.",
      },
      {
        id: "f2", time: "10h00", duration: "30 min", priority: "CRITIQUE",
        title: "Préparer le script de démo live (15 min)",
        description: "Avoir un script précis pour chaque rendez-vous de démonstration",
        steps: [
          "Min 1-2 : Vous → 'Vos clients posent des questions à 23h. Coco répond en 2 sec.'",
          "Min 3-7 : Démo live → faire parler Coco (couple en lune de miel, famille, client russe)",
          "Min 8-10 : Fonctionnalités → intégration 5 lignes, co-branding, rapport mensuel",
          "Min 11-13 : Tarifs → Starter 2 500, Partner 4 500 THB/mois",
          "Min 14-15 : Closing → 'On commence avec 14 jours gratuits ?'",
        ],
        output: "Script mémorisé + téléphone chargé + URL prête",
        tip: "Montrer Coco en train de parler russe ou allemand à un GM = deal-maker immédiat sur Samui.",
      },
      {
        id: "f3", time: "10h30", duration: "2h", priority: "CRITIQUE",
        title: "Démos terrain — hôtels Chaweng & Lamai",
        description: "Rendez-vous physiques avec les hôtels qui ont répondu",
        steps: [
          "Arriver 10 min en avance, démo sur téléphone chargé",
          "Commencer par une question : 'Combien de langues parlent vos clients ?' → la réponse justifie Coco",
          "Faire la démo en LEUR montrant, pas en expliquant",
          "Si intéressé : proposer les 14 jours gratuits directement",
          "Si pas décidé : laisser pitch deck + QR code + rappel lundi",
        ],
        output: "Objectif : 1 contrat signé ou 3 essais gratuits activés",
      },
      {
        id: "f4", time: "14h00", duration: "1h", priority: "IMPORTANT",
        title: "Envoyer les emails secondaires (priorité orange)",
        description: "Contacter les 10 hôtels de la liste secondaire",
        steps: [
          "Banyan Tree → samui@banyantree.com",
          "Renaissance Koh Samui → renaissance.kohsamui@marriott.com",
          "Silavadee → info@silavadee.com",
          "Beach Republic → info@beachrepublic.com",
          "Rocky's → reservations@rockyresort.com",
          "+ 5 autres de la liste contacts",
        ],
        output: "10 emails supplémentaires envoyés",
      },
      {
        id: "f5", time: "15h30", duration: "45 min", priority: "IMPORTANT",
        title: "Préparer le contrat / bon de commande simple",
        description: "Avoir un document signable pour les hôtels prêts à démarrer",
        steps: [
          "1 page maximum : nom hôtel, plan choisi, durée, tarif mensuel",
          "Clause : 'Essai 14 jours gratuits. Facturation au 15ème jour si non résilié.'",
          "Signature + date. Pas besoin d'avocat pour commencer.",
          "Version WhatsApp : prendre une photo du document signé",
        ],
        output: "Contrat simple prêt à signer",
        tip: "Un contrat simple d'une page = plus de deals signés qu'un contrat de 10 pages qui bloque tout.",
      },
      {
        id: "f6", time: "17h00", duration: "30 min", priority: "BONUS",
        title: "Bilan de semaine + plan semaine prochaine",
        description: "Mesurer les résultats et préparer le suivi",
        steps: [
          "Compter : emails envoyés / réponses / démos faites / contrats signés",
          "Lister les hôtels à relancer lundi",
          "Identifier 2-3 retours terrain à intégrer dans Coco",
          "Préparer les emails de relance pour lundi matin",
        ],
        output: "Pipeline commercial clarifié pour la semaine suivante",
      },
    ],
  },
];

const CONTACTS_URGENTS = [
  { name: "Anantara Bophut", email: "bophutsamui@anantara.com", zone: "Bophut", stars: 5, priority: 1 },
  { name: "Bandara Resort", email: "stay@bandarasamui.com", zone: "Bophut", stars: 4, priority: 1 },
  { name: "Hansar Samui", email: "reservation@hansarsamui.com", zone: "Bophut", stars: 5, priority: 1 },
  { name: "Amari Koh Samui", email: "reservations.kohsamui@amari.com", zone: "Chaweng", stars: 4, priority: 1 },
  { name: "Santiburi", email: "info@santiburisamui.com", zone: "Maenam", stars: 5, priority: 1 },
  { name: "Centara Reserve", email: "crs@chr.co.th", zone: "Chaweng", stars: 5, priority: 1 },
];

function TaskCard({ task, done, onToggle }) {
  const [open, setOpen] = useState(false);
  const pColors = { CRITIQUE: ["#FEE2E2","#EF4444"], IMPORTANT: ["#FEF3C7","#F59E0B"], BONUS: ["#F0FDF4","#22C55E"] };
  const [bg, fg] = pColors[task.priority] || pColors.IMPORTANT;

  return (
    <div style={{ background: C.white, borderRadius: 14, overflow: "hidden", boxShadow: done ? "none" : "0 2px 16px rgba(0,0,0,0.06)", border: `1px solid ${done ? "#E0F2E9" : C.creamDark}`, opacity: done ? 0.7 : 1, transition: "all 0.3s" }}>
      <div style={{ padding: "14px 16px", display: "flex", alignItems: "flex-start", gap: 12, cursor: "pointer" }} onClick={() => setOpen(o => !o)}>
        <div onClick={e => { e.stopPropagation(); onToggle(); }} style={{ width: 22, height: 22, borderRadius: 6, border: done ? "none" : `2px solid #CBD5E1`, background: done ? C.green : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1, cursor: "pointer", transition: "all 0.2s" }}>
          {done && <span style={{ color: "white", fontSize: 12, fontWeight: 700 }}>✓</span>}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 4 }}>
            <span style={{ fontSize: 11, color: C.muted, fontWeight: 500 }}>{task.time}</span>
            <span style={{ fontSize: 9, padding: "2px 7px", borderRadius: 20, background: bg, color: fg, fontWeight: 700, letterSpacing: "0.05em" }}>{task.priority}</span>
            <span style={{ fontSize: 10, color: C.muted }}>{task.duration}</span>
          </div>
          <div style={{ fontSize: 14, fontWeight: 600, color: done ? C.muted : C.charcoal, textDecoration: done ? "line-through" : "none" }}>{task.title}</div>
          <div style={{ fontSize: 12, color: C.muted, marginTop: 3, lineHeight: 1.5 }}>{task.description}</div>
        </div>
        <div style={{ fontSize: 16, color: C.muted, transition: "transform 0.2s", transform: open ? "rotate(180deg)" : "none", flexShrink: 0 }}>▾</div>
      </div>

      {open && (
        <div style={{ padding: "0 16px 16px 50px", borderTop: `1px solid ${C.creamDark}` }}>
          <div style={{ paddingTop: 12 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: C.teal, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8 }}>Étapes :</div>
            {task.steps.map((step, i) => (
              <div key={i} style={{ display: "flex", gap: 8, marginBottom: 7, alignItems: "flex-start" }}>
                <div style={{ width: 18, height: 18, borderRadius: "50%", background: C.teal, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
                  <span style={{ fontSize: 9, color: "white", fontWeight: 700 }}>{i + 1}</span>
                </div>
                <span style={{ fontSize: 12.5, color: C.charcoal, lineHeight: 1.5 }}>{step}</span>
              </div>
            ))}
            {task.tip && (
              <div style={{ background: `${C.sand}22`, borderRadius: 10, padding: "10px 12px", marginTop: 10, display: "flex", gap: 8, alignItems: "flex-start" }}>
                <span style={{ fontSize: 14 }}>💡</span>
                <span style={{ fontSize: 12, color: "#7A5C00", lineHeight: 1.55 }}>{task.tip}</span>
              </div>
            )}
            <div style={{ marginTop: 10, display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
              <span style={{ fontSize: 10, fontWeight: 600, color: C.teal }}>→ Output :</span>
              <span style={{ fontSize: 11, background: `${C.teal}12`, color: C.teal, padding: "3px 10px", borderRadius: 20, fontWeight: 500 }}>{task.output}</span>
              {task.link && (
                <a href={task.link} target="_blank" rel="noopener noreferrer" style={{ fontSize: 11, color: C.coral, textDecoration: "none", padding: "3px 10px", border: `1px solid ${C.coral}30`, borderRadius: 20 }}>🔗 Ouvrir →</a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ActionPlan() {
  const [activeDay, setActiveDay] = useState("wed");
  const [done, setDone] = useState({});
  const [copiedEmail, setCopiedEmail] = useState(null);

  const toggleTask = (id) => setDone(d => ({ ...d, [id]: !d[id] }));

  const allTasks = DAYS.flatMap(d => d.tasks);
  const totalDone = allTasks.filter(t => done[t.id]).length;
  const progress = Math.round((totalDone / allTasks.length) * 100);

  const currentDay = DAYS.find(d => d.id === activeDay);
  const dayDone = currentDay.tasks.filter(t => done[t.id]).length;

  const copyEmail = (email) => {
    navigator.clipboard.writeText(email);
    setCopiedEmail(email);
    setTimeout(() => setCopiedEmail(null), 2000);
  };

  return (
    <div style={{ fontFamily: "'DM Sans', 'Segoe UI', sans-serif", background: C.cream, minHeight: "100vh" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&display=swap');`}</style>

      {/* Header */}
      <div style={{ background: `linear-gradient(135deg, ${C.tealDeep}, ${C.teal})`, padding: "24px 24px 20px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
          <span style={{ fontSize: 24 }}>🥥</span>
          <div>
            <div style={{ fontSize: 18, fontWeight: 700, color: C.white, letterSpacing: "0.08em" }}>COCO · Plan d'action</div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", letterSpacing: "0.15em" }}>OBJECTIF : PRÉSENTABLE AUX HÔTELS · FIN DE SEMAINE</div>
          </div>
        </div>

        {/* Global progress */}
        <div style={{ background: "rgba(255,255,255,0.08)", borderRadius: 12, padding: "14px 16px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <span style={{ fontSize: 12, color: "rgba(255,255,255,0.65)" }}>Progression globale</span>
            <span style={{ fontSize: 16, fontWeight: 700, color: C.sand }}>{progress}%</span>
          </div>
          <div style={{ height: 6, background: "rgba(255,255,255,0.12)", borderRadius: 3, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${progress}%`, background: `linear-gradient(90deg, ${C.coral}, ${C.sand})`, borderRadius: 3, transition: "width 0.5s ease" }} />
          </div>
          <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", marginTop: 6 }}>{totalDone}/{allTasks.length} tâches complétées</div>
        </div>
      </div>

      {/* Day tabs */}
      <div style={{ background: C.white, borderBottom: `1px solid ${C.creamDark}`, display: "flex", overflowX: "auto" }}>
        {DAYS.map(d => {
          const dayComplete = d.tasks.filter(t => done[t.id]).length;
          return (
            <button key={d.id} onClick={() => setActiveDay(d.id)} style={{ padding: "14px 16px", background: "none", border: "none", cursor: "pointer", borderBottom: activeDay === d.id ? `3px solid ${d.color}` : "3px solid transparent", marginBottom: -1, whiteSpace: "nowrap", flex: 1 }}>
              <div style={{ fontSize: 16, marginBottom: 2 }}>{d.icon}</div>
              <div style={{ fontSize: 12, fontWeight: activeDay === d.id ? 600 : 400, color: activeDay === d.id ? d.color : C.muted }}>{d.day}</div>
              <div style={{ fontSize: 10, color: C.muted }}>{d.date}</div>
              <div style={{ fontSize: 9, marginTop: 2, color: dayComplete === d.tasks.length ? "#22C55E" : C.muted }}>
                {dayComplete}/{d.tasks.length} ✓
              </div>
            </button>
          );
        })}
      </div>

      {/* Day content */}
      <div style={{ padding: "16px" }}>
        {/* Day header */}
        <div style={{ background: `${currentDay.color}14`, border: `1px solid ${currentDay.color}30`, borderRadius: 14, padding: "14px 16px", marginBottom: 16, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
              <span style={{ fontSize: 9, fontWeight: 700, padding: "2px 8px", borderRadius: 20, background: currentDay.color, color: "white", letterSpacing: "0.1em" }}>{currentDay.label}</span>
              <span style={{ fontSize: 12, color: C.muted }}>{currentDay.date}</span>
            </div>
            <div style={{ fontSize: 13.5, fontWeight: 600, color: C.charcoal }}>🎯 {currentDay.objective}</div>
          </div>
          <div style={{ textAlign: "center", flexShrink: 0 }}>
            <div style={{ fontSize: 22, fontWeight: 700, color: currentDay.color }}>{dayDone}/{currentDay.tasks.length}</div>
            <div style={{ fontSize: 9, color: C.muted }}>tâches</div>
          </div>
        </div>

        {/* Tasks */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
          {currentDay.tasks.map(task => (
            <TaskCard key={task.id} task={task} done={!!done[task.id]} onToggle={() => toggleTask(task.id)} />
          ))}
        </div>

        {/* Contacts rapides — only on thursday */}
        {activeDay === "thu" && (
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: C.tealDeep, marginBottom: 10, display: "flex", alignItems: "center", gap: 6 }}>
              <span>📋</span> Contacts priorité ROUGE — copier-coller
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {CONTACTS_URGENTS.map(c => (
                <div key={c.email} style={{ background: C.white, borderRadius: 12, padding: "12px 14px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, boxShadow: "0 1px 8px rgba(0,0,0,0.05)" }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: C.charcoal }}>{c.name}</div>
                    <div style={{ fontSize: 11, color: C.muted }}>{c.zone} · {"⭐".repeat(c.stars)}</div>
                    <div style={{ fontSize: 11, color: C.teal, marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.email}</div>
                  </div>
                  <button onClick={() => copyEmail(c.email)} style={{ padding: "7px 12px", borderRadius: 8, border: `1px solid ${C.teal}30`, background: copiedEmail === c.email ? `${C.green}20` : "transparent", color: copiedEmail === c.email ? C.green : C.teal, fontSize: 11, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap", transition: "all 0.2s" }}>
                    {copiedEmail === c.email ? "✓ Copié" : "📋 Copier"}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Email template — mercredi */}
        {activeDay === "wed" && (
          <div style={{ background: C.white, borderRadius: 14, padding: 16, border: `1px solid ${C.creamDark}` }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: C.tealDeep, marginBottom: 10 }}>📱 Message WhatsApp de démo (à envoyer après déploiement)</div>
            <div style={{ background: C.cream, borderRadius: 10, padding: "12px 14px", fontSize: 12.5, color: C.charcoal, lineHeight: 1.7, fontStyle: "italic" }}>
              "Bonjour [Nom], je suis Cyril, basé à Koh Samui. Je développe Coco 🥥 — un concierge IA local pour hôtels, disponible 24h/24 en 6 langues. Je vous envoie une démo de 2 min : [URL LOOM]. Et la demo interactive : [URL VERCEL]. Disponible pour en parler 15 min cette semaine ?"
            </div>
          </div>
        )}

        {/* Closing message — vendredi */}
        {activeDay === "fri" && (
          <div style={{ background: `${C.green}10`, borderRadius: 14, padding: 16, border: `1px solid ${C.green}30` }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: "#166534", marginBottom: 8 }}>🏁 Objectif fin de semaine</div>
            {[
              "✓ URL de démo en ligne et fonctionnelle",
              "✓ Pitch deck envoyé à 16+ hôtels",
              "✓ 3+ démos live réalisées",
              "✓ 1 contrat signé OU 3 essais gratuits activés",
              "✓ Pipeline de 10 hôtels pour la semaine suivante",
            ].map((item, i) => (
              <div key={i} style={{ fontSize: 12.5, color: "#166534", lineHeight: 1.8 }}>{item}</div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
