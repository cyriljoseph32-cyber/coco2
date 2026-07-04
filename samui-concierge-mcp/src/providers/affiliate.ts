/**
 * Affiliate deep-link builders for Klook and GetYourGuide.
 *
 * These need NO API approval — just an affiliate ID. They produce monetizable
 * search/booking links you can attach to any Coco recommendation immediately.
 * (Klook/GYG full catalog APIs require partner approval; deep links let you
 * start earning commission today while that is pending.)
 */

import { KLOOK_BASE, GETYOURGUIDE_BASE, VIATOR_WEB_BASE } from "../constants.js";

export interface AffiliateLink {
  provider: "klook" | "getyourguide" | "viator";
  url: string;
  configured: boolean; // false = link works but earns no commission (ID missing)
  note?: string;
}

export function buildKlookLink(query: string): AffiliateLink {
  const aid = process.env.KLOOK_AFFILIATE_ID;
  const u = new URL(KLOOK_BASE);
  u.searchParams.set("query", query);
  if (aid) u.searchParams.set("aid", aid);
  return {
    provider: "klook",
    url: u.toString(),
    configured: Boolean(aid),
    note: aid
      ? undefined
      : "Set KLOOK_AFFILIATE_ID (https://affiliate.klook.com) to earn commission.",
  };
}

export function buildGetYourGuideLink(query: string): AffiliateLink {
  const pid = process.env.GETYOURGUIDE_PARTNER_ID;
  const u = new URL(GETYOURGUIDE_BASE);
  u.searchParams.set("q", query);
  if (pid) u.searchParams.set("partner_id", pid);
  return {
    provider: "getyourguide",
    url: u.toString(),
    configured: Boolean(pid),
    note: pid
      ? undefined
      : "Set GETYOURGUIDE_PARTNER_ID (https://partner.getyourguide.com) to earn commission.",
  };
}

export function buildViatorLink(query: string): AffiliateLink {
  const pid = process.env.VIATOR_AFFILIATE_PID;
  const u = new URL(VIATOR_WEB_BASE);
  u.searchParams.set("text", query);
  if (pid) u.searchParams.set("pid", pid);
  return {
    provider: "viator",
    url: u.toString(),
    configured: Boolean(pid),
    note: pid
      ? undefined
      : "Set VIATOR_AFFILIATE_PID (https://www.viator.com/partner) to earn commission.",
  };
}

/** All booking links for a query, ordered by Thailand relevance. */
export function buildAllLinks(query: string): AffiliateLink[] {
  return [buildKlookLink(query), buildGetYourGuideLink(query), buildViatorLink(query)];
}
