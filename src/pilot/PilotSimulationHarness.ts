import type { ClinicalActionId } from "../clinical/ActionTypes";
import { EndToEndSession } from "../core/EndToEndSession";
import { getOperationalScenario, type OperationalScenarioPackage } from "../scenarios/ScenarioPackage";
import type { DeviceClass } from "../platform/DeviceProfile";

export type PilotDevice = DeviceClass;
export type PilotFault = "NONE" | "SKIP_HAND_HYGIENE" | "SKIP_PATIENT_ID" | "SKIP_ALLERGY_CHECK" | "WRONG_SEQUENCE";

export interface PilotStep { action?: ClinicalActionId; seconds?: number; note?: string; }
export interface PilotRunResult {
  scenarioId: string;
  device: PilotDevice;
  fault: PilotFault;
  completed: boolean;
  completion: ReturnType<EndToEndSession["snapshot"]>["completion"];
  finalTimeSeconds: number;
  auditCount: number;
  acceptedActions: number;
  rejectedActions: number;
  observedState: ReturnType<EndToEndSession["snapshot"]>["state"];
}

const deviceFrameBudgetMs: Record<PilotDevice, number> = { DESKTOP: 16.67, TABLET: 16.67, PHONE: 16.67 };

export function getPilotScenario(id: string): OperationalScenarioPackage {
  const scenario = getOperationalScenario(id);
  if (!scenario) throw new Error(`Unknown operational scenario: ${id}`);
  return scenario;
}

export function runPilotScenario(scenarioId: string, device: PilotDevice, fault: PilotFault = "NONE", steps: readonly PilotStep[] = defaultPilotSteps(fault)): PilotRunResult {
  const scenario = getPilotScenario(scenarioId);
  const session = new EndToEndSession(scenario);
  session.start();
  let accepted = 0;
  let rejected = 0;
  for (const step of steps) {
    if (step.seconds && step.seconds > 0) session.tick(step.seconds);
    if (step.action) {
      const ok = session.perform(step.action, step.note);
      ok ? accepted++ : rejected++;
    }
  }
  const snapshot = session.snapshot();
  const entries = session.runtime.controller.audit.all();
  return {
    scenarioId, device, fault,
    completed: snapshot.completion.readyForDebrief,
    completion: snapshot.completion,
    finalTimeSeconds: snapshot.timeSeconds,
    auditCount: entries.length,
    acceptedActions: accepted,
    rejectedActions: rejected,
    observedState: snapshot.state,
  };
}

export function defaultPilotSteps(fault: PilotFault): readonly PilotStep[] {
  const safety: PilotStep[] = [];
  if (fault !== "SKIP_HAND_HYGIENE") safety.push({ action: "hand_hygiene" });
  if (fault !== "SKIP_PATIENT_ID") safety.push({ action: "identify_patient" });
  if (fault !== "SKIP_ALLERGY_CHECK") safety.push({ action: "check_allergies" });
  const assessmentActions: ClinicalActionId[] = ["review_ehr", "initial_vitals", "pat_assessment", "auscultate_lungs", "reassess_vitals", "document"];
  const assessment: PilotStep[] = assessmentActions.map(action => ({ action }));
  if (fault === "WRONG_SEQUENCE") return [...assessment, ...safety];
  return [...safety, ...assessment];
}

export function runDeviceMatrix(scenarioId: string, fault: PilotFault = "NONE") {
  return (["DESKTOP", "TABLET", "PHONE"] as const).map(device => runPilotScenario(scenarioId, device, fault));
}

export interface SyntheticPerformanceSample { device: PilotDevice; frames: number; elapsedMs: number; simulatedFps: number; frameBudgetMs: number; withinBudget: boolean; }

/** Deterministic engineering load model; this is not a substitute for a real device benchmark. */
export function simulatePerformance(device: PilotDevice, frames = 600, averageFrameMs?: number): SyntheticPerformanceSample {
  const frameMs = averageFrameMs ?? deviceFrameBudgetMs[device];
  if (!Number.isFinite(frames) || frames <= 0) throw new Error("frames must be positive");
  if (!Number.isFinite(frameMs) || frameMs <= 0) throw new Error("averageFrameMs must be positive");
  const elapsedMs = frames * frameMs;
  const simulatedFps = 1000 / frameMs;
  return { device, frames, elapsedMs, simulatedFps, frameBudgetMs: deviceFrameBudgetMs[device], withinBudget: frameMs <= deviceFrameBudgetMs[device] };
}
