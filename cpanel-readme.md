# Qandy Control Panel Configuration Guide

## Overview

The `cpanel.js` file provides a user-friendly way to customize the Qandy keyboard mappings and display options. This allows users to modify key behavior for all three caps lock levels without editing the main qandy2.htm file directly.

## Three-Level Keyboard System

Qandy uses a three-level keyboard system controlled by the CAPS lock key:

### Level 0: Normal (Lowercase)
Default lowercase letters and standard symbols
- Press keys to get: a-z, 0-9, `, \, etc.

### Level 1: Shifted (Uppercase)
Uppercase letters and shifted symbols  
- Press CAPS once to enable
- Press keys to get: A-Z, !, @, ~, |, etc.

### Level 2: Extended Graphics
Special Unicode characters for ASCII/ANSI art
- Press CAPS twice to enable
- Press keys to get: ┌, ─, │, ★, ◆, etc.

## Using cpanel.js

### Basic Setup

1. **Using cpanel.js**:
   
   Currently, qandy2.htm has the keyboard configurations built-in. The cpanel.js file serves as:
   - A reference for the keyboard mapping structure
   - A template for creating custom configurations
   - Documentation of all available mappings
   
   Future versions may support:
   ```html
   <script src="cpanel.js"></script>
   <!-- Then load qandy2.htm which would read from qandyConfig -->
   ```

2. **Modify the configuration** by editing the objects in cpanel.js:
   - `normalKeys`: Customize lowercase characters
   - `shiftedKeys`: Customize uppercase/shifted characters
   - `extendedChars`: Customize extended graphics characters

### Customization Examples

#### Change a normal key mapping
```javascript
normalKeys: {
  'q': 'q',  // Change 'q' to map to a different character
  // ... other keys
}
```

#### Change a shifted key mapping
```javascript
shiftedKeys: {
  '1': '!',  // Change what Shift+1 produces
  // ... other keys
}
```

#### Change an extended graphics character
```javascript
extendedChars: {
  'q': '┌',  // Change CAPS2+Q to a different box drawing character
  '\\': '∥', // Change from broken bar to double vertical line
  // ... other keys
}
```

## New Keys Added

Two previously missing keys have been added to Qandy:

### Backtick / Tilde (~`)
- **Keycode**: 192
- **Level 0**: ` (backtick)
- **Level 1**: ~ (tilde)
- **Level 2**: ` (backtick - kept for JavaScript coding)

### Backslash / Pipe (\\|)
- **Keycode**: 220
- **Level 0**: \ (backslash)
- **Level 1**: | (pipe)
- **Level 2**: ¦ (broken bar)

## Security Considerations

### Backtick in JavaScript vs Perl

**In Perl** (UNSAFE):
```perl
$output = `ls -la`;  # EXECUTES system command!
```

**In JavaScript/Node.js** (SAFE):
```javascript
const output = `Hello ${name}`;  // Just string interpolation
```

### Why Backticks are Safe in Qandy

1. **No Command Execution**: JavaScript backticks create template literals, not system commands
2. **Text-Only Input**: Qandy stores user input as plain text strings
3. **No Automatic Evaluation**: Characters are displayed, not executed
4. **Safe for Code Editing**: Useful for JavaScript input without security risks

### Pipe Character Safety

- In shell contexts, `|` chains commands together
- In Qandy, it's just a text character
- No shell command execution occurs from user input
- Safe for ASCII/ANSI art and code editing

## Extended Graphics Character Reference

### Box Drawing Characters

**Single Lines:**
```
┌─┬─┐
│ │ │
├─┼─┤
│ │ │
└─┴─┘
```

**Double Lines:**
```
╔═╦═╗
║ ║ ║
╠═╬═╣
║ ║ ║
╚═╩═╝
```

### Shapes
- **Circles**: ○ ●
- **Squares**: □ ■
- **Diamonds**: ◇ ◆
- **Stars**: ☆ ★

### Arrows
- **Basic**: ↑ ↓ ← →
- **Blocks**: ▀ ▄ ▌ ▐

### Card Suits
- ♠ (Spade) - Mapped to `[`
- ♥ (Heart) - Mapped to `]`
- ♦ (Diamond) - Mapped to `;`
- ♣ (Club) - Mapped to `'`

### Math Symbols
- × (Multiply) - Mapped to `=`
- ÷ (Divide) - Mapped to `/`
- ± (Plus-minus) - Mapped to `-`

### Other Useful Characters
- ✓ (Checkmark) - Mapped to `,`
- ✗ (X mark) - Mapped to `.`
- · (Middle dot) - Mapped to `space`
- ¦ (Broken bar) - Mapped to `\`

## Display Options

The configuration also includes display settings:

```javascript
displayOptions: {
  screenWidth: 29,              // Characters per line
  screenHeight: 25,             // Lines per screen
  maxHistorySize: 50,           // Command history limit
  paginationEnabled: true,      // Enable/disable pagination
  paginationLinesBeforePause: 22, // Lines before pause
  selectionBgColor: '#ffffff',  // Selection background
  selectionFgColor: '#000000'   // Selection text color
}
```

## Tips for ASCII/ANSI Art

1. **Use CAPS Level 2** for box drawing and special characters
2. **Combine characters** to create complex designs
3. **Mix single and double lines** for visual variety
4. **Use block characters** (▀ ▄) for shading effects
5. **Card suits and symbols** add decorative elements

## Future Enhancements

Potential future improvements to cpanel.js:
- Live configuration reloading
- Import/export keyboard layouts
- Custom color schemes
- Additional keyboard layouts (DVORAK, AZERTY, etc.)
- Macro key support

## Contributing

To suggest new characters or improvements:
1. Open an issue on the GitHub repository
2. Describe the character or feature you'd like to add
3. Explain the use case (ASCII art, coding, etc.)

## License

Qandy is Open Source software. See the main README for license details.
