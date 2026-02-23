"use client";

import { CasesFilters as Filters } from "@/hooks/useCases";

type Props = {
  value: Filters;
  onChange: (next: Partial<Filters>) => void;
  onReset: () => void;
  disabled?: boolean;
};

export default function CasesFilters({
  value,
  onChange,
  onReset,
  disabled,
}: Props) {
  return (
    <div className="flex flex-wrap gap-4 items-end">

      <div className="flex flex-col gap-1">
        <label className="text-xs text-gray-500">Status</label>
        <select
          className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          value={value.status || ""}
          onChange={(e) => onChange({ status: e.target.value })}
          disabled={disabled}
        >
          <option value="">All Status</option>
          <option value="OPEN">OPEN</option>
          <option value="IN_PROGRESS">IN_PROGRESS</option>
          <option value="RESOLVED">RESOLVED</option>
          <option value="CLOSED">CLOSED</option>
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs text-gray-500">Stage</label>
        <select
          className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          value={value.stage || ""}
          onChange={(e) => onChange({ stage: e.target.value })}
          disabled={disabled}
        >
          <option value="">All Stage</option>
          <option value="SOFT">SOFT</option>
          <option value="HARD">HARD</option>
          <option value="LEGAL">LEGAL</option>
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs text-gray-500">Assigned To</label>
        <input
          className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Assigned To"
          value={value.assignedTo || ""}
          onChange={(e) => onChange({ assignedTo: e.target.value })}
          disabled={disabled}
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs text-gray-500">DPD Min</label>
        <input
          className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 w-24"
          placeholder="Min"
          inputMode="numeric"
          value={value.dpdMin || ""}
          onChange={(e) => onChange({ dpdMin: e.target.value })}
          disabled={disabled}
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs text-gray-500">DPD Max</label>
        <input
          className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 w-24"
          placeholder="Max"
          inputMode="numeric"
          value={value.dpdMax || ""}
          onChange={(e) => onChange({ dpdMax: e.target.value })}
          disabled={disabled}
        />
      </div>

      <button
        onClick={onReset}
        disabled={disabled}
        className="px-4 py-2 text-sm bg-gray-200 hover:bg-gray-300 rounded-md transition"
      >
        Reset
      </button>

    </div>
  );
}