# DOS API Quick Reference

## Overview

The DOS (Disk Operating System) API provides simple file storage for Qandy programs using localStorage. All files are stored as plain text strings - developers are responsible for converting complex data types (arrays, objects, etc.) to and from strings.

## Including DOS in Your Program

```html
<script src="dos.js"></script>
```

## Global Variables

```javascript
var device = "local";      // Current storage device
var lastError = "";        // Last error message
```

## Core Functions

### save(filename, data)
Save a text file to the current device.

```javascript
// Returns: boolean (true = success, false = failure)

save("myfile.txt", "Hello, World!");
save("program.js", "print('Hello!\\n');");
save("data.b64", btoa("binary data"));
save("readme.me", "This is a README");

// Check for errors
if (!save("file.txt", content)) {
  print("Error: " + lastError + "\n");
}
```

### load(filename)
Load a text file from the current device.

```javascript
// Returns: string (file content) or null (not found)

var content = load("myfile.txt");
if (content !== null) {
  print(content + "\n");
} else {
  print("Error: " + lastError + "\n");
}
```

### dir() / ls()
Display directory listing using print().

```javascript
dir();    // DOS style
ls();     // Linux style (same output)
```

Output format:
```
Directory of local:
─────────────────────────────────
  myfile.txt                       15 bytes
  program.js                       31 bytes

Total: 2 file(s)
```

### loadDir()
Get directory listing as a string for programmatic use.

```javascript
// Returns: newline-separated string of filenames

var fileList = loadDir();
var files = fileList.split("\n").filter(f => f.length > 0);

files.forEach(function(filename) {
  var content = load(filename);
  print(filename + ": " + content.length + " bytes\n");
});
```

### del(filename)
Delete a file from the current device.

```javascript
// Returns: boolean (true = deleted, false = not found)

if (del("oldfile.txt")) {
  print("File deleted\n");
} else {
  print("Error: " + lastError + "\n");
}
```

### exists(filename)
Check if a file exists.

```javascript
// Returns: boolean

if (exists("config.txt")) {
  var config = load("config.txt");
}
```

## File Extensions

The DOS API supports **any file extension**. Common uses:

- `.txt` - Text files
- `.js` - JavaScript programs
- `.b64` - Base64-encoded data
- `.me` - README files
- `.json` - JSON data (stringify/parse yourself)
- `.bas` - BASIC programs
- `.dat` - Data files
- Any other extension you want!

## Saving Complex Data

Since DOS only handles strings, you must convert complex data yourself:

### Arrays
```javascript
// Save array
var myArray = [1, 2, 3, 4, 5];
save("array.txt", myArray.join(","));

// Load array
var content = load("array.txt");
var myArray = content.split(",").map(Number);
```

### Objects
```javascript
// Save object
var myObj = {name: "John", age: 30};
save("object.json", JSON.stringify(myObj));

// Load object
var content = load("object.json");
var myObj = JSON.parse(content);
```

### Binary Data
```javascript
// Save binary as base64
var binaryData = "some binary data";
save("data.b64", btoa(binaryData));

// Load binary from base64
var content = load("data.b64");
var binaryData = atob(content);
```

## Error Handling

Always check return values and the `lastError` global:

```javascript
var content = load("missing.txt");
if (content === null) {
  print("Load failed: " + lastError + "\n");
  // lastError = "File not found: missing.txt"
}

if (!save("test.txt", data)) {
  print("Save failed: " + lastError + "\n");
  // Common errors:
  // - "Storage quota exceeded - disk full"
  // - "Data must be a string"
}
```

## Device Switching (Future)

The `device` variable allows switching between storage locations:

```javascript
device = "local";      // localStorage (default)
device = "cookie";     // Cookies (not yet implemented)
device = "disk";       // Server disk (not yet implemented)
```

Currently, only `"local"` is supported.

## Complete Example

```javascript
// Save some files
save("hello.txt", "Hello, World!");
save("program.js", "print('Loaded from disk!\\n');");

// List all files
print("Files on disk:\n");
dir();

// Load and execute a program
if (exists("program.js")) {
  var code = load("program.js");
  eval(code);  // Executes: print('Loaded from disk!\n');
}

// Get file list programmatically
var files = loadDir().split("\n").filter(f => f.length > 0);
print("\nFound " + files.length + " files\n");

// Delete a file
if (del("hello.txt")) {
  print("Deleted hello.txt\n");
}
```

## Best Practices

1. **Always check return values** - Don't assume operations succeed
2. **Use descriptive filenames** - `user-config.json` not `data.txt`
3. **Check exists() before load()** - Avoid unnecessary errors
4. **Handle conversion yourself** - Convert arrays/objects to strings before saving
5. **Keep files small** - localStorage typically has 5-10MB limit
6. **Use appropriate extensions** - Makes file purpose clear

## Limitations

- **Text only** - All files stored as strings (use btoa/atob for binary)
- **No directories** - Flat file system only
- **localStorage limit** - Usually 5-10MB per domain
- **Browser-specific** - Files don't sync between browsers
- **Cleared with browser data** - Not persistent if user clears cache

## Troubleshooting

### "File not found"
File doesn't exist. Use `dir()` to see available files.

### "Storage quota exceeded"
localStorage is full. Delete old files with `del()`.

### "Data must be a string"
You tried to save a non-string. Convert first:
```javascript
save("data.txt", String(myData));  // or JSON.stringify()
```

### Files disappeared
- Cleared browser data
- Different browser or incognito mode
- Wrong domain (files are per-domain)

---

**For detailed API documentation, see [DOS_API.md](DOS_API.md)**

**For test suite, open [test-dos.html](test-dos.html)**
