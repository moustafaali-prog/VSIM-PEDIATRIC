# Procedure Completion Pipeline v1.9.0

## Purpose
Close the gap between a 3D click and a clinical action. A click now resolves to a registered action/target pair. For procedures, the procedure state machine must reach `complete` before the clinical action is submitted to the Safety Gate.

## Deterministic sequence
1. Scene target is selected.
2. Target/action mapping is validated against `InteractionRegistry`.
3. If a procedure exists, it enters `approach` then `perform`.
4. No clinical state mutation occurs during partial progress.
5. At `complete`, the action is submitted to `SimulationController` with the target.
6. Safety Gate decides acceptance.
7. Only an accepted action is sent to the scenario engine and assessment/audit path.

## Scope boundary
This release does not invent medication doses, physiological response coefficients, validated clinical audio, or clinical skill validity claims. Those remain governed by the project's traceability/validation rules.
