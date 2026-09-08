import { AUDIO_ASSETS, type ClinicalAudioCue } from './ClinicalAudioManifest';

export type AudioValidationStatus =
  | 'SOURCE_REGISTERED'
  | 'TECHNICAL_QA_REQUIRED'
  | 'CLINICAL_QA_REQUIRED'
  | 'SME_APPROVED';

export interface AudioValidationRecord {
  cue: ClinicalAudioCue;
  assetPath: string;
  sourceRef: string;
  licenseStatus: 'NOT_CLEARED' | 'CLEARED';
  technicalQA: 'PENDING' | 'PASS';
  clinicalQA: 'PENDING' | 'PASS';
  status: AudioValidationStatus;
  clinicalClaim: string;
}

/**
 * Audio is presentation-only. No record in this registry authorizes physiology changes.
 * Clinical approval is deliberately not inferred from technical availability.
 */
export const AUDIO_VALIDATION_REGISTRY: readonly AudioValidationRecord[] = AUDIO_ASSETS.map((asset) => ({
  cue: asset.cue,
  assetPath: asset.path,
  sourceRef: 'PROJECT-FILE-03 / PROJECT-FILE-06',
  licenseStatus: asset.licenseCleared ? 'CLEARED' : 'NOT_CLEARED',
  technicalQA: 'PENDING',
  clinicalQA: 'PENDING',
  status: 'SOURCE_REGISTERED',
  clinicalClaim: audioClaim(asset.cue),
}));

function audioClaim(cue: ClinicalAudioCue): string {
  switch (cue) {
    case 'WHEEZE': return 'Respiratory wheeze cue; clinical recording/interpretation requires SME review.';
    case 'DIMINISHED_BREATH_SOUNDS': return 'Diminished breath-sound cue; clinical recording/interpretation requires SME review.';
    case 'SILENT_CHEST': return 'Absent/silent breath-sound cue; clinical recording/interpretation requires SME review.';
    case 'MONITOR_BEEP': return 'Monitor presentation cue; waveform/audio synchronization requires technical QA.';
    case 'MONITOR_ALARM': return 'Monitor alarm presentation cue; alarm semantics require technical and clinical QA.';
    case 'CHILD_CRY': return 'Pediatric distress/cry presentation cue; clinical appropriateness requires SME review.';
    case 'AMBIENT_HOSPITAL': return 'Non-clinical ambient presentation cue; licensing and technical QA required.';
  }
}

export function isAudioClinicallyApproved(cue: ClinicalAudioCue): boolean {
  const record = AUDIO_VALIDATION_REGISTRY.find((item) => item.cue === cue);
  return record?.status === 'SME_APPROVED' && record.licenseStatus === 'CLEARED' && record.technicalQA === 'PASS' && record.clinicalQA === 'PASS';
}
