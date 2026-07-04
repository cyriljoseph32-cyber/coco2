# COCO · SAMUI AI CONCIERGE — BUSINESS PLAN
*Version "revenu rapide", 21 juin 2026. Honnête, pas de chiffres gonflés.*

---

## EXECUTIVE SUMMARY

Coco est un concierge IA local pour Koh Samui : il répond aux voyageurs 24/7 en 6 langues (EN/FR/DE/SV/TH/ZH) avec des recommandations locales vérifiées et des liens de réservation. Il se déploie chez les hôtels, villas et prestataires (site, WhatsApp, QR en chambre) en marque blanche, et est déjà en production sur coco-samui-ai.com (app web + PWA + widget intégrable).

**Le vrai métier n'est pas "vendre un chatbot".** C'est une **agence d'affiliation locale outillée par l'IA** : Coco distribue des clients aux prestataires (tours, plongée, transferts) contre commission, et fait gagner du temps aux hôtels contre un abonnement. L'IA est le prétexte d'entrée et l'outil ; le réseau local de Cyril est l'actif défendable.

**Modèle de revenu (3 jambes) :** (1) affiliation B2C sur réservations — tourne sans vendre ; (2) abonnement B2B segmenté (Free / Pro 2 900 / Premium 6 900–9 900 THB) + setup fee ; (3) commission partenaires (10–15 %).

**Objectif 12 mois (réaliste) :** 15–25 clients B2B + affiliation active = **80–110 k THB/mois (~2–2,8 k€)**, soit ~36 k€ ARR. **Ce n'est pas une startup à 500 k€ ; c'est un revenu familial solide, transférable/vendable.**

