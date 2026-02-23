"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { getCases, GetCasesParams } from "@/lib/api/cases";
import { Case } from "@/types/case";

export type CasesFilters = {
  status?: string;
  stage?: string;
  assignedTo?: string;
  dpdMin?: string;
  dpdMax?: string;
};

export function useCases() {
  const router = useRouter();
  const searchParams = useSearchParams();  

  const page = Number(searchParams.get("page") || 1);
  const limit = Number(searchParams.get("limit") || 10);

  const filters = useMemo(() => ({
    status: searchParams.get("status") || "",
    stage: searchParams.get("stage") || "",
    assignedTo: searchParams.get("assignedTo") || "",
    dpdMin: searchParams.get("dpdMin") || "",
    dpdMax: searchParams.get("dpdMax") || "",
  }), [searchParams]);  

  const [rows, setRows] = useState<Case[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);  

  const query: GetCasesParams = useMemo(() => {
    const dpdMin = filters.dpdMin ? Number(filters.dpdMin) : undefined;
    const dpdMax = filters.dpdMax ? Number(filters.dpdMax) : undefined;

    return {
      page,
      limit,
      status: filters.status || undefined,
      stage: filters.stage || undefined,
      assignedTo: filters.assignedTo || undefined,
      dpdMin,
      dpdMax,
      sortBy: "createdAt",
      sortOrder: "desc",
    };
  }, [filters, page, limit]);  

  function updateUrl(next: Record<string, any>) {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(next).forEach(([key, value]) => {
      if (!value) {
        params.delete(key);
      } else {
        params.set(key, String(value));
      }
    });

    router.push(`?${params.toString()}`);
  }  

  const setPage = (p: number) => {
    updateUrl({ ...filters, page: p, limit });
  };

  const setLimit = (l: number) => {
    updateUrl({ ...filters, page: 1, limit: l });
  };

  const updateFilters = (next: Partial<CasesFilters>) => {
    updateUrl({
      ...filters,
      ...next,
      page: 1,
    });
  };

  const resetFilters = () => {
    router.push("?page=1&limit=10");
  };  

  useEffect(() => {
    let active = true;

    async function fetchData() {
      setLoading(true);
      setError(null);

      try {
        const res = await getCases(query);

        if (!active) return;

        setRows(res.data);
        setTotal(res.total);
      } catch (e: any) {
        if (!active) return;
        setError(e?.message || "Failed to fetch cases");
      } finally {
        if (active) setLoading(false);
      }
    }

    fetchData();

    return () => {
      active = false;
    };
  }, [query]);  

  const totalPages = limit ? Math.ceil((total ?? 0) / limit) : 1;

  return {
    rows,
    total,
    totalPages,
    page,
    limit,
    filters,
    loading,
    error,
    setPage,
    setLimit,
    updateFilters,
    resetFilters,
  };
}