//
// Qandy Video Graphics Adaptor
// 
// alert(JSON.stringify(peekStyle(y, x)));
//


function validateCoords(x, y) {
  return (typeof x === 'number' && typeof y === 'number' && 
          x >= 0 && y >= 0 && x < screenWidth && y < screenHeight);
}

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

window.poke = window.pokeCell = function(x, y, ch, styleObj) {
  if (!validateCoords(x, y)) return false;
  // Handle parameter shifting: poke(x, y, styleObj)
  if (typeof ch === 'object' && typeof styleObj === 'undefined') { styleObj = ch; ch = undefined; }

  if (typeof ch !== 'undefined') {
    screenBuffer[y][x] = (typeof ch === 'string') ? ch : String(ch)[0] || ' ';
  }

  // Helper to read currentStyle safely
  var cs = (window.currentStyle && typeof window.currentStyle === 'object') ? window.currentStyle : { color: 37, bgcolor: 40, bold: false, inverse: false };

  // If styleObj provided -> normalize/replace using styleObj (use currentStyle as defaults)
  if (styleObj && typeof styleObj === 'object') {
    window.styleBuffer[y][x] = {
      color: (typeof styleObj.color !== 'undefined') ? styleObj.color : (typeof cs.color !== 'undefined' ? cs.color : 37),
      bgcolor: (typeof styleObj.bgcolor !== 'undefined') ? styleObj.bgcolor : (typeof cs.bgcolor !== 'undefined' ? cs.bgcolor : 40),
      bold: (typeof styleObj.bold !== 'undefined') ? !!styleObj.bold : !!cs.bold,
      inverse: (typeof styleObj.inverse !== 'undefined') ? !!styleObj.inverse : !!cs.inverse
    };
  } else {
    // No styleObj -> replace the style cell with currentStyle (overwrite previous)
    window.styleBuffer[y][x] = {
      color: (typeof cs.color !== 'undefined') ? cs.color : 37,
      bgcolor: (typeof cs.bgcolor !== 'undefined') ? cs.bgcolor : 40,
      bold: !!cs.bold,
      inverse: !!cs.inverse
    };
  }
  
  // Fast DOM update
  updateDomCellInPlace(x, y);
  return true;
};

window.pokeInverse = function(x, y, state, count) {
  styleBuffer[y][x].inverse = state;
  updateDomCellInPlace(x, y);
  return true;
};


// PEEK - Read character at position
window.peek = function(x, y) { 
  return validateCoords(x, y) ? screenBuffer[y][x] : undefined;
};

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

// POKEINVERSE - Toggle inverse video (white on black <-> black on white)
// Most common style operation for text selection and highlighting

