export type CaseStatus =
  | "OPEN"
  | "IN_PROGRESS"
  | "RESOLVED"
  | "CLOSED";

export type CaseStage =
  | "SOFT"
  | "HARD"
  | "LEGAL";

export interface Case {
  id: number;
  customerName: string;
  loanId: string;
  dpd: number;
  stage: CaseStage;
  status: CaseStatus;
  assignedTo?: string;
  createdAt: string;
  updatedAt: string;
}
