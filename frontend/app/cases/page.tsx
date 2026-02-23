"use client";

import { useEffect, useState } from "react";
import { getCases } from "@/lib/api/cases";
import { Case } from "@/types/case";

export default function CasesPage() {
  const [cases, setCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchCases() {
    try {
      const res = await getCases("page=1&limit=10");
      setCases(res.data);
    } catch (err) {
      console.error("Failed to fetch cases", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchCases();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div style={{ padding: 20 }}>
      <h1>Cases</h1>

      {cases.map((c) => (
        <div key={c.id} style={{ borderBottom: "1px solid #ccc", padding: 10 }}>
          <strong>{c.customerName}</strong>
          <div>Status: {c.status}</div>
          <div>Stage: {c.stage}</div>
          <div>DPD: {c.dpd}</div>
        </div>
      ))}
    </div>
  );
}
