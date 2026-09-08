import { ClinicalState } from "./ClinicalState";
import { ClinicalSound } from "../audio/ClinicalAudioController";

export function deriveClinicalSounds(
  state: ClinicalState,
): ClinicalSound[] {
  const sounds: ClinicalSound[] = ["ambient"];

  if (state.respiratory.effort === "severe") {
    sounds.push("monitor_alarm");
  }

  if (state.flags["wheeze"]) sounds.push("wheeze");
  if (state.flags["diminished_breath"]) sounds.push("diminished_breath");
  if (state.flags["silent_chest"]) sounds.push("silent_chest");

  return sounds;
}
