# Piano Cursor Positioning Fix

## Problems Fixed

### 1. Piano Keyboard Disappearing After Pagination
**Issue:** When screen filled up and "Press Any Key to Continue" appeared, pressing a key would clear the entire screen including the piano keyboard display.

**Root Cause:** The `resumePagination()` function in qandy2.htm called `initScreen()` which cleared the entire screen buffer.

**Solution:** Implemented ANSI cursor positioning so that note displays don't cause scrolling. The cursor stays at a fixed position (line 27) and overwrites the previous note instead of adding new lines.

### 2. Note Feedback Causing Scrolling
**Issue:** Each note played would print with `\n`, causing the screen to scroll and eventually trigger pagination.

**Root Cause:** The `pianoKeyHandler()` function was using `print()` with newlines, which incremented the cursor position and caused scrolling.

**Solution:** 
- Use ANSI cursor positioning `\x1b[27;1H` to move cursor to line 27, column 1
- Use ANSI clear line `\x1b[K` to clear from cursor to end of line
- Print the note information without `\n`
- This overwrites the previous note at the same position without scrolling

## Technical Implementation

### Changes to piano.js
1. Added `noteDisplayLine` variable set to 27 (the line after all piano display content)
2. Modified `drawPiano()` to include a placeholder line "Now playing: (press a key)"
3. Modified `pianoKeyHandler()` to use ANSI cursor positioning:
   ```javascript
   print("\x1b[" + noteDisplayLine + ";1H"); // Move to line 27, column 1
   print("\x1b[K"); // Clear from cursor to end of line
   print("\x1b[1;36m♪ Now playing: " + note + " (" + keyLabel + ")\x1b[0m");
   ```
4. Updated all song functions (playScale, playTwinkleTwinkle, etc.) to use cursor positioning
5. Updated chord functions to use cursor positioning
6. Removed extra initialization messages that would cause scrolling

### Changes to qandy2.htm
Added ANSI cursor control support to the print system:

1. **Modified `parseANSIString()` function:**
   - Added handling for `H` and `f` commands (Cursor Position)
   - Added handling for `K` command (Erase in Line)
   - Creates tokens of type `cursor` and `clearline`

2. **Modified `print()` function:**
   - Added handler for `cursor` token type:
     ```javascript
     cursorY = Math.min(Math.max(0, token.row), screenHeight - 1);
     cursorX = Math.min(Math.max(0, token.col), screenWidth - 1);
     ```
   - Added handler for `clearline` token type with three modes:
     - Mode 0: Clear from cursor to end of line (default)
     - Mode 1: Clear from start of line to cursor
     - Mode 2: Clear entire line

## ANSI Codes Now Supported

### Cursor Positioning
- `\x1b[H` - Move cursor to home (0,0)
- `\x1b[row;colH` - Move cursor to row, col (1-based)
- `\x1b[row;colf` - Same as H (alternative form)

### Erase in Line
- `\x1b[K` or `\x1b[0K` - Clear from cursor to end of line
- `\x1b[1K` - Clear from start of line to cursor
- `\x1b[2K` - Clear entire line

## Result

The piano keyboard now:
- ✅ Stays visible at all times
- ✅ Shows the currently playing note at a fixed position
- ✅ Never triggers pagination from note display
- ✅ Updates in place without scrolling
- ✅ Works correctly even if "Press Any Key" is triggered by other scripts

## Testing

To test the fix:
1. Open `qandy2.htm?run=piano.js` in a browser
2. Press piano keys (A, S, D, F, G, H, J, K, W, E, T, Y, U)
3. Verify:
   - Piano keyboard remains visible
   - Note display updates in place on line 27
   - No scrolling occurs
   - No pagination is triggered
   - Keyboard continues working after any "Press Any Key" prompts

## Example Usage

The cursor positioning can now be used in any qandy script:

```javascript
// Move cursor to line 10, column 5
print("\x1b[10;5H");

// Clear the current line from cursor position
print("\x1b[K");

// Write at a fixed position without scrolling
print("\x1b[15;1H\x1b[KStatus: Running");
```

This enables creating status displays, progress indicators, and other UI elements that don't scroll.
