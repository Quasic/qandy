# DOS Command Removal - Migration Guide

## Summary

DOS command parsing has been removed from qandy2.htm. Users now call DOS functions directly via the JavaScript API instead of typing command-line style commands.

## What Changed

### Before (Removed)
Users typed commands at the prompt:
```
> save myfile.js
> load myfile.js
> dir
> del myfile.js
```

These commands were parsed by qandy2.htm and routed to `dosCommand_*()` helper functions.

### After (Current)
Users call DOS API functions directly as JavaScript:
```javascript
save("myfile.js", content)
var content = load("myfile.js")
dir()
del("myfile.js")
```

## Available DOS API Functions

All functions are defined in `dos.js` and available globally:

### Core Functions

**save(filename, data)** - Save a file
- Returns: `"OK"` on success, `"ERROR: message"` on failure
- Example: `save("test.js", "print('hello');")`

**load(filename)** - Load a file
- Returns: File content as string, or `"ERROR: message"` on failure
- Example: `var code = load("test.js")`

**del(filename)** - Delete a file
- Returns: `"OK"` on success, `"ERROR: message"` on failure
- Example: `del("old.js")`

### Directory Functions

**dir()** - Display directory listing (formatted output)
- Prints formatted list to screen
- Example: `dir()`

**ls()** - Alias for dir()
- Example: `ls()`

**loadDir()** - Get directory as newline-separated string
- Returns: String with one filename per line
- Example: `var files = loadDir().split("\n")`

### Utility Functions

**exists(filename)** - Check if file exists
- Returns: `true` or `false`
- Example: `if (exists("config.js")) { ... }`

## Error Handling

All functions use string-based error handling:

```javascript
var result = save("test.txt", "hello");
if (result.substring(0, 5) === "ERROR") {
  print("Save failed: " + result + "\n");
} else {
  print("File saved successfully\n");
}
```

## Code Removed

From qandy2.htm:
- 54 lines of DOS command parsing (save, load, dir, ls, del, type, run, new, ram)
- 140 lines of `dosCommand_*()` helper functions
- Total: 194 lines removed

## Files Modified

- **qandy2.htm** - Removed command parsing and helper functions
- **dos.js** - No changes (already exports all needed functions)

## Testing

A test file was created to verify API functionality:
- **test-dos-api.html** - Demonstrates direct API calls (not committed due to .gitignore)

Existing test still works:
- **test-dos-simple.html** - Original DOS API test

## Migration for Existing Code

If you had scripts that expected command-line style DOS commands, you need to update them:

### Old Style (No longer works)
```javascript
// This was typed at the prompt and parsed
save myfile.js
load myfile.js
```

### New Style (Current)
```javascript
// Call functions directly
save("myfile.js", content);
var content = load("myfile.js");
```

## Benefits

1. **Simpler code** - No command parsing logic
2. **More flexible** - Can use DOS functions in any JavaScript context
3. **Consistent API** - Direct function calls match JavaScript conventions
4. **Better error handling** - Functions return values instead of printing errors

## See Also

- **dos.js** - Source code for DOS API functions
- **DOS_API.md** - API documentation (may need updating)
- **test-dos-simple.html** - Working examples of API usage

---

**Date:** February 17, 2026  
**PR:** Remove DOS command parsing from qandy2.htm
