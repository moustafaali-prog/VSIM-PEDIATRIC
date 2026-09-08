import { AuditLog } from "../audit/AuditLog";
import { CJMMEngine } from "../assessment/CJMMEngine";
import { PerformanceScoringEngine } from "../assessment/PerformanceScoringEngine";
import { ClinicalState } from "../clinical/ClinicalState";
import { buildSBAR, SBARReport } from "./SBARReport";

export interface DebriefReport {
  performanceScore: number;
  cjmmScore: number;
  sbar: SBARReport;
  actionCount: number;
  acceptedActionCount: number;
  missedSafetyChecks: string[];
}

export function buildDebrief(
  state: ClinicalState,
  audit: AuditLog,
  performance: PerformanceScoringEngine,
  cjmm: CJMMEngine,
): DebriefReport {
  const records = audit.actionRecords();
  const accepted = records.filter((x) => x.accepted);
  const safety = new Set(accepted.map((x) => x.actionId));
  const missedSafetyChecks = ["hand_hygiene", "identify_patient", "check_allergies"]
    .filter((id) => !safety.has(id));

  return {
    performanceScore: Number(performance.total().toFixed(2)),
    cjmmScore: Number(cjmm.total().toFixed(2)),
    sbar: buildSBAR(state, audit.all()),
    actionCount: records.length,
    acceptedActionCount: accepted.length,
    missedSafetyChecks,
  };
}
