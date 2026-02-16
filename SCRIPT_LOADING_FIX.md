# Script Loading and Initialization Fix

## Problems Fixed

### 1. sound.js Leaves No Cursor After Loading
**Issue:** When loading sound.js directly by typing "sound.js", it would beep but then sit there with no cursor, appearing to be stuck.

**Root Cause:** 
- sound.js didn't manage the `run` variable
- After loading, `keyon` was set back to 1 (keyboard enabled) but there was no keydown handler
- The system appeared stuck because there was no visual cursor

**Solution:** 
- Added `run = ""` at line 41 of sound.js
- This clears the run variable, signaling the system that no script is actively running
- The command prompt returns normally after sound.js loads

### 2. piano.js Requires sound.js But Doesn't Check
**Issue:** If piano.js is loaded without sound.js being loaded first, the piano won't make any sound because the audio functions don't exist.

**Root Cause:**
- piano.js assumed sound.js was already loaded
- No validation or automatic loading

**Solution:**
- Added automatic detection and loading of sound.js in piano.js (lines 13-30)
- Checks for existence of `beep` and `playNote` functions
- If not found, automatically loads sound.js
- Shows user feedback during loading process
- Initializes piano after sound.js is loaded

## Technical Implementation

### sound.js Changes

```javascript
beep();

// Sound.js is a library script, not an interactive program
// Clear the run variable so the command prompt returns after loading
run = "";

// Create Web Audio context (lazily initialized on first beep)
var audioContext = null;
```

**Why this works:**
- Library scripts should NOT set a run variable (unlike interactive scripts like demo.js or piano.js)
- By explicitly setting `run = ""`, we signal that the script has finished its initialization
- The qandy system recognizes this and returns to command prompt mode

### piano.js Changes

```javascript
// Check if sound.js is loaded, if not load it automatically
if (typeof beep === 'undefined' || typeof playNote === 'undefined') {
  print("\x1b[1;33mLoading sound.js...\x1b[0m\n");
  var soundScript = document.createElement('script');
  soundScript.src = 'sound.js';
  soundScript.onload = function() {
    print("\x1b[1;32m✓ Sound system loaded\x1b[0m\n\n");
    initializePiano();
  };
  soundScript.onerror = function() {
    print("\x1b[1;31mError: Could not load sound.js\x1b[0m\n");
    print("Please ensure sound.js is in the same directory.\n");
  };
  document.head.appendChild(soundScript);
  var initializePiano;
}
```

**How it works:**
1. Check if sound functions exist using `typeof`
2. If missing, create a script element and load sound.js
3. Show loading message to user
4. When loaded, show success message and call initializePiano()
5. If error, show error message
6. If sound.js already loaded, initialize immediately (lines 234-238)

## Script Types in Qandy

### Interactive Scripts
Examples: demo.js, q.js, piano.js

**Characteristics:**
- Set `run="scriptname.js"` to receive keyboard events
- Define a `keydown(key)` function to handle input
- Remain active until user exits or loads another script

### Library Scripts  
Examples: sound.js, qandy-gfx.js, qandy-itemid.js

**Characteristics:**
- Do NOT set run variable (or set `run=""` explicitly)
- Provide functions/data for other scripts to use
- Execute initialization code then yield control back
- Should complete quickly and return to command prompt

## Testing

### Test Scenario 1: Loading sound.js directly
```
> sound.js
[beep sound]
> [cursor returns, ready for next command]
```

### Test Scenario 2: Loading piano.js without sound.js
```
> piano.js
Loading sound.js...
[beep sound]
✓ Sound system loaded

[Piano keyboard displays]
```

### Test Scenario 3: Loading piano.js with sound.js already loaded
```
> sound.js
[beep sound]
> piano.js
[Piano keyboard displays immediately]
```

## Run Variable Behavior

The `run` variable in qandy controls whether keyboard events are routed to a script:

| Value | Behavior |
|-------|----------|
| `run=""` | Command prompt mode, no script running |
| `run="piano.js"` | Piano script receives keyboard events |
| `run="demo.js"` | Demo/game receives keyboard events |

**Key Points:**
- Interactive scripts MUST set run to their name
- Library scripts MUST set run to empty string or leave it alone
- When run is set, the keydown() function receives key events
- When run is empty, the system is in command prompt mode

## Files Modified

1. **sound.js** (line 41)
   - Added `run = ""` to clear run variable after initialization

2. **piano.js** (lines 13-30, 228-238)
   - Added sound.js detection and auto-loading
   - Wrapped initialization in conditional logic
   - Added user feedback messages

## Benefits

✅ sound.js now properly returns to command prompt after loading
✅ piano.js automatically loads sound.js if needed
✅ Clear user feedback during loading process
✅ No more "stuck" appearance after loading library scripts
✅ Proper separation of library vs interactive scripts
