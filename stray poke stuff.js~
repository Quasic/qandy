
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

    // Build the class list for the character (map your ANSI to classes)
    const classes = [];
    if (style.inverse) {
      classes.push('ansi-inverse');
    } else {
      classes.push(`ansi-fg-${style.color}`);   // adjust names to match your CSS
      classes.push(`ansi-bg-${style.bgcolor}`);
    }
    if (style.bold) classes.push('ansi-bold');

    // Escape char for HTML; keep spaces as &nbsp;
    const escapedChar = (ch === ' ') ? '&nbsp;' :
                        (ch === '&') ? '&amp;' :
                        (ch === '<') ? '&lt;' :
                        (ch === '>') ? '&gt;' :
                        ch;

    // Give each cell an id so it can be updated independently later.
    lineHtml += `<span id="c${y}_${x}" class="${classes.join(' ')}">${escapedChar}</span>`;
  }

  lineHtml += '</span><br>';
  htmlContent += lineHtml;
}

  // Fill remaining visible rows with blank lines if buffer is shorter than screenHeight
  for (let y = rowsToRender; y < screenHeight; y++) {
    htmlContent += `<div class="row">&nbsp;</div>`;
  }

  // Write to DOM in one shot
  txtElement.innerHTML = htmlContent;

  //try {
  //  // Remove previous cursor markers (if any)
  //  const prev = document.querySelectorAll('.qandy-cursor');
  //  for (let p = 0; p < prev.length; p++) prev[p].classList.remove('qandy-cursor');

  //  // Add cursor marker to current cursor position (cursorX, cursorY are logical coords)
  //  if (typeof cursorX === 'number' && typeof cursorY === 'number') {
  //    const curEl = document.getElementById(`c${cursorY}_${cursorX}`);
  //    if (curEl) {
  //      curEl.classList.add('qandy-cursor');
  //    }
  //  }
  //} catch (e) {
  //  // Non-fatal: best-effort only
  //  console.warn('Failed to apply qandy cursor marker', e);
  //}
}


function ensureBuffersAndRow(y) {
  if (!window.screenHeight) window.screenHeight = 25;
  if (!window.screenBuffer) window.screenBuffer = [];
  if (!window.styleBuffer) window.styleBuffer = [];
  if (!window.screenBuffer[y]) {
    window.screenBuffer[y] = new Array(32);
    for (var i = 0; i < 32; i++) window.screenBuffer[y][i] = ' ';
  }
  if (!window.styleBuffer[y]) {
    window.styleBuffer[y] = new Array(32);
    for (var i = 0; i < 32; i++) {
      window.styleBuffer[y][i] = {
        color: (window.currentStyle && window.currentStyle.color) || 37,
        bgcolor: (window.currentStyle && window.currentStyle.bgcolor) || 40,
        bold: false,
        inverse: false
      };
    }
  }
}

function safeGet(arr, y, x) {
  if (!arr) return undefined;
  if (typeof y !== 'number' || typeof x !== 'number') return undefined;
  if (!arr[y]) return undefined;
  return arr[y][x];
}

function updateDomCell(x, y) {
  try {
    var elId = 'c' + y + '_' + x; // qandy's cell id convention (row_col)
    var el = document.getElementById(elId);
    var ch = safeGet(window.screenBuffer, y, x);
    var style = safeGet(window.styleBuffer, y, x);

    // Convert to safe innerHTML; use &nbsp; for spaces/NBSP so it remains visible
    var html;
    if (typeof ch === 'string') {
      if (ch === '\u00A0' || ch === ' ') html = '&nbsp;';
      else html = ch.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
    } else {
      html = '&nbsp;';
    }

    if (el) {
      el.innerHTML = html;
      // apply minimal style hints so the cell looks correct if inverse/bold changed
      if (style && style.inverse) {
        el.style.backgroundColor = '#fff';
        el.style.color = '#000';
      } else {
        el.style.backgroundColor = '';
        el.style.color = '';
      }
      el.style.fontWeight = (style && style.bold) ? 'bold' : '';
      return true;
    } else {
      return false;
    }
  } catch (e) {
    console.error('updateDomCell error:', e);
    return false;
  }
}

// ============================================================================
// OPERATING SYSTEM LEVEL POKE ROUTINES - OPTIMIZED FOR MAXIMUM PERFORMANCE
// ============================================================================

