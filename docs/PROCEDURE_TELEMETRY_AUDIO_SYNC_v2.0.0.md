# Procedure / Telemetry / Audio Synchronization v2.0.0

## Implemented
- Procedure progress is a presentation state separate from ClinicalState.
- Scene targets start procedures; clinical actions are emitted only on completion through the existing safety gate.
- Nurse hand presentation follows the active procedure target.
- Telemetry derives ECG, pleth, ABP and capnography traces from the current clinical state without mutating it.
- Clinical audio cues are derived from the same state projection.

## Validation boundary
- Waveforms are deterministic educational renderings, not diagnostic monitor waveforms.
- Audio cue labels are synchronization hooks; validated clinical recordings are still required before claiming clinical fidelity.
- No new medication dose or treatment rule is introduced here.
