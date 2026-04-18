# Milestone v1.1 Requirements: Google Gravity Effect

## 1. Interaction & Trigger
- [ ] **TRIG-01**: Clicking the profile image (`profile.jpg`) toggles the gravity effect on.
- [ ] **TRIG-02**: The cursor should change to a pointer when hovering over the profile image to indicate it's clickable.

## 2. Physics Simulation
- [ ] **PHYS-01**: Use Matter.js to create a physics world with gravity.
- [ ] **PHYS-02**: Page elements (headings, text blocks, cards, buttons) should fall to the bottom of the viewport when triggered.
- [ ] **PHYS-03**: Elements should have realistic collisions and bounce slightly.
- [ ] **PHYS-04**: Create invisible boundaries (floor and walls) matching the viewport dimensions.

## 3. DOM Synchronization
- [ ] **SYNC-01**: Capture the initial position (top, left, width, height) of all target elements before the effect starts.
- [ ] **SYNC-02**: Update the CSS `transform` (translate and rotate) of each DOM element to match its corresponding physical body in every frame.
- [ ] **SYNC-03**: Ensure elements stay within the viewport.

## 4. User Interaction
- [ ] **DRAG-01**: Users can drag and toss the fallen elements using the mouse or touch.
- [ ] **DRAG-02**: Elements should react to the "toss" with momentum.

## Future Requirements
- [ ] **FUT-01**: Option to "reset" the page to its original state.
- [ ] **FUT-02**: Sound effects for collisions.

## Out of Scope
- Making every single span/icon a separate physics body (too heavy).
- Persistent state after page refresh.

## Traceability
| REQ-ID | Phase |
|--------|-------|
| TRIG-01 | 1 |
| TRIG-02 | 1 |
| PHYS-01 | 2 |
| PHYS-02 | 2 |
| PHYS-03 | 2 |
| PHYS-04 | 2 |
| SYNC-01 | 1 |
| SYNC-02 | 2 |
| SYNC-03 | 2 |
| DRAG-01 | 3 |
| DRAG-02 | 3 |
