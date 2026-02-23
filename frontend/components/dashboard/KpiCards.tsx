"use client";

import { Kpis } from "@/lib/api/dashboard";

type Props = {
  data?: Kpis | null;
  loading?: boolean;
};

export default function KpiCards({ data, loading }: Props) {
  if (loading) {
    return (
      <div className="text-sm text-gray-500">
        Loading KPIs...
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">

      <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
        <div className="text-xs text-gray-500 uppercase tracking-wide">
          Open Cases
        </div>
        <div className="text-2xl font-semibold mt-2 text-gray-900">
          {data.openCases}
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
        <div className="text-xs text-gray-500 uppercase tracking-wide">
          Resolved Today
        </div>
        <div className="text-2xl font-semibold mt-2 text-green-600">
          {data.resolvedToday}
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
        <div className="text-xs text-gray-500 uppercase tracking-wide">
          Avg DPD (Open)
        </div>
        <div className="text-2xl font-semibold mt-2 text-indigo-600">
          {data.avgDpdOpen}
        </div>
      </div>

    </div>
  );
}