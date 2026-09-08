# Operational Scenario Layer — v1.5.0

This release upgrades the directory into 11 runtime-loadable scenario packages.

## Traceability rule
All patient demographics and baseline findings represented in the packages are transcribed from project FILE-05. No medication dose is executed by the runtime in this release. No timed curveball is created unless FILE-05 explicitly supplies a time.

## Scenario status
All 11 packages are `PENDING_VALIDATION`. This is intentional: runtime readiness is not equivalent to clinical validation.

## Runtime contract
Each package exposes:
- patient identity, age and weight;
- baseline clinical state;
- common safety-gated actions;
- source facts;
- explicitly timed events where available;
- a hard boundary disabling executable medication logic until a validated order set is supplied.

## Known source-level conflicts
The project files contain different scoring distributions and some clinical statements that require SME reconciliation. The runtime does not silently resolve these conflicts.
