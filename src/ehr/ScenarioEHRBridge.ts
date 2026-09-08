import type { ClinicalState } from "../clinical/ClinicalState";
import type { OperationalScenarioPackage } from "../scenarios/ScenarioPackage";
import { EHRStore, type EHRSnapshot, type VitalRecord } from "./EhrModel";

/** Read-only projection of source-supported scenario data into the EHR layer. */
export function createScenarioEHR(scenario: OperationalScenarioPackage): EHRStore {
  const patient = {
    id: scenario.patient.id,
    displayName: scenario.patient.name,
    ageYears: scenario.patient.ageYears.value,
    weightKg: scenario.patient.weightKg.value,
    allergies: scenario.sourceSupportedAllergies,
    diagnosis: scenario.catalog.diagnosis,
  };
  return new EHRStore(patient, [], []);
}


export function projectVitals(state: ClinicalState, timeSeconds: number): VitalRecord {
  return {
    timeSeconds,
    heartRate: state.cardiovascular.heartRate,
    respiratoryRate: state.respiratory.rate,
    systolicBP: state.cardiovascular.systolicBP,
    diastolicBP: state.cardiovascular.diastolicBP,
    oxygenSaturation: state.respiratory.oxygenSaturation,
    temperatureC: state.temperatureC,
  };
}

export function appendRuntimeVitals(ehr: EHRStore, state: ClinicalState): void {
  ehr.addVitals(projectVitals(state, state.timeSeconds));
}

export function snapshotEHR(ehr: EHRStore): EHRSnapshot { return ehr.snapshot(); }
