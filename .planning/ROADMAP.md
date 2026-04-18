# Roadmap: Milestone v1.1 Google Gravity Effect

## Phase 1: Foundation & Trigger
**Goal:** Prepare the DOM for physics and implement the trigger.

- **Tasks:**
  - [ ] Identify and tag elements to be included in the physics world.
  - [ ] Implement a script to capture initial element positions.
  - [ ] Add the click event listener to the profile image.
  - [ ] Import Matter.js library.

**Success Criteria:**
- Clicking the profile image logs "Gravity Triggered" and captures all target element dimensions.
- Matter.js is available in the browser console.

---

## Phase 2: Physics Engine Integration
**Goal:** Map DOM elements to Matter.js bodies and start the simulation.

- **Tasks:**
  - [ ] Initialize Matter.js engine and world.
  - [ ] Create static boundaries (floor/walls) based on window size.
  - [ ] Convert target elements to physics bodies.
  - [ ] Implement the animation loop to sync DOM transforms with physics bodies.

**Success Criteria:**
- Upon click, elements fall and stack at the bottom of the screen.
- Elements rotate realistically as they fall and collide.

---

## Phase 3: Interactivity & Polish
**Goal:** Add dragging capabilities and refine the experience.

- **Tasks:**
  - [ ] Add Matter.js `MouseConstraint` for element manipulation.
  - [ ] Refine collision properties (friction, restitution).
  - [ ] Handle window resize to update physics boundaries.
  - [ ] Add a subtle "shake" or initial impulse when gravity starts.

**Success Criteria:**
- User can drag and throw elements around the screen.
- Elements behave predictably and smoothly.
- Window resizing doesn't break the boundaries.
