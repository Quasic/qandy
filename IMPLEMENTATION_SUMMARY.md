# ESC Key Opt-Out Implementation Summary

## Issue Resolved
The universal ESC key termination feature (added in a previous update) broke the q.js script, which previously used ESC to toggle between text and graphics display modes. Users needed a way for scripts to bypass the universal ESC termination when they want to handle the ESC key themselves.

## Solution Implemented
Added an `allowScriptESC` flag that defaults to `false` (maintaining universal ESC termination for all scripts) but can be set to `true` by scripts that need to handle ESC themselves.

## Technical Implementation

### 1. qandy2.htm Changes

**Added global flag (line 14):**
```javascript
var allowScriptESC=false; // if true, script handles ESC instead of universal termination
```

**Modified ESC handler (lines 497-514):**
```javascript
if (k==="esc") {
  // Universal ESC handler: terminate any running script and return to OS
  // UNLESS script has set allowScriptESC=true to handle ESC itself
  if (run && !allowScriptESC) {
   // Script is running and hasn't opted out - terminate it
   run = "";
   if (typeof document !== 'undefined' && document.getElementById("run")) {
    document.getElementById("run").innerHTML = run;
   }
   // Show termination message
   print("\x1b[1;33m[Script terminated by ESC key]\x1b[0m\n\n");
   // Prevent key from being passed to the terminated script
   k = "";
  }
  // If allowScriptESC is true, ESC will be passed to script's keydown() handler
  // If no script running, ESC does nothing
}
```

### 2. q.js Changes

**Enabled opt-out (line 6):**
```javascript
// Enable script to handle ESC key instead of universal termination
allowScriptESC=true;
```

**Added ESC handler in keydown() (lines 563-574):**
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
 // ... rest of keydown function
}
```

## Behavior Matrix

| Script State | allowScriptESC | ESC Pressed | Result |
|--------------|----------------|-------------|---------|
| No script running | N/A | ESC | Nothing happens |
| piano.js running | false (default) | ESC | Script terminated, return to OS |
| demo.js running | false (default) | ESC | Script terminated, return to OS |
| edit.js running | false (default) | ESC | Script terminated, return to OS |
| q.js running | true (explicitly set) | ESC | Mode toggles (txt ↔ gfx) |

## Testing Performed

### Unit Tests (Node.js)
```
Test 1: piano.js (no opt-out) - ESC terminates ✅
Test 2: q.js (opt-out) - First ESC toggles mode txt→gfx ✅
Test 3: q.js (opt-out) - Second ESC toggles mode gfx→txt ✅
Test 4: No script running - ESC ignored ✅
```

### Code Review
- ✅ Addressed style consistency feedback
- ✅ Code follows existing patterns in qandy codebase

### Security Scan
- ✅ CodeQL analysis: 0 vulnerabilities found
- ✅ No new security risks introduced

## Backward Compatibility
- **100% backward compatible**
- All existing scripts continue to work unchanged
- Default behavior (ESC terminates) preserved
- Only scripts that explicitly opt-out behave differently

## Files Modified

| File | Lines Changed | Description |
|------|--------------|-------------|
| `qandy2.htm` | +1, ~8 | Added flag, modified ESC handler |
| `q.js` | +15 | Added opt-out and ESC handling |
| `ESC_OPT_OUT_FEATURE.md` | +193 | Complete documentation |
| `.gitignore` | +1 | Ignore test files |
| **TOTAL** | **+210 lines** | Minimal, focused changes |

## Future Enhancements Enabled

With this opt-out mechanism, future scripts can now implement:

1. **edit.js**: "Save changes before exiting?" confirmation dialog
2. **Game scripts**: Pause menus triggered by ESC
3. **Demo scripts**: Help overlays toggled with ESC
4. **Any script**: Custom exit confirmation or multi-step exit workflows

## Usage Guide

### For Users
- **Most scripts**: Press ESC to quit (default behavior)
- **q.js (Queville game)**: Press ESC to toggle between text and graphics views
- **Future scripts**: May implement custom ESC behavior with confirmation prompts

### For Script Developers

**To use default ESC termination (recommended):**
```javascript
// Don't set allowScriptESC - it defaults to false
// ESC will automatically terminate your script
// No code needed!
```

**To handle ESC yourself:**
```javascript
// 1. Enable opt-out at script start
allowScriptESC = true;

// 2. Handle ESC in your keydown function
function keydown(k) {
  if (k == "esc") {
    // Your custom ESC handling here
    // Examples:
    // - Toggle a mode
    // - Show exit confirmation
    // - Display pause menu
    return;
  }
  // ... handle other keys ...
}
```

## Key Design Decisions

1. **Default to false**: Maintains security and prevents scripts from trapping users
2. **Global flag**: Simple, easy to understand, matches qandy architecture
3. **Minimal changes**: Only touch code directly related to ESC handling
4. **Preserve message**: Keep "[Script terminated]" message for default behavior
5. **No API changes**: Fits into existing keydown() pattern

## Verification Checklist

- [x] Solves reported issue (q.js ESC toggles display mode)
- [x] Backward compatible (existing scripts unchanged)
- [x] No security vulnerabilities introduced
- [x] Code review completed and feedback addressed
- [x] Logic tested and verified
- [x] Documentation created
- [x] Follows coding style of existing codebase
- [x] Minimal changes (surgical fix)
- [x] Enables future enhancements (edit.js, etc.)

## Conclusion

This implementation successfully resolves the ESC key issue with minimal, focused changes that:
- Restore q.js functionality
- Maintain backward compatibility
- Preserve security (default behavior unchanged)
- Enable future script enhancements
- Follow qandy coding patterns
- Introduce zero security vulnerabilities

The solution is production-ready and can be merged immediately.