function ensureBuffersAndRow(y) {
  if (!window.screenHeight) window.screenHeight = 25;
  if (!window.screenBuffer) window.screenBuffer = [];
  if (!window.styleBuffer) window.styleBuffer = [];
  if (!window.screenBuffer[y]) {
    window.screenBuffer[y] = new Array(screenWidth);
    for (var i = 0; i < screenWidth; i++) window.screenBuffer[y][i] = ' ';
  }
  if (!window.styleBuffer[y]) {
    window.styleBuffer[y] = new Array(screenWidth);
    for (var i = 0; i < screenWidth; i++) {
      window.styleBuffer[y][i] = {
        color: 37,
        bgcolor: 40,
        bold: false,
        inverse: false
      };
    }
  }
}

// Helper: Fast safe get
function safeGet(arr, y, x) {
  return (arr && arr[y]) ? arr[y][x] : undefined;
}

// ============================================================================
// PRIMARY POKE FUNCTION - Poke character, color, and style all at once
// ============================================================================
window.pokeCell = function(x, y, ch, styleObj) {
  // Validate coordinates
  if (typeof x !== 'number' || typeof y !== 'number') return false;
  if (x < 0 || y < 0 || x >= screenWidth || y >= screenHeight) return false;
  
  ensureBuffersAndRow(y);
  
  // Handle parameter shifting: pokeCell(x, y, styleObj)
  if (typeof ch === 'object' && typeof styleObj === 'undefined') {
    styleObj = ch;
    ch = undefined;
  }
  
  // Getter mode: pokeCell(x, y) returns character
  if (typeof ch === 'undefined' && typeof styleObj === 'undefined') {
    return window.screenBuffer[y][x];
  }
  
  // Update character if provided
  if (typeof ch !== 'undefined') {
    window.screenBuffer[y][x] = (typeof ch === 'string') ? ch : String(ch)[0] || ' ';
  }
  
  // Ensure style exists
  if (!window.styleBuffer[y][x]) {
    window.styleBuffer[y][x] = { color: 37, bgcolor: 40, bold: false, inverse: false };
  }
  
  // Update style if provided
  if (styleObj && typeof styleObj === 'object') {
    var style = window.styleBuffer[y][x];
    if (typeof styleObj.color !== 'undefined') style.color = styleObj.color;
    if (typeof styleObj.bgcolor !== 'undefined') style.bgcolor = styleObj.bgcolor;
    if (typeof styleObj.bold !== 'undefined') style.bold = !!styleObj.bold;
    if (typeof styleObj.inverse !== 'undefined') style.inverse = !!styleObj.inverse;
  }
  
  // Fast DOM update
  updateDomCellInPlace(x, y);
  return true;
};

// ============================================================================
// POKE CHARACTER ONLY - Fastest character-only updates
// ============================================================================
window.pokeChar = function(x, y, ch, count) {
  // Validate
  if (typeof x !== 'number' || typeof y !== 'number') return false;
  if (x < 0 || y < 0 || y >= screenHeight) return false;
  
  // Getter mode
  if (typeof ch === 'undefined') {
    return safeGet(window.screenBuffer, y, x);
  }
  
  // Normalize character
  var char = (typeof ch === 'string') ? ch : String(ch)[0] || ' ';
  
  // Span mode: repeat character across multiple cells
  if (typeof count === 'number' && count > 1) {
    var endX = Math.min(x + count, screenWidth);
    for (var i = x; i < endX; i++) {
      ensureBuffersAndRow(y);
      window.screenBuffer[y][i] = char;
      updateDomCellInPlace(i, y);
    }
    return endX - x; // Return number of cells updated
  }
  
  // Single cell update
  if (x >= screenWidth) return false;
  ensureBuffersAndRow(y);
  window.screenBuffer[y][x] = char;
  updateDomCellInPlace(x, y);
  return true;
};

