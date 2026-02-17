# Qandy DOS API Documentation

## Overview

The DOS (Disk Operating System) module provides a JavaScript API for file management using browser localStorage. This document is for developers who want to integrate DOS functionality into their Qandy programs or extend the DOS system.

## Architecture

### Design Principles

1. **JSON-based storage** - Easy to parse, extensible, human-readable
2. **Indexed file system** - Fast file listing without scanning all localStorage keys
3. **Consistent error handling** - All methods return `{success, data, error}` objects
4. **Validation first** - Input validation before any storage operations
5. **Safe by default** - Restricted file extensions, character validation

### Storage Structure

```
localStorage:
  ├─ qandy_file_myprogram.js     → JSON file data
  ├─ qandy_file_notes.txt        → JSON file data
  └─ qandy_files_index           → JSON array of filenames
```

**File Data Format:**
```javascript
{
  "content": "string",      // File content (code or text)
  "timestamp": 1234567890,  // Unix timestamp in milliseconds
  "size": 123,              // Content length in bytes
  "type": "javascript"      // "javascript" or "text"
}
```

**Index Format:**
```javascript
["myprogram.js", "notes.txt", "utils.js"]  // Alphabetically sorted
```

## API Reference

### DOS.save(filename, content)

Saves a file to localStorage.

**Parameters:**
- `filename` (string) - Name of file (must end with .js or .txt)
- `content` (string) - File content to save

**Returns:**
```javascript
{
  success: true,
  data: {
    filename: "myfile.js",
    size: 107,
    timestamp: 1771262848578
  }
}
```

**Error Returns:**
```javascript
{
  success: false,
  error: "Error message"
}
```

**Possible Errors:**
- "Filename is required"
- "Filename cannot be empty"
- "Filename too long (max 50 characters)"
- "Filename contains invalid characters"
- "Filename must end with .js or .txt"
- "Content must be a string"
- "Storage quota exceeded"
- "Error saving file: [details]"

**Example:**
```javascript
const result = DOS.save("hello.js", "print('Hello!\\n');");
if (result.success) {
  console.log(`Saved ${result.data.filename} (${result.data.size} bytes)`);
} else {
  console.error(result.error);
}
```

### DOS.load(filename)

Loads a file from localStorage.

**Parameters:**
- `filename` (string) - Name of file to load

**Returns:**
```javascript
{
  success: true,
  data: {
    filename: "myfile.js",
    content: "print('Hello!\\n');",
    timestamp: 1771262848578,
    size: 107,
    type: "javascript"
  }
}
```

**Possible Errors:**
- "File not found: [filename]"
- "Error loading file: [details]"

**Example:**
```javascript
const result = DOS.load("hello.js");
if (result.success) {
  console.log("File content:", result.data.content);
  eval(result.data.content);  // Execute if JavaScript
} else {
  console.error(result.error);
}
```

### DOS.list()

Lists all files in localStorage.

**Parameters:** None

**Returns:**
```javascript
{
  success: true,
  data: [
    {
      filename: "hello.js",
      size: 107,
      timestamp: 1771262848578,
      type: "javascript",
      formattedSize: "107 B",
      formattedDate: "2026-02-16 17:27"
    }
  ]
}
```

**Possible Errors:**
- "Error listing files: [details]"

**Example:**
```javascript
const result = DOS.list();
if (result.success) {
  result.data.forEach(file => {
    print(`${file.filename} - ${file.formattedSize} - ${file.formattedDate}\n`);
  });
}
```

### DOS.delete(filename)

Deletes a file from localStorage.

**Parameters:**
- `filename` (string) - Name of file to delete

**Returns:**
```javascript
{
  success: true
}
```

**Possible Errors:**
- "File not found: [filename]"
- "Error deleting file: [details]"

**Example:**
```javascript
const result = DOS.delete("oldfile.js");
if (result.success) {
  print("File deleted successfully\n");
}
```

### DOS.exists(filename)

Checks if a file exists.

**Parameters:**
- `filename` (string) - Name of file to check

**Returns:** `boolean` - true if file exists, false otherwise

**Example:**
```javascript
if (DOS.exists("config.js")) {
  DOS.load("config.js");
} else {
  print("Config file not found\n");
}
```

