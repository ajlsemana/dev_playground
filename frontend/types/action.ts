export type ActionType =
  | "CALL"
  | "SMS"
  | "EMAIL"
  | "WHATSAPP";

export type ActionOutcome =
  | "NO_ANSWER"
  | "PROMISE_TO_PAY"
  | "PAID"
  | "WRONG_NUMBER";

export interface ActionLog {
  id: number;
  type: ActionType;
  outcome: ActionOutcome;
  notes?: string;
  createdAt: string;
}
