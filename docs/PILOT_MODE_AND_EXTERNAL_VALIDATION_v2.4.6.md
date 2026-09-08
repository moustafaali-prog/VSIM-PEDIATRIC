# Pilot Mode & External Validation — v2.4.6

## Purpose
This layer enables controlled engineering/pilot rehearsal before clinical approval. It uses the existing deterministic clinical runtime and does not replace real browser/device/SME validation.

## Added capabilities
- Deterministic scenario replay through the existing EndToEndSession boundary.
- Device matrix rehearsal for DESKTOP, TABLET, and PHONE.
- Safety fault injection: skipped hand hygiene, skipped patient identification, skipped allergy check, and wrong sequence.
- Synthetic performance budget calculation for 60 FPS engineering checks.

## Safety boundary
Medication execution remains disabled and scenario packages remain pending clinical validation. Pilot results are engineering evidence only and must not be presented as clinical validation.

## Required external validation
1. Install dependencies and run the real Vite/Three.js browser build.
2. Run the pilot in real desktop/tablet/phone browsers.
3. Execute browser-level E2E flows.
4. Supply licensed clinical audio and obtain clinical review.
5. Obtain pediatric clinical SME approval for scenarios, medications, and assessment criteria.
6. Measure FPS, memory, GPU behavior, touch input and thermals on representative physical devices.
7. Run the final release gate only after all required approvals are recorded.
