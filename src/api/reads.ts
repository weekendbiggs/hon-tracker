import type { CollectionItem, PriceEntry } from "./types";

const cacheBust = () => `?t=${Date.now()}`;

async function readJson<T>(url: string, fallback: T): Promise<T> {
  try {
    const res = await fetch(url + cacheBust(), { cache: "no-store" });
    if (!res.ok) return fallback;
    return (await res.json()) as T;
  } catch {
    return fallback;
  }
}

export const readCollection = () =>
  readJson<CollectionItem[]>(`${import.meta.env.BASE_URL}data/collection.json`, []);

export const readPrices = () =>
  readJson<PriceEntry[]>(`${import.meta.env.BASE_URL}data/prices.json`, []);
