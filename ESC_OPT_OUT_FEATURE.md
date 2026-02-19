# ESC Key Opt-Out Feature

## Overview

This feature allows scripts to opt-out of the universal ESC key termination behavior, enabling them to handle the ESC key themselves for custom functionality.

## Problem

Previously, the universal ESC key handler would always terminate scripts when ESC was pressed. This broke `q.js` which used ESC to toggle between text and graphics display modes.

## Solution

Added an `allowScriptESC` flag that scripts can set to `true` to handle ESC key presses themselves instead of being terminated.

### Changes Made

#### 1. qandy2.htm - Added opt-out flag (line 14)
```javascript
var allowScriptESC=false; // if true, script handles ESC instead of universal termination
```

#### 2. qandy2.htm - Modified ESC handler (lines 497-514)
```javascript
if (k==="esc") {
  // Universal ESC handler: terminate any running script and return to OS
  // UNLESS script has set allowScriptESC=true to handle ESC itself
  if (run && !allowScriptESC) {
   // Script is running and hasn't opted out - terminate it
   run = "";
   // ... termination logic ...
  }
  // If allowScriptESC is true, ESC will be passed to script's keydown() handler
  // If no script running, ESC does nothing
}
```

#### 3. q.js - Enabled opt-out (line 6)
```javascript
// Enable script to handle ESC key instead of universal termination
allowScriptESC=true;
```

#### 4. q.js - Added ESC handler in keydown() (lines 561-572)
```javascript
function keydown(k) {
 // Handle ESC key to toggle between text and graphics screen
 if (k=="esc") {
  if (mode==="txt") {
   mode="gfx";
   document.getElementById("txt").style.left = "350px";
  } else {
   mode="txt";
   document.getElementById("txt").style.left = "54px";
  }
  return; // Don't process further
 }
 // ... rest of keydown logic ...
}
```

## Behavior

### Default Behavior (allowScriptESC=false)
- ESC terminates the script immediately
- Script returns to Qandy OS command prompt
- Works for: piano.js, demo.js, edit.js, and most scripts

### Opt-Out Behavior (allowScriptESC=true)
- ESC is passed to the script's `keydown()` function
- Script can handle ESC for custom functionality
- Works for: q.js (toggles display mode)

## Usage Examples

### For Script Developers

**To opt-out of universal ESC termination:**
```javascript
// At the top of your script
allowScriptESC = true;

// Then handle ESC in your keydown function
function keydown(k) {
  if (k === "esc") {
    // Your custom ESC handling here
    console.log("Script handling ESC key");
    return;
  }
  // ... other key handling ...
}
```

**To use default termination (recommended for most scripts):**
```javascript
// Don't set allowScriptESC - it defaults to false
// ESC will automatically terminate your script
```

### For Users

- **Most scripts**: Press ESC to quit
- **q.js (Queville game)**: Press ESC to toggle between text and graphics views
- **edit.js**: Can now implement "Save before quit?" prompts (future enhancement)

## Test Results

```
Test 1: piano.js (no opt-out) - ESC terminates ✅
  Before: run="piano.js"
  After:  run=""

Test 2: q.js (opt-out enabled) - ESC toggles mode ✅
  Before: run="queville.js", mode="txt"
  After:  run="queville.js", mode="gfx"

Test 3: q.js - Second ESC toggles back ✅
  Before: mode="gfx"
  After:  mode="txt"

Test 4: No script running - ESC ignored ✅
  Before: run=""
  After:  run="" (no change)
```

## Benefits

✅ **Backward compatible** - Existing scripts continue to work unchanged  
✅ **Minimal changes** - Only 3 lines added to qandy2.htm, 15 lines to q.js  
✅ **Flexible** - Scripts can choose their ESC behavior  
✅ **Well-documented** - Clear usage for script developers  
✅ **Restores q.js functionality** - ESC now toggles display mode as intended  

## Future Enhancements

With this feature, scripts can now implement advanced ESC handling:

- **edit.js**: "Save changes before exiting?" prompt
- **games**: Pause menu when ESC is pressed
- **demos**: ESC to toggle help overlay
- **any script**: Custom exit confirmation dialogs

## Migration Guide

**For existing scripts (no changes needed):**
- Scripts automatically use universal ESC termination
- No code changes required

**For scripts that want custom ESC handling:**
1. Add `allowScriptESC=true;` at the top of your script
2. Implement ESC handling in your `keydown(k)` function
3. Check for `if (k === "esc")` and handle accordingly

## Security & Best Practices

⚠️ **Important**: Scripts that opt-out should still provide a way to exit!

**Good practices:**
```javascript
allowScriptESC = true;

function keydown(k) {
  if (k === "esc") {
    // Show exit menu or confirm dialog
    showExitMenu();
    return;
  }
  if (k === "q" && menuVisible) {
    // Alternative: quit on 'q' key
    run = "";
    return;
  }
}
```

**Bad practices:**
```javascript
allowScriptESC = true;

function keydown(k) {
  if (k === "esc") {
    // Ignoring ESC completely - user has no way to exit!
    return;
  }
}
```

## Conclusion

The `allowScriptESC` flag provides a clean, backward-compatible solution that:
- Restores q.js functionality
- Enables future enhancements for edit.js and other scripts
- Maintains the universal ESC termination as the default behavior
- Gives script developers control when they need it
