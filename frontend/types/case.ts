export type CaseStatus =
  | "OPEN"
  | "IN_PROGRESS"
  | "RESOLVED"
  | "CLOSED";

export type CaseStage =
  | "SOFT"
  | "HARD"
  | "LEGAL";

export type Case = {
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

export type Customer = {
  id: number;
  name: string;
  phone: string;
  email: string;
  country: string;
  riskScore: number;
};

export type Loan = {
  id: number;
  principal: number;
  outstanding: number;
  dueDate: string;
  status: string;
};

export type ActionLog = {
  id: number;
  caseId: number;
  type: string;
  outcome: string;
  notes: string;
  createdAt: string;
};

export type CaseDetails = Omit<Case, "customerName" | "loanId"> & {
  customer: Customer;
  loan: Loan;
  actions: ActionLog[];
};
