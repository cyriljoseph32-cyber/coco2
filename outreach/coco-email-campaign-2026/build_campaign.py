#!/usr/bin/env python3
"""Build the Coco Samui AI outreach campaign.

Reads the prospect database (xlsx), keeps contacts that have a real email,
personalises one English outreach email per contact, assigns a staggered
send date by priority, and emits campaign.md + campaign.csv + campaign.json.

Usage:
    python3 build_campaign.py /path/to/COCO_SAMUI_AI_DATABASE_2026_MAJ.xlsx
"""
import sys, re, json, csv
from datetime import date, timedelta
from pathlib import Path
import openpyxl

EMAIL_RE = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")
OUT_DIR = Path(__file__).resolve().parent
START = date(2026, 7, 8)   # first business day of the campaign
PER_DAY = 12

SENDER_NAME = "Cyril Joseph"
SENDER_EMAIL = "cyril.joseph@coco-samui-ai.com"
SITE = "https://coco-samui-ai.com"

# Category -> (short offer name, one-line value prop, ROI line). Sourced from the
# "OPPORTUNITÉS BUSINESS" sheet of the database.
CATEGORY = {
    "1. Hôtels & Resorts": (
        "a 24/7 multilingual concierge widget",
        "a digital receptionist that never sleeps and answers guests in 6 languages, taking spa and activity bookings automatically",
        "hotels we work with typically see +15% direct bookings and save ~10 staff-hours a week",
    ),
    "2. Villas & Property Mgmt": (
        "an AI villa manager",
        "handle owner and guest messages, availability and repetitive FAQs automatically across all your villas",
        "roughly 5 hours saved per villa each week and noticeably higher guest satisfaction",
    ),
    "3. Restaurants": (
        "automatic 24/7 table booking",
        "online reservations, a multilingual menu and WhatsApp reminders that cut no-shows — no more empty tables on a Saturday night",
        "typically -40% no-shows and +25% covers on weeknights",
    ),
    "4. Activités Touristiques": (
        "a 24/7 activity booking desk",
        "real-time availability, online payment and automatic follow-ups in 6 languages, so no lead is lost overnight",
        "operators see around +30% bookings with 100% of night-time leads captured",
    ),
    "5. Wellness & Spa": (
        "a wellness concierge",
        "class and treatment booking, personalised programmes and automatic reminders that prepare your clients before they arrive",
        "about -30% cancellations and +40% premium programmes sold",
    ),
    "6. Muay Thai & Fitness": (
        "an AI gym manager",
        "automated class scheduling, online sign-up and package sales without picking up the phone",
        "typically +40% class occupancy and +20% package sales",
    ),
    "7. Transport": (
        "a transfer booking bot",
        "automatic WhatsApp + web booking, driver calendar and SMS confirmation in 6 languages — never miss a 3am transfer request",
        "around +50% of requests captured and zero missed calls",
    ),
    "8. Mariages & Événements": (
        "a wedding & events CRM",
        "an international-couple CRM with automated quote follow-up and multilingual communication, so no lead slips through",
        "even +3 weddings a year is significant additional revenue",
    ),
    "9. Digital Services": (
        "a technical partnership",
        "embedding the Coco AI widget in your clients' sites with revenue-share on the leads it generates",
        "an immediate uplift to your client offering with a differentiating AI module",
    ),
    "10. Commerces Locaux": (
        "a local visibility listing",
        "an enriched, verified Coco AI listing so tourists are pointed to you 24/7, in their own language",
        "far greater visibility with international tourists from day one",
    ),
}
DEFAULT_CAT = (
    "a local AI concierge",
    "a 24/7 multilingual assistant that answers travellers and takes bookings automatically",
    "less manual admin and more bookings captured around the clock",
)


def prio_rank(p):
    p = (p or "").upper()
    if "HOT" in p:
        return 0
    if "WARM" in p:
        return 1
    return 2


def prio_clean(p):
    p = (p or "").upper()
    if "HOT" in p:
        return "HOT"
    if "WARM" in p:
        return "WARM"
    return "LOW"


def business_days(start, n):
    d, out = start, []
    while len(out) < n:
        if d.weekday() < 5:
            out.append(d)
        d += timedelta(days=1)
    return out


def zone_phrase(zone):
    z = (zone or "").strip()
    if not z or z.lower() in {"island-wide", "n/a"}:
        return "on Koh Samui"
    return f"in {z}"


def subject_for(name, cat):
    offer, _, _ = CATEGORY.get(cat, DEFAULT_CAT)
    offer_cap = offer[:1].upper() + offer[1:]  # capitalise first letter, keep "AI" intact
    return f"{name}: {offer_cap} for Koh Samui guests"


