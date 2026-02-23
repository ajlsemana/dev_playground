"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
    getCaseById,
    createActionLog,
    runAssignment,
    downloadNoticePdf
} from "@/lib/api/cases";
import { CaseDetails } from "@/types/case";
import { ActionLog } from "@/types/action";

export default function CaseDetailsPage() {
    const { id } = useParams();
    const caseId = Number(id);

    const [data, setData] = useState<CaseDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [form, setForm] = useState<Partial<ActionLog>>({
        type: "CALL",
        outcome: "NO_ANSWER",
        notes: ""
    });

    async function fetchCase() {
        try {
            setLoading(true);
            const res = await getCaseById(caseId);
            setData(res);
        } catch (err) {
            setData(null);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (caseId) fetchCase();
    }, [caseId]);

    async function handleAddAction(e: React.FormEvent) {
        e.preventDefault();
        await createActionLog(caseId, form);
        setForm({ type: "CALL", outcome: "NO_ANSWER", notes: "" });
        fetchCase();
    }

    async function handleAssign() {
        await runAssignment(caseId);
        fetchCase();
    }

    async function handleGeneratePdf() {
        const blob = await downloadNoticePdf(caseId);
        const url = window.URL.createObjectURL(blob);
        window.open(url, "_blank");
    }

    if (loading) {
        return (
            <div className="max-w-5xl mx-auto p-8">
                <div className="border border-blue-200 bg-blue-50 text-blue-700 rounded-lg p-4 text-sm">
                    Loading...
                </div>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="max-w-5xl mx-auto p-8">
                <div className="border border-red-200 bg-red-50 text-red-700 rounded-lg p-4 text-sm">
                    Case not found.
                </div>
            </div>
        );
    }

    const { customer, loan, actions } = data;

    return (
        <div className="p-8 space-y-8 max-w-5xl mx-auto">
            <div className="flex justify-between items-center border-b pb-4">
                <div>
                    <h1 className="text-2xl font-semibold">
                        Case #{data.id}
                    </h1>
                    <div className="flex gap-3 mt-2 text-sm">
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded">
                            {data.stage}
                        </span>
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded">
                            {data.status}
                        </span>
                    </div>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={handleAssign}
                        className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                    >
                        Run Assignment
                    </button>
                    <button
                        onClick={handleGeneratePdf}
                        className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-black"
                    >
                        Generate PDF Notice
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
                <div className="border p-4 rounded">
                    <h2 className="font-semibold mb-3">Customer</h2>
                    <p>Name: {customer?.name}</p>
                    <p>Email: {customer?.email}</p>
                    <p>Phone: {customer?.phone}</p>
                    <p>Risk Score: {customer?.riskScore}</p>
                </div>

                <div className="border p-4 rounded">
                    <h2 className="font-semibold mb-3">Loan</h2>
                    <p>Principal: {loan?.principal}</p>
                    <p>Outstanding: {loan?.outstanding}</p>
                    <p>Due Date: {loan?.dueDate}</p>
                    <p>DPD: {data.dpd}</p>
                    <p>Assigned To: {data.assignedTo || "Unassigned"}</p>
                </div>
            </div>

            <div>
                <h2 className="text-lg font-semibold mb-3">Action Logs</h2>
                <div className="border rounded divide-y">
                    {(!actions || actions.length === 0) && (
                        <div className="p-4 text-sm text-gray-500">
                            No actions yet
                        </div>
                    )}
                    {actions?.map((a: any) => (
                        <div key={a.id} className="p-4 text-sm">
                            <div className="font-medium">
                                {a.type} — {a.outcome}
                            </div>
                            <div>{a.notes}</div>
                            <div className="text-gray-500 text-xs">
                                {new Date(a.createdAt).toLocaleString()}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div>
                <h2 className="text-lg font-semibold mb-3">Add Action</h2>
                <form
                    onSubmit={handleAddAction}
                    className="space-y-4 border p-4 rounded"
                >
                    <div className="flex gap-4">
                        <select
                            value={form.type}
                            onChange={(e) =>
                                setForm({ ...form, type: e.target.value as any })
                            }
                            className="border px-3 py-2 rounded w-full"
                        >
                            <option value="CALL">CALL</option>
                            <option value="SMS">SMS</option>
                            <option value="EMAIL">EMAIL</option>
                            <option value="WHATSAPP">WHATSAPP</option>
                        </select>

                        <select
                            value={form.outcome}
                            onChange={(e) =>
                                setForm({ ...form, outcome: e.target.value as any })
                            }
                            className="border px-3 py-2 rounded w-full"
                        >
                            <option value="NO_ANSWER">NO_ANSWER</option>
                            <option value="PROMISE_TO_PAY">PROMISE_TO_PAY</option>
                            <option value="PAID">PAID</option>
                            <option value="WRONG_NUMBER">WRONG_NUMBER</option>
                        </select>
                    </div>

                    <textarea
                        value={form.notes}
                        onChange={(e) =>
                            setForm({ ...form, notes: e.target.value })
                        }
                        className="border px-3 py-2 rounded w-full"
                        placeholder="Notes..."
                    />

                    <button
                        type="submit"
                        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                    >
                        Add Action
                    </button>
                </form>
            </div>
        </div>
    );
}