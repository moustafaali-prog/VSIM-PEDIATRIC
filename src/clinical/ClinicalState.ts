export type RespiratoryEffort="normal"|"increased"|"severe"|"unknown";
export interface ClinicalState {
  timeSeconds:number;
  respiratory:{rate:number|null;oxygenSaturation:number|null;effort:RespiratoryEffort;airflow:"normal"|"reduced"|"markedly_reduced"|"unknown"};
  cardiovascular:{heartRate:number|null;systolicBP:number|null;diastolicBP:number|null;capillaryRefillSeconds:number|null};
  pain:{score:number|null;scale:string|null};
  hydration:{status:"adequate"|"possible_deficit"|"significant_deficit"|"unknown"};
  temperatureC:number|null;
  position:"supine"|"semi_fowler"|"high_fowler"|"lateral"|"other";
  flags:Record<string,boolean>;
  audit:{handHygieneCompleted:boolean;patientIdentified:boolean;allergyCheckCompleted:boolean};
}