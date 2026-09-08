# Integrated Scenario Assessment — v1.6.0

This release connects the operational scenario packages to the runtime assessment boundary.

## Data flow
Scenario Package -> Scenario Clinical Map -> SimulationController -> Audit + IntegratedAssessmentEngine -> Runtime Snapshot -> Debrief/UI.

## Traceability
- FILE-04: CJMM stage weights and safety-critical assessment framework.
- FILE-05: scenario-specific findings, explicit curveballs and explicitly stated priorities.
- FILE-07: eight-stage student workflow and domain scoring weights.

## Safety rule
Medication-related criteria that are not clinically validated remain `PENDING_CLINICAL_VALIDATION`; this release does not convert them into executable medication administration logic.

## Important limitation
The project source contains scenario-specific clinical values that require SME/guideline validation before the simulator can be labelled clinically validated or used for high-stakes assessment.
