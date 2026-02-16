/**
 * DOS (Disk Operating System) API for Qandy
 * 
 * A simple file system API that abstracts storage devices.
 * Developers include this script to get DOS access in their programs.
 * 
 * DESIGN PHILOSOPHY:
 * - Text-only storage (all files saved as strings)
 * - Device abstraction (local, cookie, disk in future)
 * - Simple API: save(), load(), dir(), ls(), loadDir()
 * - Developer responsibility for data format (arrays, JSON, etc.)
 * 
 * USAGE:
 *   <script src="dos.js"></script>
 *   
 *   // Save a file
 *   save("myfile.txt", "Hello, World!");
 *   
 *   // Load a file (returns data as string)
 *   var content = load("myfile.txt");
 *   
 *   // Display directory
 *   dir();    // or ls();
 *   
 *   // Get directory list programmatically
 *   var fileList = loadDir();
 *   var files = fileList.split("\n");
 */

// ==================================================================
// GLOBAL CONFIGURATION
// ==================================================================

/**
 * Current storage device
 * Options: "local" (localStorage), "cookie" (future), "disk" (future)
 * 
 * Changing this is like changing drives in DOS (A:, B:, C:)
 * or changing directories in Linux
 */
var device = "local";

/**
 * Last error message (like errno in C or $? in shell)
 * Check this after operations that return null or false
 * 
 * @example
 *   var data = load("missing.txt");
 *   if (data === null) {
 *     print("Error: " + lastError + "\n");
 *   }
 */
var lastError = "";

// ==================================================================
// PRIVATE HELPERS
// ==================================================================

/**
 * Get storage prefix for current device
 */
function _getPrefix() {
  switch(device) {
    case "local":
      return "qandy_";
    case "cookie":
      return "qandy_cookie_";
    case "disk":
      return "qandy_disk_";
    default:
      return "qandy_";
  }
}

/**
 * Get all file keys from current device
 */
function _getFileKeys() {
  var prefix = _getPrefix();
  var keys = [];
  
  if (device === "local") {
    for (var i = 0; i < localStorage.length; i++) {
      var key = localStorage.key(i);
      if (key && key.startsWith(prefix) && !key.endsWith("_index")) {
        keys.push(key);
      }
    }
  }
  // Future: Add cookie, disk implementations here
  
  return keys;
}

/**
 * Get filename from storage key
 */
function _keyToFilename(key) {
  var prefix = _getPrefix();
  return key.substring(prefix.length);
}

/**
 * Get storage key from filename
 */
function _filenameToKey(filename) {
  return _getPrefix() + filename;
}

// ==================================================================
// PUBLIC API - Core Functions
// ==================================================================

/**
 * Save data to a file on the current device
 * 
 * @param {string} filename - Name of file (any extension: .txt, .js, .b64, .me, etc.)
 * @param {string} data - Text data to save (must be string)
 * @returns {boolean} - true if successful, false otherwise
 * 
 * @example
 *   save("myfile.txt", "Hello, World!");
 *   save("program.js", "print('Hello!\\n');");
 *   save("data.b64", btoa("binary data"));
 *   save("readme.me", "This is a readme file");
 */
function save(filename, data) {
  lastError = "";  // Clear previous error
  
  if (!filename || typeof filename !== 'string') {
    lastError = "Filename must be a non-empty string";
    console.error("DOS.save(): " + lastError);
    return false;
  }
  
  if (typeof data !== 'string') {
    lastError = "Data must be a string";
    console.error("DOS.save(): " + lastError);
    return false;
  }
  
  try {
    var key = _filenameToKey(filename);
    
    if (device === "local") {
      localStorage.setItem(key, data);
      return true;
    } else {
      lastError = "Device '" + device + "' not implemented yet";
      return false;
    }
  } catch (e) {
    console.error("DOS.save() error:", e.message);
    if (e.name === 'QuotaExceededError') {
      lastError = "Storage quota exceeded - disk full";
      console.error("Storage quota exceeded!");
    } else {
      lastError = "Save failed: " + e.message;
    }
    return false;
  }
}

/**
 * Load data from a file on the current device
 * 
 * @param {string} filename - Name of file to load
 * @returns {string|null} - File content as string, or null if not found
 * 
 * @example
 *   var content = load("myfile.txt");
 *   if (content !== null) {
 *     print(content);
 *   }
 */
