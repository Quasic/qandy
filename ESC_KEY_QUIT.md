# ESC Key Quit Feature

## Overview

Piano.js now supports pressing the ESC key to quit the application and return to the Qandy operating system. This provides a consistent exit mechanism for interactive scripts.

## Usage

**To Quit Piano:**
1. While piano.js is running
2. Press the **ESC** key on your keyboard
3. Piano will exit cleanly and return to the Qandy command prompt

**Visual Feedback:**
```
[User presses ESC]

Piano exited.
Returning to Qandy OS...

>
```

## Implementation Details

### Key Flow

1. **Physical Keyboard** → User presses ESC key (keyCode 27)
2. **qandy2.htm** → Maps keyCode 27 to string "esc"
3. **Routing** → Passes "esc" to active script's keydown() function
4. **piano.js** → Detects key === "esc" and calls quitPiano()
5. **Exit** → Clears state and returns control to Qandy OS

### Code Implementation

**pianoKeyHandler() - ESC Detection (piano.js lines 108-113)**
```javascript
function pianoKeyHandler(key) {
  // Check for ESC key to quit
  if (key === "esc") {
    quitPiano();
    return true;
  }
  // ... rest of key handling
}
```

**quitPiano() - Clean Exit (piano.js lines 135-152)**
```javascript
function quitPiano() {
  // Clear pressed keys
  pressedKeys = {};
  
  // Clear the screen
  cls();
  
  // Show exit message
  print("\x1b[1;32mPiano exited.\x1b[0m\n");
  print("Returning to Qandy OS...\n\n");
  
  // Clear the run variable to return control to qandy
  run = "";
  if (typeof document !== 'undefined' && document.getElementById("run")) {
    document.getElementById("run").innerHTML = run;
  }
}
```

**qandy2.htm - Key Mapping (line 442)**
```javascript
case 27: k="esc"; break;
```

### The run Variable

The `run` variable controls which script receives keyboard input:

| run Value | Behavior |
|-----------|----------|
| `""` (empty) | Command prompt mode - qandy2.htm handles input |
| `"piano.js"` | Piano mode - piano.js receives keyboard events |
| `"demo.js"` | Game mode - demo.js receives keyboard events |

**Key Routing Code (qandy2.htm line 1050):**
```javascript
if (run) { keydown(k); }  // Only routes if run is set
```

When piano.js sets `run = ""`, keyboard input stops going to piano.js and returns to the command prompt.

## Display Update

The piano display now includes the ESC instruction:

**Before:**
```
Keys: White:A-K Black:WETYU

Songs:
 playScale()
```

**After:**
```
Keys: White:A-K Black:WETYU
ESC: Quit

Songs:
 playScale()
```

## Clean Exit Behavior

The quitPiano() function ensures a clean exit:

1. **Clear State** - Resets `pressedKeys = {}` to release any held notes
2. **Clear Display** - Calls `cls()` to clear the terminal screen
3. **User Feedback** - Shows exit message in green text
4. **Return Control** - Sets `run = ""` to return to command prompt
5. **Update DOM** - Updates the run indicator in the UI

### State Management

**Before Quit:**
- `run = "piano.js"` - Piano receiving input
- `pressedKeys = { 'a': 'C4', 's': 'D4' }` - Keys may be pressed
- Display showing piano keyboard

**After Quit:**
- `run = ""` - Command prompt receiving input
- `pressedKeys = {}` - All keys released
- Display cleared, showing exit message
- Command prompt ready for next command

## Consistent with Other Scripts

This ESC key behavior is consistent with other Qandy scripts:

### demo.js (Queville Game)
```javascript
// Shows "Press ESC key:" prompt
print("Press ESC key:<p>");
```

### q.js (Queville Editor)
```javascript
// Shows "Press [ESC] Key:" prompt
print("Press [ESC] Key:");
```

## User Experience Scenarios

