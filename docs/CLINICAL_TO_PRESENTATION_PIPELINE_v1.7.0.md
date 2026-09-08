# Clinical-to-Presentation Pipeline v1.7.0

## Contract

`ClinicalState` is the single source of truth for patient presentation. The presentation layer may derive:

- respiratory motion frequency from respiratory rate;
- respiratory motion amplitude from the documented effort state;
- perfusion appearance from the project visual thresholds;
- audio cue selection from explicit state flags/effort;
- monitor heartbeat timing from heart rate.

The presentation layer must never write to `ClinicalState`.

## Validation boundary

The current implementation does not claim clinical validation of generated breath sounds, crying audio, alarm semantics, or facial-expression mappings. Audio assets remain validation-gated in `ClinicalAudioManifest.ts`.

## Runtime path

`SimulationController.update()` → `ClinicalState` → `SceneManager.updateFromClinicalState()` → `ClinicalSceneBridge` → `PatientVisualController` + `ClinicalAudioController`.

The monitor beep is a presentation cue and does not alter physiology.
