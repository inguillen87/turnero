"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';

export function useFetch<T>(endpoint: string) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(true);
  const params = useParams();
  const slug = params.slug as string || "demo";

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(endpoint, {
            headers: {
                'x-tenant-slug': slug
            }
        });
        if (!res.ok) throw new Error(res.statusText);
        const json = await res.json();
        setData(json);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [endpoint, slug]);

  return { data, error, loading, refetch: () => setLoading(true) };
}
