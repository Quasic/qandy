// ============================================================================
// ADVANCED GRAPHICS PRIMITIVES - Complete drawing toolkit
// ============================================================================

// ============================================================================
// LINE DRAWING - Bresenham's line algorithm
// ============================================================================
window.pokeLine = function(x1, y1, x2, y2, ch, styleObj) {
  var char = (typeof ch === 'string') ? ch : (ch || '█');
  var dx = Math.abs(x2 - x1);
  var dy = Math.abs(y2 - y1);
  var sx = (x1 < x2) ? 1 : -1;
  var sy = (y1 < y2) ? 1 : -1;
  var err = dx - dy;
  var count = 0;
  
  while (true) {
    // Plot point
    if (x1 >= 0 && x1 < screenWidth && y1 >= 0 && y1 < screenHeight) {
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

// ============================================================================
// TEXT WRITING - Write string with optional style
// ============================================================================
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
    if (styleObj) {
      pokeCell(currentX, currentY, char, styleObj);
    } else {
      pokeChar(currentX, currentY, char);
    }
    
    currentX++;
    count++;
  }
  
  return count;
};

// Centered text helper
window.pokeTextCentered = function(y, text, styleObj) {
  var x = Math.floor((screenWidth - text.length) / 2);
  if (x < 0) x = 0;
  return pokeText(x, y, text, styleObj);
};

// Right-aligned text helper
window.pokeTextRight = function(y, text, styleObj) {
  var x = screenWidth - text.length;
  if (x < 0) x = 0;
  return pokeText(x, y, text, styleObj);
};

// ============================================================================
// REGION SCROLLING - Scroll part of screen in any direction
// ============================================================================
window.scrollRegion = function(x, y, width, height, direction, distance, fillChar) {
  distance = distance || 1;
  var fill = fillChar || ' ';
  
  // Validate region
  if (x < 0 || y < 0 || width <= 0 || height <= 0) return false;
  var x2 = Math.min(x + width, screenWidth);
  var y2 = Math.min(y + height, screenHeight);
  
  ensureBuffersAndRow(y2 - 1);
  
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

// Full screen scroll helpers
window.scrollUp = function(lines, fillChar) {
  return scrollRegion(0, 0, screenWidth, screenHeight, 'up', lines || 1, fillChar);
};

window.scrollDown = function(lines, fillChar) {
  return scrollRegion(0, 0, screenWidth, screenHeight, 'down', lines || 1, fillChar);
};

// ============================================================================
// REGION COPYING - Copy/move regions of screen
// ============================================================================
window.copyRegion = function(srcX, srcY, destX, destY, width, height, clearSource) {
  // Validate
  if (srcX < 0 || srcY < 0 || destX < 0 || destY < 0) return false;
  if (width <= 0 || height <= 0) return false;
  
  // Create temporary buffers to hold source data
  var tempChars = [];
  var tempStyles = [];
  
  // Copy source to temp buffers
  for (var row = 0; row < height; row++) {
    tempChars[row] = [];
    tempStyles[row] = [];
    var sRow = srcY + row;
    if (sRow >= screenHeight) break;
    
    ensureBuffersAndRow(sRow);
    
    for (var col = 0; col < width; col++) {
      var sCol = srcX + col;
      if (sCol >= screenWidth) break;
      
      tempChars[row][col] = screenBuffer[sRow][sCol];
      tempStyles[row][col] = Object.assign({}, styleBuffer[sRow][sCol]);
    }
  }
  
  // Clear source if requested
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
    
    ensureBuffersAndRow(dRow);
    
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

// Move region (copy then clear source)
window.moveRegion = function(srcX, srcY, destX, destY, width, height) {
  return copyRegion(srcX, srcY, destX, destY, width, height, true);
};

// ============================================================================
// DOUBLE BUFFERING - Flicker-free animation
// ============================================================================
var backBuffer = null;
var backBufferStyle = null;
var doubleBufferEnabled = false;

window.enableDoubleBuffer = function() {
  if (doubleBufferEnabled) return;
  
  // Create back buffer (clone current screen)
  backBuffer = [];
  backBufferStyle = [];
  
  for (var y = 0; y < screenHeight; y++) {
    backBuffer[y] = new Array(screenWidth);
    backBufferStyle[y] = new Array(screenWidth);
    
    for (var x = 0; x < screenWidth; x++) {
      backBuffer[y][x] = screenBuffer[y] ? screenBuffer[y][x] : ' ';
      backBufferStyle[y][x] = styleBuffer[y] ? Object.assign({}, styleBuffer[y][x]) : 
        { color: 37, bgcolor: 40, bold: false, inverse: false };
    }
  }
  
  doubleBufferEnabled = true;
  
  // Redirect all poke functions to back buffer
  window.screenBuffer = backBuffer;
  window.styleBuffer = backBufferStyle;
};

window.disableDoubleBuffer = function() {
  if (!doubleBufferEnabled) return;
  doubleBufferEnabled = false;
  backBuffer = null;
  backBufferStyle = null;
};

window.swapBuffers = function() {
  if (!doubleBufferEnabled) return;
  
  // Simply call updateDisplay - it reads from current screenBuffer/styleBuffer
  // which is pointing to backBuffer
  updateDisplay();
};

// Alternative: Manual buffer management
window.getBackBuffer = function() {
  return doubleBufferEnabled ? { chars: backBuffer, styles: backBufferStyle } : null;
};

// ============================================================================
// ADDITIONAL SHAPE PRIMITIVES
// ============================================================================

// Circle (using Bresenham's circle algorithm)
window.pokeCircle = function(centerX, centerY, radius, ch, styleObj, fill) {
  var char = ch || '○';
  var count = 0;
  
  if (fill) {
    // Filled circle
    for (var y = -radius; y <= radius; y++) {
      for (var x = -radius; x <= radius; x++) {
        if (x*x + y*y <= radius*radius) {
          var px = centerX + x;
          var py = centerY + y;
          if (px >= 0 && px < screenWidth && py >= 0 && py < screenHeight) {
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
    // Circle outline (Bresenham)
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
        if (px >= 0 && px < screenWidth && py >= 0 && py < screenHeight) {
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

// Rectangle (alternative to box - supports fill)
window.pokeRect = function(x, y, width, height, ch, styleObj, fill) {
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

// ============================================================================
// SCREEN CAPTURE / RESTORE
// ============================================================================
window.captureScreen = function() {
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
      capture.chars[y][x] = screenBuffer[y] ? screenBuffer[y][x] : ' ';
      capture.styles[y][x] = styleBuffer[y] ? Object.assign({}, styleBuffer[y][x]) : 
        { color: 37, bgcolor: 40, bold: false, inverse: false };
    }
  }
  
  return capture;
};

window.restoreScreen = function(capture) {
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
window.floodFill = function(x, y, ch, styleObj) {
  if (x < 0 || y < 0 || x >= screenWidth || y >= screenHeight) return 0;
  
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
    if (px < 0 || py < 0 || px >= screenWidth || py >= screenHeight) continue;
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
// SPRITE SUPPORT - Store and draw character-based sprites
// ============================================================================
window.createSprite = function(data) {
  // data should be array of strings or 2D array
  if (!Array.isArray(data)) return null;
  
  return {
    data: data,
    width: data[0] ? data[0].length : 0,
    height: data.length
  };
};

window.drawSprite = function(sprite, x, y, styleObj, transparent) {
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
// PERFORMANCE PROFILING
// ============================================================================
window.profilePoke = function(testName, iterations, testFunc) {
  var start = performance.now();
  
  beginBatch();
  for (var i = 0; i < iterations; i++) {
    testFunc(i);
  }
  endBatch();
  
  var end = performance.now();
  var time = end - start;
  
  console.log(testName + ': ' + time.toFixed(2) + 'ms (' + 
    (iterations / time * 1000).toFixed(0) + ' ops/sec)');
  
  return time;
};