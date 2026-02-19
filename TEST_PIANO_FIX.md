# Testing Piano Keyboard Input Fix

## Issue
Piano keys were not producing sound when pressed because the `run` variable was not set.

## Fix Applied
Added `run="piano.js"` to the beginning of piano.js (line 7).

## How to Test

### Method 1: Using qandy2.htm
1. Open `qandy2.htm` in a browser
2. Type: `run piano.js` and press Enter (or navigate to `qandy2.htm?run=piano.js`)
3. The piano keyboard should display
4. Press keyboard keys:
   - **A, S, D, F, G, H, J, K** (white keys - natural notes)
   - **W, E, T, Y, U** (black keys - sharps/flats)
5. **Expected:** Each key press should:
   - Play the corresponding musical note
   - Display text like "♪ C4 (A)" showing which note was played

### Method 2: Using test-piano-keys.html
1. Open `test-piano-keys.html` in a browser
2. Wait for both sound.js and piano.js to load
3. You should see: "run variable is: piano.js"
4. Press the piano keys (A-K, W-U)
5. **Expected:** Same as above

### Method 3: Testing with playScale()
1. Load piano.js in qandy2.htm
2. In the console or command line, type: `playScale()`
3. **Expected:** Should hear the C major scale playing

## What Should Work

✅ **Initial beep** - When sound.js loads, you should hear a beep
✅ **playScale()** - Calling this function should play the C major scale
✅ **Piano keys** - Pressing A-K and W-U should play notes (THIS WAS THE BUG)
✅ **Example songs** - Functions like playTwinkleTwinkle() should work

## Verification Checklist

- [ ] Initial beep is heard when sound.js loads
- [ ] playScale() works and plays the scale
- [ ] Piano key 'A' plays note C4
- [ ] Piano key 'S' plays note D4
- [ ] Piano key 'W' plays note C#4
- [ ] All other piano keys work (D, E, F, G, H, J, K, T, Y, U)
- [ ] Visual feedback appears when keys are pressed (shows note name)
- [ ] playTwinkleTwinkle() works
- [ ] playMaryHadALamb() works

## Technical Details

The bug was in the keyboard event routing:
- qandy2.htm line 1050: `if (run) { keydown(k); }`
- This only calls keydown() if the `run` variable is truthy
- Piano.js was defining keydown() but not setting `run`
- Result: keydown() was never called for piano.js

The fix:
```javascript
run="piano.js"; 
if (typeof document !== 'undefined' && document.getElementById("run")) {
  document.getElementById("run").innerHTML = run;
}
```

This follows the same pattern as other qandy scripts (demo.js, q.js, etc.)
