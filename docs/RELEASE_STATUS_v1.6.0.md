# Release Status — v1.6.0

## Implemented
- Scenario-specific clinical assessment maps for all 11 operational packages.
- Runtime integration: accepted actions -> scenario engine -> audit -> integrated assessment.
- Domain-normalized performance scoring using FILE-07 weights.
- CJMM-normalized scoring using FILE-04 weights.
- Duplicate actions do not award duplicate criterion credit.
- Blocked actions do not award criterion credit.
- Pending clinical-validation criteria are excluded from scoring and clearly reported.
- Runtime snapshot now exposes assessment results.

## Traceability
- FILE-04 supplies CJMM weights and critical-safety framework.
- FILE-05 supplies scenario-specific clinical findings, curveballs, and explicitly stated priorities.
- FILE-07 supplies the eight-stage workflow and performance-domain weights.

## Not claimed
- No medication is made executable merely because a dose appears in FILE-05.
- No claim of clinical validation, regulatory approval, or high-stakes assessment readiness is made.
- Full browser/Three.js build remains dependent on installing project dependencies; this environment currently lacks `node_modules`.
