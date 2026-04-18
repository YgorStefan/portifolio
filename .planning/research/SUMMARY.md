# Research Summary: Google Gravity Effect

## Stack Additions
- **Matter.js**: 2D physics engine for the gravity simulation.
- **Vanilla JavaScript**: To handle DOM-to-Physics mapping and animation loop.

## Key Concepts
1. **DOM Mapping**: Every element on the page needs to be represented by a `Matter.Bodies.rectangle`.
2. **Dynamic Transition**: Elements must switch from standard document flow to `absolute` or `fixed` positioning when the effect starts.
3. **Animation Loop**: A `requestAnimationFrame` loop will sync the physical body's position/angle to the DOM element's `transform` (translate/rotate).
4. **Interactivity**: Matter.js `MouseConstraint` can be used to allow dragging and tossing of elements after they've fallen.

## Implementation Pitfalls
- **Layout Shift**: Switching to absolute positioning can break the layout if not handled carefully. A "snapshot" of initial positions is required.
- **Performance**: Too many elements will lag the browser. We should target main containers and headings rather than every single small tag.
- **Responsiveness**: The physics boundaries (floor/walls) must be updated if the window is resized.

## Integration Plan
1. Trigger: Click event on `images/profile.jpg`.
2. Phase 1: Snapshot initial positions of all target elements.
3. Phase 2: Initialize Matter.js world with invisible boundaries.
4. Phase 3: Transition elements to physics-controlled states.
5. Phase 4: Handle interactivity (drag/drop).
