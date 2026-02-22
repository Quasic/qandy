//
// Qandy Video Graphics Adaptor
// 
// alert(JSON.stringify(peekStyle(y, x)));
//

window.pokeCell = function(x, y, ch, styleObj) {
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
  pokeRefresh(x, y);
  return true;
};

let lastx=0; let lasty=0; 

window.pokeText = function(text) {
  if (!text) return false; var str = String(text);
  var curx = CURX; var cury = CURY;
  for (var i = 0; i < str.length; i++) {
    var char = str[i];
    if (char === '\n') { 
     curx = 0; cury++; 
     if (cury >= H) {
     	return false; break;
     }
     continue;
    }
    if (curx >= W) { 
     curx = 0; cury++; 
     if (cury >= H) {
     	 return false; break;
     }
    }
    pokeCell(curx, cury, char); curx++;
  }
  CURX=curx;
  CURY=cury;
  pokeRefresh(); return true;
};

window.pokeInput = function() {
  if (!LINE) return false; var str = String(LINE);
  var curx = LINEX; var cury = LINEY;
  for (var i = 0; i < str.length; i++) {
    var char = str[i];
    if (char === '\n') { 
     curx = 0; cury++; 
     if (cury >= H) { return false; }
     continue;
    }
    if (curx >= W) { 
     curx = 0; cury++; 
     if (cury >= H) { return false; }
    }
    pokeCell(curx, cury, char); curx++;
  }
  pokeRefresh();
  return true;
};

window.peekInverse = function(x, y) { //@@
  if (typeof x !== 'number' || typeof y !== 'number') return undefined;
  // Prefer existing validator if available
  if (typeof validateCoords === 'function') {
    if (!validateCoords(x, y)) return undefined;
  } else {
    // Minimal fallback checks
    var sw = (typeof screenWidth === 'number') ? screenWidth : (typeof W === 'number' ? W : null);
    var sh = (typeof screenHeight === 'number') ? screenHeight : (typeof H === 'number' ? H : null);
    if (sw === null || sh === null) return undefined;
    if (x < 0 || y < 0 || x >= sw || y >= sh) return undefined;
  }
  if (!window.styleBuffer || !window.styleBuffer[y]) return undefined;
  var style = window.styleBuffer[y][x];
  return style ? !!style.inverse : undefined;
};

// Alias if you prefer a short name
window.peekInv = window.peekInverse;

window.pokeInverse = function(x, y, state, count) {
  if (typeof state === 'undefined') { state=true; }
  if (!validateCoords(x, y)) return false;
  var inverseState = !!state;
  if (typeof count === 'number' && count > 1) {
    var endX = Math.min(x + count, W);
    for (var i = x; i < endX; i++) {
    	// this loop does not wrap at x loc 32
      styleBuffer[y][i].inverse = inverseState;
      pokeRefresh(i, y);
    }
    return true;
  }
  styleBuffer[x][y].inverse = inverseState;
  pokeRefresh(x, y);
  return true;
};

window.peek = function(x, y) { 
  return validateCoords(x, y) ? screenBuffer[y][x] : undefined;
};

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
      pokeRefresh(i, y);
    }
    return endX - x; // Return number of cells updated
  }
  
  // Single cell update
  screenBuffer[y][x] = char;
  pokeRefresh(x, y);
  return true;
};

window.peekChar = function(x, y) { 
  return validateCoords(x, y) ? screenBuffer[y][x] : undefined;
};

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
      pokeRefresh(i, y);
    }
    return endX - x;
  }
  
  // Single cell update - direct access, no checks
  var style = styleBuffer[y][x];
  if (typeof styleObj.color !== 'undefined') style.color = styleObj.color;
  if (typeof styleObj.bgcolor !== 'undefined') style.bgcolor = styleObj.bgcolor;
  if (typeof styleObj.bold !== 'undefined') style.bold = !!styleObj.bold;
  if (typeof styleObj.inverse !== 'undefined') style.inverse = !!styleObj.inverse;
  
  pokeRefresh(x, y);
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
      pokeRefresh(i, y);
    }
    return endX - x;
  }  
  // Single cell update - direct property access (fastest)
  styleBuffer[y][x].inverse = inverseState;
  pokeRefresh(x, y);
  return true;
};