### DOS.stats()

Gets storage statistics.

**Parameters:** None

**Returns:**
```javascript
{
  success: true,
  data: {
    fileCount: 5,
    totalSize: 2048,
    formattedSize: "2.0 KB"
  }
}
```

**Example:**
```javascript
const stats = DOS.stats();
if (stats.success) {
  print(`Storage: ${stats.data.fileCount} files, ${stats.data.formattedSize}\n`);
}
```

## Integration Examples

### Example 1: Auto-Load Configuration

```javascript
// Load config.js if it exists, otherwise use defaults
var config = {
  theme: "dark",
  soundEnabled: true
};

if (DOS.exists("config.js")) {
  const result = DOS.load("config.js");
  if (result.success) {
    eval(result.data.content);  // Loads config object
  }
}
```

### Example 2: Save Game State

```javascript
function saveGame() {
  const gameState = {
    level: currentLevel,
    score: playerScore,
    inventory: playerInventory
  };
  
  const code = "var gameState = " + JSON.stringify(gameState, null, 2) + ";";
  const result = DOS.save("savegame.js", code);
  
  if (result.success) {
    print("Game saved!\n");
  } else {
    print("Error saving: " + result.error + "\n");
  }
}

function loadGame() {
  const result = DOS.load("savegame.js");
  if (result.success) {
    eval(result.data.content);
    currentLevel = gameState.level;
    playerScore = gameState.score;
    playerInventory = gameState.inventory;
    print("Game loaded!\n");
  }
}
```

### Example 3: File Manager

```javascript
function showFileManager() {
  const result = DOS.list();
  if (!result.success) {
    print("Error: " + result.error + "\n");
    return;
  }
  
  print("\n╔════════════════════════════════╗\n");
  print("║       FILE MANAGER             ║\n");
  print("╚════════════════════════════════╝\n\n");
  
  if (result.data.length === 0) {
    print("No files found.\n\n");
    return;
  }
  
  result.data.forEach((file, index) => {
    print(`${index + 1}. ${file.filename}\n`);
    print(`   Size: ${file.formattedSize}\n`);
    print(`   Modified: ${file.formattedDate}\n`);
    print(`   Type: ${file.type}\n\n`);
  });
  
  const stats = DOS.stats();
  if (stats.success) {
    print(`Total: ${stats.data.fileCount} files, ${stats.data.formattedSize}\n`);
  }
}
```

### Example 4: Batch Operations

```javascript
// Backup all JavaScript files
function backupAllJS() {
  const result = DOS.list();
  if (!result.success) return;
  
  let backupData = "// Backup created: " + new Date().toISOString() + "\n\n";
  
  result.data.forEach(file => {
    if (file.filename.endsWith('.js')) {
      const loadResult = DOS.load(file.filename);
      if (loadResult.success) {
        backupData += `// File: ${file.filename}\n`;
        backupData += loadResult.data.content + "\n\n";
      }
    }
  });
  
  DOS.save("backup.txt", backupData);
}
```

## Error Handling Best Practices

### Always Check Success Flag

```javascript
// ✓ Good
const result = DOS.load("file.js");
if (result.success) {
  // Use result.data
} else {
  print("Error: " + result.error + "\n");
}

// ✗ Bad
const result = DOS.load("file.js");
eval(result.data.content);  // Might crash if file doesn't exist!
```

### Provide User Feedback

```javascript
function safeLoad(filename) {
  const result = DOS.load(filename);
  if (result.success) {
    print(`✓ Loaded ${filename}\n`);
    return result.data.content;
  } else {
    print(`✗ Failed to load ${filename}: ${result.error}\n`);
    return null;
  }
}
```

### Handle Quota Exceeded

```javascript
function smartSave(filename, content) {
  let result = DOS.save(filename, content);
  
  if (!result.success && result.error.includes("quota exceeded")) {
    print("Storage full! Cleaning up...\n");
    
    // Delete old files
    const list = DOS.list();
    if (list.success) {
      // Sort by timestamp, oldest first
      list.data.sort((a, b) => a.timestamp - b.timestamp);
      
      // Delete oldest 3 files
      for (let i = 0; i < Math.min(3, list.data.length); i++) {
        DOS.delete(list.data[i].filename);
      }
      
      // Try again
      result = DOS.save(filename, content);
    }
  }
  
  return result;
}
```

## Validation Rules

### Filename Validation

```javascript
// Valid filenames
"program.js"      ✓
"notes.txt"       ✓
"my-file.js"      ✓
"file_2.js"       ✓
"data-2024.txt"   ✓

