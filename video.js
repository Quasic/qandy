//
// Qandy Video Graphics Adaptor
// 

let lastx=0; let lasty=0;

window.pokeCell = function(x, y, ch) {
  if (!validateCoords(x, y)) return false;
  if (typeof ch !== 'undefined') { VIDEO[y][x] = (typeof ch === 'string') ? ch : String(ch)[0] || ' '; }
  pokeRefresh(x, y);
  return true;
};

window.pokeCursor = function(text) {
  if (typeof text === 'undefined' || text === null) return false;
  var str = String(text);
  for (i=0; i < str.length; i++) {
    var ch = str.charAt(i);
    pokeCursorOff();
    if (ch === '\n') {
      CURX = 0;
      CURY = CURY + 1;
      if (CURY >= H) { 
        if (CURY >= H) { CURY = H - 1; CURX = Math.min(CURX, W-1); }
        pokeCursorOn();
        return false;
      }
    }

    if (CURX >= W) {
      CURX = 0;
      CURY = CURY + 1;
      if (CURY >= H) {
        CURY = H - 1; CURX = Math.min(CURX, W-1);
        pokeCursorOn();
        return false;
      }
    }

    pokeCell(CURX, CURY, ch);

    CURX = CURX + 1;
    if (CURX >= W) {
      CURX = 0;
      CURY = CURY + 1;
      if (CURY >= H) {
        CURY = H - 1;
        CURX = Math.min(CURX, W - 1);
        pokeCursorOn();
        return false;
      }
    }
    pokeCursorOn();
    LINEX = CURX;
    LINEY = CURY;
  }
  return true;
};

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

