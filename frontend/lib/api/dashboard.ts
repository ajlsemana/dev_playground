import { apiFetch } from "./client";

export type Kpis = {
  openCases: number;
  resolvedToday: number;
  avgDpdOpen: number;
};

export async function getKpis() {
  return apiFetch<Kpis>("/api/dashboard/kpis");
}