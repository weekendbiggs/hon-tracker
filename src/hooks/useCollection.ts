import { useCallback, useEffect, useState } from "react";
import { readCollection } from "@/api/reads";
import { saveCollection } from "@/api/github";
import type { CollectionItem } from "@/api/types";
import { colorById } from "@/data/colors";

let cache: CollectionItem[] | null = null;
const listeners = new Set<(v: CollectionItem[]) => void>();

function emit(v: CollectionItem[]) {
  cache = v;
  listeners.forEach((l) => l(v));
}

export function useCollection() {
  const [items, setItems] = useState<CollectionItem[]>(cache ?? []);
  const [loading, setLoading] = useState(cache === null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const listener = (v: CollectionItem[]) => setItems(v);
    listeners.add(listener);
    if (cache === null) {
      readCollection()
        .then((v) => {
          emit(v);
          setLoading(false);
        })
        .catch((e) => {
          setError(String(e));
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
    return () => {
      listeners.delete(listener);
    };
  }, []);

  const commit = useCallback(async (next: CollectionItem[], message: string) => {
    const prev = cache ?? [];
    emit(next);
    try {
      await saveCollection(next, message);
    } catch (e) {
      emit(prev);
      throw e;
    }
  }, []);

  const add = useCallback(
    async (item: CollectionItem) => {
      const color = colorById(item.honColorId);
      await commit([...(cache ?? []), item], `Add ${color?.name ?? "HON"} to collection`);
    },
    [commit],
  );

  const update = useCallback(
    async (item: CollectionItem) => {
      const color = colorById(item.honColorId);
      const next = (cache ?? []).map((x) => (x.id === item.id ? item : x));
      await commit(next, `Update ${color?.name ?? "HON"} in collection`);
    },
    [commit],
  );

  const remove = useCallback(
    async (id: string) => {
      const target = (cache ?? []).find((x) => x.id === id);
      const color = target ? colorById(target.honColorId) : undefined;
      const next = (cache ?? []).filter((x) => x.id !== id);
      await commit(next, `Remove ${color?.name ?? "HON"} from collection`);
    },
    [commit],
  );

  return { items, loading, error, add, update, remove };
}
