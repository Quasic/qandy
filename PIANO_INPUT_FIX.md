# Piano Keyboard Input Fix

## Problem

Piano.js loaded and displayed the keyboard correctly, but pressing keys didn't play any notes. However, manually executing `playScale()` worked, indicating:
- Sound system was functional ✓
- Keyboard input routing was broken ✗

## Root Cause

When piano.js dynamically loads sound.js, a variable conflict occurs:

1. **piano.js initialization** (line 7):
   ```javascript
   run = "piano.js";
   ```
   Sets the run variable to route keyboard events to piano.js

2. **sound.js loads** (line 41 of sound.js):
   ```javascript
   run = "";
   ```
   Clears the run variable (library script pattern - returns to command prompt)

3. **Result**: The run variable is cleared, breaking keyboard routing

4. **qandy2.htm routing** (line 1050):
   ```javascript
   if (run) { keydown(k); }
   ```
   Only routes keyboard events if `run` is truthy

Since `run=""` is falsy, keyboard events never reach piano.js's keydown handler.

## Solution

Restore the `run` variable after sound.js finishes loading:

**File: piano.js, lines 17-26**

```javascript
soundScript.onload = function() {
  print("\x1b[1;32m✓ Sound system loaded\x1b[0m\n\n");
  // sound.js clears the run variable, so we need to restore it
  run = "piano.js";
  if (typeof document !== 'undefined' && document.getElementById("run")) {
    document.getElementById("run").innerHTML = run;
  }
  // Continue with piano initialization after sound.js loads
  initializePiano();
};
```

## Execution Flow

### Before Fix (Broken)
```
1. piano.js loads
   └─> run = "piano.js" ✓
   
2. sound.js not found, load dynamically
   └─> sound.js executes
       └─> run = "" ✗ (cleared!)
       
3. User presses key
   └─> qandy2.htm: if (run) { keydown(k); }
       └─> run is "" (falsy) → keydown NOT called
       └─> Input goes to command prompt instead
```

### After Fix (Working)
```
1. piano.js loads
   └─> run = "piano.js" ✓
   
2. sound.js not found, load dynamically
   └─> sound.js executes
       └─> run = "" (temporary)
   └─> onload callback executes
       └─> run = "piano.js" ✓ (restored!)
       
3. User presses key
   └─> qandy2.htm: if (run) { keydown(k); }
       └─> run is "piano.js" (truthy) → keydown called ✓
       └─> piano.js keydown handler processes key → plays note ✓
```

## The run Variable Gate

The `run` variable acts as a control gate in qandy2.htm:

| run value | Behavior |
|-----------|----------|
| `""` (empty) | Command prompt mode - input goes to qandy2.htm |
| `"piano.js"` | Piano mode - input goes to piano.js keydown handler |
| `"demo.js"` | Game mode - input goes to demo.js keydown handler |

**Key Code in qandy2.htm:**
```javascript
if (run) { 
  keydown(k);  // Call the active script's keydown handler
}
```

If `run` is empty/falsy, this condition fails and keyboard input is processed as commands instead of being routed to the script.

## Why This Pattern Exists

### Library Scripts (sound.js)
- Provide functions/data for other scripts
- Should NOT capture keyboard input
- Set `run=""` to return control to command prompt after loading

### Interactive Scripts (piano.js, demo.js)
- Require keyboard input to function
- Set `run="scriptname.js"` to capture keyboard events
- Define `keydown(key)` function to handle input

### The Conflict
When an interactive script dynamically loads a library script:
1. Interactive script sets `run="scriptname.js"`
2. Library script loads and sets `run=""`
3. Interactive script must restore `run="scriptname.js"`

## Testing

### Scenario 1: Load piano.js without sound.js pre-loaded
```
> piano.js
Loading sound.js...
[beep sound]
✓ Sound system loaded

[Piano keyboard displays]

Press A: Plays C4 note ✓
Press S: Plays D4 note ✓
Press W: Plays C#4 note ✓
```

### Scenario 2: Load piano.js with sound.js already loaded
```
> sound.js
[beep sound]
> piano.js
[Piano keyboard displays immediately]

Press A: Plays C4 note ✓
Press S: Plays D4 note ✓
Press W: Plays C#4 note ✓
```

### Scenario 3: Verify run variable state
```javascript
// After piano.js loads:
console.log(run);  // Output: "piano.js" ✓

// After pressing a key:
// Note plays and status line updates ✓
```

## Related Files

1. **piano.js** (Modified)
   - Lines 17-26: Added run variable restoration in onload callback

2. **sound.js** (Reference)
   - Line 41: Sets `run=""` (library script pattern)

3. **qandy2.htm** (Reference)
   - Line 1050: Keyboard routing gate `if (run) { keydown(k); }`

## Benefits

✅ Piano keyboard input now works correctly
✅ Notes play when keys are pressed
✅ Maintains proper separation of library vs interactive scripts
✅ Compatible with both loading scenarios (with/without sound.js pre-loaded)
✅ Follows established qandy script patterns
