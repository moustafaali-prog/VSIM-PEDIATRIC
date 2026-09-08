# v1.3.0 — High-Fidelity Simulation Phase

This release advances the project from a software integration prototype toward an interactive clinical simulation runtime.

## Implemented
- Higher-detail procedural pediatric patient model.
- Higher-detail procedural nurse model.
- Clinical equipment geometry: monitor, oxygen cylinder, IV pole/bag, bed rails, handwash station.
- Clinical state drives patient respiratory motion and skin/perfusion visualization.
- Patient and nurse geometry are kept separate from the clinical engine.
- Monitor-beep WebAudio layer is state-driven and does not modify physiology.
- Responsive renderer remains DPR-limited for device safety.
- Asset pipeline remains available for later GLB replacement.

## Important boundary
Procedural audio is limited to non-diagnostic monitor feedback. It is NOT a substitute for clinically validated breath/heart sound recordings.

Likewise, procedural characters are an engineering fallback. They are not claimed to be anatomically validated human digital twins.

## Next acceptance gates
1. Replace/augment procedural models with license-cleared GLB assets where they improve fidelity.
2. Add validated clinical auscultation recordings.
3. Implement complete procedure state machines and visual hand/arm IK per procedure.
4. Connect all 11 scenarios end-to-end.
5. Run clinical SME validation and device acceptance tests.