// Invalid filenames
"file"            ✗ (no extension)
"file.exe"        ✗ (wrong extension)
"file<>.js"       ✗ (invalid characters)
"a".repeat(51) + ".js"  ✗ (too long)
""                ✗ (empty)
```

**Forbidden characters:** `< > : " | ? *` and control characters (0x00-0x1F)

## Performance Considerations

### Operation Complexity

| Operation | Time Complexity | Notes |
|-----------|----------------|-------|
| `save()`  | O(1) | Constant time, updates index |
| `load()`  | O(1) | Direct localStorage access |
| `list()`  | O(n) | Iterates through all files |
| `delete()`| O(n) | Updates index array |
| `exists()`| O(1) | Quick localStorage check |
| `stats()` | O(n) | Calculates total size |

### Storage Optimization

```javascript
// ✓ Good: Store only necessary data
const data = {
  score: 100,
  level: 5
};
DOS.save("game.js", "var data=" + JSON.stringify(data));

// ✗ Bad: Storing redundant data
const data = {
  score: 100,
  level: 5,
  hugeArray: Array(10000).fill("unnecessary data")
};
```

## Security Considerations

### Code Execution Safety

The `load()` command automatically executes `.js` files with `eval()`. This is safe for user-created content but be aware:

```javascript
// User's own code - safe
DOS.save("mycode.js", "print('Hello!\\n');");
DOS.load("mycode.js");  // Executes safely

// Never load untrusted code!
// If implementing file sharing, sanitize content first
```

### localStorage Isolation

- Files are isolated to the domain (http://localhost, https://example.com, etc.)
- Different browsers have separate storage
- Incognito/private mode has separate storage
- No cross-domain access possible

## Extending DOS

### Adding New File Types

To support additional file types, modify `ALLOWED_EXTENSIONS` in `dos.js`:

```javascript
const ALLOWED_EXTENSIONS = ['.js', '.txt', '.json', '.md'];
```

### Custom File Handlers

```javascript
function customLoad(filename) {
  const result = DOS.load(filename);
  if (!result.success) return result;
  
  // Custom handling based on file type
  if (filename.endsWith('.json')) {
    result.data.parsed = JSON.parse(result.data.content);
  } else if (filename.endsWith('.md')) {
    result.data.html = markdownToHtml(result.data.content);
  }
  
  return result;
}
```

### File Metadata Extensions

Add custom metadata to file objects:

```javascript
function saveWithMetadata(filename, content, metadata) {
  // Save file normally
  const result = DOS.save(filename, content);
  if (!result.success) return result;
  
  // Save metadata separately
  const metaKey = "qandy_meta_" + filename;
  localStorage.setItem(metaKey, JSON.stringify(metadata));
  
  return result;
}
```

## Testing

Run the test suite with:

```bash
# Open in browser
open test-dos.html
```

Or use the DOS API directly in qandy2.htm:

```javascript
// Test save
DOS.save("test.js", "print('Test!\\n');");

// Test load
DOS.load("test.js");

// Test list
DOS.list();

// Test delete
DOS.delete("test.js");
```

## Changelog

### Version 1.0.0 (2026-02-16)
- Initial release
- SAVE, LOAD, DIR, DELETE commands
- JSON-based file format
- Indexed file system
- Support for .js and .txt files
- File validation and error handling
- Storage statistics
- Integration with qandy2.htm

## Contributing

To contribute to DOS development:

1. Fork the repository
2. Create a feature branch
3. Make your changes to `dos.js`
4. Test with `test-dos.html`
5. Update documentation
6. Submit a pull request

## License

Qandy DOS is part of the Qandy project and follows the same open source license.

---

For user-facing documentation, see [DOS User Guide](DOS_USER_GUIDE.md).