window.toggleInverse = function(x, y) {
  if (!validateCoords(x, y)) return false;
  styleBuffer[y][x].inverse = !styleBuffer[y][x].inverse;
  pokeRefresh(x, y);
  return true;
};

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
      pokeRefresh(i, y);
    }
    return endX - x;
  }
  
  // Single cell
  styleBuffer[y][x].bold = boldState;
  pokeRefresh(x, y);
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
      pokeRefresh(i, y);
    }
    return endX - x;
  }
  
  // Single cell
  styleBuffer[y][x].color = color;
  pokeRefresh(x, y);
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
      pokeRefresh(i, y);
    }
    return endX - x;
  }
  
  // Single cell
  styleBuffer[y][x].bgcolor = color;
  pokeFresh(x, y);
  return true;
};

// POKECOLOR - set foreground and background color together
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
      pokeRefresh(i, y);
    }
    return endX - x;
  }
  
  // Single cell
  if (typeof fgColor !== 'undefined') styleBuffer[y][x].color = fgColor;
  if (typeof bgColor !== 'undefined') styleBuffer[y][x].bgcolor = bgColor;
  pokeRefresh(x, y);
  return true;
};

// PEEKCOLOR - Read color at position
window.peekColor = function(x, y) {
  if (!validateCoords(x, y)) return undefined;
  var style = styleBuffer[y][x];
  return { fg: style.color, bg: style.bgcolor };
};


