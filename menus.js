// QANDY DROPDOWN MENU SYSTEM API
// A reusable dropdown menu system for QANDY programs
// Handles ALT key activation, keyboard navigation, and menu rendering

// Menu system state
var menuState = {
  menus: [],
  menuIndex: 0,
  menuItemIndex: 0,
  menuOpen: false,
  activationKey: "alt", // Default activation key (just ALT)
  onAction: null, // Callback when menu item is selected
  hotkeys: {} // Map of ALT+letter to action (e.g. "alt s" -> "save")
};

/**
 * Initialize the menu system with a menu structure
 * @param {Array} menuStructure - Array of menu objects with title and items
 * @param {String} activationKey - Key combination to open menu (default: "alt")
 * @param {Function} onAction - Callback function when menu item selected
 * @param {Object} hotkeys - Optional map of ALT+key to action (e.g. {"s": "save", "l": "open"})
 * 
 * Example menuStructure:
 * [
 *   {
 *     title: "File",
 *     items: [
 *       { label: "New", action: "new" },
 *       { label: "Open", action: "open" },
 *       { label: "Save", action: "save" }
 *     ]
 *   },
 *   {
 *     title: "Edit",
 *     items: [
 *       { label: "Cut", action: "cut" },
 *       { label: "Copy", action: "copy" }
 *     ]
 *   }
 * ]
 */
function initMenus(menuStructure, activationKey, onAction, hotkeys) {
  menuState.menus = menuStructure || [];
  menuState.activationKey = activationKey || "alt";
  menuState.onAction = onAction || null;
  menuState.hotkeys = hotkeys || {};
  menuState.menuOpen = false;
  menuState.menuIndex = 0;
  menuState.menuItemIndex = 0;
}

/**
 * Check if the given key should activate or control the menu
 * @param {String} k - The key pressed
 * @returns {Boolean} - True if this key is for the menu system
 */
function isMenuKey(k) {
  // Check for activation key
  if (k === menuState.activationKey || k === menuState.activationKey.toUpperCase()) {
    return true;
  }
  
  // If menu is open, all navigation keys belong to menu
  if (menuState.menuOpen) {
    var navKeys = ["\x1b", "esc", "\r", "\n", "enter", "←", "\x08", "left", 
                   "→", " ", "right", "↑", "up", "↓", "down"];
    for (var i = 0; i < navKeys.length; i++) {
      if (k === navKeys[i]) {
        return true;
      }
    }
  }
  
  return false;
}

/**
 * Process a key press for the menu system
 * @param {String} k - The key pressed
 * @returns {Boolean} - True if key was handled by menu system
 */
function processMenuKey(k) {
  // Check for activation key
  if (k === menuState.activationKey || k === menuState.activationKey.toUpperCase()) {
    menuState.menuOpen = true;
    menuState.menuIndex = 0;
    menuState.menuItemIndex = 0;
    return true;
  }
  
  // Check for hotkeys (ALT+letter combinations) - works even when menu is closed
  // Format: "alt s", "alt l", etc.
  var lowerK = k.toLowerCase();
  for (var hotkey in menuState.hotkeys) {
    if (lowerK === "alt " + hotkey) {
      var action = menuState.hotkeys[hotkey];
      menuState.menuOpen = false;
      
      // Call the action callback if provided
      if (menuState.onAction && action) {
        menuState.onAction(action, { action: action });
      }
      return true;
    }
  }
  
  // If menu is not open, we don't handle this key
  if (!menuState.menuOpen) {
    return false;
  }
  
  // Handle menu navigation
  if (k === "\x1b" || k === "esc") { // Escape
    menuState.menuOpen = false;
    return true;
  } else if (k === "\r" || k === "\n" || k === "enter") { // Enter
    if (menuState.menus.length > 0) {
      var menu = menuState.menus[menuState.menuIndex];
      if (menu.items && menu.items.length > 0) {
        var item = menu.items[menuState.menuItemIndex];
        menuState.menuOpen = false;
        
        // Call the action callback if provided
        if (menuState.onAction && item.action) {
          menuState.onAction(item.action, item);
        }
      }
    }
    return true;
  } else if (k === "←" || k === "\x08" || k === "left") { // Left arrow
    menuState.menuIndex = (menuState.menuIndex - 1 + menuState.menus.length) % menuState.menus.length;
    menuState.menuItemIndex = 0;
    return true;
  } else if (k === "→" || k === " " || k === "right") { // Right arrow
    menuState.menuIndex = (menuState.menuIndex + 1) % menuState.menus.length;
    menuState.menuItemIndex = 0;
    return true;
  } else if (k === "↑" || k === "up") { // Up arrow
    if (menuState.menus.length > 0) {
      var menu = menuState.menus[menuState.menuIndex];
      if (menu.items) {
        menuState.menuItemIndex = (menuState.menuItemIndex - 1 + menu.items.length) % menu.items.length;
      }
    }
    return true;
  } else if (k === "↓" || k === "down") { // Down arrow
    if (menuState.menus.length > 0) {
      var menu = menuState.menus[menuState.menuIndex];
      if (menu.items) {
        menuState.menuItemIndex = (menuState.menuItemIndex + 1) % menu.items.length;
      }
    }
    return true;
  }
  
  return false;
}

/**
 * Check if menu is currently open
 * @returns {Boolean} - True if menu is open
 */
function isMenuOpen() {
  return menuState.menuOpen;
}

/**
 * Close the menu
 */
function closeMenu() {
  menuState.menuOpen = false;
}

/**
 * Render the menu bar (call this from your rendering function)
 * @param {Number} maxCols - Maximum columns for menu bar width
 */
function renderMenuBar(maxCols) {
  if (!maxCols) maxCols = 30;
  
  print("\x1b[44;37m"); // Blue background, white text
  var menuBar = "";
  
  for (var i = 0; i < menuState.menus.length; i++) {
    if (menuState.menuOpen && menuState.menuIndex === i) {
      menuBar += "\x1b[47;30m " + menuState.menus[i].title + " \x1b[44;37m "; // Highlight selected
    } else {
      menuBar += " " + menuState.menus[i].title + "  ";
    }
  }
  
  // Pad to full width
  while (menuBar.length < maxCols + 20) {
    menuBar += " ";
  }
  print(menuBar.substring(0, maxCols) + "\x1b[0m\n");
  
  // If menu is open, render dropdown
  if (menuState.menuOpen) {
    renderMenuDropdown();
  }
}

/**
 * Render the menu dropdown (called automatically by renderMenuBar)
 */
function renderMenuDropdown() {
  if (!menuState.menuOpen || menuState.menus.length === 0) {
    return;
  }
  
  var menu = menuState.menus[menuState.menuIndex];
  if (!menu.items || menu.items.length === 0) {
    return;
  }
  
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
    if (i === menuState.menuItemIndex) {
      print("\x1b[47;30m " + item);
      for (var j = 0; j < pad - 1; j++) print(" ");
      print("\x1b[0m\n");
    } else {
      print("\x1b[40;37m " + item);
      for (var j = 0; j < pad - 1; j++) print(" ");
      print("\x1b[0m\n");
    }
  }
}

/**
 * Get current menu state (for debugging)
 * @returns {Object} - Current menu state
 */
function getMenuState() {
  return {
    menuOpen: menuState.menuOpen,
    menuIndex: menuState.menuIndex,
    menuItemIndex: menuState.menuItemIndex,
    menuCount: menuState.menus.length
  };
}

// Log initialization
if (typeof print === "function") {
  print("menus.js loaded - Dropdown menu system ready\n");
}
