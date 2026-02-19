// ============================================================================
// OPERATING SYSTEM LEVEL POKE ROUTINES - OPTIMIZED FOR MAXIMUM PERFORMANCE
// ============================================================================
// ASSUMPTIONS:
// - screenBuffer and styleBuffer are pre-initialized at startup
// - All buffers have screenHeight rows and screenWidth columns
// - Invalid coordinates are rejected (fail fast)
// ============================================================================


// ============================================================================
// PRIMARY POKE FUNCTION - Poke character, color, and style all at once
// ============================================================================

// ============================================================================
// POKE CHARACTER ONLY - Fastest character-only updates
// ============================================================================
window.pokeChar = function(x, y, ch, count) {
  // Getter mode
  if (typeof ch === 'undefined') {
    return validateCoords(x, y) ? screenBuffer[y][x] : undefined;
  }
  
  // Validate starting position
  if (!validateCoords(x, y)) return false;
  
  // Normalize character
  var char = (typeof ch === 'string') ? ch : String(ch)[0] || ' ';
  
  // Span mode: repeat character across multiple cells
  if (typeof count === 'number' && count > 1) {
    var endX = Math.min(x + count, screenWidth);
    for (var i = x; i < endX; i++) {
      screenBuffer[y][i] = char;
      updateDomCellInPlace(i, y);
    }
    return endX - x; // Return number of cells updated
  }
  
  // Single cell update
  screenBuffer[y][x] = char;
  updateDomCellInPlace(x, y);
  return true;
};

// ============================================================================
// POKE STYLE ONLY - Update inverse, bold without touching character
// ============================================================================
window.pokeStyle = function(x, y, styleObj, count) {
  // Getter mode
  if (typeof styleObj === 'undefined') {
    return validateCoords(x, y) ? styleBuffer[y][x] : undefined;
  }
  
  // Validate starting position
  if (!validateCoords(x, y)) return false;
  
  // Span mode: apply style across multiple cells
  if (typeof count === 'number' && count > 1) {
    var endX = Math.min(x + count, screenWidth);
    for (var i = x; i < endX; i++) {
      var style = styleBuffer[y][i];
      if (typeof styleObj.color !== 'undefined') style.color = styleObj.color;
      if (typeof styleObj.bgcolor !== 'undefined') style.bgcolor = styleObj.bgcolor;
      if (typeof styleObj.bold !== 'undefined') style.bold = !!styleObj.bold;
      if (typeof styleObj.inverse !== 'undefined') style.inverse = !!styleObj.inverse;
      updateDomCellInPlace(i, y);
    }
    return endX - x;
  }
  
  // Single cell update - direct access, no checks
  var style = styleBuffer[y][x];
  if (typeof styleObj.color !== 'undefined') style.color = styleObj.color;
  if (typeof styleObj.bgcolor !== 'undefined') style.bgcolor = styleObj.bgcolor;
  if (typeof styleObj.bold !== 'undefined') style.bold = !!styleObj.bold;
  if (typeof styleObj.inverse !== 'undefined') style.inverse = !!styleObj.inverse;
  
  updateDomCellInPlace(x, y);
  return true;
};

// ============================================================================
// POKE COLOR ONLY - C64-style color memory (fg/bg only)
// ============================================================================
window.pokeColor = function(x, y, fgColor, bgColor, count) {
  // Getter mode: return {fg, bg}
  if (typeof fgColor === 'undefined') {
    if (!validateCoords(x, y)) return undefined;
    var style = styleBuffer[y][x];
    return { fg: style.color, bg: style.bgcolor };
  }
  
  // Validate starting position
  if (!validateCoords(x, y)) return false;
  
  // Build style object
  var styleObj = {};
  if (typeof fgColor !== 'undefined') styleObj.color = fgColor;
  if (typeof bgColor !== 'undefined') styleObj.bgcolor = bgColor;
  
  // Span mode
  if (typeof count === 'number' && count > 1) {
    return pokeStyle(x, y, styleObj, count);
  }
  
  // Single cell
  return pokeStyle(x, y, styleObj);
};

// ============================================================================
// ADVANCED SPAN FUNCTIONS - Fill regions efficiently
// ============================================================================

// Fill rectangular area with character
window.fillChar = function(x, y, width, height, ch) {
  // Validate starting position
  if (!validateCoords(x, y)) return 0;
  
  var char = (typeof ch === 'string') ? ch : String(ch)[0] || ' ';
  var updated = 0;
  var maxY = Math.min(y + height, screenHeight);
  
  for (var row = y; row < maxY; row++) {
    var result = pokeChar(x, row, char, width);
    updated += (typeof result === 'number') ? result : 1;
  }
  return updated;
};

