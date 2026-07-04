/** Shared HTTP helper built on global fetch (Node >=18), with timeout + caching. */

import { HTTP_TIMEOUT_MS } from "./constants.js";

export class HttpError extends Error {
  constructor(
    public status: number,
    public provider: string,
    message: string,
  ) {
    super(message);
    this.name = "HttpError";
  }
}

interface CacheEntry {
  expires: number;
  value: unknown;
}

const cache = new Map<string, CacheEntry>();

/**
 * Perform a JSON HTTP request with a timeout and optional short-lived cache.
 *
 * @param ttlMs Cache time-to-live in ms. 0 = never cache (e.g. TripAdvisor,
 *              which forbids storing content). Use <24h for Viator/Google.
 */
export async function requestJson<T>(
  url: string,
  opts: {
    method?: "GET" | "POST";
    headers?: Record<string, string>;
    body?: unknown;
    provider: string;
    ttlMs?: number;
  },
): Promise<T> {
  const method = opts.method ?? "GET";
  const ttlMs = opts.ttlMs ?? 0;
  const cacheKey = `${method} ${url} ${opts.body ? JSON.stringify(opts.body) : ""}`;

  if (ttlMs > 0) {
    const hit = cache.get(cacheKey);
    if (hit && hit.expires > Date.now()) {
      return hit.value as T;
    }
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), HTTP_TIMEOUT_MS);

  try {
    const res = await fetch(url, {
      method,
      headers: {
        Accept: "application/json",
        ...(opts.body ? { "Content-Type": "application/json" } : {}),
        ...opts.headers,
      },
      body: opts.body ? JSON.stringify(opts.body) : undefined,
      signal: controller.signal,
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new HttpError(
        res.status,
        opts.provider,
        `${opts.provider} returned HTTP ${res.status}${text ? `: ${text.slice(0, 300)}` : ""}`,
      );
    }

    const value = (await res.json()) as T;
    if (ttlMs > 0) {
      cache.set(cacheKey, { expires: Date.now() + ttlMs, value });
    }
    return value;
  } catch (err) {
    if (err instanceof HttpError) throw err;
    if (err instanceof Error && err.name === "AbortError") {
      throw new HttpError(0, opts.provider, `${opts.provider} request timed out`);
    }
    throw new HttpError(
      0,
      opts.provider,
      `${opts.provider} request failed: ${err instanceof Error ? err.message : String(err)}`,
    );
  } finally {
    clearTimeout(timer);
  }
}

/** Turn any error into a clear, actionable string for the agent. */
export function describeError(err: unknown): string {
  if (err instanceof HttpError) {
    switch (err.status) {
      case 401:
      case 403:
        // err.message already carries an actionable hint (e.g. "KEY is not set…").
        return `Error: ${err.message}`;
      case 404:
        return `Error: ${err.provider} resource not found. Check the ID.`;
      case 429:
        return `Error: ${err.provider} rate limit hit. Wait and retry.`;
      default:
        return `Error: ${err.message}`;
    }
  }
  return `Error: ${err instanceof Error ? err.message : String(err)}`;
}
