# Synchronized Procedure → Presentation v2.0.0

## Implemented
1. A scene target starts a registered procedure rather than directly mutating clinical state.
2. Procedure progress is advanced by the simulation clock.
3. Procedure progress is projected to nurse-hand presentation.
4. Only procedure completion calls the clinical action path.
5. The clinical action path still passes through the existing SafetyEngine.
6. Telemetry derives ECG, pleth, ABP and capnography from the same ClinicalState snapshot.
7. Audio cues derive from the same ClinicalState projection.
8. Presentation layers are prohibited from mutating ClinicalState.

## Important validation boundary
- Procedural hand motion is an engineering presentation layer; it is not a validated competency measure.
- Waveforms are deterministic educational renderings, not diagnostic monitor waveforms.
- Audio cue routing is implemented; validated clinical recordings are not bundled.
- No new medication dose or clinical treatment rule is introduced.
