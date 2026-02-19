# Qandy Dropdown Menu System API

The `menus.js` library provides a reusable dropdown menu system for Qandy programs, inspired by classic DOS and GUI menu systems.

## Features

- ✅ Professional dropdown menus
- ✅ Keyboard navigation (arrows, Enter, Escape)
- ✅ Customizable activation key (default: ALT+M)
- ✅ Action callback system
- ✅ Blue menu bar with white text (customizable)
- ✅ Easy integration into any Qandy program

## Quick Start

### 1. Include the Library

Add to your HTML file:
```html
<script src="menus.js"></script>
```

### 2. Define Your Menu Structure

```javascript
var myMenus = [
  {
    title: "File",
    items: [
      { label: "New", action: "new" },
      { label: "Open", action: "open" },
      { label: "Save", action: "save" },
      { label: "Exit", action: "exit" }
    ]
  },
  {
    title: "Edit",
    items: [
      { label: "Cut", action: "cut" },
      { label: "Copy", action: "copy" },
      { label: "Paste", action: "paste" }
    ]
  },
  {
    title: "Help",
    items: [
      { label: "About", action: "about" },
      { label: "Manual", action: "manual" }
    ]
  }
];
```

### 3. Initialize the Menu System

```javascript
function handleMenuAction(action, item) {
  if (action === "new") {
    // Handle new file
    createNewFile();
  } else if (action === "open") {
    // Handle open file
    openFileDialog();
  } else if (action === "save") {
    // Handle save
    saveCurrentFile();
  }
  // ... handle other actions
  
  // Re-render your screen after action
  renderMyProgram();
}

// Initialize with menu structure, activation key, and callback
initMenus(myMenus, "alt m", handleMenuAction);
```

### 4. Integrate with Keyboard Handler

```javascript
function keydown(k) {
  // Let menu system handle its keys first
  if (isMenuKey(k)) {
    processMenuKey(k);
    renderMyProgram();
    return;
  }
  
  // Handle your program's keys
  if (k === "a") {
    // Do something
  }
  // ... etc
}
```

### 5. Render the Menu Bar

```javascript
function renderMyProgram() {
  cls();
  
  // Render menu bar at top (pass max columns)
  renderMenuBar(30);
  
  // Render rest of your program UI
  print("Welcome to my program!\n");
  // ... your rendering code
}
```

## API Reference

### Initialization

#### `initMenus(menuStructure, activationKey, onAction)`

Initialize the menu system with your menu structure.

**Parameters:**
- `menuStructure` (Array) - Array of menu objects
- `activationKey` (String) - Key combination to activate menu (default: "alt m")
- `onAction` (Function) - Callback function when menu item is selected

**Menu Structure Format:**
```javascript
[
  {
    title: "MenuName",      // Menu title displayed in menu bar
    items: [
      {
        label: "ItemName",  // Menu item label
        action: "actionId"  // Action identifier (passed to callback)
      },
      // ... more items
    ]
  },
  // ... more menus
]
```

**Example:**
```javascript
initMenus(
  [{ title: "File", items: [{ label: "Save", action: "save" }] }],
  "alt f",
  function(action, item) {
    if (action === "save") {
      // Handle save
    }
  }
);
```

### Key Handling

#### `isMenuKey(k)`

Check if the given key should be handled by the menu system.

**Parameters:**
- `k` (String) - The key pressed

**Returns:**
- `Boolean` - True if this key belongs to menu system

**Example:**
```javascript
if (isMenuKey(k)) {
  // This key is for the menu
  processMenuKey(k);
} else {
  // This key is for your program
  handleMyKey(k);
}
```

#### `processMenuKey(k)`

Process a key press for the menu system.

**Parameters:**
- `k` (String) - The key pressed

**Returns:**
- `Boolean` - True if key was handled

**Handles:**
- Activation key (e.g., "alt m") - Opens menu
- ESC - Closes menu
- ENTER - Selects current item
- Arrow keys - Navigate menu
  - LEFT/RIGHT - Switch between menus
  - UP/DOWN - Navigate items in dropdown

**Example:**
```javascript
function keydown(k) {
  if (isMenuKey(k)) {
    processMenuKey(k);
    renderScreen();
  }
}
```

### Rendering

#### `renderMenuBar(maxCols)`

Render the menu bar with optional dropdown.

**Parameters:**
- `maxCols` (Number) - Maximum columns for menu bar width (default: 30)

**Notes:**
- Call this from your main rendering function
- Automatically renders dropdown if menu is open
- Uses ANSI color codes (blue background, white text)

**Example:**
```javascript
function renderScreen() {
  cls();
  renderMenuBar(40);  // Menu bar with 40 column width
  // ... render rest of screen
}
```

#### `renderMenuDropdown()`

Render the dropdown menu.

