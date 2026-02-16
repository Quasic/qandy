// QANDY DOS-STYLE TEXT EDITOR
// A retro text editor inspired by MS-DOS EDIT
// Saves files to localStorage

// Editor state
var editorState = {
  lines: [""],
  cursorLine: 0,
  cursorCol: 0,
  filename: "untitled.js",
  modified: false,
  mode: "edit", // "edit", "menu", "dialog"
  menuIndex: 0, // 0=File, 1=Edit, 2=Run
  menuOpen: false,
  menuItemIndex: 0,
  viewOffsetLine: 0,
  maxLines: 20, // Maximum visible lines in editor
  maxCols: 29, // Maximum visible columns
  message: "",
  dialogType: "", // "save", "open", "new"
  dialogInput: ""
};

// Menu structure
var menus = [
  {
    title: "File",
    items: [
      { label: "New", action: menuNew },
      { label: "Open", action: menuOpen },
      { label: "Save", action: menuSave },
      { label: "List Files", action: menuList },
      { label: "Exit", action: menuExit }
    ]
  },
  {
    title: "Edit",
    items: [
      { label: "Delete Line", action: deleteLine },
      { label: "Clear All", action: clearAll }
    ]
  },
  {
    title: "Run",
    items: [
      { label: "Execute", action: runCode }
    ]
  }
];

// Initialize editor
function initEditor(filename) {
  if (filename) {
    editorState.filename = filename;
    loadFile(filename);
  }
  editorState.mode = "edit";
  editorState.modified = false;
  renderEditor();
}

// Load file from localStorage
function loadFile(filename) {
  var content = localStorage.getItem("qandy_file_" + filename);
  if (content !== null) {
    editorState.lines = content.split("\n");
    if (editorState.lines.length === 0) {
      editorState.lines = [""];
    }
    editorState.cursorLine = 0;
    editorState.cursorCol = 0;
    editorState.viewOffsetLine = 0;
    editorState.modified = false;
    editorState.message = "Loaded: " + filename;
  } else {
    editorState.message = "File not found: " + filename;
  }
}

// Save file to localStorage
function saveFile(filename) {
  var content = editorState.lines.join("\n");
  localStorage.setItem("qandy_file_" + filename, content);
  editorState.filename = filename;
  editorState.modified = false;
  editorState.message = "Saved: " + filename;
}

// List all files in localStorage
function listFiles() {
  var files = [];
  for (var i = 0; i < localStorage.length; i++) {
    var key = localStorage.key(i);
    if (key.startsWith("qandy_file_")) {
      files.push(key.substring(11)); // Remove "qandy_file_" prefix
    }
  }
  return files;
}

// Render the editor screen
function renderEditor() {
  cls();
  
  // Render menu bar
  renderMenuBar();
  
  // Render editor area or dialog
  if (editorState.mode === "dialog") {
    renderDialog();
  } else {
    renderEditArea();
  }
  
  // Render status bar
  renderStatusBar();
}

// Render menu bar at top
function renderMenuBar() {
  print("\x1b[44;37m"); // Blue background, white text
  var menuBar = "";
  for (var i = 0; i < menus.length; i++) {
    if (editorState.menuOpen && editorState.menuIndex === i) {
      menuBar += "\x1b[47;30m " + menus[i].title + " \x1b[44;37m "; // Highlight selected
    } else {
      menuBar += " " + menus[i].title + "  ";
    }
  }
  // Pad to full width
  while (menuBar.length < editorState.maxCols + 20) {
    menuBar += " ";
  }
  print(menuBar.substring(0, editorState.maxCols) + "\x1b[0m\n");
  
  // If menu is open, render dropdown
  if (editorState.menuOpen) {
    renderMenuDropdown();
  }
}

// Render menu dropdown
function renderMenuDropdown() {
  var menu = menus[editorState.menuIndex];
  var maxWidth = 0;
  for (var i = 0; i < menu.items.length; i++) {
    if (menu.items[i].label.length > maxWidth) {
      maxWidth = menu.items[i].label.length;
    }
  }
  maxWidth += 4; // Padding
  
  for (var i = 0; i < menu.items.length; i++) {
    var item = menu.items[i].label;
    var pad = maxWidth - item.length;
    if (i === editorState.menuItemIndex) {
      print("\x1b[47;30m " + item);
      for (var j = 0; j < pad - 1; j++) print(" ");
      print("\x1b[0m\n");
    } else {
      print("\x1b[40;37m " + item);
      for (var j = 0; j < pad - 1; j++) print(" ");
      print("\x1b[0m\n");
    }
  }
  print("\n");
}

