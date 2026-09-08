import type { ClinicalState } from "../clinical/ClinicalState";
import { deriveClinicalPresentation } from "../scene/ClinicalStatePresentation";
import { ClinicalAudioController } from "./ClinicalAudioController";

/** Deterministic state-to-cue synchronization. Audio remains presentation-only. */
export class ClinicalAudioSynchronizer {
  constructor(private readonly audio: ClinicalAudioController) {}
  sync(state: ClinicalState): void {
    this.audio.setClinicalSounds(deriveClinicalPresentation(state).sounds);
  }
}