function load(filename) {
  lastError = "";  // Clear previous error
  
  if (!filename || typeof filename !== 'string') {
    lastError = "Filename must be a non-empty string";
    console.error("DOS.load(): " + lastError);
    return null;
  }
  
  try {
    var key = _filenameToKey(filename);
    
    if (device === "local") {
      var data = localStorage.getItem(key);
      if (data === null) {
        lastError = "File not found: " + filename;
      }
      return data;  // Returns null if not found
    } else {
      lastError = "Device '" + device + "' not implemented yet";
      return null;
    }
  } catch (e) {
    lastError = "Load failed: " + e.message;
    console.error("DOS.load() error:", e.message);
    return null;
  }
}

/**
 * Get directory listing as formatted string (for programmatic use)
 * 
 * Returns a string with one filename per line.
 * Easy to split into array: var files = loadDir().split("\n");
 * 
 * @returns {string} - Newline-separated list of filenames
 * 
 * @example
 *   var dirList = loadDir();
 *   var files = dirList.split("\n").filter(f => f.length > 0);
 *   files.forEach(function(filename) {
 *     print(filename + "\n");
 *   });
 */
function loadDir() {
  try {
    var keys = _getFileKeys();
    var filenames = keys.map(_keyToFilename).sort();
    return filenames.join("\n");
  } catch (e) {
    console.error("DOS.loadDir() error:", e.message);
    return "";
  }
}

/**
 * Display directory listing using print() function
 * Works like DOS "dir" command
 * 
 * @example
 *   dir();
 */
function dir() {
  if (typeof print !== 'function') {
    console.log("DOS.dir(): print() function not available");
    console.log("Directory listing:");
    var listing = loadDir();
    console.log(listing || "(empty)");
    return;
  }
  
  var files = loadDir().split("\n").filter(function(f) { return f.length > 0; });
  
  print("\n");
  print("Directory of " + device + ":\n");
  print("─────────────────────────────────\n");
  
  if (files.length === 0) {
    print("(no files)\n");
  } else {
    for (var i = 0; i < files.length; i++) {
      // Get file size
      var content = load(files[i]);
      var size = content ? content.length : 0;
      var sizeStr = size.toString().padStart(8, ' ') + " bytes";
      
      print("  " + files[i].padEnd(30, ' ') + sizeStr + "\n");
    }
    print("\n");
    print("Total: " + files.length + " file(s)\n");
  }
  print("\n");
}

/**
 * Display directory listing using print() function
 * Works like Linux "ls" command (alias for dir)
 * 
 * @example
 *   ls();
 */
function ls() {
  dir();
}

/**
 * Delete a file from the current device
 * 
 * @param {string} filename - Name of file to delete
 * @returns {boolean} - true if successful, false otherwise
 * 
 * @example
 *   if (del("oldfile.txt")) {
 *     print("File deleted\n");
 *   }
 */
function del(filename) {
  lastError = "";  // Clear previous error
  
  if (!filename || typeof filename !== 'string') {
    lastError = "Filename must be a non-empty string";
    console.error("DOS.del(): " + lastError);
    return false;
  }
  
  try {
    var key = _filenameToKey(filename);
    
    if (device === "local") {
      if (localStorage.getItem(key) !== null) {
        localStorage.removeItem(key);
        return true;
      }
      lastError = "File not found: " + filename;
      return false;
    } else {
      lastError = "Device '" + device + "' not implemented yet";
      return false;
    }
  } catch (e) {
    lastError = "Delete failed: " + e.message;
    console.error("DOS.del() error:", e.message);
    return false;
  }
}

/**
 * Check if a file exists on the current device
 * 
 * @param {string} filename - Name of file to check
 * @returns {boolean} - true if file exists, false otherwise
 * 
 * @example
 *   if (exists("config.txt")) {
 *     var config = load("config.txt");
 *   }
 */
function exists(filename) {
  if (!filename || typeof filename !== 'string') {
    return false;
  }
  
  try {
    var key = _filenameToKey(filename);
    
    if (device === "local") {
      return localStorage.getItem(key) !== null;
    }
    // Future: Add cookie, disk implementations
    
    return false;
  } catch (e) {
    return false;
  }
}

// ==================================================================
// EXPORT FOR GLOBAL ACCESS
// ==================================================================

// Functions are already global due to function declarations
// Device variable is already global

// For compatibility with module systems (if needed in future)
if (typeof window !== 'undefined') {
  window.save = save;
  window.load = load;
  window.dir = dir;
  window.ls = ls;
  window.loadDir = loadDir;
  window.del = del;
  window.exists = exists;
  window.device = device;
  window.lastError = lastError;
}

// Console notification
if (typeof console !== 'undefined') {
  console.log("DOS API loaded - device: " + device);
  console.log("Functions: save(), load(), dir(), ls(), loadDir(), del(), exists()");
  console.log("Global variables: device (current: '" + device + "'), lastError");
}
