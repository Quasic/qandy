// ============================================================================
// QANDY OPERATING SYSTEM - POKE ROUTINES v1.0
// ============================================================================
// High-performance character and style manipulation for retro computing
// Designed to feel like a native 8-bit computer, not a web browser
// 
// ASSUMPTIONS:
// - screenBuffer and styleBuffer are pre-initialized at startup
// - All buffers have screenHeight rows and screenWidth columns
// - Invalid coordinates are rejected (fail fast, no buffer creation)
// ============================================================================

// ============================================================================
// INTERNAL HELPERS (not exposed to developers)
// ============================================================================

// Fast coordinate validation
function validateCoords(x, y) {
  return (typeof x === 'number' && typeof y === 'number' && 
          x >= 0 && y >= 0 && x < screenWidth && y < screenHeight);
}

// Safe get without buffer creation
function safeGet(arr, y, x) {
  return (arr && arr[y]) ? arr[y][x] : undefined;
}

function updateDomCellInPlace(x, y) {
  try {
    var elId = 'c' + y + '_' + x; // repo convention: c{row}_{col}
    var el = document.getElementById(elId);
    var ch = safeGet(window.screenBuffer, y, x);
    var styleObj = safeGet(window.styleBuffer, y, x);

    if (!el) return false;

    // write char (use &nbsp; for space)
    if (typeof ch === 'string') {
      if (ch === '\u00A0' || ch === ' ') el.innerHTML = '&nbsp;';
      else el.textContent = ch;
    } else {
      el.innerHTML = '&nbsp;';
    }

    // apply styling helper (must exist in your codebase)
    if (typeof applyStyleToDom === 'function') {
      applyStyleToDom(el, styleObj);
    } else {
      // fallback minimal styling if helper missing
      if (styleObj && styleObj.inverse) {
        el.style.backgroundColor = '#fff';
        el.style.color = '#000';
      } else {
        el.style.backgroundColor = '';
        el.style.color = '';
      }
      el.style.fontWeight = (styleObj && styleObj.bold) ? 'bold' : '';
    }

    return true;
  } catch (e) {
    console.error('updateDomCellInPlace error:', e);
    return false;
  }
}

// ============================================================================
// PRIMARY POKE FUNCTIONS - Character, Color, and Style
// ============================================================================

// POKE - Main function: poke character and/or style
window.poke = window.pokeCell = function(x, y, ch, styleObj) {
  // Fast coordinate validation only
  if (!validateCoords(x, y)) return false;
  
  // Handle parameter shifting: poke(x, y, styleObj)
  if (typeof ch === 'object' && typeof styleObj === 'undefined') {
    styleObj = ch;
    ch = undefined;
  }
  
  // Getter mode: poke(x, y) returns character
  if (typeof ch === 'undefined' && typeof styleObj === 'undefined') {
    return screenBuffer[y][x];
  }
  
  // Update character if provided
  if (typeof ch !== 'undefined') {
    screenBuffer[y][x] = (typeof ch === 'string') ? ch : String(ch)[0] || ' ';
  }
  
  // Update style if provided (direct access, no null checks needed)
  if (styleObj && typeof styleObj === 'object') {
    var style = styleBuffer[y][x];
    if (typeof styleObj.color !== 'undefined') style.color = styleObj.color;
    if (typeof styleObj.bgcolor !== 'undefined') style.bgcolor = styleObj.bgcolor;
    if (typeof styleObj.bold !== 'undefined') style.bold = !!styleObj.bold;
    if (typeof styleObj.inverse !== 'undefined') style.inverse = !!styleObj.inverse;
  }
  
  // Fast DOM update
  updateDomCellInPlace(x, y);
  return true;
};

// PEEK - Read character at position
window.peek = function(x, y) { 
  return validateCoords(x, y) ? screenBuffer[y][x] : undefined;
};

// ============================================================================
// CHARACTER POKE FUNCTIONS
// ============================================================================

// POKECHAR - Poke character only (fastest character updates)
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

// PEEKCHAR - Read character at position
window.peekChar = function(x, y) { 
  return validateCoords(x, y) ? screenBuffer[y][x] : undefined;
};

