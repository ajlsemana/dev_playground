import { apiFetch, apiFetchBlob } from "./client";
import { Case } from "@/types/case";
import { ActionLog } from "@/types/action";
import { AssignmentDecision } from "@/types/assignment";
import { PaginatedResponse } from "@/types/api";

export async function getCases(params: string) {
  return apiFetch<PaginatedResponse<Case>>(
    `/api/cases?${params}`
  );
}

export async function getCaseById(id: number) {
  return apiFetch<Case>(`/api/cases/${id}`);
}

export async function createActionLog(
  id: number,
  payload: Partial<ActionLog>
) {
  return apiFetch(`/api/cases/${id}/actions`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function runAssignment(id: number) {
  return apiFetch<AssignmentDecision>(
    `/api/cases/${id}/assign`,
    { method: "POST" }
  );
}

export async function downloadNoticePdf(id: number) {
  return apiFetchBlob(`/api/cases/${id}/notice.pdf`);
}
