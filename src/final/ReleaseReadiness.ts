import type { ScenarioDefinition } from "../scenarios/ScenarioSchema";
import { getScenarioClinicalMap } from "../scenarios/ScenarioClinicalMap";

export interface ScenarioReadiness { scenarioId:string; executable:boolean; reasons:string[]; }
export function assessScenarioReadiness(scenario: ScenarioDefinition): ScenarioReadiness {
  const reasons:string[]=[];
  const map=getScenarioClinicalMap(scenario.id);
  if (!map) reasons.push("No clinical assessment map is registered.");
  if (scenario.validationStatus !== "VERIFIED") reasons.push(`Scenario validation status is ${scenario.validationStatus}.`);
  if (map?.criteria.some(c=>c.validationStatus === "PENDING_CLINICAL_VALIDATION")) reasons.push("One or more scenario criteria remain pending clinical validation.");
  return {scenarioId:scenario.id, executable:reasons.length===0, reasons};
}
