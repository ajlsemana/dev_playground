"use client";

import Link from "next/link";
import { Case } from "@/types/case";

type Props = {
  rows: Case[];
};

export default function CasesTable({ rows }: Props) {
  if (!rows.length) {
    return (
      <div className="p-6 text-sm text-gray-500">
        No cases found
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">

        <thead className="bg-gray-100 text-gray-600 uppercase text-xs tracking-wider">
          <tr>
            <th className="px-4 py-3 text-left">ID</th>
            <th className="px-4 py-3 text-left">Customer</th>
            <th className="px-4 py-3 text-left">Loan</th>
            <th className="px-4 py-3 text-left">DPD</th>
            <th className="px-4 py-3 text-left">Stage</th>
            <th className="px-4 py-3 text-left">Status</th>
            <th className="px-4 py-3 text-left">Assigned To</th>
            <th className="px-4 py-3 text-left">Action</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-200">

          {rows.map((c) => (
            <tr
              key={c.id}
              className="hover:bg-gray-50 transition"
            >
              <td className="px-4 py-3 font-medium text-gray-900">
                {c.id}
              </td>

              <td className="px-4 py-3">
                {c.name}
              </td>

              <td className="px-4 py-3">
                {c.loanId}
              </td>

              <td className="px-4 py-3">
                {c.dpd}
              </td>

              <td className="px-4 py-3">
                <span className="px-2 py-1 text-xs rounded bg-yellow-100 text-yellow-700">
                  {c.stage}
                </span>
              </td>

              <td className="px-4 py-3">
                <span className="px-2 py-1 text-xs rounded bg-blue-100 text-blue-700">
                  {c.status}
                </span>
              </td>

              <td className="px-4 py-3">
                {c.assignedTo || "-"}
              </td>

              <td className="px-4 py-3">
                <Link
                  target="_blank"
                  href={`/cases/${c.id}`}
                  className="text-indigo-600 hover:text-indigo-800 font-medium"
                >
                  View
                </Link>
              </td>
            </tr>
          ))}

        </tbody>
      </table>
    </div>
  );
}