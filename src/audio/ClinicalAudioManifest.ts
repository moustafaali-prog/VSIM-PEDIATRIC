export type ClinicalAudioCue='MONITOR_BEEP'|'MONITOR_ALARM'|'CHILD_CRY'|'AMBIENT_HOSPITAL'|'WHEEZE'|'DIMINISHED_BREATH_SOUNDS'|'SILENT_CHEST';
export interface AudioAsset{cue:ClinicalAudioCue;path:string;licenseCleared:boolean;clinicalValidation:'PENDING'|'VALIDATED';}
export const AUDIO_ASSETS:readonly AudioAsset[]=[...(['MONITOR_BEEP','MONITOR_ALARM','CHILD_CRY','AMBIENT_HOSPITAL','WHEEZE','DIMINISHED_BREATH_SOUNDS','SILENT_CHEST'] as ClinicalAudioCue[]).map(c=>({cue:c,path:`/assets/audio/${c.toLowerCase()}.ogg`,licenseCleared:false,clinicalValidation:'PENDING'} as AudioAsset))];