// ============================================================================
// STYLE POKE FUNCTIONS - General style manipulation
// ============================================================================

// POKESTYLE - Update any style properties (color, bgcolor, bold, inverse)
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

// PEEKSTYLE - Read style at position
window.peekStyle = function(x, y) { 
  return validateCoords(x, y) ? styleBuffer[y][x] : undefined;
};

// ============================================================================
// SPECIALIZED STYLE FUNCTIONS - Ultra-fast single-property updates
// ============================================================================

// POKEINVERSE - Toggle inverse video (white on black <-> black on white)
// Most common style operation for text selection and highlighting
window.pokeInverse = function(x, y, state, count) {
  // Getter mode
  if (typeof state === 'undefined') {
    return validateCoords(x, y) ? styleBuffer[y][x].inverse : undefined;
  }
  
  // Validate starting position
  if (!validateCoords(x, y)) return false;
  
  var inverseState = !!state;
  
  // Span mode: set inverse across multiple cells
  if (typeof count === 'number' && count > 1) {
    var endX = Math.min(x + count, screenWidth);
    for (var i = x; i < endX; i++) {
      styleBuffer[y][i].inverse = inverseState;
      updateDomCellInPlace(i, y);
    }
    return endX - x;
  }
  
  // Single cell update - direct property access (fastest)
  styleBuffer[y][x].inverse = inverseState;
  updateDomCellInPlace(x, y);
  return true;
};

// TOGGLEINVERSE - Flip inverse state
window.toggleInverse = function(x, y) {
  if (!validateCoords(x, y)) return false;
  styleBuffer[y][x].inverse = !styleBuffer[y][x].inverse;
  updateDomCellInPlace(x, y);
  return true;
};

// POKEBOLD - Set bold text attribute
window.pokeBold = function(x, y, state, count) {
  // Getter mode
  if (typeof state === 'undefined') {
    return validateCoords(x, y) ? styleBuffer[y][x].bold : undefined;
  }
  
  // Validate starting position
  if (!validateCoords(x, y)) return false;
  
  var boldState = !!state;
  
  // Span mode
  if (typeof count === 'number' && count > 1) {
    var endX = Math.min(x + count, screenWidth);
    for (var i = x; i < endX; i++) {
      styleBuffer[y][i].bold = boldState;
      updateDomCellInPlace(i, y);
    }
    return endX - x;
  }
  
  // Single cell
  styleBuffer[y][x].bold = boldState;
  updateDomCellInPlace(x, y);
  return true;
};

// POKEFG - Set foreground color (text color)
// Colors: 30-37 standard, 90-97 bright
window.pokeFG = function(x, y, color, count) {
  // Getter mode
  if (typeof color === 'undefined') {
    return validateCoords(x, y) ? styleBuffer[y][x].color : undefined;
  }
  
  // Validate starting position
  if (!validateCoords(x, y)) return false;
  
  // Span mode
  if (typeof count === 'number' && count > 1) {
    var endX = Math.min(x + count, screenWidth);
    for (var i = x; i < endX; i++) {
      styleBuffer[y][i].color = color;
      updateDomCellInPlace(i, y);
    }
    return endX - x;
  }
  
  // Single cell
  styleBuffer[y][x].color = color;
  updateDomCellInPlace(x, y);
  return true;
};

// POKEBG - Set background color
// Colors: 40-47 standard, 100-107 bright
window.pokeBG = function(x, y, color, count) {
  // Getter mode
  if (typeof color === 'undefined') {
    return validateCoords(x, y) ? styleBuffer[y][x].bgcolor : undefined;
  }
  
  // Validate starting position
  if (!validateCoords(x, y)) return false;
  
  // Span mode
  if (typeof count === 'number' && count > 1) {
    var endX = Math.min(x + count, screenWidth);
    for (var i = x; i < endX; i++) {
      styleBuffer[y][i].bgcolor = color;
      updateDomCellInPlace(i, y);
    }
    return endX - x;
  }
  
  // Single cell
  styleBuffer[y][x].bgcolor = color;
  updateDomCellInPlace(x, y);
  return true;
};