// Render edit area
function renderEditArea() {
  // Calculate visible line range
  var startLine = editorState.viewOffsetLine;
  var endLine = Math.min(startLine + editorState.maxLines, editorState.lines.length);
  
  // Render lines
  for (var i = startLine; i < endLine; i++) {
    var line = editorState.lines[i];
    var displayLine = line.substring(0, editorState.maxCols);
    
    // Show cursor on current line
    if (i === editorState.cursorLine && editorState.mode === "edit") {
      var before = displayLine.substring(0, editorState.cursorCol);
      var at = displayLine[editorState.cursorCol] || " ";
      var after = displayLine.substring(editorState.cursorCol + 1);
      print(before + "\x1b[7m" + at + "\x1b[0m" + after + "\n");
    } else {
      print(displayLine + "\n");
    }
  }
  
  // Fill remaining lines
  for (var i = endLine - startLine; i < editorState.maxLines; i++) {
    print("~\n");
  }
}

// Render dialog box
function renderDialog() {
  var dialogLines = 5;
  // Center some blank lines
  for (var i = 0; i < (editorState.maxLines - dialogLines) / 2; i++) {
    print("\n");
  }
  
  print("\x1b[47;30m"); // White background, black text
  print("════════════════════════════\n");
  if (editorState.dialogType === "save") {
    print(" Save File As:             \n");
  } else if (editorState.dialogType === "open") {
    print(" Open File:                \n");
  } else if (editorState.dialogType === "new") {
    print(" New File:                 \n");
  }
  print(" " + editorState.dialogInput + "_");
  // Pad line
  for (var i = editorState.dialogInput.length; i < 27; i++) {
    print(" ");
  }
  print("\n");
  print("════════════════════════════\n");
  print(" [Enter] OK  [Esc] Cancel   \x1b[0m\n");
  
  // Fill remaining lines
  for (var i = 0; i < editorState.maxLines - dialogLines - (editorState.maxLines - dialogLines) / 2; i++) {
    print("\n");
  }
}

// Message timer management
var messageTimer = null;

// Render status bar at bottom
function renderStatusBar() {
  print("\x1b[47;30m"); // White background, black text
  var status = " " + editorState.filename;
  if (editorState.modified) status += "*";
  status += " | Ln:" + (editorState.cursorLine + 1) + " Col:" + (editorState.cursorCol + 1);
  
  if (editorState.message) {
    status += " | " + editorState.message;
  }
  
  // Pad to full width
  while (status.length < editorState.maxCols) {
    status += " ";
  }
  print(status.substring(0, editorState.maxCols) + "\x1b[0m\n");
  
  // Clear message after display with single timer
  if (editorState.message) {
    if (messageTimer) {
      clearTimeout(messageTimer);
    }
    messageTimer = setTimeout(function() {
      editorState.message = "";
      messageTimer = null;
    }, 3000);
  }
}

// Menu actions
function menuNew() {
  editorState.mode = "dialog";
  editorState.dialogType = "new";
  editorState.dialogInput = "untitled.js";
  renderEditor();
}

function menuOpen() {
  editorState.mode = "dialog";
  editorState.dialogType = "open";
  editorState.dialogInput = "";
  renderEditor();
}

function menuSave() {
  editorState.mode = "dialog";
  editorState.dialogType = "save";
  editorState.dialogInput = editorState.filename;
  renderEditor();
}

function menuList() {
  cls();
  print("\x1b[1;36m");
  print("═══════════════════════════════\n");
  print("  FILES IN STORAGE\n");
  print("═══════════════════════════════\x1b[0m\n\n");
  
  var files = listFiles();
  if (files.length === 0) {
    print("\x1b[33mNo files found in storage.\x1b[0m\n\n");
  } else {
    for (var i = 0; i < files.length; i++) {
      print("\x1b[32m" + files[i] + "\x1b[0m\n");
    }
    print("\n");
  }
  
  // Also show built-in files
  print("\x1b[1;36m");
  print("═══════════════════════════════\n");
  print("  BUILT-IN PROGRAMS\n");
  print("═══════════════════════════════\x1b[0m\n\n");
  print("ansi-demo.js\n");
  print("ansi-edit.js\n");
  print("ascii.js\n");
  print("demo.js\n");
  print("q.js\n");
  print("world.js\n");
  print("\n");
  print("\x1b[33mPress any key to return...\x1b[0m\n");
  keyon = 1;
}

function menuExit() {
  cls();
  print("\x1b[32mEditor closed.\x1b[0m\n");
  print("\nType a .js filename to run a program\n");
  run = "";  // Clear run variable to return to OS mode
  keyon = 1; // Re-enable keyboard input
}

function deleteLine() {
  if (editorState.lines.length > 1) {
    editorState.lines.splice(editorState.cursorLine, 1);
    if (editorState.cursorLine >= editorState.lines.length) {
      editorState.cursorLine = editorState.lines.length - 1;
    }
    editorState.modified = true;
    editorState.message = "Line deleted";
  }
  closeMenu();
  renderEditor();
}

