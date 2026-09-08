# Device Performance Validation Plan v2.4.5

## Required device classes
- Desktop/laptop: mouse + keyboard.
- Tablet: touch-first interaction.
- Smartphone: touch-first interaction and reduced render load.

## Measurements
- FPS: median and 1% low during room view, patient close-up, telemetry, procedure animation, and audio playback.
- Frame time: median and 95th percentile.
- Memory: JS heap where exposed plus browser/task-manager observation.
- GPU pressure: draw calls, DPR, texture memory where tooling permits.
- Input: raycast latency and touch target usability.

## Acceptance criteria
The project specification target of 60 FPS remains a target to be verified experimentally. No device is marked PASS until measured under representative scenarios.

## Test sequence
1. Cold launch.
2. Load default scenario.
3. Run safety-gate sequence.
4. Execute assessment interactions.
5. Execute procedure animation.
6. Observe telemetry.
7. Trigger audio cues.
8. Complete/debrief session.
9. Repeat on each device class.