// POKECOLOR - C64-style: set foreground and background color together
window.pokeColor = function(x, y, fgColor, bgColor, count) {
  // Getter mode: return {fg, bg}
  if (typeof fgColor === 'undefined') {
    if (!validateCoords(x, y)) return undefined;
    var style = styleBuffer[y][x];
    return { fg: style.color, bg: style.bgcolor };
  }
  
  // Validate starting position
  if (!validateCoords(x, y)) return false;
  
  // Span mode
  if (typeof count === 'number' && count > 1) {
    var endX = Math.min(x + count, screenWidth);
    for (var i = x; i < endX; i++) {
      if (typeof fgColor !== 'undefined') styleBuffer[y][i].color = fgColor;
      if (typeof bgColor !== 'undefined') styleBuffer[y][i].bgcolor = bgColor;
      updateDomCellInPlace(i, y);
    }
    return endX - x;
  }
  
  // Single cell
  if (typeof fgColor !== 'undefined') styleBuffer[y][x].color = fgColor;
  if (typeof bgColor !== 'undefined') styleBuffer[y][x].bgcolor = bgColor;
  updateDomCellInPlace(x, y);
  return true;
};

// PEEKCOLOR - Read color at position
window.peekColor = function(x, y) {
  if (!validateCoords(x, y)) return undefined;
  var style = styleBuffer[y][x];
  return { fg: style.color, bg: style.bgcolor };
};

// ============================================================================
// FILL FUNCTIONS - Fast region filling
// ============================================================================

