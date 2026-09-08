# Release Status — v1.4.0

## What is actually implemented
- Scenario catalog containing the 11 directory entries from project file 05.
- A single `SimulationRuntime` orchestration boundary.
- Correct scenario replacement/reset semantics.
- Clinical audit summary helper.
- SBAR form validation model.
- Adaptive render-quality profile.
- Runtime tests for safety gating and deterministic time advancement.

## Source discipline
The scenario catalog transcribes directory facts from project file 05. It deliberately does **not** turn unverified scenario prose into executable drug doses, physiologic equations, or timed interventions.

## Not claimed as complete
This release is not a clinically validated production release. The following remain pending:
1. End-to-end executable logic for all 11 scenarios.
2. Clinical SME validation and sign-off.
3. Validated medication/order sets.
4. Validated clinical auscultation recordings.
5. Production-grade external 3D assets and technical/clinical QA.
6. Full browser build verification with installed dependencies.

## Important correction
No previous v1.4.0 archive existed in the runtime before this release. This release is the first archive actually created and verified at v1.4.0 in this execution.
