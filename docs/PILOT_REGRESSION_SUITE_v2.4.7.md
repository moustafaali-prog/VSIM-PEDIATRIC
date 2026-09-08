# Automated Pilot Regression Suite v2.4.7

## Purpose

This suite reruns the deterministic pilot harness after source changes and compares the normalized observable result of each case with a versioned baseline. It is an engineering regression detector, not clinical approval.

## Coverage

- 11 operational scenarios from `ScenarioCatalog`.
- 3 device profiles: DESKTOP, TABLET, PHONE.
- 5 pilot paths: NONE, SKIP_HAND_HYGIENE, SKIP_PATIENT_ID, SKIP_ALLERGY_CHECK, WRONG_SEQUENCE.
- 3 time-triggered probes for the currently specified timed events, repeated across all 3 device profiles.
- Baseline result includes completion blockers, accepted/rejected actions, state flags, safety audit state, physiologic state, elapsed time, and audit count.

Total cases: 174.

## Regression rule

A case is considered regressed if its normalized observable result differs from the stored baseline. This deliberately catches changes to behavior that may otherwise pass type checking.

Intentional changes must be reviewed first, then the baseline may be regenerated with `npm run pilot:regression:update`.

## Important boundary

The suite does not claim that project-specific clinical values, medication doses, audio files, or physiologic responses are clinically approved. It verifies repeatability and preservation of the current engineered behavior.