**3 actions qui débloquent tout, cette semaine :** réparer la capture de leads (aujourd'hui perdue dans /tmp), activer l'affiliation (aujourd'hui éteinte = 0 THB), et viser villas/boutique/partenaires plongée avant les 5★.

---

## 1. MARCHÉ
- **TAM Koh Samui :** ~200–300 hôtels + plusieurs centaines de villas gérées + dizaines de dive/tour ops. Marché **réel mais étroit et saisonnier** (haute saison nov–avr).
- **Plafond théorique absolu** (100 % des hôtels à 3 500 THB) ≈ 260 k€/an — irréaliste. **Cible réaliste : 5–15 % du segment accessible.**
- **Extension TAM sans réécrire le produit :** Koh Phangan + Koh Tao (même moteur, nouvelle data). C'est le seul vrai chemin de croissance.

## 2. PROBLÈME / SOLUTION
- Problème : réceptions débordées par des questions répétitives multilingues 24/7 ; upsell des services maison perdu ; voyageurs noyés dans l'info générique.
- Solution : concierge IA à la marque de l'établissement, 6 langues, 24/7, qui pousse les services maison d'abord et propose des réservations (monétisées).

## 3. PRODUIT (état réel)
- ✅ En prod : chatbot Claude multilingue, PWA, widget, QR trackés par hôtel, providers Google Places/Viator/OpenWeather, capture de leads (à réparer), MCP séparé.
- ⚠️ À corriger en priorité : leads perdus (/tmp), affiliation éteinte (PID vide), prix codés en dur dans le prompt (péremption/hallucination), pas de dashboard (rétention).
- 🔜 À construire après 1ers payants : dashboard hôtel V1, couche data vérifiée (remplacer le prompt statique), pages SEO.
- ❌ À NE PAS construire maintenant : l'architecture Supabase/scoring/admin/anti-hallucination complète des consignes projet = sur-ingénierie tant qu'il n'y a pas 5 clients.

## 4. MODÈLE ÉCONOMIQUE & UNIT ECONOMICS
- **Coûts variables quasi nuls :** Vercel + API Claude (qq € à dizaines d'€/mois selon trafic). Marge brute > 90 %.
- **Coût réel principal = le temps de Cyril** (vente, support 6 langues, maintenance data).
- **Pricing :** voir COCO_Pricing_Sheet.md. Setup fee systématique pour financer le temps et qualifier.
- **CAC :** aujourd'hui = temps × faible taux de conversion du cold email manuel (1–3 %). À réduire via vente en personne (force de Cyril) + relances automatisées + bouche-à-oreille.
- **LTV :** dépend entièrement de la rétention. Sans dashboard, churn élevé → LTV ≈ 2–4 mois. Avec dashboard + rapport mensuel → LTV 12 mois+. **La rétention est le levier n°1 de l'unit economics.**

## 5. PROJECTIONS (prudentes, 3 scénarios)

| | Clients B2B | MRR abo | Affiliation/mois | Total/mois | Annuel |
|---|---|---|---|---|---|
| **Pessimiste (M12)** | 5 | ~17 k THB | ~5 k THB | ~22 k THB | ~7 k€ |
| **Réaliste (M12)** | 15–20 | ~55 k THB | ~25 k THB | ~80 k THB | ~24 k€ |
| **Optimiste (M18, +Phangan/Tao)** | 30–40 | ~120 k THB | ~60 k THB | ~180 k THB | ~55 k€ |

*Hypothèses : mix Pro/Premium, ~50 % setup fees encaissés, affiliation montant avec le trafic SEO + QR installés. Conversion d'abonnés volontairement basse.*

## 6. GO-TO-MARKET
- **Séquencement cible :** villas → dive/tour ops (partenaires commission) → boutique hotels → wellness → (preuve) 5★.
- **Canaux :** vente en personne / WhatsApp vidéo (force principale), cold email court + relances auto, QR en chambre (acquisition voyageur), contenu TikTok/IG (haut de funnel — reels déjà produits), SEO local (moyen terme).
- **Rétention :** dashboard + rapport PDF mensuel = anti-churn. Révisions trimestrielles Premium.

## 7. CONCURRENCE & FOSSÉ
- Concurrents indirects écrasants et gratuits (ChatGPT, Google, Klook/Viator). La techno n'est PAS défendable (copiable en un week-end).
- **Fossé réel = données locales vérifiées + contrats partenaires + présence/réseau de Cyril sur l'île.** Construire le fossé là, pas dans le code.

## 8. RISQUES
1. **Rétention B2B** (pas de dashboard) — risque #1. Mitigation : dashboard V1 + rapport mensuel dès le 2e client.
2. **Péremption des données** (prix codés en dur) — un prix faux cité = client perdu. Mitigation : Google Places live + mention "indicatif, vérifié le [date]".
3. **Dépendance à une personne** (Cyril, qui prépare un départ en Suède 2026). Mitigation : automatiser onboarding/support, viser un actif vendable, ou modèle gérable à distance.
4. **Saisonnalité** (basse saison). Mitigation : affiliation + abos annuels.
5. **Marché étroit.** Mitigation : extension multi-îles.

## 9. EMPLOI DES FONDS (si Erik ou autre met 15–20 k€)
Pas besoin de 500 k€. Un petit apport sert à : (a) 3–6 mois de salaire/temps de Cyril pour vendre à plein temps ; (b) un dev ponctuel pour dashboard + couche data ; (c) un budget micro-ads/contenu. Tout le reste s'autofinance via affiliation + setup fees. **Levée massive = inadaptée ; bootstrap + petit coup de pouce = adapté.**

## 10. 90 JOURS (résumé — détail dans l'audit)
- **J1-30 :** réparer leads, activer affiliation, analytics, cibler villas/boutique/partenaires, 3 payants + 2 partenaires.
- **J31-60 :** dashboard V1, rapport mensuel, témoignages, 8-10 pages SEO.
- **J61-90 :** CRM propre, migration data, extension Phangan/Tao, 10-15 payants, MRR ≥ 50 k THB.

---
*Documents liés : AUDIT_Samui_AI_Concierge.md · COCO_Pricing_Sheet.md · COCO_Sales_Deck_FAQ.md*
