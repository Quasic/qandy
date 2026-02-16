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
 * - Simple error handling: Check if result.substring(0,5) === "ERROR"
 * 
 * USAGE:
 *   <script src="dos.js"></script>
 *   
 *   // Save a file - returns "OK" or "ERROR: message"
 *   var result = save("myfile.txt", "Hello, World!");
 *   if (result.substring(0, 5) === "ERROR") {
 *     print(result + "\n");
 *   }
 *   
 *   // Load a file - returns content or "ERROR: message"
 *   var content = load("myfile.txt");
 *   if (content.substring(0, 5) === "ERROR") {
 *     print(content + "\n");
 *   } else {
 *     print(content);
 *   }
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
 * @returns {string} - "OK" if successful, "ERROR: [message]" if failed
 * 
 * @example
 *   var result = save("myfile.txt", "Hello, World!");
 *   if (result.substring(0, 5) === "ERROR") {
 *     print(result + "\n");
 *   }
 */
function save(filename, data) {
  if (!filename || typeof filename !== 'string') {
    var errorMsg = "ERROR: Filename must be a non-empty string";
    console.error("DOS.save(): " + errorMsg);
    return errorMsg;
  }
  
  if (typeof data !== 'string') {
    var errorMsg = "ERROR: Data must be a string";
    console.error("DOS.save(): " + errorMsg);
    return errorMsg;
  }
  
  try {
    var key = _filenameToKey(filename);
    
    if (device === "local") {
      localStorage.setItem(key, data);
      return "OK";
    } else {
      return "ERROR: Device '" + device + "' not implemented yet";
    }
  } catch (e) {
    console.error("DOS.save() error:", e.message);
    if (e.name === 'QuotaExceededError') {
      console.error("Storage quota exceeded!");
      return "ERROR: Storage quota exceeded - disk full";
    } else {
      return "ERROR: Save failed: " + e.message;
    }
  }
}

/**
 * Load data from a file on the current device
 * 
 * @param {string} filename - Name of file to load
 * @returns {string} - File content as string, or "ERROR: [message]" if failed
 * 
 * @example
 *   var content = load("myfile.txt");
 *   if (content.substring(0, 5) === "ERROR") {
 *     print(content + "\n");
 *   } else {
 *     print(content);
 *   }
 */
function load(filename) {
  if (!filename || typeof filename !== 'string') {
    var errorMsg = "ERROR: Filename must be a non-empty string";
    console.error("DOS.load(): " + errorMsg);
    return errorMsg;
  }
  
  try {
    var key = _filenameToKey(filename);
    
    if (device === "local") {
      var data = localStorage.getItem(key);
      if (data === null) {
        return "ERROR: File not found: " + filename;
      }
      return data;
    } else {
      return "ERROR: Device '" + device + "' not implemented yet";
    }
  } catch (e) {
    console.error("DOS.load() error:", e.message);
    return "ERROR: Load failed: " + e.message;
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
 * @returns {string} - "OK" if successful, "ERROR: [message]" if failed
 * 
 * @example
 *   var result = del("oldfile.txt");
 *   if (result.substring(0, 5) === "ERROR") {
 *     print(result + "\n");
 *   } else {
 *     print("File deleted\n");
 *   }
 */
function del(filename) {
  if (!filename || typeof filename !== 'string') {
    var errorMsg = "ERROR: Filename must be a non-empty string";
    console.error("DOS.del(): " + errorMsg);
    return errorMsg;
  }
  
  try {
    var key = _filenameToKey(filename);
    
    if (device === "local") {
      if (localStorage.getItem(key) !== null) {
        localStorage.removeItem(key);
        return "OK";
      }
      return "ERROR: File not found: " + filename;
    } else {
      return "ERROR: Device '" + device + "' not implemented yet";
    }
  } catch (e) {
    console.error("DOS.del() error:", e.message);
    return "ERROR: Delete failed: " + e.message;
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
}

// Console notification
if (typeof console !== 'undefined') {
  console.log("DOS API loaded - device: " + device);
  console.log("Functions: save(), load(), dir(), ls(), loadDir(), del(), exists()");
  console.log("Error handling: Check if result.substring(0,5) === 'ERROR'");
}
