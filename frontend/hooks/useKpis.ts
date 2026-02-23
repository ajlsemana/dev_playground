"use client";

import { useEffect, useState } from "react";
import { getKpis, Kpis } from "@/lib/api/dashboard";

export function useKpis() {
  const [data, setData] = useState<Kpis | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetch() {
      try {
        const res = await getKpis();
        setData(res);
      } finally {
        setLoading(false);
      }
    }

    fetch();
  }, []);

  return { data, loading };
}