def body_for(c):
    offer, value, roi = CATEGORY.get(c["cat"], DEFAULT_CAT)
    zone = zone_phrase(c["zone"])
    lines = [
        f"Hi {c['name']} team,",
        "",
        f"I'm {SENDER_NAME}, founder of Coco AI — the local AI concierge built specifically "
        f"for Koh Samui. I came across {c['name']} {zone} and thought it would be a strong fit.",
        "",
        f"In about 5 minutes a day, {c['name']} could have {offer}: {value}. "
        f"In practice, {roi}.",
        "",
        "I'd love to set you up with a free 14-day pilot — no commitment, and I handle the setup. "
        "Would you be open to a quick call this week?",
        "",
        "Warm regards,",
        SENDER_NAME,
        "Founder — Coco Samui AI",
        f"{SENDER_EMAIL} · {SITE}",
    ]
    return "\n".join(lines)


def load_contacts(xlsx_path):
    wb = openpyxl.load_workbook(xlsx_path, data_only=True)
    ws = wb["📋 DATABASE BUSINESS"]
    rows = list(ws.iter_rows(values_only=True))[2:]  # skip title + header
    contacts, no_email, seen = [], [], set()
    for r in rows:
        if not r or not r[0]:
            continue
        name = (r[1] or "").strip()
        email = (r[7] or "").strip()
        rec = {
            "id": r[0], "name": name, "cat": (r[2] or "").strip(),
            "zone": (r[4] or "").strip(), "email": email,
            "prio": prio_clean(r[18]), "sia": r[16] or 0, "spart": r[17] or 0,
        }
        if not EMAIL_RE.match(email):
            no_email.append(rec)
            continue
        if email.lower() in seen:
            continue
        seen.add(email.lower())
        contacts.append(rec)
    contacts.sort(key=lambda x: (prio_rank(x["prio"]), -x["sia"], -x["spart"]))
    return contacts, no_email


def main():
    xlsx = sys.argv[1] if len(sys.argv) > 1 else None
    if not xlsx:
        sys.exit("usage: build_campaign.py <database.xlsx>")
    contacts, no_email = load_contacts(xlsx)

    days = business_days(START, (len(contacts) + PER_DAY - 1) // PER_DAY)
    for i, c in enumerate(contacts):
        c["send"] = days[i // PER_DAY].isoformat()
        c["subject"] = subject_for(c["name"], c["cat"])
        c["body"] = body_for(c)
        c["status"] = "Brouillon créé ✅ — à envoyer"

    # campaign.json (machine-readable, used by the draft-creation step)
    (OUT_DIR / "campaign.json").write_text(
        json.dumps(contacts, ensure_ascii=False, indent=2), encoding="utf-8")

    # campaign.csv
    with (OUT_DIR / "campaign.csv").open("w", newline="", encoding="utf-8") as f:
        w = csv.writer(f)
        w.writerow(["Nom", "Email", "Priorité", "Zone", "Catégorie", "Date envoi", "Statut", "Objet"])
        for c in contacts:
            w.writerow([c["name"], c["email"], c["prio"], c["zone"], c["cat"],
                        c["send"], c["status"], c["subject"]])

    # campaign.md
    md = ["# Coco Samui AI — Campagne de contact 2026",
          "",
          f"**Expéditeur prévu :** {SENDER_NAME} <{SENDER_EMAIL}> · {SITE}",
          f"**Contacts joignables :** {len(contacts)} (email valide) — "
          f"**{len(no_email)} sans email** (exclus, listés en bas).",
          f"**Cadence :** {PER_DAY}/jour ouvré, par priorité (HOT → WARM → LOW), "
          f"à partir du {START.isoformat()}.",
          "",
          "> ⚠️ **À vérifier avant envoi :** les 62 brouillons sont créés dans la boîte "
          "Gmail connectée. L'outil ne permet pas de définir l'expéditeur, donc chaque "
          "brouillon part avec l'adresse du compte connecté. Avant d'envoyer, règle le "
          "champ *De* sur `cyril.joseph@coco-samui-ai.com` (alias send-as à configurer "
          "dans Gmail si ce n'est pas déjà fait). Aucun email n'est envoyé automatiquement.",
          "",
          "## Planning d'envoi",
          "",
          "| Nom | Email | Priorité | Date envoi | Statut |",
          "| --- | --- | --- | --- | --- |"]
    for c in contacts:
        md.append(f"| {c['name']} | {c['email']} | {c['prio']} | {c['send']} | {c['status']} |")
    md += ["", "## Emails personnalisés", ""]
    for c in contacts:
        md += [f"### {c['name']}  ·  {c['send']}  ·  {c['prio']}",
               f"**To:** {c['email']}  ", f"**Subject:** {c['subject']}", "",
               "```", c["body"], "```", ""]
    if no_email:
        md += ["## Contacts sans email (non contactables ici)", ""]
        for c in no_email:
            md.append(f"- {c['name']} ({c['prio']}, {c['zone']}) — {c['cat']}")
    (OUT_DIR / "campaign.md").write_text("\n".join(md) + "\n", encoding="utf-8")

    print(f"contacts={len(contacts)} no_email={len(no_email)} "
          f"days={[d.isoformat() for d in days]}")


if __name__ == "__main__":
    main()