function clearAll() {
  editorState.lines = [""];
  editorState.cursorLine = 0;
  editorState.cursorCol = 0;
  editorState.viewOffsetLine = 0;
  editorState.modified = true;
  editorState.message = "All cleared";
  closeMenu();
  renderEditor();
}

function runCode() {
  closeMenu();
  
  // Helper function to wait for keypress and return to editor
  var waitForKeyAndReturnToEditor = function() {
    keyon = 1;
    var originalInput = input;
    input = function() {
      input = originalInput;
      keyon = 0;
      renderEditor();
    };
  };
  
  try {
    var code = editorState.lines.join("\n");
    cls();
    print("\x1b[1;32mExecuting code...\x1b[0m\n\n");
    // Note: eval() is used here for the development environment
    // This allows dynamic code execution in the emulator context
    eval(code);
    print("\n\n\x1b[33mPress any key to return to editor...\x1b[0m\n");
    waitForKeyAndReturnToEditor();
  } catch (err) {
    print("\x1b[1;31mError: " + err.message + "\x1b[0m\n");
    print("\n\x1b[33mPress any key to return to editor...\x1b[0m\n");
    waitForKeyAndReturnToEditor();
  }
}

function closeMenu() {
  editorState.menuOpen = false;
  editorState.mode = "edit";
}

// Handle keyboard input
function keydown(k) {
  // Handle dialog mode
  if (editorState.mode === "dialog") {
    handleDialogKey(k);
    return;
  }
  
  // Handle menu mode
  if (editorState.menuOpen) {
    handleMenuKey(k);
    return;
  }
  
  // Handle edit mode
  handleEditKey(k);
}

// Handle dialog keyboard input
function handleDialogKey(k) {
  if (k === "\x1b" || k === "esc") { // Escape
    editorState.mode = "edit";
    editorState.dialogInput = "";
    renderEditor();
  } else if (k === "\r" || k === "\n" || k === "enter") { // Enter
    // Process dialog action
    if (editorState.dialogType === "save") {
      if (editorState.dialogInput) {
        saveFile(editorState.dialogInput);
      }
    } else if (editorState.dialogType === "open") {
      if (editorState.dialogInput) {
        loadFile(editorState.dialogInput);
      }
    } else if (editorState.dialogType === "new") {
      editorState.filename = editorState.dialogInput || "untitled.js";
      editorState.lines = [""];
      editorState.cursorLine = 0;
      editorState.cursorCol = 0;
      editorState.modified = false;
    }
    editorState.mode = "edit";
    editorState.dialogInput = "";
    renderEditor();
  } else if (k === "\x7F" || k === "\b") { // Backspace
    if (editorState.dialogInput.length > 0) {
      editorState.dialogInput = editorState.dialogInput.slice(0, -1);
      renderEditor();
    }
  } else if (k.length === 1 && k >= " ") {
    editorState.dialogInput += k;
    renderEditor();
  }
}

// Handle menu keyboard input
function handleMenuKey(k) {
  // Check for special keys first (don't uppercase these)
  if (k === "\x1b" || k === "esc") { // Escape
    closeMenu();
    renderEditor();
  } else if (k === "\r" || k === "\n" || k === "enter") { // Enter
    var menu = menus[editorState.menuIndex];
    var action = menu.items[editorState.menuItemIndex].action;
    action();
  } else if (k === "←" || k === "\x08" || k === "left") { // Left arrow or backspace
    editorState.menuIndex = (editorState.menuIndex - 1 + menus.length) % menus.length;
    editorState.menuItemIndex = 0;
    renderEditor();
  } else if (k === "→" || k === " " || k === "right") { // Right arrow or space
    editorState.menuIndex = (editorState.menuIndex + 1) % menus.length;
    editorState.menuItemIndex = 0;
    renderEditor();
  } else if (k === "↑" || k === "up") { // Up arrow
    var menu = menus[editorState.menuIndex];
    editorState.menuItemIndex = (editorState.menuItemIndex - 1 + menu.items.length) % menu.items.length;
    renderEditor();
  } else if (k === "↓" || k === "down") { // Down arrow
    var menu = menus[editorState.menuIndex];
    editorState.menuItemIndex = (editorState.menuItemIndex + 1) % menu.items.length;
    renderEditor();
  }
}

