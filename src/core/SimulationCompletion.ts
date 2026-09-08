import type { ClinicalState } from "../clinical/ClinicalState";
import type { AuditEntry } from "../audit/AuditLog";
import { isCompleteSBAR, type SBARFormData } from "../ui/SBARForm";

export interface CompletionStatus {
  safetyGateComplete: boolean;
  initialAssessmentComplete: boolean;
  reassessmentComplete: boolean;
  documentationComplete: boolean;
  sbarComplete: boolean;
  readyForDebrief: boolean;
  blockers: string[];
}

export function evaluateCompletion(state: ClinicalState, audit: readonly AuditEntry[], sbar?: SBARFormData): CompletionStatus {
  const accepted = new Set(audit.filter(e => e.type === "action" && e.action?.accepted).map(e => e.action!.actionId));
  const safetyGateComplete = state.audit.handHygieneCompleted && state.audit.patientIdentified && state.audit.allergyCheckCompleted;
  const initialAssessmentComplete = ["review_ehr", "initial_vitals", "pat_assessment"].every(x => accepted.has(x));
  const reassessmentComplete = accepted.has("reassess_vitals") || accepted.has("reassess_neuro");
  const documentationComplete = accepted.has("document");
  const sbarComplete = accepted.has("sbar_handover") && (!sbar || isCompleteSBAR(sbar));
  const blockers: string[] = [];
  if (!safetyGateComplete) blockers.push("SAFETY_GATE_INCOMPLETE");
  if (!initialAssessmentComplete) blockers.push("INITIAL_ASSESSMENT_INCOMPLETE");
  if (!reassessmentComplete) blockers.push("REASSESSMENT_INCOMPLETE");
  if (!documentationComplete) blockers.push("DOCUMENTATION_INCOMPLETE");
  if (!sbarComplete) blockers.push("SBAR_INCOMPLETE");
  return { safetyGateComplete, initialAssessmentComplete, reassessmentComplete, documentationComplete, sbarComplete, readyForDebrief: blockers.length === 0, blockers };
}
