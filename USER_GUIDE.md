# User Guide: Command History and Editor

## Command History (Commodore 64 Style)

The qandy.htm system now includes command history, allowing you to quickly recall and re-execute previous commands just like on a Commodore 64!

### How to Use

#### Recalling Previous Commands
1. Press **↑** (Up Arrow) to recall your last command
2. Keep pressing **↑** to go further back in history (up to 50 commands)
3. Press **↓** (Down Arrow) to move forward through history
4. Press **↓** when at the newest command to return to what you were typing

#### Executing Recalled Commands
1. Press **↑** to recall a command
2. Press **ENTER** to execute it immediately, or
3. Edit the command first, then press **ENTER**

#### Editing Recalled Commands
1. Press **↑** to recall a command
2. Type any character to start editing
3. The command becomes yours to modify
4. Press **ENTER** when ready to execute

### Examples

```
> print('Hello World')
Hello World

> cls

> // Press ↑ now...
> cls

> // Press ↑ again...
> print('Hello World')

> // Press ↓...
> cls

> // Press ↓ again...
> // Returns to empty input line
```

### Tips
- Empty commands are not saved to history
- Duplicate consecutive commands are automatically filtered
- You can type at any time to exit history mode
- History is cleared when you reload the page

---

## Text Editor (edit.js)

The edit.js text editor is now fully functional! Use it to write and edit JavaScript programs.

### Starting the Editor

```
> edit.js
```

The editor will load with a welcome screen.

### Basic Editing

#### Navigation
- **↑ ↓ ← →** Arrow keys to move cursor
- Cursor wraps to next/previous line at edges

#### Text Entry
- Type normally to insert characters
- **ENTER** creates a new line
- **BACKSPACE** deletes character before cursor

#### Menu Access
- Press **M** or **ALT** to open the menu
- Use **↑ ↓** to navigate menu items
- Use **← →** to switch between menus
- Press **ENTER** to select an item
- Press **ESC** to close menu

### Menu Options

#### File Menu
- **New**: Start a new file (prompts for filename)
- **Open**: Load an existing file from storage
- **Save**: Save current file to localStorage
- **List Files**: Show all saved files
- **Exit**: Close editor and return to qandy

#### Edit Menu
- **Delete Line**: Remove current line
- **Clear All**: Erase entire document

#### Run Menu
- **Execute**: Run the code in the editor
  - Output appears on screen
  - Press any key to return to editor
  - Errors are displayed if code fails

### Example Session

```
> edit.js

[Editor opens]

// Type your program:
print('Testing 1-2-3')
for (var i = 0; i < 3; i++) {
  print('Count: ' + i)
}

// Press M or ALT to open menu
// Navigate to File > Save
// Enter filename: test.js
// File saved!

// Navigate to Run > Execute
// Your code runs and displays output

// Press any key to return to editor
// Navigate to File > Exit
// Back to qandy prompt

> test.js
// Your saved program loads and runs!
```

### Keyboard Shortcuts Quick Reference

| Key | Action |
|-----|--------|
| **M** or **ALT** | Open menu |
| **ESC** | Close menu/dialog |
| **↑ ↓ ← →** | Navigate (editing or menu) |
| **ENTER** | New line or select |
| **BACKSPACE** | Delete character |

### File Storage

Files are saved to your browser's localStorage:
- Files persist between sessions
- Files are per-browser (not shared across devices)
- Use **File > List Files** to see saved files
- Use **File > Open** to load a saved file

### Tips

1. **Save Often**: Use **File > Save** frequently
2. **Test Code**: Use **Run > Execute** to test without leaving editor
3. **List Files**: Check **File > List Files** to see what you've saved
4. **Quick Exit**: Use **File > Exit** or type a new program name at qandy prompt

### Limitations

- Maximum 20 visible lines (scrolls automatically)
- Maximum 29 visible columns per line
- No syntax highlighting (retro style!)
- No undo/redo (save frequently!)
- Files stored locally only

---

## Troubleshooting

### Command History Not Working?
- Make sure you're on the main qandy prompt (not in a program)
- Try refreshing the page if history seems stuck
- Remember: history clears on page reload

### Editor Not Opening?
- Type exactly: `edit.js` (all lowercase)
- Make sure no other program is running
- Press **ESC** if you're in a program, then try again

### Can't Find Saved Files?
- Use **File > List Files** in the editor
- Files are saved in localStorage (browser-specific)
- Clear browser cache? Files may be gone
- Try opening the file: use **File > Open** and type the filename

### Keys Not Working in Editor?
- Make sure editor is focused (click on it)
- Try pressing **ESC** to close any open menus
- Some browsers intercept certain keys - try different keys

### Code Won't Run?
- Check for syntax errors in your code
- Try running from qandy prompt instead: `yourfile.js`
- Look for error messages in the output
- Save file first, then try running

---

## More Information

See **IMPLEMENTATION_NOTES.md** for technical details about how these features were implemented.

---

**Enjoy coding in qandy! 🎮💻**
