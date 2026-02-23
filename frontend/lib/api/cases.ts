import { apiFetch, apiFetchBlob } from "./client";
import { Case, CaseDetails } from "@/types/case";
import { ActionLog } from "@/types/action";
import { AssignmentDecision } from "@/types/assignment";
import { PaginatedResponse } from "@/types/api";
import { buildQuery } from "@/utils/query";

export type GetCasesParams = {
  page?: number;
  limit?: number;
  status?: string;
  stage?: string;
  assignedTo?: string;
  dpdMin?: number;
  dpdMax?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
};

export async function getCases(params: GetCasesParams) {
  const qs = buildQuery(params);
  return apiFetch<PaginatedResponse<Case>>(`/api/cases?${qs}`);
}

export async function getCaseById(id: number) {
  return apiFetch<CaseDetails>(`/api/cases/${id}`);
}

export async function createActionLog(id: number, payload: Partial<ActionLog>) {
  return apiFetch(`/api/cases/${id}/actions`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function runAssignment(id: number) {
  return apiFetch<AssignmentDecision>(`/api/cases/${id}/assign`, {
    method: "POST",
  });
}

export async function downloadNoticePdf(id: number) {
  return apiFetchBlob(`/api/cases/${id}/notice.pdf`);
}