import type { AuditEntry } from "../audit/AuditLog";

export interface ClinicalAuditSummary {
  totalActions: number;
  acceptedActions: number;
  blockedActions: number;
  criticalErrors: number;
}

export function summarizeAudit(entries: readonly AuditEntry[]): ClinicalAuditSummary {
  let acceptedActions = 0;
  let blockedActions = 0;
  let criticalErrors = 0;
  for (const entry of entries) {
    if (entry.type !== "action" || !entry.action) continue;
    if (entry.action.accepted) acceptedActions++; else blockedActions++;
    if (entry.action.reason) criticalErrors++;
  }
  return { totalActions: acceptedActions + blockedActions, acceptedActions, blockedActions, criticalErrors };
}