// Handle edit mode keyboard input
function handleEditKey(k) {
  // Check for menu key (ALT+M only, not just M)
  // When ALT is pressed with M, k will be "alt m" or "alt M"
  if (k === "alt m" || k === "alt M") {
    editorState.menuOpen = true;
    editorState.menuIndex = 0;
    editorState.menuItemIndex = 0;
    renderEditor();
    return;
  }
  
  // Arrow keys - check before converting to uppercase
  if (k === "↑" || k === "up") {
    if (editorState.cursorLine > 0) {
      editorState.cursorLine--;
      editorState.cursorCol = Math.min(editorState.cursorCol, editorState.lines[editorState.cursorLine].length);
      adjustViewOffset();
      renderEditor();
    }
    return;
  } else if (k === "↓" || k === "down") {
    if (editorState.cursorLine < editorState.lines.length - 1) {
      editorState.cursorLine++;
      editorState.cursorCol = Math.min(editorState.cursorCol, editorState.lines[editorState.cursorLine].length);
      adjustViewOffset();
      renderEditor();
    }
    return;
  } else if (k === "←" || k === "\x08" || k === "left") {
    if (editorState.cursorCol > 0) {
      editorState.cursorCol--;
      renderEditor();
    } else if (editorState.cursorLine > 0) {
      // Move to end of previous line
      editorState.cursorLine--;
      editorState.cursorCol = editorState.lines[editorState.cursorLine].length;
      adjustViewOffset();
      renderEditor();
    }
    return;
  } else if (k === "→" || k === "right") {
    if (editorState.cursorCol < editorState.lines[editorState.cursorLine].length) {
      editorState.cursorCol++;
      renderEditor();
    } else if (editorState.cursorLine < editorState.lines.length - 1) {
      // Move to start of next line
      editorState.cursorLine++;
      editorState.cursorCol = 0;
      adjustViewOffset();
      renderEditor();
    }
    return;
  }
  
  // Backspace
  if (k === "\x7F" || k === "\b" || k === "back") {
    if (editorState.cursorCol > 0) {
      var line = editorState.lines[editorState.cursorLine];
      editorState.lines[editorState.cursorLine] = 
        line.substring(0, editorState.cursorCol - 1) + 
        line.substring(editorState.cursorCol);
      editorState.cursorCol--;
      editorState.modified = true;
      renderEditor();
    } else if (editorState.cursorLine > 0) {
      // Join with previous line
      var prevLine = editorState.lines[editorState.cursorLine - 1];
      var currLine = editorState.lines[editorState.cursorLine];
      editorState.lines[editorState.cursorLine - 1] = prevLine + currLine;
      editorState.lines.splice(editorState.cursorLine, 1);
      editorState.cursorLine--;
      editorState.cursorCol = prevLine.length;
      editorState.modified = true;
      adjustViewOffset();
      renderEditor();
    }
    return;
  }
  
  // Enter - new line
  if (k === "\r" || k === "\n" || k === "enter") {
    var line = editorState.lines[editorState.cursorLine];
    var before = line.substring(0, editorState.cursorCol);
    var after = line.substring(editorState.cursorCol);
    editorState.lines[editorState.cursorLine] = before;
    editorState.lines.splice(editorState.cursorLine + 1, 0, after);
    editorState.cursorLine++;
    editorState.cursorCol = 0;
    editorState.modified = true;
    adjustViewOffset();
    renderEditor();
    return;
  }
  
  // Regular character input
  if (k.length === 1 && k >= " ") {
    var line = editorState.lines[editorState.cursorLine];
    editorState.lines[editorState.cursorLine] = 
      line.substring(0, editorState.cursorCol) + 
      k + 
      line.substring(editorState.cursorCol);
    editorState.cursorCol++;
    editorState.modified = true;
    renderEditor();
  }
}

// Adjust view offset for scrolling
function adjustViewOffset() {
  if (editorState.cursorLine < editorState.viewOffsetLine) {
    editorState.viewOffsetLine = editorState.cursorLine;
  } else if (editorState.cursorLine >= editorState.viewOffsetLine + editorState.maxLines) {
    editorState.viewOffsetLine = editorState.cursorLine - editorState.maxLines + 1;
  }
}

// Start the editor
cls();
print("\x1b[1;36m╔═══════════════════════════════╗\n");
print("║   QANDY DOS-STYLE EDITOR      ║\n");
print("╚═══════════════════════════════╝\x1b[0m\n\n");
print("Press \x1b[1;33mALT+M\x1b[0m to open menu\n");
print("Use \x1b[1;33mArrow Keys\x1b[0m to navigate\n");
print("Press \x1b[1;33mEnter\x1b[0m for new line\n");
print("Press \x1b[1;33mBackspace\x1b[0m to delete\n\n");
print("Starting editor...\n");

// Set run variable to indicate this program is running
run = "edit.js";

// Disable default keyboard handling
keyon = 0;

// Initialize and start
setTimeout(function() {
  initEditor();
}, 1000);