window.peek = function(x, y) { 
  return validateCoords(x, y) ? VIDEO[y][x] : undefined;
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

window.pokeChar = function(x, y, ch, count) {
  if (typeof ch === 'undefined') { return validateCoords(x, y) ? VIDEO[y][x] : undefined; }
  if (!validateCoords(x, y)) return false;
  var char = (typeof ch === 'string') ? ch : String(ch)[0] || ' ';
  if (typeof count === 'number' && count > 1) {
    var endX = Math.min(x + count, W);
    for (var i = x; i < endX; i++) {
      VIDEO[y][i] = char;
      pokeRefresh(i, y);
    }
    return endX - x;
  }
  VIDEO[y][x] = char;
  pokeRefresh(x, y);
  return true;
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

// POKEFG - Set foreground color (text color)
// Colors: 30-37 standard, 90-97 bright
window.pokeFG = function(x, y, color, count) {
  // Getter mode
  if (typeof color === 'undefined') {
    return validateCoords(x, y) ? COLOR[y][x].color : undefined;
  }
  
  // Validate starting position
  if (!validateCoords(x, y)) return false;
  
  // Span mode
  if (typeof count === 'number' && count > 1) {
    var endX = Math.min(x + count, W);
    for (var i = x; i < endX; i++) {
      COLOR[y][i].color = color;
      if (SYNC) { pokeRefresh(i, y); }
    }
    return endX - x;
  }
  
  // Single cell
  COLOR[y][x].color = color;
  if (SYNC) { pokeRefresh(x, y); }
  return true;
};

// POKEBG - Set background color
// Colors: 40-47 standard, 100-107 bright
window.pokeBG = function(x, y, color, count) {
  if (typeof color === 'undefined') { return validateCoords(x, y) ? COLOR[y][x].bgcolor : undefined; }
  if (!validateCoords(x, y)) return false;
  // Span mode
  if (typeof count === 'number' && count > 1) {
    var endX = Math.min(x + count, W);
    for (var i = x; i < endX; i++) {
      COLOR[y][i].bgcolor = color;
      if (SYNC) { pokeRefresh(i, y); }
    }
    return endX - x;
  }
  
  // Single cell
  COLOR[y][x].bgcolor = color;
  if (SYNC) pokeRefresh(x, y);
  return true;
};

// POKECOLOR - set foreground and background color together
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
  var x2 = Math.min(x + width, W);
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
          }
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

// SCROLLUP - Scroll entire screen up
window.scrollUp = function(lines, fillChar) {
  return scrollRegion(0, 0, W, H, 'up', lines || 1, fillChar);
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
function _mirrorAttrToColor(x, y) {
  _ensureAttrRow(y); _ensureColorRow(y);
  var bits = ATTR[y][x] || 0;
  var sb = COLOR[y][x] || { color:(window.defaultColor||37), bgcolor:(window.defaultBg||40), bold:false, inverse:false, blink:false };
  sb.inverse   = !!(bits & (window.ATTR_INVERSE || 0x0001));
  sb.bold      = !!(bits & (window.ATTR_BOLD    || 0x0002));
  sb.blink     = !!(bits & (window.ATTR_BLINK   || 0x0020));
  sb.italic    = !!(bits & (window.ATTR_ITALIC  || 0x0008));
  sb.underline = !!(bits & (window.ATTR_UNDERLINE|| 0x0010));
  COLOR[y][x] = sb;
}

function _setAttrBit(x, y, bit, state) {
  if (!validateCoords(x,y)) return false;
  _ensureAttrRow(y);
  if (state) ATTR[y][x] |= bit;
  else       ATTR[y][x] &= ~bit;
  _mirrorAttrToColor(x, y);
  return true;
}

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

    // Mirror to COLOR if present
    if (window.COLOR) {
      // Ensure the row exists
      if (!COLOR[y]) {
        COLOR[y] = [];
      }
      var sb = COLOR[y][x];
      if (!sb) {
        sb = { color: (window.defaultColor||37), bgcolor: (window.defaultBg||40), bold:false, inverse:false };
        COLOR[y][x] = sb;
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

//  pokeAttr(x, y, 0x0003); // set ATTR[y][x] = 0x0003 (numeric mask, overwrite)
//  pokeAttr(x, y, { bold: true, inverse: false, color: 31, bgcolor: 47 }); // set/clear bits & colors (merge)

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

  // pokeAttrBit(0, 0, ATTR_BOLD, false);
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
      if (typeof pokeRefreshRow === 'function') pokeRefreshRow(x, y, count);
      else if (typeof pokeRefresh === 'function') for (var xr = x; xr < endX; xr++) pokeRefresh(xr, y);
      return count;
    }
    _setAttrBit(x, y, window.ATTR_INVERSE, !!state);
    if (typeof pokeRefresh === 'function') pokeRefresh(x,y);
    return true;
  };

window.pokeRefresh = function(x, y) {
  if (typeof x === 'undefined' && typeof y === 'undefined') {
    for (var ry = 0; ry < H; ry++) {
      var rowRefs = DOM[ry] || [];
      var rowChars = VIDEO[ry] || [];
      var colorRow = COLOR[ry] || [];
      var attrRow = ATTR && ATTR[ry]; // ATTR is typed-array rows: ATTR[ry][rx]

      for (var rx = 0; rx < W; rx++) {
        var el = rowRefs[rx];
        if (!el) continue;

        // character
        var ch = rowChars[rx];
        var newText = (ch === ' ' || ch === '\u00A0' || typeof ch === 'undefined') ? '\u00A0' : ch;
        if (el.textContent !== newText) el.textContent = newText;

        // colors (numbers) come from COLOR buffer (fall back to defaults)
        var ccell = colorRow[rx] || {};
        var fg = (typeof ccell.color !== 'undefined') ? ccell.color : ((window.currentStyle && currentStyle.color) ? currentStyle.color : 37);
        var bg = (typeof ccell.bgcolor !== 'undefined') ? ccell.bgcolor : ((window.currentStyle && currentStyle.bgcolor) ? currentStyle.bgcolor : 40);

        // boolean flags come from ATTR bitfield
        var attrVal = (attrRow && typeof attrRow[rx] !== 'undefined') ? attrRow[rx] : 0;
        var inv   = !!(attrVal & (window.ATTR_INVERSE || 0x0001));
        var bold  = !!(attrVal & (window.ATTR_BOLD    || 0x0002));
        var dim   = !!(attrVal & (window.ATTR_DIM     || 0x0004));
        var italic= !!(attrVal & (window.ATTR_ITALIC  || 0x0008));
        var under = !!(attrVal & (window.ATTR_UNDERLINE || 0x0010));
        var blink = !!(attrVal & (window.ATTR_BLINK   || 0x0020));

        // build class string (keep same naming as CSS expects)
        var classStr = 'qandy-cell ansi-fg-' + fg + ' ansi-bg-' + bg;
        if (bold) classStr += ' ansi-bold';
        if (inv)  classStr += ' ansi-inverse';
        if (italic) classStr += ' ansi-italic';
        if (under) classStr += ' ansi-underline';
        if (dim) classStr += ' ansi-dim';
        if (blink) classStr += ' ansi-blink';

        // only write className if it changed
        if (el._lastClass !== classStr) {
          el.className = classStr;
          el._lastClass = classStr;
        }
      }
    }    
    return true;
  }

  if (SYNC) {
    var elCell = (DOM[y] && DOM[y][x]);
    if (!elCell) return false;

    var chCell = (VIDEO[y] && typeof VIDEO[y][x] !== 'undefined') ? VIDEO[y][x] : ' ';
    var newTextCell = (chCell === ' ' || chCell === '\u00A0') ? '\u00A0' : chCell;
    if (elCell.textContent !== newTextCell) elCell.textContent = newTextCell;

    var ccell = (COLOR[y] && COLOR[y][x]) || {};
    var fg = (typeof ccell.color !== 'undefined') ? ccell.color : ((window.currentStyle && currentStyle.color) ? currentStyle.color : 37);
    var bg = (typeof ccell.bgcolor !== 'undefined') ? ccell.bgcolor : ((window.currentStyle && currentStyle.bgcolor) ? currentStyle.bgcolor : 40);

    var attrVal = (ATTR && ATTR[y] && typeof ATTR[y][x] !== 'undefined') ? ATTR[y][x] : 0;
    var inv   = !!(attrVal & (window.ATTR_INVERSE || 0x0001));
    var bold  = !!(attrVal & (window.ATTR_BOLD    || 0x0002));
    var dim   = !!(attrVal & (window.ATTR_DIM     || 0x0004));
    var italic= !!(attrVal & (window.ATTR_ITALIC  || 0x0008));
    var under = !!(attrVal & (window.ATTR_UNDERLINE || 0x0010));
    var blink = !!(attrVal & (window.ATTR_BLINK   || 0x0020));

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
    var el = document.getElementById('c' + y + '_' + x);
    // var s = COLOR[y] && COLOR[y][x] ? COLOR[y][x] : { color:37, bgcolor:40, bold:false, inverse:false };
    // build classes as before...
    if (CURON && x === CURX && y === CURY) {
      el.classList.add('qandy-cursor');
      // Safely set cursor color CSS variables if CURATTR is available
      if (typeof CURATTR === 'object' && CURATTR !== null) {
        var _fg = _ansiCssMap[CURATTR.color]   || '#ccc';
        var _bg = _ansiCssMap[CURATTR.bgcolor] || '#000';
        el.style.setProperty('--qandy-cursor-fg', _fg);
        el.style.setProperty('--qandy-cursor-bg', _bg);
      }
      // .qandy-cursor { color: var(--qandy-cursor-fg); background: var(--qandy-cursor-bg); }
    } else {
      el.classList.remove('qandy-cursor');
      el.style.removeProperty('--qandy-cursor-fg');
      el.style.removeProperty('--qandy-cursor-bg');
    }
    return true;
  } 
  return false;
}

  window.pokeRefreshRow = function(startX, y, count) {
    if (typeof y !== 'number' || typeof startX !== 'number') return false;
    count = (typeof count === 'number' && count > 0) ? (count|0) : 1;
    startX = startX|0;
    if (typeof H === 'number') { if (y < 0 || y >= H) return false; } else if (!DOM || !VIDEO) { return false;}
    var endX = startX + count;
    if (typeof W === 'number') { if (startX < 0) startX = 0; if (endX > W) endX = W; if (startX >= endX) return false; }
    var rowRefs = (typeof DOM !== 'undefined' && DOM[y]) ? DOM[y] : [];
    var rowChars = (typeof VIDEO !== 'undefined' && VIDEO[y]) ? VIDEO[y] : [];
    var colorRow = (typeof COLOR !== 'undefined' && COLOR[y]) ? COLOR[y] : [];
    var attrRow  = (typeof ATTR !== 'undefined' && ATTR[y]) ? ATTR[y] : null;
    for (var rx = startX; rx < endX; rx++) {
      var el = rowRefs[rx];
      if (!el) continue;
      var ch = (typeof rowChars[rx] !== 'undefined') ? rowChars[rx] : ' ';
      if (el.textContent !== ch) el.textContent = ch;
      var st = colorRow[rx] || { color: (window.defaultColor || 37), bgcolor: (window.defaultBg   || 40), bold: false, inverse: false };
      if (attrRow) {
        st.inverse   = !!(attrRow[rx] & (window.ATTR_INVERSE  || 0x0001));
        st.bold      = !!(attrRow[rx] & (window.ATTR_BOLD     || 0x0002));
        st.italic    = !!(attrRow[rx] & (window.ATTR_ITALIC   || 0x0008));
        st.underline = !!(attrRow[rx] & (window.ATTR_UNDERLINE|| 0x0010));
        st.blink     = !!(attrRow[rx] & (window.ATTR_BLINK    || 0x0020));
        st.hidden    = !!(attrRow[rx] & (window.ATTR_HIDDEN   || 0x0080));
        st.strike    = !!(attrRow[rx] & (window.ATTR_STRIKE   || 0x0100));
      }
      applyCellStyle(el, st); // @@
    }
    return true;
  };


window.applyCellStyle = function(el, st) {
  if (!el || typeof st !== 'object' || st === null) return;
  var fg = (typeof st.color !== 'undefined') ? st.color : (window.defaultColor || 37);
  var bg = (typeof st.bgcolor !== 'undefined') ? st.bgcolor : (window.defaultBg || 40);

  var classStr = 'qandy-cell ansi-fg-' + fg + ' ansi-bg-' + bg;
  if (st.bold)      classStr += ' ansi-bold';
  if (st.inverse)   classStr += ' ansi-inverse';
  if (st.italic)    classStr += ' ansi-italic';
  if (st.underline) classStr += ' ansi-underline';
  if (st.dim)       classStr += ' ansi-dim';
  if (st.blink)     classStr += ' ansi-blink';
  if (st.hidden)    classStr += ' ansi-hidden';
  if (st.strike)    classStr += ' ansi-strike';

  if (el._lastClass !== classStr) {
    el.className = classStr;
    el._lastClass = classStr;
  }

  // If the element isn't the cursor, remove any cursor-specific inline vars.
  // pokeRefresh handles adding qandy-cursor and its CSS vars separately.
  if (!el.classList.contains('qandy-cursor')) {
    el.style.removeProperty('--qandy-cursor-fg');
    el.style.removeProperty('--qandy-cursor-bg');
  }
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
})();


function applyCursorAttrToCell(x, y) {
  if (!validateCoords(x,y)) return;
  // clear previous cursor if needed elsewhere
  var attrValue = styleToAttr(CURATTR); // bits from CURATTR booleans
  _ensureAttrRow(y);
  ATTR[y][x] |= attrValue; // set bits (or set/clear as needed)
  // Mirror colors into COLOR
  _ensureColorRow(y);
  COLOR[y][x] = COLOR[y][x] || { color:37, bgcolor:40, bold:false, inverse:false, blink:false };
  COLOR[y][x].color = CURATTR.color;
  COLOR[y][x].bgcolor = CURATTR.bgcolor;
  COLOR[y][x].bold = !!CURATTR.bold;
  COLOR[y][x].inverse = !!CURATTR.inverse;
  COLOR[y][x].blink = !!CURATTR.blink;
  if (window.SYNC) pokeRefresh(x,y);
}


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
  try {
    // line cursor: underline
    if (CURSOR === 1 || CURSOR === 3) {
      if (typeof window.ATTR_UNDERLINE !== 'undefined') pokeAttrBit(sx, sy, window.ATTR_UNDERLINE, true);
      if (CURSOR === 3 && typeof window.ATTR_BLINK !== 'undefined') pokeAttrBit(sx, sy, window.ATTR_BLINK, true);
    }

    // block cursor: inverse
    if (CURSOR === 4 || CURSOR === 5) {
      if (typeof window.ATTR_INVERSE !== 'undefined') pokeAttrBit(sx, sy, window.ATTR_INVERSE, true);
      if (CURSOR === 5 && typeof window.ATTR_BLINK !== 'undefined') pokeAttrBit(sx, sy, window.ATTR_BLINK, true);
    }
  } catch (e) {
    console.warn("activateStartupCursor failed:", e);
  }
}

window.pokeCursorOff = function() {
  if (typeof prevAttr === 'undefined' || prevAttr === null) return false;
  ATTR[CURY][CURX] = prevAttr;
  pokeRefresh(CURX,CURY);
  cursor_saved = null;
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




// Signal that video.js is ready
if (typeof window.qandySignalReady === 'function') {
  window.qandySignalReady('Video');
}
