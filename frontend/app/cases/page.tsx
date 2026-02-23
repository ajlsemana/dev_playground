"use client";

import { useCases } from "@/hooks/useCases";
import CasesFilters from "@/components/cases/CasesFilters";
import CasesTable from "@/components/cases/CasesTable";
import Pagination from "@/components/ui/Pagination";
import { useKpis } from "@/hooks/useKpis";
import KpiCards from "@/components/dashboard/KpiCards";

export default function CasesPage() {
  const {
    rows,
    total,
    page,
    limit,
    totalPages,
    filters,
    loading,
    error,
    setPage,
    setLimit,
    updateFilters,
    resetFilters,
  } = useCases();

  const { data: kpis, loading: kpisLoading } = useKpis();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-8 py-10 space-y-8">

        {/* HEADER */}
        <div className="border-b border-gray-200 pb-4">
          <h1 className="text-2xl font-semibold text-gray-900">
            Cases
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage delinquency cases and assignments
          </p>
        </div>

        {/* KPI SECTION */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <KpiCards data={kpis} loading={kpisLoading} />
        </div>

        {/* FILTERS + PAGINATION */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-6">

          <CasesFilters
            value={filters}
            onChange={updateFilters}
            onReset={resetFilters}
            disabled={loading}
          />

          <Pagination
            page={page}
            totalPages={totalPages}
            total={total}
            limit={limit}
            loading={loading}
            onPageChange={setPage}
            onLimitChange={setLimit}
          />

        </div>

        {/* TABLE */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">

          {loading && (
            <div className="p-6 text-sm text-gray-500">
              Loading cases...
            </div>
          )}

          {error && (
            <div className="p-6 text-sm text-red-600">
              {error}
            </div>
          )}

          {!loading && !error && (
            <CasesTable rows={rows} />
          )}

        </div>

      </div>
    </div>
  );
}