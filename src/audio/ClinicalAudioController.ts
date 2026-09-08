export type ClinicalSound =
  | "ambient"
  | "monitor_alarm"
  | "crying"
  | "wheeze"
  | "diminished_breath"
  | "silent_chest";

export interface AudioState {
  enabled: boolean;
  activeSounds: ClinicalSound[];
}

/**
 * Audio is intentionally an interface layer in v0.3.0.
 * Sound selection follows clinical state/scenario events.
 * No sound is allowed to mutate the clinical state.
 */
export class ClinicalAudioController {
  private enabled = true;
  private active = new Set<ClinicalSound>();

  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
    if (!enabled) this.active.clear();
  }

  setClinicalSounds(sounds: ClinicalSound[]): void {
    if (!this.enabled) {
      this.active.clear();
      return;
    }
    this.active = new Set(sounds);
  }

  snapshot(): AudioState {
    return {
      enabled: this.enabled,
      activeSounds: [...this.active],
    };
  }
}