window.pokeInverse = function(x, y, state, count) {
  if (typeof state === 'undefined') { return validateCoords(x, y) ? styleBuffer[y][x].inverse : undefined; }
  // Validate starting position
  if (!validateCoords(x, y)) return false;
  var inverseState = !!state;
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
//window.vline = function(x, y, height, ch) {
//  if (!validateCoords(x, y)) return 0;
//  
//  var char = ch || '|';
//  var maxY = Math.min(y + height, screenHeight);
//  var count = 0;
//  
//  for (var i = y; i < maxY; i++) {
//    screenBuffer[i][x] = char;
//    updateDomCellInPlace(x, i);
//    count++;
//  }
//  return count;
//};

// LINE - Draw line between two points (Bresenham's algorithm)
//window.line = window.pokeLine = function(x1, y1, x2, y2, ch, styleObj) {
//  var char = (typeof ch === 'string') ? ch : (ch || '█');
//  var dx = Math.abs(x2 - x1);
//  var dy = Math.abs(y2 - y1);
//  var sx = (x1 < x2) ? 1 : -1;
//  var sy = (y1 < y2) ? 1 : -1;
//  var err = dx - dy;
//  var count = 0;
//  
//  while (true) {
//    // Plot point
//    if (validateCoords(x1, y1)) {
//      if (styleObj) {
//        pokeCell(x1, y1, char, styleObj);
//     } else {
//        pokeChar(x1, y1, char);
//      }
//      count++;
//    }
//    
//    // Check if we've reached the end
//    if (x1 === x2 && y1 === y2) break;
//    
//    var e2 = 2 * err;
 //   if (e2 > -dy) {
//      err -= dy;
//      x1 += sx;
//    }
//    if (e2 < dx) {
//      err += dx;
//      y1 += sy;
//    }
//  }
//  return count;
//};

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


function renderInputLine() {
  pokeText(window.inputStartX, window.inputStartY, window.line); updateDisplay();
}

window.pokeText = function(x, y, text) {
  if (!text) return 0;
  var str = String(text);
  var count = 0;
  var currentX = x; var currentY = y;
  
  for (var i = 0; i < str.length; i++) {
    var char = str[i];
    if (char === '\n') { currentX = 0; currentY++; if (currentY >= screenHeight) { break; } continue; }
    if (currentX >= screenWidth) { currentX = 0; currentY++; if (currentY >= screenHeight) break; }
    pokeCell(currentX, currentY, char);
    currentX++;
    count++;
  }
  updateDisplay();
  return count;
};

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
window.draw = function(sprite, x, y, styleObj, transparent) {
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

window.drawInputLine = function(text, writeCol, writeRow) {
  var W = screenWidth;
  var H = screenHeight;
  
  // this line of code is wrong
  if (writeRow < 0 || writeRow >= H || writeCol >= W) return 0;

  var curStyle = (typeof currentStyle === 'object' && currentStyle) ? currentStyle : { color: 37, bgcolor: 40 };
  var idx = 0;
  var rowOffset = 0;
  var updated = 0;

  // Batch DOM updates so we only paint once at the end
  try { beginBatch(); } catch (e) { /* beginBatch may exist as begin(); ignore if not */ try { begin(); } catch(_) {} }

  while (idx < text.length && (writeRow + rowOffset) < H) {
    var y = writeRow + rowOffset;
    var rowStartCol = (rowOffset === 0) ? writeCol : 0;
    var avail = W - rowStartCol;
    if (avail <= 0) break;

    // Ensure buffers exist for this row
    if (!screenBuffer[y]) {
      screenBuffer[y] = new Array(W);
      styleBuffer[y]  = new Array(W);
      for (var xi = 0; xi < W; xi++) {
        screenBuffer[y][xi] = '\u00A0';
        styleBuffer[y][xi]  = { color: curStyle.color, bgcolor: curStyle.bgcolor, bold: false, inverse: false };
      }
    }

    // Number of characters to write into this row
    var writeCount = Math.min(avail, text.length - idx);

    // Write contiguous block for this row
    for (var i = 0; i < writeCount; i++) {
      var x = rowStartCol + i;
      var ch = text.charAt(idx + i) || '\u00A0';

      var prevCh = screenBuffer[y][x];
      var prevStyle = styleBuffer[y][x];

      // Defensive init if missing
      if (!prevStyle) {
        prevStyle = { color: curStyle.color, bgcolor: curStyle.bgcolor, bold: false, inverse: false };
        styleBuffer[y][x] = prevStyle;
        if (typeof prevCh === 'undefined') prevCh = '\u00A0';
        screenBuffer[y][x] = prevCh;
      }

      // Preserve prevStyle.inverse; only update non-inverse style props and char
      var needUpdate = false;
      if (prevCh !== ch) needUpdate = true;
      else if (prevStyle.color !== curStyle.color) needUpdate = true;
      else if (prevStyle.bgcolor !== curStyle.bgcolor) needUpdate = true;
      else if (prevStyle.bold !== false) needUpdate = true;

      if (needUpdate) {
        screenBuffer[y][x] = ch;
        prevStyle.color = curStyle.color;
        prevStyle.bgcolor = curStyle.bgcolor;
        prevStyle.bold = false;
        // DO NOT touch prevStyle.inverse - preserve selection/highlight

        updated++;
      }
    }

    idx += writeCount;
    rowOffset++;
  }

  // If we still want to blank trailing visible columns on the first row (after text),
  // but preserve inverse, you can optionally write NBSPs for the remainder. This is omitted
  // for max speed unless you need to explicitly clear old characters.

  // Flush DOM updates once
  try { endBatch(); } catch (e) { /* endBatch may exist as end(); ignore if not */ try { end(); } catch(_) {} }

  return updated;
};

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
  
  return time;
};

  window.setCellStyle = function (x, y, styleObj) {
    if (typeof x !== 'number' || typeof y !== 'number') {
      throw new Error('setCellStyle requires numeric x,y: setCellStyle(x,y, { color:.., bgcolor:.., bold:.., inverse:.. })');
    }
    var row = window.styleBuffer[y];
    if (!row[x]) {
      row[x] = {
        color: (window.currentStyle && window.currentStyle.color) || 37,
        bgcolor: (window.currentStyle && window.currentStyle.bgcolor) || 40,
        bold: false, 
        inverse: false
      };
    }
    // apply provided fields (only update provided keys)
    // if (typeof styleObj.color !== 'undefined') row[x].color = styleObj.color;
    // if (typeof styleObj.bgcolor !== 'undefined') row[x].bgcolor = styleObj.bgcolor;
    // if (typeof styleObj.bold !== 'undefined') row[x].bold = !!styleObj.bold;
    // if (typeof styleObj.i thenverse !== 'undefined') row[x].inverse = !!styleObj.inverse;
    
    return domUpdated;
  };

const ANSI = {
  colors: { 30: 'black', 31: 'red', 32: 'green', 33: 'yellow', 34: 'blue', 35: 'magenta', 36: 'cyan', 37: 'white', 90: 'black', 91: 'red', 92: 'green', 93: 'yellow', 94: 'blue', 95: 'magenta', 96: 'cyan', 97: 'white' },
  bgColors: { 40: 'black', 41: 'red', 42: 'green', 43: 'yellow', 44: 'blue', 45: 'magenta', 46: 'cyan', 47: 'white', 100: 'black', 101: 'red', 102: 'green', 103: 'yellow', 104: 'blue', 105: 'magenta', 106: 'cyan', 107: 'white' },
  
  render: function(text) {
    let html = ''; let currentColor = 'white'; let currentBgColor = 'black'; let bold = false; let inverse = false; let cX = 0; let cY = 0;
    const ansiRegex = /\x1b\[([\d;]*)([A-Za-z])/g; let lastIndex = 0; let match;
    while ((match = ansiRegex.exec(text)) !== null) {
      html += this.escapeHtml(text.substring(lastIndex, match.index));
      const params = match[1] ? match[1].split(';').map(Number) : [0];
      const command = match[2];
      if (command === 'm') {
        params.forEach(param => {
          if (param === 0) {
            currentColor = 'white';
            currentBgColor = 'black';
            bold = false;
            inverse = false;
          } else if (param === 1) {
            bold = true;
          } else if (param === 7) {
            inverse = true;
          } else if (param === 27) {
            inverse = false;
          } else if (param >= 30 && param <= 37) {
            currentColor = this.colors[param];
          } else if (param >= 40 && param <= 47) {
            currentBgColor = this.bgColors[param];
          }
        });
      } else if (command === 'H' || command === 'f') {
        cY = params[0] || 0;
        cX = params[1] || 0;
      } else if (command === 'A') {
        cY = Math.max(0, cY - (params[0] || 1));
      } else if (command === 'B') {
        cY += (params[0] || 1);
      } else if (command === 'C') {
        cX += (params[0] || 1);
      } else if (command === 'D') {
        cX = Math.max(0, cX - (params[0] || 1));
      } else if (command === 'J') {
        if (params[0] === 2) {
          html = ''; // Clear screen 
        }
      } else if (command === 'K') {
      }
      lastIndex = match.index + match[0].length;
    }
    html += this.escapeHtml(text.substring(lastIndex));
    let classes = [];
    if (bold) classes.push('ansi-bold');
    if (inverse) classes.push('ansi-inverse');
    classes.push(`ansi-${currentColor}`);
    classes.push(`ansi-bg-${currentBgColor}`);
    if (classes.length > 0) { html = `<span class="${classes.join(' ')}">${html}</span>`; }
    return html;
  },

  escapeHtml: function(text) {
    const map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
  },

  codes: {
    reset: '\x1b[0m',
    bold: '\x1b[1m',
    inverse: '\x1b[7m',
    black: '\x1b[30m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
    white: '\x1b[37m',
    bgBlack: '\x1b[40m',
    bgRed: '\x1b[41m',
    bgGreen: '\x1b[42m',
    bgYellow: '\x1b[43m',
    bgBlue: '\x1b[44m',
    bgMagenta: '\x1b[45m',
    bgCyan: '\x1b[46m',
    bgWhite: '\x1b[47m',
    cursorHome: '\x1b[H',
    cursorPos: (row, col) => `\x1b[${row};${col}H`,
    cursorUp: (n = 1) => `\x1b[${n}A`,
    cursorDown: (n = 1) => `\x1b[${n}B`,
    cursorForward: (n = 1) => `\x1b[${n}C`,
    cursorBack: (n = 1) => `\x1b[${n}D`,
    clearScreen: '\x1b[2J',
    clearLine: '\x1b[K',
    pageBreak: '\f'  // Form Feed (ASCII 12, 0x0C) - explicit page break for pagination
  }
};

window.ANSI=ANSI;

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

// shorter aliases for color constants
window.C = window.COLOR;

window.W = 32; window.screenWidth = window.W;
window.H = 25; window.screenHeight = window.H;

var defaultColor = (window.currentStyle && typeof window.currentStyle.color !== 'undefined') ? window.currentStyle.color : 37;
var defaultBg    = (window.currentStyle && typeof window.currentStyle.bgcolor !== 'undefined') ? window.currentStyle.bgcolor : 40;

window.screenBuffer = new Array(window.screenHeight);
window.styleBuffer  = new Array(window.screenHeight);
window.domCellRefs  = new Array(window.screenHeight);

var txtEl = document.getElementById('txt');

// Build DOM grid into a fragment to minimize layout thrash
txtEl.innerHTML = '';
var frag = document.createDocumentFragment();

for (var y = 0; y < window.screenHeight; y++) {
  var rowChars = new Array(window.screenWidth);
  var rowStyles = new Array(window.screenWidth);
  var rowRefs   = new Array(window.screenWidth);

  var rowDiv = document.createElement('div');
  rowDiv.className = 'qandy-row';

  for (var x = 0; x < window.screenWidth; x++) {
    rowChars[x] = '\u00A0';
    rowStyles[x] = { color: defaultColor, bgcolor: defaultBg, bold: false, inverse: false };

    var cell = document.createElement('span');
    cell.id = 'c' + y + '_' + x;
    // set class names for default colors so CSS can style them immediately
    cell.className = 'qandy-cell ansi-fg-' + defaultColor + ' ansi-bg-' + defaultBg;
    cell.textContent = '\u00A0';
    // small snapshot to avoid costly classList scans in hot path
    cell._qandyStyle = { color: defaultColor, bgcolor: defaultBg, bold: false, inverse: false };

    rowDiv.appendChild(cell);
    rowRefs[x] = cell;
  }

  frag.appendChild(rowDiv);
  window.screenBuffer[y] = rowChars;
  window.styleBuffer[y]  = rowStyles;
  window.domCellRefs[y]  = rowRefs;
}

function updateDisplay() {
  const txtElement = document.getElementById("txt");
  let htmlContent = '';
  // Render the full visible screen (clamped to available buffer).
  const rowsToRender = Math.min(screenHeight, screenBuffer.length);
  // small helper to escape characters for HTML
  function escapeChar(c) {
    if (c === ' ') return '&nbsp;';
    if (c === '&') return '&amp;';
    if (c === '<') return '&lt;';
    if (c === '>') return '&gt;';
    // keep control chars out of output
    if (c === '\t') return '&nbsp;&nbsp;&nbsp;&nbsp;';
    if (c === '\r' || c === '\n') return '';
    // default: return the character as-is (assumes ASCII printable)
    return c;
  }

  for (let y = 0; y < rowsToRender; y++) {
    // ensure row arrays exist (same as before)
    if (!screenBuffer[y]) { screenBuffer[y] = new Array(screenWidth).fill(' '); }
    if (!styleBuffer[y]) {
      styleBuffer[y] = new Array(screenWidth);
      for (let x = 0; x < screenWidth; x++) {
        styleBuffer[y][x] = {
          color: currentStyle.color,
          bgcolor: currentStyle.bgcolor,
          bold: currentStyle.bold,
          inverse: currentStyle.inverse
        };
      }
    }

    let lineHtml = '<span class="qandy-line">';

    for (let x = 0; x < screenWidth; x++) {
      const ch = (screenBuffer[y][x] === undefined || screenBuffer[y][x] === null) ? ' ' : screenBuffer[y][x];
      const style = styleBuffer[y][x] || {
        color: currentStyle.color,
        bgcolor: currentStyle.bgcolor,
        bold: currentStyle.bold,
        inverse: currentStyle.inverse
      };
      const classes = [];
      if (style.inverse) {
        classes.push('ansi-inverse');
      } else {
        classes.push(`ansi-fg-${style.color}`);
        classes.push(`ansi-bg-${style.bgcolor}`);
      }
      if (style.bold) classes.push('ansi-bold');

      const escapedChar = (ch === ' ') ? '&nbsp;' :
                          (ch === '&') ? '&amp;' :
                          (ch === '<') ? '&lt;' :
                          (ch === '>') ? '&gt;' :
                          escapeChar(ch);

      lineHtml += `<span id="c${y}_${x}" class="${classes.join(' ')}">${escapedChar}</span>`;
    }

    lineHtml += '</span><br>';
    htmlContent += lineHtml;
  }

  if (txtElement) txtElement.innerHTML = htmlContent;
}
txtEl.appendChild(frag);

// Signal that video.js is ready
if (typeof window.qandySignalReady === 'function') {
  window.qandySignalReady('Video');
}