### Scenario 1: Normal Exit
```
> piano.js
[Piano keyboard displays]
[User plays some notes]
[User presses ESC]
Piano exited.
Returning to Qandy OS...

> 
```

### Scenario 2: Exit with Keys Held
```
[User holds down A+S+D keys - playing chord]
♫ Chord: A+S+D → C4+D4+E4
[User presses ESC while still holding other keys]
Piano exited.
Returning to Qandy OS...

>
[Pressed keys cleared automatically]
```

### Scenario 3: Multiple Sessions
```
> piano.js
[Play some notes]
[Press ESC]
Piano exited.
Returning to Qandy OS...

> sound.js
[beep]
> piano.js
[Piano loads fresh - no state from previous session]
```

## Technical Benefits

### Clean State Management
- No lingering key presses after exit
- No stuck notes or audio oscillators
- Clean slate for next piano.js session

### Consistent Behavior
- Matches ESC behavior in demo.js and q.js
- Familiar pattern for users
- Predictable exit mechanism

### Proper Resource Cleanup
- Clears pressedKeys object
- Stops receiving keyboard events
- Returns focus to command prompt

## Alternative Exit Methods

While ESC is the recommended method, you can also exit by:

1. **Closing Browser Tab** - Abrupt exit, no cleanup
2. **Refreshing Page** - Resets entire Qandy system
3. **Loading Another Script** - Implicit exit, state may transfer

**Note:** Using ESC is preferred as it provides clean, explicit exit with proper state cleanup.

## Testing

### Manual Test 1: Basic Exit
1. Load qandy2.htm in browser
2. Type: `piano.js` and press Enter
3. Wait for piano to display
4. Press ESC key
5. **Expected:** Exit message shows, command prompt returns

### Manual Test 2: Exit with Active Keys
1. Load piano.js
2. Press and hold A key
3. Press and hold S key (chord playing)
4. Press ESC key
5. **Expected:** Exit occurs, keys cleared, no stuck notes

### Manual Test 3: Re-enter After Exit
1. Load piano.js
2. Press ESC to exit
3. Type: `piano.js` again
4. **Expected:** Piano loads fresh, no previous state

## Troubleshooting

### ESC Key Not Working?

**Check 1: Script Running?**
- Verify `run="piano.js"` is set
- Piano display should be visible
- If not loaded, ESC won't do anything

**Check 2: Browser Focus?**
- Click on the Qandy terminal window
- Ensure focus is in the text area
- Some browsers need focus for keyboard events

**Check 3: JavaScript Console?**
- Open browser developer tools (F12)
- Check for JavaScript errors
- Errors may prevent keydown handler from running

### Exit Message Not Showing?

**Likely Cause:** Display buffer issue
- Try pressing ESC twice
- Check if command prompt returns
- Type `cls` to clear any stuck display

## Future Enhancements

### Possible Improvements
- Confirmation prompt before exit (if chord playing)
- Save session state for resume
- Exit animation or fade-out effect
- Keyboard shortcut help (Ctrl+H)
- Exit statistics (notes played, session duration)

### Potential Additional Exit Keys
- **Ctrl+C** - Traditional interrupt signal
- **Ctrl+Q** - Common quit shortcut
- **Ctrl+X** - Alternative exit key

### Exit Hooks
```javascript
// Future: Allow scripts to run cleanup on exit
var exitHooks = [];

function onExit(callback) {
  exitHooks.push(callback);
}

function quitPiano() {
  // Run all exit hooks
  exitHooks.forEach(hook => hook());
  // ... existing quit code
}
```

## Summary

✅ **ESC key** exits piano.js cleanly
✅ **Clean state management** - no lingering keys or audio
✅ **User feedback** - clear exit message
✅ **Consistent** - matches other Qandy scripts
✅ **Documented** - displayed in piano instructions
✅ **Reliable** - proper run variable management

The ESC key provides a polished, professional exit mechanism that enhances the user experience and maintains system stability.
