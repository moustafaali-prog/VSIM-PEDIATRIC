# Scenario Traceability — v2.2.0

This release closes the traceability layer for the 11 project scenarios without inventing unsupported clinical rules.

## Traceability contract

Each catalog scenario must have:
1. exactly one operational package;
2. exactly one scenario clinical map;
3. at least one source fact from FILE-05;
4. at least one assessment criterion;
5. `clinicalValidationRequired: true`;
6. `executableMedicationLogic: false` until medication/order-set validation is completed.

The traceability code intentionally treats missing mappings as release-blocking errors rather than silently generating defaults.

## Important limitation

This is **engineering traceability**, not clinical validation. The scenario values and source facts remain attributed to FILE-05 and must be clinically reviewed before institutional deployment.