**Notes:**
- Automatically called by `renderMenuBar()` when menu is open
- Rarely needs to be called directly
- Renders below the currently selected menu

### State Management

#### `isMenuOpen()`

Check if menu is currently open.

**Returns:**
- `Boolean` - True if menu is open

**Example:**
```javascript
if (isMenuOpen()) {
  // Menu is open, maybe disable other input
}
```

#### `closeMenu()`

Programmatically close the menu.

**Example:**
```javascript
// Close menu after some action
closeMenu();
renderScreen();
```

#### `getMenuState()`

Get current menu state (useful for debugging).

**Returns:**
- `Object` - Menu state object with:
  - `menuOpen` - Boolean indicating if menu is open
  - `menuIndex` - Current menu index (0-based)
  - `menuItemIndex` - Current item index (0-based)
  - `menuCount` - Total number of menus

**Example:**
```javascript
var state = getMenuState();
print("Menu open: " + state.menuOpen + "\n");
print("Current menu: " + state.menuIndex + "\n");
```

## Complete Example

Here's a complete example program using the menu system:

```javascript
// Define menu structure
var programMenus = [
  {
    title: "File",
    items: [
      { label: "New", action: "new" },
      { label: "Open", action: "open" },
      { label: "Save", action: "save" },
      { label: "Exit", action: "exit" }
    ]
  },
  {
    title: "Help",
    items: [
      { label: "About", action: "about" }
    ]
  }
];

// Program state
var programData = {
  content: "",
  filename: "untitled.txt"
};

// Menu action handler
function handleMenuAction(action, item) {
  if (action === "new") {
    programData.content = "";
    programData.filename = "untitled.txt";
  } else if (action === "open") {
    // Show open dialog
    var filename = prompt("Enter filename:");
    if (filename) {
      programData.content = load(filename);
      programData.filename = filename;
    }
  } else if (action === "save") {
    save(programData.filename, programData.content);
  } else if (action === "exit") {
    run = "";
    keyon = 1;
    return;
  } else if (action === "about") {
    alert("My Program v1.0");
  }
  
  renderProgram();
}

// Initialize
function initProgram() {
  initMenus(programMenus, "alt m", handleMenuAction);
  keyon = 0;  // We handle our own input
  renderProgram();
}

// Keyboard handler
function keydown(k) {
  // Menu keys
  if (isMenuKey(k)) {
    processMenuKey(k);
    renderProgram();
    return;
  }
  
  // Program keys
  if (k.length === 1 && k >= " ") {
    programData.content += k;
    renderProgram();
  }
}

// Render
function renderProgram() {
  cls();
  keyon = 0;
  
  // Render menu bar
  renderMenuBar(30);
  
  // Render content
  print("\n" + programData.content + "\n");
  print("\n" + programData.filename + "\n");
}

// Start
initProgram();
```

## Keyboard Navigation

When menu is open:
- **ESC** - Close menu
- **ENTER** - Select current item
- **LEFT ARROW** - Previous menu
- **RIGHT ARROW** - Next menu
- **UP ARROW** - Previous item
- **DOWN ARROW** - Next item

## Styling

The menu system uses ANSI color codes:
- Menu bar: Blue background (`\x1b[44;37m`), white text
- Selected menu: White background (`\x1b[47;30m`), black text
- Dropdown: Black background (`\x1b[40;37m`), white text
- Selected item: White background (`\x1b[47;30m`), black text

You can modify the rendering functions in `menus.js` to change colors.

## Integration with Existing Programs

To add menus to an existing program:

1. Include `menus.js` in your HTML
2. Define menu structure
3. Call `initMenus()` in your initialization code
4. Add `isMenuKey()` check at top of your `keydown()` function
5. Add `renderMenuBar()` call at top of your render function

## Tips

- **Action IDs**: Use descriptive action strings like "save", "open", "exit"
- **Callback Pattern**: Keep menu action handler separate from menu definition
- **Re-render**: Always re-render after menu actions
- **keyon Variable**: Set `keyon = 0` if your program handles its own input
- **ALT Keys**: Pass ALT key combinations through to menus.js
- **Custom Keys**: Change activation key per program (e.g., "alt f" for File)

## Troubleshooting

**Menu doesn't appear:**
- Check that `renderMenuBar()` is called in your render function
- Verify `initMenus()` was called during initialization

**Keys not working:**
- Ensure `isMenuKey()` is checked before your key handling
- Verify `processMenuKey()` is called when `isMenuKey()` returns true

**Menu stays open:**
- Make sure you re-render after `processMenuKey()`
- Check that ESC key is reaching the menu system

**Action not firing:**
- Verify your action strings match between menu structure and handler
- Check callback function is passed to `initMenus()`

## License

Part of the Qandy Pocket Computer project.
