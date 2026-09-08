# Release Status — v1.5.0

## Completed in this release
- The 11 scenario directory entries from FILE-05 are now runtime-loadable packages.
- Each package has a deterministic baseline ClinicalState using values explicitly present in FILE-05.
- Common safety-gated assessment/action vocabulary is available across scenarios.
- Explicitly timed source events are represented for Rana (minute 3 and 6) and Charlie (minute 4). Other scenarios do not receive invented timings.
- Each package carries source facts and a validation boundary.
- Executable medication logic remains disabled pending validated order-set review.

## Not claimed
This release is not a clinically validated production release. It does not claim that every clinical value, order, dose, event, or scoring rule in FILE-05 has been independently validated.

## Next engineering gate
Scenario-specific scoring/rubrics, validated EHR orders, and end-to-end clinical response transitions must be added only after the source conflicts are reconciled and the relevant clinical content is validated.
