import { useCallback, useEffect, useState } from "react";
import { readPrices } from "@/api/reads";
import { savePrices } from "@/api/github";
import type { PriceEntry } from "@/api/types";
import { colorById } from "@/data/colors";

let cache: PriceEntry[] | null = null;
const listeners = new Set<(v: PriceEntry[]) => void>();

function emit(v: PriceEntry[]) {
  cache = v;
  listeners.forEach((l) => l(v));
}

export function usePrices() {
  const [items, setItems] = useState<PriceEntry[]>(cache ?? []);
  const [loading, setLoading] = useState(cache === null);

  useEffect(() => {
    const l = (v: PriceEntry[]) => setItems(v);
    listeners.add(l);
    if (cache === null) {
      readPrices().then((v) => {
        emit(v);
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
    return () => {
      listeners.delete(l);
    };
  }, []);

  const commit = useCallback(async (next: PriceEntry[], msg: string) => {
    const prev = cache ?? [];
    emit(next);
    try {
      await savePrices(next, msg);
    } catch (e) {
      emit(prev);
      throw e;
    }
  }, []);

  const add = useCallback(
    async (entry: PriceEntry) => {
      const color = colorById(entry.honColorId);
      await commit([...(cache ?? []), entry], `Log ${color?.name ?? "HON"} price`);
    },
    [commit],
  );

  const remove = useCallback(
    async (id: string) => {
      const target = (cache ?? []).find((x) => x.id === id);
      const color = target ? colorById(target.honColorId) : undefined;
      await commit(
        (cache ?? []).filter((x) => x.id !== id),
        `Remove ${color?.name ?? "HON"} price entry`,
      );
    },
    [commit],
  );

  return { items, loading, add, remove };
}
