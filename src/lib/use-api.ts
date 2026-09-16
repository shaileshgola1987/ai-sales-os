"use client";

import { useCallback, useEffect, useState } from "react";

export function useApi<T>(path: string | null) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(() => {
    if (!path) return;
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetch(path)
      .then(async (res) => {
        if (!res.ok) {
          let message = `Request failed (${res.status})`;
          try {
            const body = (await res.json()) as { error?: string };
            if (body.error) message = body.error;
          } catch {
            /* ignore */
          }
          throw new Error(message);
        }
        return (await res.json()) as T;
      })
      .then((json) => {
        if (!cancelled) setData(json);
      })
      .catch((err: unknown) => {
        if (!cancelled) setError(err instanceof Error ? err.message : "Unknown error");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [path]);

  useEffect(() => {
    // Data fetch: loading flags are updated from the request callbacks.
    // eslint-disable-next-line react-hooks/set-state-in-effect -- fetch lifecycle
    const stop = reload();
    return stop;
  }, [reload]);

  return { data, error, loading, reload };
}
