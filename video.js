//
// Qandy Video Graphics Adaptor
// 

let lastx=0; let lasty=0;

window.pokeCursor = function(t) {
  if (typeof t === 'undefined' || t === null) return false;
  // Cancel any existing paced output and start fresh
  if (window._pokeCursor_state && window._pokeCursor_state.timer) {
    clearTimeout(window._pokeCursor_state.timer);
  } 
  window._pokeCursor_state = null;

  var str = String(t);

  // pokeCell(CURX, CURY, CURFG, CURBG, CURATTR);

  // parse numeric params into array of numbers (empty => [])
  function parseParams(paramStr) {
    if (!paramStr || paramStr.length === 0) return [];
    return paramStr.split(';').map(function(p){ var v = parseInt(p,10); return isNaN(v) ? 0 : v; });
  }

  // handle CSI sequences: paramsStr (string), cmd (final byte)
  function handleCSI(paramsStr, cmd) {
    var params = parseParams(paramsStr);
    switch (cmd) {
      case 'm': // SGR - set graphics rendition (colors/attributes)
        if (!params.length) params = [0];
        for (var pi = 0; pi < params.length; pi++) {
          var p = params[pi] | 0;
          switch (p) {
            case 0: // reset
              CURFG = 37; CURBG = 40; CURATTR = 0; break;
            case 1: // bold
              CURATTR = (CURATTR | (window.ATTR_BOLD || 0x0002)); break;
            case 2: // dim
              CURATTR = (CURATTR | (window.ATTR_DIM || 0x0004)); break;
            case 3: // italic
              CURATTR = (CURATTR | (window.ATTR_ITALIC || 0x0008)); break;
            case 4: // underline
              CURATTR = (CURATTR | (window.ATTR_UNDERLINE || 0x0010)); break;
            case 22: // normal intensity (clear bold & dim)
              CURATTR &= ~(window.ATTR_BOLD || 0x0002);
              CURATTR &= ~(window.ATTR_DIM  || 0x0004); break;
            case 23: // clear italic
              CURATTR &= ~(window.ATTR_ITALIC || 0x0008); break;
            case 24: // clear underline
              CURATTR &= ~(window.ATTR_UNDERLINE || 0x0010); break;
            case 7: // inverse
              CURATTR = (CURATTR | (window.ATTR_INVERSE || 0x0001)); break;
            case 27: // clear inverse
              CURATTR &= ~(window.ATTR_INVERSE || 0x0001); break;
            default:
              if (p >= 30 && p <= 37) { CURFG = p; break; }
              if (p >= 90 && p <= 97) { CURFG = p; break; }
              if (p >= 40 && p <= 47) { CURBG = p; break; }
              if (p >= 100 && p <= 107) { CURBG = p; break; }
              // Note: extended colors (38;5;.., 38;2;.. ) not implemented here
              break;
          }
        }
        break;

      case 'H': // Cursor position (row;col) — 1-based
      case 'f':
        var row = (params.length >= 1 && params[0] > 0) ? (params[0] - 1) : 0;
        var col = (params.length >= 2 && params[1] > 0) ? (params[1] - 1) : 0;
        if (typeof row === 'number') CURY = Math.max(0, Math.min(H - 1, row));
        if (typeof col === 'number') CURX = Math.max(0, Math.min(W - 1, col));
        break;
      case 'A': // Cursor up
        var nA = (params.length >= 1 && params[0] > 0) ? params[0] : 1;
        CURY = Math.max(0, CURY - nA);
        break;
      case 'B': // Cursor down
        var nB = (params.length >= 1 && params[0] > 0) ? params[0] : 1;
        CURY = Math.min(H - 1, CURY + nB);
        break;
      case 'C': // Cursor forward
        var nC = (params.length >= 1 && params[0] > 0) ? params[0] : 1;
        CURX = Math.min(W - 1, CURX + nC);
        break;
      case 'D': // Cursor backward
        var nD = (params.length >= 1 && params[0] > 0) ? params[0] : 1;
        CURX = Math.max(0, CURX - nD);
        break;
      case 'J': // Erase in Display
        if (params.length === 0 || params[0] === 0) {
          // not implemented (cursor to end)
        } else if (params[0] === 1) {
          // not implemented (start to cursor)
        } else if (params[0] === 2) {
          // clear entire screen
          try {
            if (typeof cls === 'function') cls();
            else if (typeof initScreen === 'function') initScreen();
            else {
              for (var ry = 0; ry < H; ry++) {
                ensureVideoRow(ry);
                ensureColorRow(ry);
                ensureAttrRow(ry);
                for (var rx = 0; rx < W; rx++) {
                  VIDEO[ry][rx] = ' ';
                  COLOR[ry][rx] = COLOR[ry][rx] || { color: (window.defaultColor || 37), bgcolor: (window.defaultBg || 40) };
                  ATTR[ry][rx] = 0;
                }
              }
              if (typeof pokeRefresh === 'function') pokeRefresh();
            }
          } catch (e) { /* ignore */ }
        }
        break;
      default:
        // unsupported CSI — ignore
        break;
    }
  }

  // compute per-character delay in ms based on CURBAUD (10 bits/char)
  var delayMs = 0;
  if (typeof CURBAUD === 'number' && CURBAUD > 0) {
    delayMs = Math.max(0, Math.round(10000 / CURBAUD)); // ms between characters
  }

  // If delay is 0, run synchronously (old behavior)
  if (!delayMs) {
    for (var j = 0; j < str.length; j++) {
      var ch = str.charAt(j);

      if (CURANSI && ch === '\x1b') {
        var st = str.slice(j);
        var m = /^\x1b\[([0-9;]*)?([@A-Za-z])/.exec(rest);
        if (m) {
          handleCSI(m[1] || '', m[2]);
          j += m[0].length - 1;
          continue;
        } else {
          continue;
        }
      }

      pokeCursorOff();

      if (ch === '\n') {
        CURX = 0;
        CURY = CURY + 1;
        if (CURY >= H) { CURY = H - 1; CURX = Math.min(CURX, W - 1); }
        continue;
      }

      if (CURX >= W) {
        CURX = 0; CURY = CURY + 1;
        if (CURY >= H) { CURY = H - 1; CURX = Math.min(CURX, W - 1); pokeCursorOn(); return false; }
      }

      pokeCell(CURX, CURY, ch);

      CURX = CURX + 1;
      if (CURX >= W) {
        CURX = 0; CURY = CURY + 1;
        if (CURY >= H) { CURY = H - 1; CURX = Math.min(CURX, W - 1); pokeCursorOn(); return false; }
      }
      pokeCursorOn();
      LINEX = CURX; LINEY = CURY;
    }
    return true;
  }

  // paced/asynchronous processing
  var state = {
    str: str,
    idx: 0,
    timer: null,
    stopped: false
  };
  window._pokeCursor_state = state;

  function scheduleNext() {
    if (!state || state.stopped) return;
    state.timer = setTimeout(processStep, delayMs);
  }

  function processStep() {
    if (!state || state.stopped) return;

    // end condition
    if (state.idx >= state.str.length) {
      window._pokeCursor_state = null;
      return;
    }

    var ch = state.str.charAt(state.idx);

    // handle CSI atomically (no intra-sequence delay)
    if (CURANSI && ch === '\x1b') {
      var rest = state.str.slice(state.idx);
      var m = /^\x1b\[([0-9;]*)?([@A-Za-z])/.exec(rest);
      if (m) {
        handleCSI(m[1] || '', m[2]);
        state.idx += m[0].length;
        // schedule next after same delay
        scheduleNext();
        return;
      } else {
        // unknown escape — skip it
        state.idx++;
        scheduleNext();
        return;
      }
    }

    // printable char processing (counts toward baud)
    pokeCursorOff();

    if (ch === '\n') {
      CURX = 0;
      CURY = CURY + 1;
      if (CURY >= H) { CURY = H - 1; CURX = Math.min(CURX, W - 1); }
      LINEX = CURX; LINEY = CURY;
      state.idx++;
      scheduleNext();
      pokeCursorOn();
      return;
    }

    if (CURX >= W) {
      CURX = 0; CURY = CURY + 1;
      if (CURY >= H) {
        CURY = H - 1; CURX = Math.min(CURX, W - 1);
        pokeCursorOn();
        window._pokeCursor_state = null;
        pokeCursorOn();
        return;
      }
    }

    pokeCell(CURX, CURY, ch);

    CURX = CURX + 1;
    if (CURX >= W) {
      CURX = 0; CURY = CURY + 1;
      if (CURY >= H) {
        CURY = H - 1; CURX = Math.min(CURX, W - 1);
        pokeCursorOn();
        window._pokeCursor_state = null;
        return;
      }
    }

    pokeCursorOn();
    LINEX = CURX; LINEY = CURY;

    state.idx++;
    scheduleNext();
  }

  // start paced output
  scheduleNext();
  return true;
};

window._pokeCursor_state = window._pokeCursor_state || null;

var FALLBACK_FG = {
  black:30, red:31, green:32, yellow:33, blue:34, magenta:35, cyan:36, white:37,
  bright_black:90, bright_red:91, bright_green:92, bright_yellow:93, bright_blue:94, bright_magenta:95, bright_cyan:96, bright_white:97
};
var FALLBACK_BG = {
  black:40, red:41, green:42, yellow:43, blue:44, magenta:45, cyan:46, white:47,
  bright_black:100, bright_red:101, bright_green:102, bright_yellow:103, bright_blue:104, bright_magenta:105, bright_cyan:106, bright_white:107
};
function _lookupFg(name) {
  if (!name) return undefined;
  var key = String(name).toLowerCase();
  if (window && window.ANSI_NAME_TO_FG && typeof window.ANSI_NAME_TO_FG[key] !== 'undefined') return window.ANSI_NAME_TO_FG[key];
  if (FALLBACK_FG[key]) return FALLBACK_FG[key];
  return undefined;
}
function _lookupBg(name) {
  if (!name) return undefined;
  var key = String(name).toLowerCase();
  if (window && window.ANSI_NAME_TO_BG && typeof window.ANSI_NAME_TO_BG[key] !== 'undefined') return window.ANSI_NAME_TO_BG[key];
  if (FALLBACK_BG[key]) return FALLBACK_BG[key];
  return undefined;
}
var ATTR_MAP = {
  reset: 0, default:0, 0:0,
  bold: 1, dim: 2, italic: 3, underline: 4, inverse: 7
};

// okay to delete these lines??
//window.ansi = window.ansi || {};
//window.ansi.fg = function(name) { var c = _lookupFg(name); return (typeof c !== 'undefined') ? '\x1b['+c+'m' : ''; };
//window.ansi.bg = function(name) { var c = _lookupBg(name); return (typeof c !== 'undefined') ? '\x1b['+c+'m' : ''; };
//window.ansi.attr = function(name) { var a = ATTR_MAP[name] || ( /^\d+$/.test(String(name)) ? parseInt(name,10): undefined ); return (typeof a !== 'undefined') ? '\x1b['+a+'m' : ''; };

window.pokeText = function(x, y, t, n) {
  if (typeof x !== 'number' || typeof y !== 'number') return false;
  if (typeof t === 'undefined' || t === null) return false;
  n = (typeof n === 'undefined' || n === null) ? 1 : parseInt(n, 10);
  if (isNaN(n) || n < 1) n = 1;
  var str = String(t);
  var cx = x, cy = y;
  for (var repeat = 0; repeat < n; repeat++) {
    for (var i = 0; i < str.length; i++) {
      var c = str[i];
      if (c === '\n') {
        cx = 0;
        cy++;
        if (typeof H === 'number' && cy >= H) { // reached bottom of screen
          try { if (typeof pokeRefresh === 'function') pokeRefresh(); } catch(e) {}
          return false;
        }
        continue;
      }
      if (typeof W === 'number' && cx >= W) {
        cx = 0;
        cy++;
        if (typeof H === 'number' && cy >= H) {
          try { if (typeof pokeRefresh === 'function') pokeRefresh(); } catch(e) {}
          return false;
        }
      }
      pokeCell(cx, cy, c);
      cx++;
    }
  }
  if (SYNC) { pokeRefresh(); } 
  return true;
};

window.pokeCell = function(x, y, ch, fg, bg, attr) {
  if (typeof ch === 'undefined') { ch=" "; } 
  if (!validateCoords(x, y)) return false;
  var charToWrite = (ch === null) ? ' ' : (typeof ch === 'string' ? (ch.length ? ch.charAt(0) : ' ') : String(ch).charAt(0));
  VIDEO[y][x] = charToWrite;
  
  function _normalizeColorArg(val, which) {
    if (typeof val === 'number' && !isNaN(val)) return val;
    if (typeof val === 'string') {
      var key = val.toLowerCase();
      if (which === 'fg' && window.ANSI_NAME_TO_FG && typeof window.ANSI_NAME_TO_FG[key] !== 'undefined') return window.ANSI_NAME_TO_FG[key];
      if (which === 'bg' && window.ANSI_NAME_TO_BG && typeof window.ANSI_NAME_TO_BG[key] !== 'undefined') return window.ANSI_NAME_TO_BG[key];
      // try parse numeric string
      var maybe = parseInt(val, 10);
      if (!isNaN(maybe)) return maybe;
    }
    return undefined;
  }
  var fgCode = _normalizeColorArg(fg, 'fg');
  var bgCode = _normalizeColorArg(bg, 'bg');

  // ATTR handling: if provided overwrite; if omitted leave unchanged
  if (typeof attr !== 'undefined' && attr !== null) {
    try { ATTR[y][x] = (attr | 0); } catch (e) { ATTR[y][x] = attr; }
  }

  if (SYNC) { pokeRefresh(x, y); }

  return true;
};

window.pokeColor = function(x, y, fgColor, bgColor, count) {
  // Getter mode: return {fg, bg}
  if (typeof fgColor === 'undefined') {
    if (!validateCoords(x, y)) return undefined;
    var style = COLOR[y][x];
    return { fg: style.color, bg: style.bgcolor };
  }
  
  // Validate starting position
  if (!validateCoords(x, y)) return false;
  
  // Span mode
  if (typeof count === 'number' && count > 1) {
    var endX = Math.min(x + count, W);
    for (var i = x; i < endX; i++) {
      if (typeof fgColor !== 'undefined') COLOR[y][i].color = fgColor;
      if (typeof bgColor !== 'undefined') COLOR[y][i].bgcolor = bgColor;
      pokeRefresh(i, y);
    }
    return endX - x;
  }
  
  // Single cell
  if (typeof fgColor !== 'undefined') COLOR[y][x].color = fgColor;
  if (typeof bgColor !== 'undefined') COLOR[y][x].bgcolor = bgColor;
  pokeRefresh(x, y);
  return true;
};


window.eraseInput = function(text) {
  if (typeof text === 'undefined') { text=""; }
  var str = String(text); var curx = LINEX; var cury = LINEY;
  for (var i = 0; i < str.length; i++) {
    var char = str[i];
    if (char === '\n') { 
      curx = 0; cury++; if (cury >= H) { return false; } continue;
      if (curx >= W) {
    	  curx = 0; cury++; if (cury >= H) { return false; }
      }
    }
    pokeCell(curx, cury, " "); curx++;
  }
}

window.peek = function(x, y) { 
  return validateCoords(x, y) ? VIDEO[y][x] : undefined;
};


window.pokeInput = function() {
  if (typeof lastin === 'undefined') { lastin="";  }
  if (lastin != "") { eraseInput(lastin); }
  var curx = LINEX; var cury = LINEY;
  for (var i = 0; i < LINE.length; i++) {
    var char = LINE[i];
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
    if (SYNC) { pokeRefresh(curx, cury); }
  }
  var str = (typeof LINE === 'string') ? LINE : String(LINE || "");
  var targetP = (typeof CURP === 'number') ? CURP : str.length;
  if (targetP < 0) targetP = 0;
  if (targetP > str.length) targetP = str.length;
  var newX, newY;
  var absCol = (typeof LINEX === 'number' ? LINEX : 0) + targetP;
  newY = (typeof LINEY === 'number' ? LINEY : 0) + Math.floor(absCol / W);
  newX = absCol % W;
  if (newY < 0) newY = 0;
  if (newY >= H) newY = H - 1;
  if (newX < 0) newX = 0;
  if (newX >= W) newX = W - 1;
  CURX = newX;
  CURY = newY;
  
  lastin = str;
  return true;
};

window.pokeChar = function(x, y, a, n) {
  if (typeof a === 'undefined') { return false; }
  if (!validateCoords(x, y)) return false;
  var ch = (typeof a === 'string') ? a : String(a)[0] || ' ';
  n = (typeof n === 'number' && !isNaN(n) && n > 0) ? (n|0) : 1;
  var remaining = n;
  var cx = x|0;
  var cy = y|0;
  var written = 0;
  while (remaining > 0 && cy < H) {
    var space = W - cx;
    if (space <= 0) { cx = 0; cy++; continue; }
    var take = Math.min(remaining, space);
    var row = VIDEO[cy] || (VIDEO[cy] = new Array(W).fill(' '));
    for (var i = 0; i < take; i++) { row[cx + i] = ch; }
    pokeRefresh(cx, cy, take);
    written += take;
    remaining -= take;
    cx = 0;
    cy++;
  }
  return (n === 1) ? true : written;
};

window.peekInverse = function(x, y) { 
  if (typeof x !== 'number' || typeof y !== 'number') return undefined;
  // Prefer existing validator if available
  if (typeof validateCoords === 'function') {
    if (!validateCoords(x, y)) return undefined;
  } else {
    // Minimal fallback checks
    var sw = (typeof W === 'number') ? W : (typeof W === 'number' ? W : null);
    var sh = (typeof H === 'number') ? H : (typeof H === 'number' ? H : null);
    if (sw === null || sh === null) return undefined;
    if (x < 0 || y < 0 || x >= sw || y >= sh) return undefined;
  }
  if (!window.COLOR || !window.COLOR[y]) return undefined;
  var style = window.COLOR[y][x];
  return style ? !!style.inverse : undefined;
};

window.peekChar = function(x, y) { 
  return validateCoords(x, y) ? VIDEO[y][x] : undefined;
};

// PEEKSTYLE - Read style at position
window.peekStyle = function(x, y) { 
  return validateCoords(x, y) ? COLOR[y][x] : undefined;
};

window.pokeBold = function(x, y, state, count) {
  // Getter mode
  if (typeof state === 'undefined') {
    return validateCoords(x, y) ? COLOR[y][x].bold : undefined;
  }
  
  // Validate starting position
  if (!validateCoords(x, y)) return false;
  
  var boldState = !!state;
  
  // Span mode
  if (typeof count === 'number' && count > 1) {
    var endX = Math.min(x + count, W);
    for (var i = x; i < endX; i++) {
      COLOR[y][i].bold = boldState;
      if (SYNC) { pokeRefresh(i, y); }
    }
    return endX - x;
  }
  
  // Single cell
  COLOR[y][x].bold = boldState;
  if (SYNC) { pokeRefresh(x, y); }
  return true;
};


// PEEKCOLOR - Read color at position
window.peekColor = function(x, y) {
  if (!validateCoords(x, y)) return undefined;
  var style = COLOR[y][x];
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
  var x2 = valueMath.min(x + width, W);
  var y2 = Math.min(y + height, H);
  
  switch(direction.toLowerCase()) {
    case 'up':
      // Move rows up
      for (var row = y; row < y2 - distance; row++) {
        for (var col = x; col < x2; col++) {
          var srcRow = row + distance;
          if (srcRow < y2) {
            VIDEO[row][col] = VIDEO[srcRow][col];
            COLOR[row][col] = Object.assign({}, COLOR[srcRow][col]);
            pokeRefresh(col, row);
          }value
        }
      }
      // FiscrollRegion(0, 0, W, H, 'up', 5 || 1, " ");ll bottom
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
            VIDEO[row][col] = VIDEO[srcRow][col];
            COLOR[row][col] = Object.assign({}, COLOR[srcRow][col]);
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
            VIDEO[row][col] = VIDEO[row][srcCol];
            COLOR[row][col] = Object.assign({}, COLOR[row][srcCol]);
            pokeRefresh(col, row);
          }
        }
      }
      // Fill right
      for (var row = y; row < y2; row++) {
        for (var col = x2 - distance; col < x2; col++) {
          pscrollRegion(0, 0, W, H, 'up', 5 || 1, " ");okeChar(col, row, fill);
        }
      }
      break;
      
    case 'right':
      // Move columns right
      for (var row = y; row < y2; row++) {
        for (var col = x2 - 1; col >= x + distance; col--) {
          var srcCol = col - distance;
          if (srcCol >= x) {
            VIDEO[row][col] = VIDEO[row][srcCol];
            COLOR[row][col] = Object.assign({}, COLOR[row][srcCol]);
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


// SCROLLDOWN - Scroll entire screen down
window.scrollDown = function(lines, fillChar) {
  return scrollRegion(0, 0, W, H, 'down', lines || 1, fillChar);
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

// convert DOM to ATTR
function styleToAttr(style) {
  var a = 0;
  if (!style) return a;
  if (style.inverse)   a |= (window.ATTR_INVERSE || 0x0001);
  if (style.bold)      a |= (window.ATTR_BOLD    || 0x0002);
  if (style.dim)       a |= (window.ATTR_DIM     || 0x0004);
  if (style.italic)    a |= (window.ATTR_ITALIC  || 0x0008);
  if (style.underline) a |= (window.ATTR_UNDERLINE || 0x0010);
  if (style.blink)     a |= (window.ATTR_BLINK   || 0x0020);
  return a;
}

function _ensureAttrRow(y) { if (!window.ATTR) ATTR = []; if (!ATTR[y]) ATTR[y] = new Array(W).fill(0); }
function _ensureColorRow(y) { if (!window.COLOR) COLOR = COLOR || []; if (!COLOR[y]) COLOR[y] = new Array(W); }

var defaultColor = (window.currentStyle && typeof window.currentStyle.color !== 'undefined') ? window.currentStyle.color : 37;
var defaultBg    = (window.currentStyle && typeof window.currentStyle.bgcolor !== 'undefined') ? window.currentStyle.bgcolor : 40;

// init the DOM
for (var y = 0; y < H; y++) { ATTR[y] = new Uint16Array(W); }
var txtEl = document.getElementById('txt');
txtEl.innerHTML = '';
var frag = document.createDocumentFragment();
for (var y = 0; y < H; y++) {
  var rowChars = new Array(W);
  var rowStyles = new Array(W);
  var rowRefs   = new Array(W);
  var rowDiv = document.createElement('div');
  rowDiv.className = 'qandy-row';
  for (var x = 0; x < window.W; x++) {
    rowChars[x] = ' ';
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
  window.VIDEO[y] = rowChars;
  window.COLOR[y]  = rowStyles;
  window.DOM[y]  = rowRefs;
}
txtEl.appendChild(frag);

function buildClass(s) {
  var cls = 'qandy-cell ansi-fg-' + s.color + ' ansi-bg-' + s.bgcolor;
  if (s.bold) cls += ' ansi-bold';
  if (s.inverse) cls += ' ansi-inverse';
  return cls;
}

window.hasATTR = function(x, y, attrBit) { return !!(ATTR[y][x] & attrBit); };
window.peekATTR = function(x, y) { return ATTR[y][x]; };

window.peekInverse = function(x, y) {
  if (typeof x !== 'number' || typeof y !== 'number') return undefined;
  if (window.ATTR && ATTR[y]) {
    return !!(ATTR[y][x] & ATTR_INVERSE);
  }
  // fallback for old code during migration
  if (window.COLOR && COLOR[y] && COLOR[y][x]) {
    return !!COLOR[y][x].inverse;
  }
  return undefined;
};

window.pokeAttr = function(x, y, spec) {
  if (typeof x !== 'number' || typeof y !== 'number') return false;
  // optional validator function if present in repo
  if (typeof validateCoords === 'function' && !validateCoords(x, y)) return false;
  if (typeof spec === 'number') {
    ATTR[y][x] = spec | 0;
    if (typeof pokeRefresh === 'function') pokeRefresh(x, y);
    return true;
  }
  var maskFromObject = 0;
  if (typeof styleToAttr === 'function' && spec && typeof spec === 'object') {
    try {
      maskFromObject = styleToAttr(spec) | 0;
    } catch (e) {
      maskFromObject = 0;
    }
  }
  // current numeric attr value
  var cur = (typeof ATTR[y][x] !== 'undefined') ? ATTR[y][x] | 0 : 0;
  var clr = (typeof COLOR[y][x] !== 'undefined' && COLOR[y][x]) ? Object.assign({}, COLOR[y][x]) : { color: (window.defaultColor||37), bgcolor: (window.defaultBg||40), bold:false, inverse:false, blink:false, dim:false, italic:false, underline:false, hidden:false, strike:false };
  if (spec && typeof spec === 'object') {
    // If styleToAttr gave a full mask and you intend to overwrite, you can uncomment:
    // cur = (maskFromObject !== 0) ? maskFromObject : cur;
    if (spec.hasOwnProperty('inverse')) { cur = spec.inverse ? (cur | ATTR_INVERSE) : (cur & ~ATTR_INVERSE); clr.inverse = !!spec.inverse; }
    if (spec.hasOwnProperty('bold')) { cur = spec.bold ? (cur | ATTR_BOLD) : (cur & ~ATTR_BOLD); clr.bold = !!spec.bold; }
    if (spec.hasOwnProperty('dim')) { cur = spec.dim ? (cur | ATTR_DIM) : (cur & ~ATTR_DIM); clr.dim = !!spec.dim; }
    if (spec.hasOwnProperty('italic')) { cur = spec.italic ? (cur | ATTR_ITALIC) : (cur & ~ATTR_ITALIC); clr.italic = !!spec.italic; }
    if (spec.hasOwnProperty('underline')) { cur = spec.underline ? (cur | ATTR_UNDERLINE) : (cur & ~ATTR_UNDERLINE); clr.underline = !!spec.underline; }
    if (spec.hasOwnProperty('blink')) { cur = spec.blink ? (cur | ATTR_BLINK) : (cur & ~ATTR_BLINK); clr.blink = !!spec.blink; }
    if (spec.hasOwnProperty('hidden')) { cur = spec.hidden ? (cur | ATTR_HIDDEN) : (cur & ~ATTR_HIDDEN); clr.hidden = !!spec.hidden; }
    if (spec.hasOwnProperty('strike')) { cur = spec.strike ? (cur | ATTR_STRIKE) : (cur & ~ATTR_STRIKE); clr.strike = !!spec.strike; }
    if (spec.hasOwnProperty('overline')) { cur = spec.overline ? (cur | ATTR_OVERLINE) : (cur & ~ATTR_OVERLINE);
      // no color property for overline in COLOR, it's purely visual
    }
    // update color fields only when specified
    if (spec.hasOwnProperty('color'))   clr.color = spec.color;
    if (spec.hasOwnProperty('bgcolor')) clr.bgcolor = spec.bgcolor;
    // also keep COLOR.bold/inverse/blink in sync with ATTR booleans
    clr.bold = !!clr.bold;
    clr.inverse = !!clr.inverse;
    clr.blink = !!clr.blink;
    // apply merged values
    ATTR[y][x] = cur;
    COLOR[y][x] = clr;
    if (typeof pokeRefresh === 'function') pokeRefresh(x, y);
    return true;
  }
  return false;
};

window.pokeAttrBit = function(x, y, bit, state) {
  var ok = pokeAttrBit(x, y, bit, !!state);
  if (!ok) return false;
  if (typeof pokeRefresh === 'function') pokeRefresh(x,y);
  return true;
};

window.pokeAttrBit = function(x, y, bit, state) {
  if (typeof x !== 'number' || typeof y !== 'number') return false;
  if (typeof validateCoords === 'function' && !validateCoords(x, y)) return false;

  // Set or clear the bit
  if (state) ATTR[y][x] |= bit;
  else       ATTR[y][x] &= ~bit;

  if (SYNC) { pokeRefresh(x, y); }
  return true;
};

window.pokeInverse = function(x, y, state, n) {
  if (typeof x !== 'number' || typeof y !== 'number') return false;
  if (typeof n === 'number' && n > 1) {
    var endX = x + n;
    for (var xi = x; xi < endX; xi++) {
    	pokeAttrBit(xi, y, window.ATTR_INVERSE, !!state);
    }
    return n;
  }
  pokeAttrBit(x, y, window.ATTR_INVERSE, !!state);
  pokeRefresh(x,y);
  return true;
};

window.pokeRefresh = function(x, y, n) {
  var full = (typeof x === 'undefined' && typeof y === 'undefined');
  if (full) { x = 0; y = 0; n = (typeof W === 'number' && typeof H === 'number') ? (W * H) : 0; }
  if (!full) {
    if (typeof x !== 'number' || typeof y !== 'number') return false;
    if (typeof H === 'number') { if (y < 0 || y >= H) return false; }
    if (typeof W === 'number') { if (x < 0 || x >= W) return false; }
  }
  n = (typeof n === 'number' && !isNaN(n) && n > 0) ? (n|0) : 1;
  var cx = x|0; var cy = y|0;
  var remaining = n; var refreshed = 0;
  while (remaining > 0 && (typeof H !== 'number' || cy < H)) {
    if (typeof W === 'number' && cx >= W) { cx = 0; cy++; if (typeof H === 'number' && cy >= H) break; }
    var elCell = (DOM[cy] && DOM[cy][cx]);
    if (elCell) {
      // text
      var chCell = (VIDEO[cy] && typeof VIDEO[cy][cx] !== 'undefined') ? VIDEO[cy][cx] : ' ';
      var newTextCell = (chCell === ' ' || chCell === '\u00A0') ? '\u00A0' : chCell;
      if (elCell.textContent !== newTextCell) elCell.textContent = newTextCell;

      // color values
      var ccell = (COLOR[cy] && COLOR[cy][cx]) || {};
      var fg = (typeof ccell.color !== 'undefined') ? ccell.color : ((window.currentStyle && currentStyle.color) ? currentStyle.color : 37);
      var bg = (typeof ccell.bgcolor !== 'undefined') ? ccell.bgcolor : ((window.currentStyle && currentStyle.bgcolor) ? currentStyle.bgcolor : 40);

      // attributes come from ATTR (authoritative)
      var attrVal = (ATTR && ATTR[cy] && typeof ATTR[cy][cx] !== 'undefined') ? ATTR[cy][cx] : 0;
      var inv   = !!(attrVal & (window.ATTR_INVERSE || 0x0001));
      var bold  = !!(attrVal & (window.ATTR_BOLD    || 0x0002));
      var dim   = !!(attrVal & (window.ATTR_DIM     || 0x0004));
      var italic= !!(attrVal & (window.ATTR_ITALIC  || 0x0008));
      var under = !!(attrVal & (window.ATTR_UNDERLINE || 0x0010));
      var blink = !!(attrVal & (window.ATTR_BLINK   || 0x0020));

      // build class string
      var classStr = 'qandy-cell ansi-fg-' + fg + ' ansi-bg-' + bg;
      if (bold) classStr += ' ansi-bold';
      if (inv)  classStr += ' ansi-inverse';
      if (italic) classStr += ' ansi-italic';
      if (under) classStr += ' ansi-underline';
      if (dim) classStr += ' ansi-dim';
      if (blink) classStr += ' ansi-blink';

      if (elCell._lastClass !== classStr) {
        elCell.className = classStr;
        elCell._lastClass = classStr;
      }
      refreshed++;
    }
    // advance to next cell, wrapping rows as needed
    cx++;
    if (typeof W === 'number' && cx >= W) { cx = 0; cy++; }
    remaining--;
  }
  if (full) return true;
  if (n === 1) return true;
  return refreshed;
};

window.pokeSelect = function(state) {
  if (typeof SSTART !== 'number' || typeof SEND !== 'number') return false;
  if (SSTART < 0 || SEND < 0) return false;
  var s = Math.min(SSTART, SEND);
  var e = Math.max(SSTART, SEND);
  var count = e - s;
  if (count <= 0) return false;
  var absCol = (typeof LINEX === 'number' ? LINEX : 0) + s;
  var startY = (typeof LINEY === 'number' ? LINEY : 0) + Math.floor(absCol / W);
  var startX = absCol % W;
  // pokeInverse expects (x, y, state, count)
  return pokeInverse(startX, startY, !!state, count);
}
  
window.peekAttr = function(x,y) { return (ATTR && ATTR[y]) ? ATTR[y][x] : undefined; };

window.peekInverse = function(x,y) {
  if (ATTR && ATTR[y]) return !!(ATTR[y][x] & (window.ATTR_INVERSE || 0x0001));
  if (COLOR && COLOR[y] && COLOR[y][x]) return !!COLOR[y][x].inverse;
  return undefined;
};

function getCellStyle(x, y) {
  // color/bgcolor come from COLOR buffer (fallbacks provided)
  var colRow = (window.COLOR && COLOR[y]) ? COLOR[y] : undefined;
  var colCell = (colRow && typeof colRow[x] !== 'undefined') ? colRow[x] : undefined;

  var fg = (colCell && typeof colCell.color !== 'undefined') ? colCell.color : ((window.currentStyle && currentStyle.color) ? currentStyle.color : 37);
  var bg = (colCell && typeof colCell.bgcolor !== 'undefined') ? colCell.bgcolor : ((window.currentStyle && currentStyle.bgcolor) ? currentStyle.bgcolor : 40);

  // ATTR is compact bitfield storage; read booleans from the bitmask
  var attrRow = (window.ATTR && ATTR[y]) ? ATTR[y] : undefined;
  var attrVal = (attrRow && typeof attrRow[x] !== 'undefined') ? attrRow[x] : 0;

  var inv = !!(attrVal & (window.ATTR_INVERSE || 0x0001));
  var bold = !!(attrVal & (window.ATTR_BOLD || 0x0002));
  var dim = !!(attrVal & (window.ATTR_DIM || 0x0004));
  var italic = !!(attrVal & (window.ATTR_ITALIC || 0x0008));
  var underline = !!(attrVal & (window.ATTR_UNDERLINE || 0x0010));
  var blink = !!(attrVal & (window.ATTR_BLINK || 0x0020));
  // extend as needed for other bits...

  return {
    color: fg,
    bgcolor: bg,
    bold: bold,
    inverse: inv,
    dim: dim,
    italic: italic,
    underline: underline,
    blink: blink
  };
}

window.pokeRefresh = function(x, y) {
  // Full-screen refresh
  if (typeof x === 'undefined' && typeof y === 'undefined') {
    for (var ry = 0; ry < H; ry++) {
      var rowRefs = DOM[ry];
      var rowChars = VIDEO[ry];
      // rowStyles not needed directly any more (we derive from ATTR + COLOR)
      for (var rx = 0; rx < W; rx++) {
        var el = rowRefs[rx];
        var ch = (rowChars && typeof rowChars[rx] !== 'undefined') ? rowChars[rx] : ' ';
        var newText = (ch === ' ' || ch === '\u00A0') ? '\u00A0' : ch;

        // set text only if changed
        if (el.textContent !== newText) el.textContent = newText;

        var s = getCellStyle(rx, ry);
        // build base class string
        var classStr = 'qandy-cell ansi-fg-' + s.color + ' ansi-bg-' + s.bgcolor;
        if (s.bold) classStr += ' ansi-bold';
        if (s.inverse) classStr += ' ansi-inverse';
        if (s.italic) classStr += ' ansi-italic';
        if (s.underline) classStr += ' ansi-underline';
        if (s.dim) classStr += ' ansi-dim';
        if (s.blink) classStr += ' ansi-blink';

        // only write className if changed to reduce style recalcs
        if (el._lastClass !== classStr) {
          el.className = classStr;
          el._lastClass = classStr;
        }
      }
    }
    return true;
  }

  // Single-cell refresh
  var elCell = DOM[y] && DOM[y][x];
  if (!elCell) return false;

  var cellChar = VIDEO[y] && VIDEO[y][x] ? VIDEO[y][x] : ' ';
  var newTextCell = (cellChar === ' ' || cellChar === '\u00A0') ? '\u00A0' : cellChar;
  if (elCell.textContent !== newTextCell) elCell.textContent = newTextCell;

  var s = getCellStyle(x, y);
  var classStr = 'qandy-cell ansi-fg-' + s.color + ' ansi-bg-' + s.bgcolor;
  if (s.bold) classStr += ' ansi-bold';
  if (s.inverse) classStr += ' ansi-inverse';
  if (s.italic) classStr += ' ansi-italic';
  if (s.underline) classStr += ' ansi-underline';
  if (s.dim) classStr += ' ansi-dim';
  if (s.blink) classStr += ' ansi-blink';

  if (elCell._lastClass !== classStr) {
    elCell.className = classStr;
    elCell._lastClass = classStr;
  }
  return true;
};

function validateCoords(x, y) { return (typeof x === 'number' && typeof y === 'number' && x >= 0 && y >= 0 && x < W && y < H); }
function safeGet(arr, y, x) { return (arr && arr[y]) ? arr[y][x] : undefined; }

var prevX = -1;
var prevY = -1;
var prevCode = CURSOR;

var prevAttr=0;

var _ansiCssMap = {30:'#000',31:'#c00',32:'#0c0',33:'#cc0',34:'#00c',35:'#c0c',36:'#0cc',37:'#ccc',
                   90:'#555',91:'#f55',92:'#5f5',93:'#ff5',94:'#55f',95:'#f5f',96:'#5ff',97:'#fff',
                   40:'#000',41:'#c00',42:'#0c0',43:'#cc0',44:'#00c',45:'#c0c',46:'#0cc',47:'#ccc'};

window.pokeCursorOn = function() {
  if (typeof CURSOR === 'undefined' || typeof CURX === 'undefined' || typeof CURY === 'undefined') return;
  if (CURSOR === 0) return; // cursor off
  var sx = Math.max(0, Math.min(W-1, CURX|0));
  var sy = Math.max(0, Math.min(H-1, CURY|0));
  var prevAttr = (typeof peekATTR === 'function') ? peekATTR(sx, sy) : (ATTR && ATTR[sy] ? ATTR[sy][sx] : 0);  
  if (CURSOR === 1 || CURSOR === 3) { // line cursor: underline
    if (typeof window.ATTR_UNDERLINE !== 'undefined') pokeAttrBit(sx, sy, window.ATTR_UNDERLINE, true);
    if (CURSOR === 3 && typeof window.ATTR_BLINK !== 'undefined') pokeAttrBit(sx, sy, window.ATTR_BLINK, true);
  }
  if (CURSOR === 4 || CURSOR === 5) { // block cursor: inverse
    if (typeof window.ATTR_INVERSE !== 'undefined') pokeAttrBit(sx, sy, window.ATTR_INVERSE, true);
    if (CURSOR === 5 && typeof window.ATTR_BLINK !== 'undefined') pokeAttrBit(sx, sy, window.ATTR_BLINK, true);
  }
}

window.pokeCursorOff = function() {
  if (typeof prevAttr === 'undefined' || prevAttr === null) return false;
  ATTR[CURY][CURX] = prevAttr;
  pokeRefresh(CURX,CURY);
  return true;
}

function cursorVarsToAttr(vars) {
  // prefer window-defined ATTR_* constants if present, otherwise use defaults
  const ATTR_INVERSE   = (window.ATTR_INVERSE   !== undefined) ? window.ATTR_INVERSE   : 0x0001;
  const ATTR_BOLD      = (window.ATTR_BOLD      !== undefined) ? window.ATTR_BOLD      : 0x0002;
  const ATTR_ITALIC    = (window.ATTR_ITALIC    !== undefined) ? window.ATTR_ITALIC    : 0x0008;
  const ATTR_UNDERLINE = (window.ATTR_UNDERLINE !== undefined) ? window.ATTR_UNDERLINE : 0x0010; // "line"
  const ATTR_BLINK     = (window.ATTR_BLINK     !== undefined) ? window.ATTR_BLINK     : 0x0020;
  const ATTR_DIM       = (window.ATTR_DIM       !== undefined) ? window.ATTR_DIM       : 0x0040;

  // vars may be an object with the fields, otherwise fall back to globals
  const v = (vars && typeof vars === 'object') ? vars : {};

  const inverse = (typeof v.cursorInverse !== 'undefined') ? v.cursorInverse : (typeof cursorInverse !== 'undefined' ? cursorInverse : 0);
  const bold    = (typeof v.cursorBold    !== 'undefined') ? v.cursorBold    : (typeof cursorBold    !== 'undefined' ? cursorBold    : 0);
  const dim     = (typeof v.cursorDim     !== 'undefined') ? v.cursorDim     : (typeof cursorDim     !== 'undefined' ? cursorDim     : 0);
  const italic  = (typeof v.cursorItalic  !== 'undefined') ? v.cursorItalic  : (typeof cursorItalic  !== 'undefined' ? cursorItalic  : 0);
  const line    = (typeof v.cursorLine    !== 'undefined') ? v.cursorLine    : (typeof cursorLine    !== 'undefined' ? cursorLine    : 0);
  const blink   = (typeof v.cursorBlink   !== 'undefined') ? v.cursorBlink   : (typeof cursorBlink   !== 'undefined' ? cursorBlink   : 0);

  let mask = 0;
  if (inverse) mask |= ATTR_INVERSE;
  if (bold)    mask |= ATTR_BOLD;
  if (dim)     mask |= ATTR_DIM;
  if (italic)  mask |= ATTR_ITALIC;
  if (line)    mask |= ATTR_UNDERLINE;
  if (blink)   mask |= ATTR_BLINK;

  return mask;
}

window.pokeScroll = function(n) {
  if (typeof n === 'undefined') n = 0;
  n = Number(n) || 0;
  if (n === 0) return true;
  var distance = Math.max(-H, Math.min(H, n));
  var defAttr = defaultAttrMask();

  if (distance > 0) {
    // Scroll up: rows move toward smaller y (top), pulling from y+distance
    for (var y = 0; y < H; y++) {
      var src = y + distance;
      if (src < H) {
        for (var x = 0; x < W; x++) {
          // copy character
          VIDEO[y][x] = VIDEO[src][x];
          COLOR[y][x] = COLOR[src][x];
          ATTR[y][x] = ATTR[src][x];
          if (SYNC) pokeRefresh(x, y);
        }
      } else {
        // fill remainder lines at bottom with spaces + default style
        for (var x2 = 0; x2 < W; x2++) {
          VIDEO[y][x2] = " ";
          // COLOR[y][x2] = @@@
          ATTR[y][x2] = defAttr;
          if (SYNC) pokeRefresh(x2, y);
        }
      }
    }
  } else {
    // distance < 0 => scroll down by -distance
    var d = -distance;
    for (var y2 = H - 1; y2 >= 0; y2--) {
      var src2 = y2 - d;
      if (src2 >= 0) {
        for (var x3 = 0; x3 < W; x3++) {
          VIDEO[y2][x3] = VIDEO[src2][x3];

          var srcColor2 = (COLOR[src2] && COLOR[src2][x3]) ? COLOR[src2][x3] : null;
          var tgtColor2 = ensureColorObj(y2, x3);
          if (srcColor2) {
            tgtColor2.color = srcColor2.color;
            tgtColor2.bgcolor = srcColor2.bgcolor;
            tgtColor2.bold = !!srcColor2.bold;
            tgtColor2.inverse = !!srcColor2.inverse;
          } else {
            tgtColor2.color = (currentStyle && currentStyle.color) || 37;
            tgtColor2.bgcolor = (currentStyle && currentStyle.bgcolor) || 40;
            tgtColor2.bold = !!(currentStyle && currentStyle.bold);
            tgtColor2.inverse = !!(currentStyle && currentStyle.inverse);
          }

          ATTR[y2][x3] = (ATTR[src2] && typeof ATTR[src2][x3] !== 'undefined') ? ATTR[src2][x3] : defAttr;
          if (SYNC) pokeRefresh(x3, y2);
        }
      } else {
        // fill remainder lines at top with spaces + default style
        for (var x4 = 0; x4 < W; x4++) {
          VIDEO[y2][x4] = " ";
          var tgtCol3 = ensureColorObj(y2, x4);
          tgtCol3.color = (currentStyle && currentStyle.color) || 37;
          tgtCol3.bgcolor = (currentStyle && currentStyle.bgcolor) || 40;
          tgtCol3.bold = !!(currentStyle && currentStyle.bold);
          tgtCol3.inverse = !!(currentStyle && currentStyle.inverse);
          ATTR[y2][x4] = defAttr;
          if (SYNC) pokeRefresh(x4, y2);
        }
      }
    }
  }

  // Move cursor and input-line anchors by the same offset (subtract distance).
  // distance positive means screen moved up; cursor row should reduce by distance.
  function clampRow(r) {
    if (typeof r !== 'number' || isNaN(r)) return 0;
    if (r < 0) return 0;
    if (r >= H) return H - 1;
    return r;
  }
  CURY  = clampRow((typeof CURY === 'number' ? CURY : 0) - distance);
  LINEY = clampRow((typeof LINEY === 'number' ? LINEY : 0) - distance);
  CURX  = Math.max(0, Math.min(W - 1, (typeof CURX === 'number' ? CURX : 0)));
  LINEX = Math.max(0, Math.min(W - 1, (typeof LINEX === 'number' ? LINEX : 0)));

  return true;
};

// Signal that video.js is ready
if (typeof window.qandySignalReady === 'function') {
  window.qandySignalReady('Video');
}