// ============================================================================
// POKE STYLE ONLY - Update inverse, bold without touching character
// ============================================================================
window.pokeStyle = function(x, y, styleObj, count) {
  // Validate
  if (typeof x !== 'number' || typeof y !== 'number') return false;
  if (x < 0 || y < 0 || y >= screenHeight) return false;
  
  // Getter mode
  if (typeof styleObj === 'undefined') {
    return safeGet(window.styleBuffer, y, x);
  }
  
  // Span mode: apply style across multiple cells
  if (typeof count === 'number' && count > 1) {
    var endX = Math.min(x + count, screenWidth);
    for (var i = x; i < endX; i++) {
      ensureBuffersAndRow(y);
      var style = window.styleBuffer[y][i];
      if (!style) {
        style = window.styleBuffer[y][i] = { color: 37, bgcolor: 40, bold: false, inverse: false };
      }
      if (typeof styleObj.color !== 'undefined') style.color = styleObj.color;
      if (typeof styleObj.bgcolor !== 'undefined') style.bgcolor = styleObj.bgcolor;
      if (typeof styleObj.bold !== 'undefined') style.bold = !!styleObj.bold;
      if (typeof styleObj.inverse !== 'undefined') style.inverse = !!styleObj.inverse;
      updateDomCellInPlace(i, y);
    }
    return endX - x;
  }
  
  // Single cell update
  if (x >= screenWidth) return false;
  ensureBuffersAndRow(y);
  var style = window.styleBuffer[y][x];
  if (!style) {
    style = window.styleBuffer[y][x] = { color: 37, bgcolor: 40, bold: false, inverse: false };
  }
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
  // Validate
  if (typeof x !== 'number' || typeof y !== 'number') return false;
  if (x < 0 || y < 0 || y >= screenHeight) return false;
  
  // Getter mode: return {fg, bg}
  if (typeof fgColor === 'undefined') {
    var style = safeGet(window.styleBuffer, y, x);
    return style ? { fg: style.color, bg: style.bgcolor } : undefined;
  }
  
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


function ensureBuffersAndRow(y) {
  if (!window.screenHeight) window.screenHeight = 25;
  if (!window.screenBuffer) window.screenBuffer = [];
  if (!window.styleBuffer) window.styleBuffer = [];
  if (!window.screenBuffer[y]) {
    window.screenBuffer[y] = new Array(32);
    for (var i = 0; i < 32; i++) window.screenBuffer[y][i] = ' ';
  }
  if (!window.styleBuffer[y]) {
    window.styleBuffer[y] = new Array(32);
    for (var i = 0; i < 32; i++) {
      window.styleBuffer[y][i] = {
        color: (window.currentStyle && window.currentStyle.color) || 37,
        bgcolor: (window.currentStyle && window.currentStyle.bgcolor) || 40,
        bold: !!(window.currentStyle && window.currentStyle.bold),
        inverse: !!(window.currentStyle && window.currentStyle.inverse)
      };
    }
  }
}

function safeGet(arr, y, x) {
  if (!arr) return undefined;
  if (typeof y !== 'number' || typeof x !== 'number') return undefined;
  if (!arr[y]) return undefined;
  return arr[y][x];
}

// Remove existing ansi-fg-* and ansi-bg-* classes from el
function removeAnsiColorClasses(el) {
  if (!el || !el.classList) return;
  var toRemove = [];
  el.classList.forEach(function (c) {
    if (/^ansi-fg-\d+$/.test(c) || /^ansi-bg-\d+$/.test(c)) toRemove.push(c);
  });
  toRemove.forEach(function (c) { el.classList.remove(c); });
}

// New: setCellStyle(x,y, styleObj) updates styleBuffer and DOM (no char change)
window.setCellStyle = function (x, y, styleObj) {
  if (typeof x !== 'number' || typeof y !== 'number') {
    throw new Error('setCellStyle requires numeric x,y: setCellStyle(x,y, { color:.., bgcolor:.., bold:.., inverse:.. })');
  }
  ensureBuffersAndRow(y);
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
  if (typeof styleObj.color !== 'undefined') row[x].color = styleObj.color;
  if (typeof styleObj.bgcolor !== 'undefined') row[x].bgcolor = styleObj.bgcolor;
  if (typeof styleObj.bold !== 'undefined') row[x].bold = !!styleObj.bold;
  if (typeof styleObj.inverse !== 'undefined') row[x].inverse = !!styleObj.inverse;

   // If prevCursor points here, update it so cursor restore won't clobber style
  //try {
  //  if (window.prevCursor && window.prevCursor.set && window.prevCursor.x === x && window.prevCursor.y === y) {
  //    window.prevCursor.style = Object.assign({}, row[x]);
  //  }
  //} catch (e) { /* ignore */ }

   // update DOM or fallback
  var domUpdated = updateDomCellInPlace(x, y);
  if (!domUpdated && typeof updateDisplay === 'function') {
    try { updateDisplay(); domUpdated = true; } catch (e) { /* ignore */ }
  }
  return domUpdated;
};

function validateCoords(x, y) {
  return (typeof x === 'number' && typeof y === 'number' && 
          x >= 0 && y >= 0 && x < screenWidth && y < screenHeight);
}

function safeGet(arr, y, x) {
  return (arr && arr[y]) ? arr[y][x] : undefined;
}

window.pokeCell = function(x, y, ch, styleObj) {
  // Fast coordinate validation only
  if (!validateCoords(x, y)) return false;
  
  // Handle parameter shifting: pokeCell(x, y, styleObj)
  if (typeof ch === 'object' && typeof styleObj === 'undefined') {
    styleObj = ch;
    ch = undefined;
  }
  
  // Getter mode: pokeCell(x, y) returns character
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

 
window.setCellStyle = window.setCellStyle; // already set above
window.poke = function (x, y, ch, styleObj) { return window.pokeCell(x, y, ch, styleObj); };
window.peek = function (x, y) { return safeGet(window.screenBuffer, y, x); };

function ensureRow(y) {
  if (!window.screenBuffer) window.screenBuffer = [];
  if (!window.styleBuffer) window.styleBuffer = [];
  if (!window.screenBuffer[y]) {
    window.screenBuffer[y] = new Array(32);
    for (var i = 0; i < 32; i++) window.screenBuffer[y][i] = ' ';
  }
  if (!window.styleBuffer[y]) {
    window.styleBuffer[y] = new Array(32);
    for (var i = 0; i < 32; i++) {
      window.styleBuffer[y][i] = {
        color: (window.currentStyle && window.currentStyle.color) || 37,
        bgcolor: (window.currentStyle && window.currentStyle.bgcolor) || 40,
        bold: false,
        inverse: false
      };
    }
  }
}

function renderCellToDOM(x, y) {
  try {
    var elId = 'c' + y + '_' + x;
    var el = document.getElementById(elId);
    var ch = safeGet(window.screenBuffer, y, x);
    var style = safeGet(window.styleBuffer, y, x);
     // Normalize character for visible HTML
    var safeText;
    if (typeof ch === 'string') {
      if (ch === '\u00A0' || ch === ' ') safeText = '&nbsp;';
      else safeText = escapeHtml(ch);
    } else {
      safeText = '&nbsp;';
    }
     if (el) {
      // apply text
      el.innerHTML = safeText;
       // apply simple style hints
      if (style && style.inverse) {
        el.style.backgroundColor = '#fff';
        el.style.color = '#000';
      } else {
        el.style.backgroundColor = '';
        el.style.color = '';
      }
      el.style.fontWeight = style && style.bold ? 'bold' : '';
      return true;
    } else {
      // fallback: if an updateDisplay function exists, use it to re-render everything
      if (typeof updateDisplay === 'function') {
        try { updateDisplay(); return true; } catch (e) { /* fallthrough */ }
      }
      // else do nothing but return false to indicate DOM not updated in place
      return false;
    }
  } catch (e) {
    console.error('renderCellToDOM error:', e);
    return false;
  }
}

function escapeHtml(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

function safeGet(arr, y, x) {
  if (!arr) return undefined;
  if (typeof y !== 'number' || typeof x !== 'number') return undefined;
  if (!arr[y]) return undefined;
  return arr[y][x];
}


// Main pokeCell: if ch is provided -> set; if not provided -> return current char
window.pokeCell = function (x, y, ch) {
  if (typeof x !== 'number' || typeof y !== 'number') {
    throw new Error('pokeCell requires numeric x,y coordinates: pokeCell(x,y[,ch])');
  }
   // ensure buffers for that row exist
  if (!window.screenBuffer || !window.styleBuffer) {
    // best-effort: initialize minimal screen if missing
    if (!window.screenHeight) window.screenHeight = 30;
    if (!window.screenBuffer) window.screenBuffer = [];
    if (!window.styleBuffer) window.styleBuffer = [];
  }
  ensureRow(y);
   if (typeof ch === 'undefined') {
    // getter: return the stored character (may be undefined)
    return safeGet(window.screenBuffer, y, x);
  } else {
    // setter: accept only single-character strings (or NBSP)
    if (typeof ch !== 'string' || ch.length === 0) {
      // allow explicit NBSP code
      if (ch === '\u00A0') {
        // ok
      } else {
        // coerce to string and take first codepoint
        ch = String(ch)[0] || ' ';
      }
    }
    // store into buffer (row-major screenBuffer[y][x])
    window.screenBuffer[y][x] = ch;
     // ensure style exists for that cell
    if (!window.styleBuffer[y][x]) {
      window.styleBuffer[y][x] = {
        color: (window.currentStyle && window.currentStyle.color) || 37,
        bgcolor: (window.currentStyle && window.currentStyle.bgcolor) || 40,
        bold: false,
        inverse: false
      };
    }
     // update DOM cell if possible
    var ok = renderCellToDOM(x, y);
     // if DOM cell wasn't found or render failure, try full redraw updateDisplay if available
    if (!ok && typeof updateDisplay === 'function') {
      try { updateDisplay(); ok = true; } catch (e) { /* ignore */ }
    }
     return ok;
  }
};

// Provide PEEK/POKE proxies for linear addressing: addr = y*screenWidth + x
function addrToXY(addr) {
  var y = Math.floor(addr / 32);
  var x = addr - (y * 32);
  return { x: x, y: y };
}

// PEEK proxy (read-only)
window.PEEK = new Proxy({}, {
  get: function (target, prop) {
    var a = Number(prop);
    if (isNaN(a)) return undefined;
    var p = addrToXY(a);
    return safeGet(window.screenBuffer, p.y, p.x);
  },
  has: function() { return true; }
});

// POKE proxy (write)
window.POKE = new Proxy({}, {
  set: function (target, prop, value) {
    var a = Number(prop);
    if (isNaN(a)) {
      // ignore non-numeric props
      target[prop] = value;
      return true;
    }
    var p = addrToXY(a);
    try {
      // call our pokeCell setter
      window.pokeCell(p.x, p.y, value);
    } catch (e) {
      console.error('POKE set error for addr', a, e);
    }
    return true;
  },
  get: function(target, prop) {
    var a = Number(prop);
    if (isNaN(a)) return undefined;
    var p = addrToXY(a);
    return safeGet(window.screenBuffer, p.y, p.x);
  }
});
 
// Usage examples (console):
//   peekCell(10,5)        // returns object with character, codepoint, style, DOM info
//   peekAddr(350)         // converts linear addr -> (x,y) then returns same object
//   peekLog(10,5)         // prints a one-line summary + full object

function peekCell(x,y) {
  // avoid clobbering if already installed
  if (window.peekCellInstalled) return;
  window.peekCellInstalled = true;

  function safeGet(arr, y, x) {
    if (!arr) return undefined;
    if (typeof y !== 'number' || typeof x !== 'number') return undefined;
    if (!arr[y]) return undefined;
    return arr[y][x];
  }

  function normChar(ch) {
    if (typeof ch !== 'string') return { raw: ch, display: String(ch) };
    if (ch === '\u00A0') return { raw: ch, display: '<NBSP>' };
    if (ch === '\n') return { raw: ch, display: '<LF>' };
    if (ch === '\r') return { raw: ch, display: '<CR>' };
    if (ch.length === 0) return { raw: ch, display: '<EMPTY>' };
    var cp = ch.codePointAt(0);
    if (cp < 32 || (cp >= 0x7F && cp <= 0x9F)) {
      return { raw: ch, display: '<CTRL U+' + cp.toString(16).toUpperCase().padStart(4, '0') + '>' };
    }
  }
}

function cursorMoveTo(nx, ny) {
  const old = { x: cursorX, y: cursorY };
  cursorX = Math.max(0, Math.min(screenWidth - 1, nx));
  cursorY = Math.max(0, Math.min(screenHeight - 1, ny));
  if (cursorOn) {
    // restore old cell
    //if (prevCursor.set && styleBuffer[old.y] && styleBuffer[old.y][old.x]) {
    //  styleBuffer[old.y][old.x].inverse = prevCursor.inverse;
    //  pokeCell(old.x, old.y);
    //}
    // mark new one
    if (!styleBuffer[cursorY]) {
      styleBuffer[cursorY] = [];
      for (let x = 0; x < screenWidth; x++) {
        styleBuffer[cursorY][x] = {
          color: currentStyle.color,
          bgcolor: currentStyle.bgcolor,
          bold: currentStyle.bold,
          inverse: currentStyle.inverse
        };
      }
    }
    // prevCursor = { set: true, x: cursorX, y: cursorY, inverse: !!styleBuffer[cursorY][cursorX].inverse };
    pokeInverse(old.x, old.y, false);
    pokeInverse(cursorX, cursorY, true);
  } else {
    // cursor isn't shown — just update logical coords
  }
}

function cls() { 
  const defaultColor = (currentStyle && currentStyle.color) ? currentStyle.color : 37;
  const defaultBg    = (currentStyle && currentStyle.bgcolor) ? currentStyle.bgcolor : 40;
  const clearStyle   = { color: defaultColor, bgcolor: defaultBg, bold: false, inverse: false };
  for (let y = 0; y < screenHeight; y++) {
    pokeChar(0, y, ' ', screenWidth);
    pokeStyle(0, y, clearStyle, screenWidth);
  }
  cursorX = 0;
  cursorY = 0;
  try { document.querySelectorAll('.qandy-cursor').forEach(el => el.classList.remove('qandy-cursor')); } catch (e) {}
}

