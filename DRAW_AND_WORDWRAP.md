# Draw Function and Word Wrap Improvements

## Overview
This document describes the improvements made to the qandy2.htm pocket computer script to simplify text display and improve word wrapping.

## New Features

### 1. draw() Function
A new `draw(text)` function has been added that provides direct video memory access, similar to the Commodore 64's PEEK/POKE approach.

#### Usage
```javascript
draw("Text to display");
draw("\x1b[32mColored text\x1b[0m");
draw("\x1b[10;5HText at specific position");
```

#### Behavior
- **Direct Rendering**: Displays text directly at the current cursor location
- **ANSI Support**: Full support for ANSI escape codes (colors, cursor positioning, line clearing)
- **No Scrolling**: Does NOT scroll when reaching the bottom of the screen - simply stops drawing
- **No Pagination**: Does NOT trigger pagination prompts
- **No History**: Does NOT update the `txt` variable (command history)
- **Screen Boundaries**: Automatically stops at screen edges (32 columns × 25 rows)

#### Use Cases
- Text editors that need to "paint" the screen directly
- Games that require precise control over display
- Status bars and overlays
- Any application that needs to bypass the normal print() behavior

### 2. Improved Word Wrap in print()
The `print()` function now features intelligent word wrapping with a look-ahead algorithm.

#### How It Works
**Old Approach (Look-Back)**:
1. Write characters to the screen buffer
2. When reaching screen width, look back to find the last space
3. Move the word fragment to the next line

**New Approach (Look-Ahead)**:
1. Before writing the first character of a word, calculate its total length
2. Check if the word will fit on the current line
3. If not, insert a line break BEFORE writing the word
4. Write the word without needing to move characters around

#### Benefits
- **More Efficient**: No need to move characters after they've been written
- **Cleaner Logic**: Prevents rendering instead of fixing after the fact
- **Better Performance**: Only checks at word boundaries, not for every character

#### Behavior
- **Word Boundaries**: Wraps at spaces, newlines, tabs, and form feeds
- **Long Words**: Words longer than 32 characters still hard-wrap at the screen width
- **Edge Detection**: Only performs look-ahead at the start of words (after a space or at line start)
- **Maintains Compatibility**: All existing functionality (scrolling, pagination, ANSI codes) still works

#### Examples
```javascript
// Normal wrapping at word boundaries
print("This is a long sentence that will wrap at word boundaries instead of breaking in the middle.");

// Output:
// This is a long sentence that
// will wrap at word boundaries
// instead of breaking in the
// middle.

// Long words still hard-wrap
print("supercalifragilisticexpialidocious");

// Output (screen width = 32):
// supercalifragilisticexpialidocio
// us
```

## Technical Details

### Screen Buffer
- **Dimensions**: 32 columns × 25 rows
- **Character Buffer**: `screenBuffer[y][x]` stores characters
- **Style Buffer**: `styleBuffer[y][x]` stores formatting (color, bold, inverse)
- **Cursor Position**: `cursorX` and `cursorY` track current position

### Token Processing
Both functions use the existing `parseANSIString()` function to tokenize input into:
- `char`: Regular characters
- `code`: ANSI color/style codes
- `cursor`: Cursor positioning commands
- `clearline`: Line clearing commands

### Differences Between print() and draw()

| Feature | print() | draw() |
|---------|---------|--------|
| Updates txt variable | ✓ | ✗ |
| Scrolling | ✓ | ✗ |
| Pagination | ✓ | ✗ |
| Word Wrap | ✓ | ✓ (hard wrap only) |
| ANSI Codes | ✓ | ✓ |
| Use Case | Normal output | Direct rendering |

## Migration Guide

### For Existing Code
No changes required! The improved word wrap in `print()` is backward compatible.

### For New Editors/Games
Consider using `draw()` for:
- Screen updates that need precise positioning
- Applications that manage their own scrolling
- Real-time displays that shouldn't trigger pagination

Continue using `print()` for:
- Normal program output
- Interactive command-line applications
- Any output that should be saved in history

## Testing
Test files are provided:
- `test-draw.js`: Demonstrates draw() function with ANSI codes
- `test-draw-function.html`: Standalone test page

Run tests by loading test files in qandy2.htm or opening the HTML test page directly.