// FILLCHAR - Fill rectangular area with character
window.fillChar = function(x, y, width, height, ch) {
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

// FILLSTYLE - Fill rectangular area with style
window.fillStyle = function(x, y, width, height, styleObj) {
  if (!validateCoords(x, y)) return 0;
  
  var updated = 0;
  var maxY = Math.min(y + height, screenHeight);
  
  for (var row = y; row < maxY; row++) {
    var result = pokeStyle(x, row, styleObj, width);
    updated += (typeof result === 'number') ? result : 1;
  }
  return updated;
};

// FILLCOLOR - Fill rectangular area with color
window.fillColor = function(x, y, width, height, fgColor, bgColor) {
  if (!validateCoords(x, y)) return 0;
  
  var updated = 0;
  var maxY = Math.min(y + height, screenHeight);
  
  for (var row = y; row < maxY; row++) {
    var result = pokeColor(x, row, fgColor, bgColor, width);
    updated += (typeof result === 'number') ? result : 1;
  }
  return updated;
};

// FILLINVERSE - Fill rectangular area with inverse state
window.fillInverse = function(x, y, width, height, state) {
  if (!validateCoords(x, y)) return 0;
  
  var updated = 0;
  var maxY = Math.min(y + height, screenHeight);
  
  for (var row = y; row < maxY; row++) {
    var result = pokeInverse(x, row, state, width);
    updated += (typeof result === 'number') ? result : 1;
  }
  return updated;
};

// FILLBOLD - Fill rectangular area with bold state
window.fillBold = function(x, y, width, height, state) {
  if (!validateCoords(x, y)) return 0;
  
  var updated = 0;
  var maxY = Math.min(y + height, screenHeight);
  
  for (var row = y; row < maxY; row++) {
    var result = pokeBold(x, row, state, width);
    updated += (typeof result === 'number') ? result : 1;
  }
  return updated;
};

// FILLPATTERN - Repeat a pattern string across row
window.fillPattern = function(x, y, pattern, count) {
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
// DRAWING PRIMITIVES - Lines and shapes
// ============================================================================

// HLINE - Draw horizontal line
window.hline = function(x, y, length, ch) {
  return pokeChar(x, y, ch || '-', length);
};

// VLINE - Draw vertical line
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

// LINE - Draw line between two points (Bresenham's algorithm)
window.line = window.pokeLine = function(x1, y1, x2, y2, ch, styleObj) {
  var char = (typeof ch === 'string') ? ch : (ch || '█');
  var dx = Math.abs(x2 - x1);
  var dy = Math.abs(y2 - y1);
  var sx = (x1 < x2) ? 1 : -1;
  var sy = (y1 < y2) ? 1 : -1;
  var err = dx - dy;
  var count = 0;
  
  while (true) {
    // Plot point
    if (validateCoords(x1, y1)) {
      if (styleObj) {
        pokeCell(x1, y1, char, styleObj);
      } else {
        pokeChar(x1, y1, char);
      }
      count++;
    }
    
    // Check if we've reached the end
    if (x1 === x2 && y1 === y2) break;
    
    var e2 = 2 * err;
    if (e2 > -dy) {
      err -= dy;
      x1 += sx;
    }
    if (e2 < dx) {
      err += dx;
      y1 += sy;
    }
  }
  return count;
};

// BOX - Draw box with borders
window.box = function(x, y, width, height, style) {
  if (!validateCoords(x, y)) return 0;
  
  var chars = style || {
    tl: '┌', tr: '┐', bl: '└', br: '┘',
    h: '─', v: '│'
  };
  
  // Validate bottom-right corner
  var x2 = x + width - 1;
  var y2 = y + height - 1;
  if (!validateCoords(x2, y2)) return 0;
  
  // Corners
  pokeChar(x, y, chars.tl);
  pokeChar(x2, y, chars.tr);
  pokeChar(x, y2, chars.bl);
  pokeChar(x2, y2, chars.br);
  
  // Horizontal lines (use span for performance)
  if (width > 2) {
    pokeChar(x + 1, y, chars.h, width - 2);
    pokeChar(x + 1, y2, chars.h, width - 2);
  }
  
  // Vertical lines
  for (var i = 1; i < height - 1; i++) {
    pokeChar(x, y + i, chars.v);
    pokeChar(x2, y + i, chars.v);
  }
  
  return width * 2 + height * 2 - 4;
};

// RECT - Draw rectangle (supports fill)
window.rect = window.pokeRect = function(x, y, width, height, ch, styleObj, fill) {
  var char = ch || '█';
  var count = 0;
  
  if (fill) {
    count = fillChar(x, y, width, height, char);
    if (styleObj) {
      fillStyle(x, y, width, height, styleObj);
    }
  } else {
    // Just outline
    hline(x, y, width, char);
    hline(x, y + height - 1, width, char);
    vline(x, y, height, char);
    vline(x + width - 1, y, height, char);
    count = width * 2 + height * 2 - 4;
    
    if (styleObj) {
      fillStyle(x, y, width, 1, styleObj);
      fillStyle(x, y + height - 1, width, 1, styleObj);
      fillStyle(x, y, 1, height, styleObj);
      fillStyle(x + width - 1, y, 1, height, styleObj);
    }
  }
  
  return count;
};

// CIRCLE - Draw circle (Bresenham's circle algorithm)
window.circle = window.pokeCircle = function(centerX, centerY, radius, ch, styleObj, fill) {
  var char = ch || '○';
  var count = 0;
  
  if (fill) {
    // Filled circle
    for (var y = -radius; y <= radius; y++) {
      for (var x = -radius; x <= radius; x++) {
        if (x*x + y*y <= radius*radius) {
          var px = centerX + x;
          var py = centerY + y;
          if (validateCoords(px, py)) {
            if (styleObj) {
              pokeCell(px, py, char, styleObj);
            } else {
              pokeChar(px, py, char);
            }
            count++;
          }
        }
      }
    }
  } else {
    // Circle outline
    var x = 0;
    var y = radius;
    var d = 3 - 2 * radius;
    
    var plotCirclePoints = function(cx, cy, x, y) {
      var points = [
        [cx + x, cy + y], [cx - x, cy + y],
        [cx + x, cy - y], [cx - x, cy - y],
        [cx + y, cy + x], [cx - y, cy + x],
        [cx + y, cy - x], [cx - y, cy - x]
      ];
      
      for (var i = 0; i < points.length; i++) {
        var px = points[i][0];
        var py = points[i][1];
        if (validateCoords(px, py)) {
          if (styleObj) {
            pokeCell(px, py, char, styleObj);
          } else {
            pokeChar(px, py, char);
          }
          count++;
        }
      }
    };
    
    while (y >= x) {
      plotCirclePoints(centerX, centerY, x, y);
      x++;
      
      if (d > 0) {
        y--;
        d = d + 4 * (x - y) + 10;
      } else {
        d = d + 4 * x + 6;
      }
    }
  }
  
  return count;
};

// CLEAR - Clear region
window.clear = window.clearRegion = function(x, y, width, height) {
  return fillChar(x, y, width, height, ' ');
};

// ============================================================================
// TEXT FUNCTIONS - Write strings to screen
// ============================================================================

// PRINT - Write text at position (supports wrap and newlines)
window.pokeText = function(x, y, text, styleObj, wrap) {
  if (!text) return 0;
  var str = String(text);
  var count = 0;
  var currentX = x;
  var currentY = y;
  
  for (var i = 0; i < str.length; i++) {
    var char = str[i];
    
    // Handle newline
    if (char === '\n') {
      currentX = x;
      currentY++;
      if (currentY >= screenHeight) break;
      continue;
    }
    
    // Handle wrapping
    if (currentX >= screenWidth) {
      if (wrap) {
        currentX = x;
        currentY++;
        if (currentY >= screenHeight) break;
      } else {
        break; // Stop if no wrap
      }
    }
    
    // Poke character
    if (validateCoords(currentX, currentY)) {
      if (styleObj) {
        pokeCell(currentX, currentY, char, styleObj);
      } else {
        pokeChar(currentX, currentY, char);
      }
      currentX++;
      count++;
    }
  }
  
  return count;
};

// PRINTC - Print centered text
window.pokeTextCentered = function(y, text, styleObj) {
  if (!text || y < 0 || y >= screenHeight) return 0;
  var x = Math.floor((screenWidth - text.length) / 2);
  if (x < 0) x = 0;
  return pokeText(x, y, text, styleObj);
};

// PRINTR - Print right-aligned text
window.pokeTextRight = function(y, text, styleObj) {
  if (!text || y < 0 || y >= screenHeight) return 0;
  var x = screenWidth - text.length;
  if (x < 0) x = 0;
  return pokeText(x, y, text, styleObj);
};

// ============================================================================
// SCREEN MANIPULATION - Scroll, copy, capture
// ============================================================================

// SCROLL - Scroll region in any direction
window.scroll = window.scrollRegion = function(x, y, width, height, direction, distance, fillChar) {
  distance = distance || 1;
  var fill = fillChar || ' ';
  
  // Validate region
  if (!validateCoords(x, y) || width <= 0 || height <= 0) return false;
  var x2 = Math.min(x + width, screenWidth);
  var y2 = Math.min(y + height, screenHeight);
  
  switch(direction.toLowerCase()) {
    case 'up':
      // Move rows up
      for (var row = y; row < y2 - distance; row++) {
        for (var col = x; col < x2; col++) {
          var srcRow = row + distance;
          if (srcRow < y2) {
            screenBuffer[row][col] = screenBuffer[srcRow][col];
            styleBuffer[row][col] = Object.assign({}, styleBuffer[srcRow][col]);
            updateDomCellInPlace(col, row);
          }
        }
      }
      // Fill bottom
      for (var row = y2 - distance; row < y2; row++) {
        for (var col = x; col < x2; col++) {
          pokeChar(col, row, fill);
        }
      }
      break;
      
    case 'down':
      // Move rows down
      for (var row = y2 - 1; row >= y + distance; row--) {
        for (var col = x; col < x2; col++) {
          var srcRow = row - distance;
          if (srcRow >= y) {
            screenBuffer[row][col] = screenBuffer[srcRow][col];
            styleBuffer[row][col] = Object.assign({}, styleBuffer[srcRow][col]);
            updateDomCellInPlace(col, row);
          }
        }
      }
      // Fill top
      for (var row = y; row < y + distance; row++) {
        for (var col = x; col < x2; col++) {
          pokeChar(col, row, fill);
        }
      }
      break;
      
    case 'left':
      // Move columns left
      for (var row = y; row < y2; row++) {
        for (var col = x; col < x2 - distance; col++) {
          var srcCol = col + distance;
          if (srcCol < x2) {
            screenBuffer[row][col] = screenBuffer[row][srcCol];
            styleBuffer[row][col] = Object.assign({}, styleBuffer[row][srcCol]);
            updateDomCellInPlace(col, row);
          }
        }
      }
      // Fill right
      for (var row = y; row < y2; row++) {
        for (var col = x2 - distance; col < x2; col++) {
          pokeChar(col, row, fill);
        }
      }
      break;
      
    case 'right':
      // Move columns right
      for (var row = y; row < y2; row++) {
        for (var col = x2 - 1; col >= x + distance; col--) {
          var srcCol = col - distance;
          if (srcCol >= x) {
            screenBuffer[row][col] = screenBuffer[row][srcCol];
            styleBuffer[row][col] = Object.assign({}, styleBuffer[row][srcCol]);
            updateDomCellInPlace(col, row);
          }
        }
      }
      // Fill left
      for (var row = y; row < y2; row++) {
        for (var col = x; col < x + distance; col++) {
          pokeChar(col, row, fill);
        }
      }
      break;
  }
  
  return true;
};

// SCROLLUP - Scroll entire screen up
window.scrollUp = function(lines, fillChar) {
  return scrollRegion(0, 0, screenWidth, screenHeight, 'up', lines || 1, fillChar);
};

// SCROLLDOWN - Scroll entire screen down
window.scrollDown = function(lines, fillChar) {
  return scrollRegion(0, 0, screenWidth, screenHeight, 'down', lines || 1, fillChar);
};

// COPY - Copy region to another location
window.copy = window.copyRegion = function(srcX, srcY, destX, destY, width, height, clearSource) {
  // Validate
  if (!validateCoords(srcX, srcY) || !validateCoords(destX, destY)) return 0;
  if (width <= 0 || height <= 0) return 0;
  
  // Create temporary buffers to hold source data
  var tempChars = [];
  var tempStyles = [];
  
  // Copy source to temp buffers
  for (var row = 0; row < height; row++) {
    tempChars[row] = [];
    tempStyles[row] = [];
    var sRow = srcY + row;
    if (sRow >= screenHeight) break;
    
    for (var col = 0; col < width; col++) {
      var sCol = srcX + col;
      if (sCol >= screenWidth) break;
      
      tempChars[row][col] = screenBuffer[sRow][sCol];
      tempStyles[row][col] = Object.assign({}, styleBuffer[sRow][sCol]);
    }
  }
  
  // Clear source if requested (move operation)
  if (clearSource) {
    for (var row = 0; row < height; row++) {
      var sRow = srcY + row;
      if (sRow >= screenHeight) break;
      for (var col = 0; col < width; col++) {
        var sCol = srcX + col;
        if (sCol >= screenWidth) break;
        pokeChar(sCol, sRow, ' ');
      }
    }
  }
  
  // Copy temp to destination
  var copied = 0;
  for (var row = 0; row < tempChars.length; row++) {
    var dRow = destY + row;
    if (dRow >= screenHeight) break;
    
    for (var col = 0; col < tempChars[row].length; col++) {
      var dCol = destX + col;
      if (dCol >= screenWidth) break;
      
      screenBuffer[dRow][dCol] = tempChars[row][col];
      styleBuffer[dRow][dCol] = tempStyles[row][col];
      updateDomCellInPlace(dCol, dRow);
      copied++;
    }
  }
  
  return copied;
};

// MOVE - Move region (copy then clear source)
window.move = window.moveRegion = function(srcX, srcY, destX, destY, width, height) {
  return copyRegion(srcX, srcY, destX, destY, width, height, true);
};

// SAVE - Capture entire screen to object
window.save = window.captureScreen = function() {
  var capture = {
    chars: [],
    styles: [],
    width: screenWidth,
    height: screenHeight
  };
  
  for (var y = 0; y < screenHeight; y++) {
    capture.chars[y] = [];
    capture.styles[y] = [];
    
    for (var x = 0; x < screenWidth; x++) {
      capture.chars[y][x] = screenBuffer[y][x];
      capture.styles[y][x] = Object.assign({}, styleBuffer[y][x]);
    }
  }
  
  return capture;
};

// RESTORE - Restore screen from captured object
window.restore = window.restoreScreen = function(capture) {
  if (!capture || !capture.chars || !capture.styles) return false;
  
  beginBatch();
  
  for (var y = 0; y < Math.min(capture.height, screenHeight); y++) {
    for (var x = 0; x < Math.min(capture.width, screenWidth); x++) {
      if (capture.chars[y] && capture.styles[y]) {
        screenBuffer[y][x] = capture.chars[y][x];
        styleBuffer[y][x] = Object.assign({}, capture.styles[y][x]);
      }
    }
  }
  
  endBatch();
  return true;
};

// ============================================================================
// FLOOD FILL - Fill enclosed area
// ============================================================================
window.flood = window.floodFill = function(x, y, ch, styleObj) {
  if (!validateCoords(x, y)) return 0;
  
  var targetChar = peekChar(x, y);
  var fillChar = (typeof ch === 'string') ? ch : String(ch)[0];
  
  if (targetChar === fillChar) return 0; // Already filled
  
  var stack = [[x, y]];
  var filled = 0;
  var visited = {};
  
  while (stack.length > 0) {
    var pos = stack.pop();
    var px = pos[0];
    var py = pos[1];
    var key = px + ',' + py;
    
    if (visited[key]) continue;
    if (!validateCoords(px, py)) continue;
    if (peekChar(px, py) !== targetChar) continue;
    
    visited[key] = true;
    
    if (styleObj) {
      pokeCell(px, py, fillChar, styleObj);
    } else {
      pokeChar(px, py, fillChar);
    }
    filled++;
    
    // Add neighbors
    stack.push([px + 1, py]);
    stack.push([px - 1, py]);
    stack.push([px, py + 1]);
    stack.push([px, py - 1]);
  }
  
  return filled;
};

// ============================================================================
// SPRITE SUPPORT - Character-based sprites
// ============================================================================

// SPRITE - Create sprite from array of strings
window.sprite = window.createSprite = function(data) {
  if (!Array.isArray(data)) return null;
  
  return {
    data: data,
    width: data[0] ? data[0].length : 0,
    height: data.length
  };
};

// DRAW - Draw sprite at position
window.draw = window.drawSprite = function(sprite, x, y, styleObj, transparent) {
  if (!sprite || !sprite.data) return 0;
  
  var count = 0;
  var transparentChar = transparent || null;
  
  for (var row = 0; row < sprite.height; row++) {
    var py = y + row;
    if (py < 0 || py >= screenHeight) continue;
    
    var line = sprite.data[row];
    if (typeof line === 'string') {
      for (var col = 0; col < line.length; col++) {
        var px = x + col;
        if (px < 0 || px >= screenWidth) continue;
        
        var char = line[col];
        if (transparentChar && char === transparentChar) continue;
        
        if (styleObj) {
          pokeCell(px, py, char, styleObj);
        } else {
          pokeChar(px, py, char);
        }
        count++;
      }
    }
  }
  
  return count;
};

// ============================================================================
// BATCH MODE - Disable DOM updates for bulk operations
// ============================================================================
var batchMode = false;

// BEGIN - Start batch mode (accumulate changes)
window.begin = window.beginBatch = function() {
  batchMode = true;
};

// END - End batch mode (flush all changes to screen)
window.end = window.endBatch = function() {
  batchMode = false;
  updateDisplay(); // Single full screen refresh
};

// Override updateDomCellInPlace to respect batch mode
var _originalUpdateDomCellInPlace = updateDomCellInPlace;
updateDomCellInPlace = function(x, y) {
  if (batchMode) return true; // Skip DOM updates in batch mode
  return _originalUpdateDomCellInPlace(x, y);
};

// ============================================================================
// DOUBLE BUFFERING - Flicker-free animation
// ============================================================================
var backBuffer = null;
var backBufferStyle = null;
var doubleBufferEnabled = false;
var frontBuffer = null;
var frontBufferStyle = null;

// DBUFFER - Enable double buffering
window.dbuffer = window.enableDoubleBuffer = function() {
  if (doubleBufferEnabled) return;
  
  // Save reference to front buffer
  frontBuffer = screenBuffer;
  frontBufferStyle = styleBuffer;
  
  // Create back buffer (clone current screen)
  backBuffer = [];
  backBufferStyle = [];
  
  for (var y = 0; y < screenHeight; y++) {
    backBuffer[y] = new Array(screenWidth);
    backBufferStyle[y] = new Array(screenWidth);
    
    for (var x = 0; x < screenWidth; x++) {
      backBuffer[y][x] = screenBuffer[y][x];
      backBufferStyle[y][x] = Object.assign({}, styleBuffer[y][x]);
    }
  }
  
  doubleBufferEnabled = true;
  
  // Redirect all poke functions to back buffer
  window.screenBuffer = backBuffer;
  window.styleBuffer = backBufferStyle;
};

// SBUFFER - Disable double buffering
window.sbuffer = window.disableDoubleBuffer = function() {
  if (!doubleBufferEnabled) return;
  
  // Restore front buffer
  window.screenBuffer = frontBuffer;
  window.styleBuffer = frontBufferStyle;
  
  doubleBufferEnabled = false;
  backBuffer = null;
  backBufferStyle = null;
  frontBuffer = null;
  frontBufferStyle = null;
};

// SWAP - Swap buffers (show back buffer)
window.swap = window.swapBuffers = function() {
  if (!doubleBufferEnabled) return;
  updateDisplay(); // Render back buffer to screen
};

// ============================================================================
// PERFORMANCE PROFILING - Test poke performance
// ============================================================================
window.profile = window.profilePoke = function(testName, iterations, testFunc) {
  var start = performance.now();
  
  beginBatch();
  for (var i = 0; i < iterations; i++) {
    testFunc(i);
  }
  endBatch();
  
  var end = performance.now();
  var time = end - start;
  
  var result = testName + ': ' + time.toFixed(2) + 'ms (' + 
    (iterations / time * 1000).toFixed(0) + ' ops/sec)';
  
  print(result);
  console.log(result);
  
  return time;
};

// ============================================================================
// COLOR CONSTANTS - Easy color reference (ANSI codes)
// ============================================================================
window.COLOR = {
  // Foreground colors (30-37)
  BLACK: 30,
  RED: 31,
  GREEN: 32,
  YELLOW: 33,
  BLUE: 34,
  MAGENTA: 35,
  CYAN: 36,
  WHITE: 37,
  
  // Bright foreground colors (90-97)
  BRIGHT_BLACK: 90,
  BRIGHT_RED: 91,
  BRIGHT_GREEN: 92,
  BRIGHT_YELLOW: 93,
  BRIGHT_BLUE: 94,
  BRIGHT_MAGENTA: 95,
  BRIGHT_CYAN: 96,
  BRIGHT_WHITE: 97,
  
  // Background colors (40-47)
  BG_BLACK: 40,
  BG_RED: 41,
  BG_GREEN: 42,
  BG_YELLOW: 43,
  BG_BLUE: 44,
  BG_MAGENTA: 45,
  BG_CYAN: 46,
  BG_WHITE: 47,
  
  // Bright background colors (100-107)
  BG_BRIGHT_BLACK: 100,
  BG_BRIGHT_RED: 101,
  BG_BRIGHT_GREEN: 102,
  BG_BRIGHT_YELLOW: 103,
  BG_BRIGHT_BLUE: 104,
  BG_BRIGHT_MAGENTA: 105,
  BG_BRIGHT_CYAN: 106,
  BG_BRIGHT_WHITE: 107
};

// Shorter aliases
window.C = window.COLOR;

// ============================================================================
// END OF POKE.JS
// ============================================================================