// Fill rectangular area with style
window.fillStyle = function(x, y, width, height, styleObj) {
  // Validate starting position
  if (!validateCoords(x, y)) return 0;
  
  var updated = 0;
  var maxY = Math.min(y + height, screenHeight);
  
  for (var row = y; row < maxY; row++) {
    var result = pokeStyle(x, row, styleObj, width);
    updated += (typeof result === 'number') ? result : 1;
  }
  return updated;
};

// Fill rectangular area with color
window.fillColor = function(x, y, width, height, fgColor, bgColor) {
  // Validate starting position
  if (!validateCoords(x, y)) return 0;
  
  var updated = 0;
  var maxY = Math.min(y + height, screenHeight);
  
  for (var row = y; row < maxY; row++) {
    var result = pokeColor(x, row, fgColor, bgColor, width);
    updated += (typeof result === 'number') ? result : 1;
  }
  return updated;
};

// ============================================================================
// PATTERN FILL - Repeat a pattern string
// ============================================================================
window.fillPattern = function(x, y, pattern, count) {
  // Validate
  if (!validateCoords(x, y)) return 0;
  if (!pattern || typeof pattern !== 'string') return 0;
  
  var patternLen = pattern.length;
  var totalChars = Math.min(count || screenWidth, screenWidth - x);
  var updated = 0;
  
  for (var i = 0; i < totalChars; i++) {
    var char = pattern[i % patternLen];
    screenBuffer[y][x + i] = char;
    updateDomCellInPlace(x + i, y);
    updated++;
  }
  return updated;
};

// ============================================================================
// BATCH UPDATE - Update entire screen at once (disable DOM updates during)
// ============================================================================
var batchMode = false;

window.beginBatch = function() {
  batchMode = true;
};

window.endBatch = function() {
  batchMode = false;
  updateDisplay(); // Single full screen refresh
};

// Modify updateDomCellInPlace to respect batch mode
var _originalUpdateDomCellInPlace = updateDomCellInPlace;
updateDomCellInPlace = function(x, y) {
  if (batchMode) return true; // Skip DOM updates in batch mode
  return _originalUpdateDomCellInPlace(x, y);
};

// ============================================================================
// CONVENIENCE ALIASES
// ============================================================================
window.poke = window.pokeCell;  // Main poke alias
window.peek = function(x, y) { return pokeCell(x, y); };
window.peekChar = function(x, y) { return pokeChar(x, y); };
window.peekStyle = function(x, y) { return pokeStyle(x, y); };
window.peekColor = function(x, y) { return pokeColor(x, y); };

// ============================================================================
// DRAW PRIMITIVES - Common drawing operations
// ============================================================================

// Draw horizontal line
window.hline = function(x, y, length, ch) {
  return pokeChar(x, y, ch || '-', length);
};

// Draw vertical line
window.vline = function(x, y, height, ch) {
  if (!validateCoords(x, y)) return 0;
  
  var char = ch || '|';
  var maxY = Math.min(y + height, screenHeight);
  var count = 0;
  
  for (var i = y; i < maxY; i++) {
    screenBuffer[i][x] = char;
    updateDomCellInPlace(x, i);
    count++;
  }
  return count;
};

// Draw box
window.box = function(x, y, width, height, style) {
  if (!validateCoords(x, y)) return 0;
  
  var chars = style || {
    tl: '┌', tr: '┐', bl: '└', br: '┘',
    h: '─', v: '│'
  };
  
  // Validate all corners are in bounds
  if (!validateCoords(x + width - 1, y + height - 1)) return 0;
  
  // Corners
  pokeChar(x, y, chars.tl);
  pokeChar(x + width - 1, y, chars.tr);
  pokeChar(x, y + height - 1, chars.bl);
  pokeChar(x + width - 1, y + height - 1, chars.br);
  
  // Horizontal lines (use span for performance)
  if (width > 2) {
    pokeChar(x + 1, y, chars.h, width - 2);
    pokeChar(x + 1, y + height - 1, chars.h, width - 2);
  }
  
  // Vertical lines
  for (var i = 1; i < height - 1; i++) {
    pokeChar(x, y + i, chars.v);
    pokeChar(x + width - 1, y + i, chars.v);
  }
  
  return width * 2 + height * 2 - 4;
};

// Clear region
window.clearRegion = function(x, y, width, height) {
  return fillChar(x, y, width, height, ' ');
};