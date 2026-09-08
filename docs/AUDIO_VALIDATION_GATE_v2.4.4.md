# Clinical Audio Validation Gate — v2.4.4

## Scope
This gate separates audio asset availability from clinical validity. The simulation may select audio from clinical state, but audio must never mutate physiology.

## Registered cue families
- MONITOR_BEEP
- MONITOR_ALARM
- CHILD_CRY
- AMBIENT_HOSPITAL
- WHEEZE
- DIMINISHED_BREATH_SOUNDS
- SILENT_CHEST

## Current disposition
All seven cues are `SOURCE_REGISTERED` only. License clearance, technical QA, and clinical SME approval are not inferred. Therefore no cue is marked `SME_APPROVED` in this release candidate.

## Required evidence before approval
1. Exact source/asset identifier and license evidence.
2. Technical playback QA across supported devices.
3. Clinical SME review for respiratory and pediatric distress cues.
4. Synchronization check against the deterministic clinical state.
5. Confirmation that audio has no write path into physiology/state.

## Safety rule
Audio is presentation-only. A missing, invalid, or unapproved audio asset must not change the clinical state or scoring.
