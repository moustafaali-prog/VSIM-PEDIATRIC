# Clinical Validation Gate v2.4.2

## Purpose
This phase establishes a machine-readable clinical validation gate for the 11 project scenarios. It records provenance and review state without converting project transcription into clinical approval.

## Scope
- Scenario demographics and identity: FILE-05 provenance.
- Baseline physiologic state: FILE-05 provenance.
- Assessment/scoring criteria: FILE-04 provenance.
- Workflow-related criteria remain traceable to FILE-07 where implemented.
- Medication/order execution remains disabled.

## Status policy
`SOURCE_TRANSCRIPTION` means the value is represented from the project source but has not been clinically approved.

`EVIDENCE_REVIEWED` may be assigned only after an external evidence review is documented.

`SME_APPROVED` may be assigned only by an appropriately qualified clinical/simulation reviewer after review of the implemented behavior.

`REQUIRES_REVISION` blocks clinical approval and is used for medication/order execution in this release because executable medication logic has not completed clinical validation.

## Release gate
A scenario is not considered clinically approved unless every registered element is `SME_APPROVED`. Medication execution cannot be enabled merely by changing a scenario flag; an explicit validated order-set review is required.

## Current result
- Scenarios covered: 11/11
- Medication execution: DISABLED
- Clinical approval: NOT CLAIMED
- Registry integrity test: REQUIRED/PASS when executed

This is a software validation control, not a clinical endorsement or order set.
