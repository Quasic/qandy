Retro Rules — Qandy Pocket Computer
Purpose: enforce "retro device" constraints so humans and AIs generate compatible code.

1) Fixed device layout
- Screen dimensions are fixed: screenWidth = 32, screenHeight = 25 (or the project constants).
- Do not write responsive or dynamic layout code. No resize-based repositioning for primary UI; tile/grid positions are absolute and constant.

2) Globals and legacy model
- Shared state is global (classic script style). Use the canonical globals file (qandy-globals.js or memory.js) to declare `var` globals.
- Avoid block-scoped shadowing: do not declare local variables with the same names as globals (cursorX, cursorY, line, inputStartX, inputStartY, screenBuffer, styleBuffer, etc.)
- If a function needs a local coordinate, use distinct names (cX, cY, localCursorX).

3) No modern module transforms
- Keep classic <script> file structure, not ES modules.
- Avoid build-tool-only features unless explicitly documented in this repo.

4) Tile and pixel rules
- Tile size is 32x32 px. Tile origin offsets are: topOffset = 50 px, leftOffset = 54 px.
- `tiles()` places tiles once using those offsets. No reflow.

5) Defensive assignments
- When assigning from possibly undefined variables, guard assignments to globals:
  window.inputStartX = (typeof cursorX === 'number') ? cursorX : window.inputStartX || 0;

6) Naming / comments
- Label globals with a comment that indicates which subsystem uses them (e.g., // video.js).
- Avoid duplicate canonical declarations across files. One authoritative initializer must exist.

7) Testing
- Manual: verify T0..Tn created and positioned; verify input rendering; verify no global vars become undefined.

(End of rules — expand as project evolves.)