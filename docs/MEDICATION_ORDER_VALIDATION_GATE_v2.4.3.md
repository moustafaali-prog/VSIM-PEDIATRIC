# Medication & Order-Set Validation Gate — v2.4.3

## Purpose
This stage establishes a provenance-aware gate for medication and order-set content. It does **not** create executable medication instructions, doses, treatment-effect coefficients, or patient-specific prescribing logic.

## Control boundary
All 11 scenario packages remain non-executable for medication logic. The registry requires review of indication, age/weight applicability, route, order parameters, timing, contraindications/allergies, interactions, monitoring, expected response, escalation/stop criteria, and local institutional compatibility before any future execution layer can be considered.

## Evidence families selected for reconciliation
- GINA 2026 — asthma.
- WHO 2026 pediatric/adolescent SCD guideline — sickle cell disease.
- AHA/AAP 2025 PALS — pediatric emergency/resuscitation.
- IDSA/PIDS 2026 pediatric CAP — community-acquired pneumonia.
- SCCM 2026 pediatric sepsis — sepsis/septic shock.
- Additional scenario-specific guidance remains subject to SME confirmation.

## Important distinction
External evidence identifies the appropriate validation family; it does not automatically validate project-specific doses, timing, order sets, scoring rules, or physiologic coefficients. Project Files 01–07 remain the primary project source of truth, and unresolved conflicts remain explicitly gated.

## Release decision
**Medication/order execution: LOCKED.**

This gate is an engineering validation control, not a clinical endorsement or prescribing order set.