// CLEAR - Clear region
window.clear = window.clearRegion = function(x, y, width, height) {
  return fillChar(x, y, width, height, ' ');
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
            pokeRefresh(col, row);
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
            pokeRefresh(col, row);
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
            pokeRefresh(col, row);
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
            pokeRefresh(col, row);
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
      pokeRefresh(dCol, dRow);
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

var batchMode = false;
// BEGIN - Start batch mode (accumulate changes)
window.begin = window.beginBatch = function() {
  batchMode = true;
};
// END - End batch mode (flush all changes to screen)
window.end = window.endBatch = function() {
  batchMode = false;
  pokeRefresh(); // Single full screen refresh
};

//// Override updateDomCellInPlace to respect batch mode
//var _originalUpdateDomCellInPlace = updateDomCellInPlace;
//updateDomCellInPlace = function(x, y) {
//  if (batchMode) return true; // Skip DOM updates in batch mode
//  return _originalUpdateDomCellInPlace(x, y);
//};

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
  pokeRefresh(); // Render back buffer to screen
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

// init the DOM
var txtEl = document.getElementById('txt');
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
txtEl.appendChild(frag);

function buildClass(s) {
  var cls = 'qandy-cell ansi-fg-' + s.color + ' ansi-bg-' + s.bgcolor;
  if (s.bold) cls += ' ansi-bold';
  if (s.inverse) cls += ' ansi-inverse';
  return cls;
}

(function(){
  'use strict';

  // Attribute bit constants (16-bit)
  window.ATTR_INVERSE    = 0x0001;
  window.ATTR_BOLD       = 0x0002;
  window.ATTR_DIM        = 0x0004;
  window.ATTR_ITALIC     = 0x0008;
  window.ATTR_UNDERLINE  = 0x0010;
  window.ATTR_BLINK      = 0x0020;
  window.ATTR_RAPIDBLINK = 0x0040; // optional
  window.ATTR_HIDDEN     = 0x0080;
  window.ATTR_STRIKE     = 0x0100;
  window.ATTR_OVERLINE   = 0x0200; // optional

  // Ensure screen size variables exist
  var sw = (typeof screenWidth === 'number') ? screenWidth : (typeof W === 'number' ? W : null);
  var sh = (typeof screenHeight === 'number') ? screenHeight : (typeof H === 'number' ? H : null);
  if (sw === null || sh === null) {
    console.warn('init-attr-step1: screenWidth/screenHeight not found - run after initScreen()');
    return;
  }

  // 1) Alias VRAM -> screenBuffer so new code can use VRAM[][] now.
  if (!window.VRAM) window.VRAM = window.screenBuffer;

  // 2) Allocate ATTR rows as Uint16Array if not present
  if (!window.ATTR) {
    window.ATTR = new Array(sh);
    for (var y = 0; y < sh; y++) {
      window.ATTR[y] = new Uint16Array(sw); // all zeros
    }
    console.log('init-attr-step1: ATTR allocated as Uint16Array rows');
  } else {
    console.log('init-attr-step1: ATTR already exists, skipping allocation');
  }

  // 3) Lightweight migration: copy common booleans from existing styleBuffer into ATTR.
  //    This does NOT remove or change styleBuffer objects; it just mirrors flags into ATTR.
  if (window.styleBuffer) {
    var migrated = 0;
    for (var yy = 0; yy < sh; yy++) {
      if (!styleBuffer[yy]) continue;
      for (var xx = 0; xx < sw; xx++) {
        var s = styleBuffer[yy][xx];
        if (!s) continue;
        var bits = 0;
        if (s.inverse) bits |= ATTR_INVERSE;
        if (s.bold)    bits |= ATTR_BOLD;
        if (s.italic)  bits |= ATTR_ITALIC;
        if (s.underline) bits |= ATTR_UNDERLINE;
        if (s.blink)   bits |= ATTR_BLINK;
        if (s.hidden)  bits |= ATTR_HIDDEN;
        if (s.strike)  bits |= ATTR_STRIKE;
        if (bits) {
          ATTR[yy][xx] = (ATTR[yy][xx] | bits);
          migrated++;
        }
      }
    }
    console.log('init-attr-step1: migrated', migrated, 'flags from styleBuffer into ATTR (mirror only)');
  } else {
    console.log('init-attr-step1: styleBuffer not present; no migration performed');
  }

  // 4) Helper functions (non-destructive; safe wrappers)
  window.hasAttr = function(x, y, attrBit) {
    if (!window.ATTR || !ATTR[y]) return false;
    return !!(ATTR[y][x] & attrBit);
  };

  window.peekAttr = function(x, y) {
    if (!window.ATTR || !ATTR[y]) return undefined;
    return ATTR[y][x];
  };

  // peekInverse: prefer ATTR, fallback to styleBuffer
  window.peekInverse = function(x, y) {
    if (typeof x !== 'number' || typeof y !== 'number') return undefined;
    if (window.ATTR && ATTR[y]) {
      return !!(ATTR[y][x] & ATTR_INVERSE);
    }
    // fallback for old code during migration
    if (window.styleBuffer && styleBuffer[y] && styleBuffer[y][x]) {
      return !!styleBuffer[y][x].inverse;
    }
    return undefined;
  };

  // Note: do not override existing pokeInverse here to avoid breaking current flow.
  // Later steps will add a pokeInverse that updates both styleBuffer and ATTR consistently.
  console.log('init-attr-step1: ready. Use VRAM[][] and ATTR[][] in new code. peekInverse(x,y) tied to ATTR (fallback styleBuffer).');

})();

(function(){
  // ensure ATTR constants exist
  if (!window.ATTR_INVERSE) {
    window.ATTR_INVERSE    = 0x0001;
    window.ATTR_BOLD       = 0x0002;
    window.ATTR_ITALIC     = 0x0008;
    window.ATTR_UNDERLINE  = 0x0010;
    window.ATTR_BLINK      = 0x0020;
    window.ATTR_HIDDEN     = 0x0080;
    window.ATTR_STRIKE     = 0x0100;
  }
  if (!window.ATTR || !ATTR[0]) { console.warn('ATTR not initialized (run init-attr-step1)'); return; }

  window._setAttrBit = function(x, y, bit, state) {
    if (typeof x !== 'number' || typeof y !== 'number') return false;
    if (!ATTR[y]) return false;
    if (state) ATTR[y][x] |= bit;
    else       ATTR[y][x] &= ~bit;

    // Mirror to styleBuffer if present
    if (window.styleBuffer && styleBuffer[y]) {
      var sb = styleBuffer[y][x];
      if (!sb) {
        sb = { color: (window.defaultColor||37), bgcolor: (window.defaultBg||40), bold:false, inverse:false };
        styleBuffer[y][x] = sb;
      }
      sb.inverse = !!(ATTR[y][x] & (window.ATTR_INVERSE || 0x0001));
      sb.bold    = !!(ATTR[y][x] & (window.ATTR_BOLD    || 0x0002));
      sb.italic  = !!(ATTR[y][x] & (window.ATTR_ITALIC  || 0x0008));
      sb.underline = !!(ATTR[y][x] & (window.ATTR_UNDERLINE || 0x0010));
      sb.blink   = !!(ATTR[y][x] & (window.ATTR_BLINK   || 0x0020));
      sb.hidden  = !!(ATTR[y][x] & (window.ATTR_HIDDEN  || 0x0080));
      sb.strike  = !!(ATTR[y][x] & (window.ATTR_STRIKE  || 0x0100));
    }
    return true;
  };

  window.pokeAttrBit = function(x, y, bit, state) {
    var ok = _setAttrBit(x, y, bit, !!state);
    if (!ok) return false;
    if (typeof pokeRefresh === 'function') pokeRefresh(x,y);
    return true;
  };

  window.pokeInverse = function(x, y, state, count) {
    if (typeof x !== 'number' || typeof y !== 'number') return false;
    if (typeof count === 'number' && count > 1) {
      var endX = x + count;
      for (var xi = x; xi < endX; xi++) _setAttrBit(xi, y, window.ATTR_INVERSE, !!state);
      if (typeof pokeRefreshRow === 'function') pokeRefreshRow(y, x, count);
      else if (typeof pokeRefresh === 'function') for (var xr = x; xr < endX; xr++) pokeRefresh(xr, y);
      return count;
    }
    _setAttrBit(x, y, window.ATTR_INVERSE, !!state);
    if (typeof pokeRefresh === 'function') pokeRefresh(x,y);
    return true;
  };

  window.peekAttr = function(x,y) { return (ATTR && ATTR[y]) ? ATTR[y][x] : undefined; };
  window.peekInverse = function(x,y) {
    if (ATTR && ATTR[y]) return !!(ATTR[y][x] & (window.ATTR_INVERSE || 0x0001));
    if (styleBuffer && styleBuffer[y] && styleBuffer[y][x]) return !!styleBuffer[y][x].inverse;
    return undefined;
  };

  console.log('Step2: pokeInverse/pokeAttrBit/peekAttr installed.');
})();



window.pokeRefresh = function(x, y) {
  // - pokeRefresh()        -> refresh entire screen (fast)
  // - pokeRefresh(x, y)    -> refresh a single cell (fast)
  if (typeof x === 'undefined' && typeof y === 'undefined') {
    for (var ry = 0; ry < H; ry++) {
      var rowRefs = domCellRefs[ry];
      var rowChars = screenBuffer[ry];
      var rowStyles = styleBuffer[ry];
      // local alias for performance
      for (var rx = 0; rx < W; rx++) {
        var el = rowRefs[rx];
        var ch = rowChars[rx];
        el.textContent = (ch === ' ' || ch === '\u00A0') ? '\u00A0' : ch;
        el.className = 'qandy-cell ansi-fg-' + rowStyles[rx].color + ' ansi-bg-' + rowStyles[rx].bgcolor + (rowStyles[rx].bold ? ' ansi-bold' : '') + (rowStyles[rx].inverse ? ' ansi-inverse' : '');
      }
    }
    return true;
  }

  // Single-cell refresh assume x,y are valid numbers and within bounds
  var elCell = domCellRefs[y][x];
  var chCell = screenBuffer[y][x];
  elCell.textContent = (chCell === ' ' || chCell === '\u00A0') ? '\u00A0' : chCell;
  var s = styleBuffer[y][x];
  elCell.className = 'qandy-cell ansi-fg-' + s.color +
                       ' ansi-bg-' + s.bgcolor +
                       (s.bold ? ' ansi-bold' : '') +
                       (s.inverse ? ' ansi-inverse' : '');
  return true;
};

  window.pokeRefreshCell = function(x,y){ return window.pokeRefresh(x,y); };
  window.pokeRefreshScreen = function(){ return window.pokeRefresh(); };


function validateCoords(x, y) {
  return (typeof x === 'number' && typeof y === 'number' && 
          x >= 0 && y >= 0 && x < screenWidth && y < screenHeight);
}

function safeGet(arr, y, x) {
  return (arr && arr[y]) ? arr[y][x] : undefined;
}

function cursor(a) {
  if (a === 1) {
    CURON = 1;
    pokeInverse(CURX, CURY, true);
  } else {
    CURON = 0;
    pokeInverse(CURX, CURY, false);  
  }
}

// Signal that video.js is ready
if (typeof window.qandySignalReady === 'function') {
  window.qandySignalReady('Video');
}
