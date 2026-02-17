# Qandy DOS (Disk Operating System) User Guide

## Overview

The Qandy DOS provides a simple file management system using your browser's localStorage. You can save, load, list, and delete files, giving you persistent storage for your programs and data.

## Why DOS?

Before DOS, there was no way to save your work! Now you can:
- **Save programs** you write for later use
- **Load programs** from storage to run them
- **Organize files** with a directory listing
- **Delete files** you no longer need

All files are stored locally in your browser's localStorage, so they persist between sessions.

## Commands

### DIR - List Files

Shows all available files (both built-in and user files).

```
dir
```

**Output:**
```
╔══════════════════════════════════════════╗
║     QANDY DISK OPERATING SYSTEM (DOS)   ║
╚══════════════════════════════════════════╝

BUILT-IN PROGRAMS:
  ascii.js
  sound.js
  piano.js
  demo.js
  q.js
  world.js

USER FILES:
  myprogram.js         512 B  2026-02-16 14:30

Total: 1 file(s), 512 B

Commands: save, load, dir, del
Type 'help' for help on DOS commands
```

### SAVE - Save a File

Saves content to a file in localStorage.

```
save <filename>
```

**Example:**
```
save myprogram.js
```

**Supported file extensions:**
- `.js` - JavaScript files (can be executed with LOAD)
- `.txt` - Text files (displayed when loaded)

**Limitations:**
- Filenames must end with `.js` or `.txt`
- Maximum filename length: 50 characters
- No special characters: `< > : " | ? * \x00-\x1F`

**Current Behavior:**
Currently, the SAVE command saves the current text content (`txt` variable). In future versions, this will be enhanced with an interactive editor.

### LOAD - Load and Execute/Display a File

Loads a file from localStorage. JavaScript files (`.js`) are automatically executed; text files (`.txt`) are displayed.

```
load <filename>
```

**Example:**
```
load myprogram.js
```

**For .js files:**
- Automatically executes the JavaScript code
- Functions become available immediately
- Can use `print()`, `cls()`, and other Qandy functions

**For .txt files:**
- Displays the file content on screen
- Good for documentation, notes, or data files

### DEL - Delete a File

Permanently removes a file from localStorage.

```
del <filename>
```

**Example:**
```
del myprogram.js
```

**Warning:** This action cannot be undone! Make sure you really want to delete the file.

## File Format

Files are stored as JSON objects in localStorage with the following structure:

```json
{
  "content": "// Your file content here",
  "timestamp": 1771262848578,
  "size": 107,
  "type": "javascript"
}
```

**Fields:**
- `content` - The actual file content
- `timestamp` - When the file was saved (Unix timestamp in milliseconds)
- `size` - File size in bytes
- `type` - File type ("javascript" or "text")

## Storage Limits

- **localStorage limit:** Typically 5-10 MB per domain (browser dependent)
- **File count:** No hard limit, but practical limit based on storage size
- **Filename length:** Maximum 50 characters

## Best Practices

### 1. Use Descriptive Filenames
```
Good: 
  - calculator.js
  - todo-list.js
  - game-state.txt

Avoid:
  - x.js
  - temp.js
  - asdf.js
```

### 2. Organize by Purpose
Use prefixes to group related files:
```
game-menu.js
game-level1.js
game-level2.js
utils-math.js
utils-string.js
```

### 3. Regular Cleanup
Use `dir` regularly to review your files and `del` to remove files you no longer need.

### 4. Backup Important Files
Since files are stored in browser localStorage:
- They're tied to your browser and domain
- Clearing browser data will delete them
- Consider copying important code elsewhere

## Workflow Examples

### Example 1: Creating a Simple Program

```
> // Type your program
> print("Hello, World!\n");

> save hello.js
✓ File saved: hello.js (28 bytes)

> dir
...
USER FILES:
  hello.js              28 B  2026-02-16 14:30
...

> load hello.js
Hello, World!
```

### Example 2: Creating a Reusable Function Library

```
> // Define utility functions
> function add(a, b) { return a + b; }
> function multiply(a, b) { return a * b; }

> save math-utils.js
✓ File saved: math-utils.js (89 bytes)

> cls

> load math-utils.js
> print(add(5, 3) + "\n");
8
> print(multiply(4, 7) + "\n");
28
```

### Example 3: Keeping Notes

```
> // Create a text file with notes
> save notes.txt
✓ File saved: notes.txt (...)

> load notes.txt
[Your notes content displayed here]
```

## Troubleshooting

### "Filename must end with .js or .txt"
**Problem:** You tried to save a file without a proper extension.

**Solution:** Add `.js` or `.txt` to your filename:
```
save myfile.js      ✓ Correct
save myfile         ✗ Wrong
```

### "File not found"
**Problem:** The file doesn't exist in localStorage.

**Solution:** 
1. Check the filename spelling with `dir`
2. Remember filenames are case-sensitive
3. Make sure you saved the file first

### "Storage quota exceeded"
**Problem:** localStorage is full (typically 5-10 MB limit).

**Solution:**
1. Use `dir` to see file sizes
2. Delete large unused files with `del`
3. Consider using shorter, more efficient code

### Files disappeared
**Possible causes:**
1. Browser cache/data was cleared
2. Using a different browser or incognito mode
3. Files are domain-specific (http://localhost vs https://example.com)

**Prevention:**
- Don't clear browser data unless necessary
- Use the same browser consistently
- Export important code to an external location

## Technical Details

### Storage Keys
Files are stored with the prefix `qandy_file_`:
- `qandy_file_myprogram.js` - Your saved file
- `qandy_files_index` - Index of all files (for fast listing)

### Character Encoding
Files are stored as UTF-8 encoded JSON strings.

### Performance
- **SAVE:** O(1) - constant time
- **LOAD:** O(1) - constant time
- **DIR:** O(n) - linear time based on file count
- **DEL:** O(n) - linear time to update index

## Future Enhancements

Planned features for future versions:
- [ ] Interactive file editor
- [ ] File categories/folders
- [ ] Import/export files to local filesystem
- [ ] File search and filtering
- [ ] File versioning
- [ ] Compression for large files
- [ ] Syntax highlighting for code files

## See Also

- [DOS API Documentation](DOS_API.md) - For developers
- [qandy2.htm User Guide](USER_GUIDE.md) - Main system documentation
- [Test DOS](test-dos.html) - Interactive DOS testing page

## Questions?

Open an issue on the [Qandy GitHub repository](https://github.com/Quintrix/qandy) for:
- Bug reports
- Feature requests
- Documentation improvements
- Questions about DOS functionality

---

**Happy coding with Qandy DOS!** 🎮💾
