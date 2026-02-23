"use client";

import { useEffect, useState } from "react";
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
  const [local, setLocal] = useState<Filters>(value);

  useEffect(() => {
    setLocal(value);
  }, [value]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onChange(local);
  }

  function handleReset() {
    setLocal({
      status: "",
      stage: "",
      assignedTo: "",
      dpdMin: "",
      dpdMax: "",
    });
    onReset();
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-wrap gap-4 items-end"
    >
      <div className="flex flex-col gap-1">
        <label className="text-xs text-gray-500">Status</label>
        <select
          className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500"
          value={local.status || ""}
          onChange={(e) =>
            setLocal({ ...local, status: e.target.value })
          }
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
          className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500"
          value={local.stage || ""}
          onChange={(e) =>
            setLocal({ ...local, stage: e.target.value })
          }
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
          className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500"
          placeholder="Assigned To"
          value={local.assignedTo || ""}
          onChange={(e) =>
            setLocal({ ...local, assignedTo: e.target.value })
          }
          disabled={disabled}
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs text-gray-500">DPD Min</label>
        <input
          className="border border-gray-300 rounded-md px-3 py-2 text-sm w-24 focus:ring-2 focus:ring-indigo-500"
          placeholder="Min"
          inputMode="numeric"
          value={local.dpdMin || ""}
          onChange={(e) =>
            setLocal({ ...local, dpdMin: e.target.value })
          }
          disabled={disabled}
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs text-gray-500">DPD Max</label>
        <input
          className="border border-gray-300 rounded-md px-3 py-2 text-sm w-24 focus:ring-2 focus:ring-indigo-500"
          placeholder="Max"
          inputMode="numeric"
          value={local.dpdMax || ""}
          onChange={(e) =>
            setLocal({ ...local, dpdMax: e.target.value })
          }
          disabled={disabled}
        />
      </div>

      <button
        type="submit"
        disabled={disabled}
        className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
      >
        Apply
      </button>

      <button
        type="button"
        onClick={handleReset}
        disabled={disabled}
        className="px-4 py-2 text-sm bg-gray-200 hover:bg-gray-300 rounded-md transition"
      >
        Reset
      </button>
    </form>
  );
}