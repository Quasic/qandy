
run="qandy.js";

function button(b, event) {
  // Resume pagination if paused
  if (typeof paginationPaused !== 'undefined' && paginationPaused) {
    if (typeof resumePagination === 'function') resumePagination();
    return;
  }

  if (event && typeof event.shiftKey !== 'undefined') shift = !!event.shiftKey;
  cursor(0);
  var k = "", l = "";
  switch (b) {
    case 16: // SHIFT
      if (event && typeof event.shiftKey !== 'undefined') shift = !!event.shiftKey;
      else shift = !shift;
      if ((alt || altPhysical) && typeof updateKeyLabels === 'function') updateKeyLabels();
      cursor(1);
      return;
    case 17: k = "ctrl"; break;
    case 18: k = "alt"; break;
    case 20: k = "caps"; break;
    case 27: k = "esc"; break;
    case 13: k = "enter"; break;
    case 8:  k = "back"; break;
    case 46: k = "delete"; break;
    case 37: k = "left"; break;
    case 38: k = "up"; break;
    case 39: k = "right"; break;
    case 40: k = "down"; break;
    case 36: k = "home"; break;
    case 35: k = "end"; break;
    default:
      // fallthrough to printable handling
  }

  // Letters A-Z (respect shift xor caps)
  if (!k && b >= 65 && b <= 90) {
    var base = String.fromCharCode(b);
    var capsOn = !!caps;
    var shiftOn = !!shift;
    var makeUpper = (shiftOn && !capsOn) || (!shiftOn && capsOn);
    l = makeUpper ? base.toUpperCase() : base.toLowerCase();
    k = l;
  }

  // Common non-letter printable key mapping
  var keyMap = {
    48: ['0', ')'], 49: ['1','!'], 50: ['2','@'], 51: ['3','#'],
    52: ['4','$'], 53: ['5','%'], 54: ['6','^'], 55: ['7','&'],
    56: ['8','*'], 57: ['9','('],
    186: [';',':'], 187: ['=','+'], 188: [',','<'], 189: ['-','_'],
    190: ['.','>'], 191: ['/','?'], 192: ['`','~'],
    219: ['[','{'], 220: ['\\','|'], 221: [']','}'], 222: ["'",'"'],
    32: [' ',' ']
  };

  if (!k && keyMap[b]) { l = shift ? keyMap[b][1] : keyMap[b][0]; k = l; }

  // Ignore raw control codes (<32) that aren't already mapped
  if (!k && b < 32) { cursor(1); return; }

  // Modifier key toggles (virtual keyboard)
  if (k === "ctrl") {
    ctrl = !ctrl;
    var el = document.getElementById("ctrl");
    if (el) { el.style.backgroundColor = ctrl ? "#fff" : "#222"; el.style.color = ctrl ? "#000" : "#fff"; }
    cursor(1);
    return;
  }
  if (k === "alt") {
    alt = !alt;
    var el2 = document.getElementById("alt");
    if (el2) { el2.style.backgroundColor = alt ? "#fff" : "#222"; el2.style.color = alt ? "#000" : "#fff"; }
    updateKeyLabels();
    cursor(1);
    return;
  }
  if (k === "caps") {
    caps = !caps;
    var capsEl = document.getElementById("kcaps") || document.getElementById("caps");
    if (capsEl) {
      if (caps) { capsEl.style.backgroundColor = "#fff"; capsEl.style.color = "#000"; }
      else { capsEl.style.backgroundColor = "#222"; capsEl.style.color = "#fff"; }
    }
    updateKeyLabels();
    cursor(1);
    return;
  }

  if (keyboard) {
    // If program is running and has keydown, send it there first
    if (run && typeof keydown !== 'undefined') {
      try { keydown(k || l); } catch (e) {
        print("ERROR: keydown();\n\n");
      }
    } else {

      if (k === "back") {
        // BACKSPACE: delete char before cursor (or delete selection)
        cursor(0);
        if (selectionStart !== -1 && selectionEnd !== -1) {
          deleteSelection();
          pokeInput();
        } else if (CURP > 0) {
          LINE = LINE.substring(0, CURP - 1) + LINE.substring(CURP);
          CURP--;
          pokeCell(CURX, CURY, " ");
          pokeInput();
        }
        selectionStart = -1; selectionEnd = -1;
        cursor(1);

      } else if (k === "delete") {
        if (SSTART !== -1 && SEND !== -1) {
          if (SSTART>SEND) { [SSTART, SEND] = [SEND, SSTART];}

    var s = Math.max(0, Math.min(SSTART, SEND));
    var e = Math.max(0, Math.min(Math.max(SSTART, SEND), len));

          if (shift && navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
            navigator.clipboard.writeText(str.substring(s, e)).catch(function(err){
              console.warn('clipboard write failed', err);
            });
          }

          // remove selected portion
          LINE = str.substring(0, s) + str.substring(e);
          // move logical cursor to start of deleted region
          CURP = s;
          // clear selection
          SSTART = -1;
          SEND   = -1;
        } else {
          // delete pressed with no selection
        }  
        pokeInput();
      } else if (k === "left") {
        if (CURP > 0) {
          if (shift) {
            if (selectionStart === -1) selectionStart = CURP;
            CURP--;
            selectionEnd = CURP;
            if (CURX > 0) {
              CURX--;
            } else {
              if (CURY > 0) {
                CURY--; CURX = W - 1;
              } else {
                CURX = 0; CURP = 0; selectionEnd = 0;
              }
            }
            pokeInverse(CURX, CURY, true);
          } else {
            SSTART = -1; SEND = -1;
            CURP--;
            if (CURX==0) {
              CURY--; CURX=W-1;
            } else {
              CURX--;
            }
          }
        }
      } else if (k === "right") {
        // Move cursor right; extend selection if SHIFT held
        if (CURP < LINE.length) {
          if (shift) {
            if (SSTART === -1) SSTART = CURP;
            CURP++;
            if (CURP < 0) CURP = 0;
            if (CURP > LINE.length) CURP = LINE.length;
            SEND = CURP;
          }
          SSTART = -1; SEND = -1;
          CURP++; if (CURP>LINE.length) { CURP=LINE.length; }
          CURX++; if (CURX>W) { CURX=0; CUY++; if (CUY>H) return false; }
        }
      } else if (k === "home") {
        if (shift && CURP > 0) {
          // SHIFT+HOME: extend selection to start of line
          if (SEND <0 ) { SEND=CURP; }
          CURP = 0; SSTART = CURP;
          pokeInverse(LINEX,LINEY,false, SEND-SSTART);
          CURX=0;
          //
          // @@ need to figure out new CURX if wraps to last line 
          //
        } else {
          // Regular HOME: move cursor to start, clear selection
          SSTART = -1; SEND = -1;
          CURP = 0;
          var absCol = LINEX + CURP;
          CURY = LINEY + Math.floor(absCol / W);
          CURX = absCol % W; //
          // clamp to screen bounds just in case
          if (CURY < 0) CURY = 0;
          if (CURY >= H) CURY = H - 1;
          if (CURX < 0) CURX = 0;
          if (CURX >= H) CURX = H - 1;
        }
        cursor(1);
      } else if (k === "end") {
        event.preventDefault();
        SSTART = -1; SEND = -1;
        var absCol  = (LINEX|0) + (LINE || "").length;;
        var newX    = absCol % W;
        var newY    = (LINEY|0) + Math.floor(absCol / W);
        CURP = (LINE || "").length; CURX = newX; CURY = newY;
      } else if (k === "up") {
        // History: go to older command
        if (commandHistory && commandHistory.length > 0) {
          if (historyIndex === -1) {
            tempCommand = line;           // save current typing
            historyIndex = commandHistory.length;
          }
          if (historyIndex > 0) {
            historyIndex--;
            line = commandHistory[historyIndex];
            setCursorToInputPos(line.length);
            pokeInput();
          }
        }
        cursor(1);

      } else if (k === "down") {
        // History: go to newer command
        if (historyIndex !== -1) {
          if (historyIndex < commandHistory.length - 1) {
            historyIndex++;
            line = commandHistory[historyIndex];
          } else {
            historyIndex = -1;
            line = tempCommand || "";
            tempCommand = "";
          }
          setCursorToInputPos(line.length);
          pokeInput();
        }
        cursor(1);

      } else if (k === "enter") {
        // Submit the current line
        selectionStart = -1; selectionEnd = -1;

        if (LINE !== undefined) {
          // Save to history
          if (typeof commandHistory !== 'undefined' && LINE.trim().length > 0) {
            if (commandHistory.length === 0 || commandHistory[commandHistory.length - 1] !== LINE) {
              commandHistory.push(LINE);
              if (typeof maxHistorySize !== 'undefined' && commandHistory.length > maxHistorySize) {
                commandHistory.shift();
              }
            }
          }
          historyIndex = -1;
          tempCommand = "";

          if (run) {
            print("\n");
            try { input(LINE); } catch (e) { /* ignore */ }
            LINE = "";
            CURP = 0;
            LINEX = CURX; LINEY = CURY;
            pokeRefresh();
            cursor(1); // did we disable cursor? i don't think we do anymore
          } else {
            print("\n");
            if (line.slice(-3) === ".js") {
              keyboard = 0;
              var prg = document.createElement('script');
              prg.src = line;
              prg.onload = function() { keyson(); };
              prg.onerror = function() { print("Error loading program\n"); keyson(); };
              document.head.appendChild(prg);
              LINE = "";
              CURP = 0;
              LINEX = CURX; LINEY = CURY;
            } else if (line.substr(0,3) === "cls") {
              if (typeof initScreen === 'function') initScreen(); else cls();
              LINE = "";
              CURX = 0; CURY = 0; CURP = 0;
              LINEX = 0; LINEY = 0;
            } else {
              try { executeCode(line); } catch (e) { /* ignore */ }
              LINE = "";
              CURP = 0;
              LINEX = CURX; LINEY = CURY;
              cursor(1);
            }
            pokeRefresh();
          }
        }

      } else if (l) {
        // Insert printable character(s)
        var finalChar = l;
        var hasCtrl = !!ctrl;
        var hasAlt = !!alt;
        var hasAltFlag = !!((typeof alt !== 'undefined' && alt) || (typeof altPhysical !== 'undefined' && altPhysical) || (event && !!event.altKey))
        var hasCtrl = !!ctrl;
        var hasCtrlFlag = !!((typeof ctrl !== 'undefined' && ctrl) || (typeof ctrlPhysical !== 'undefined' && ctrlPhysical) || (event && !!event.ctrlKey));
        var hasAltShift = hasAltFlag && !!shift;

        if (hasAltFlag || hasAlt) {
          var baseLower = (typeof l === 'string' && l.length > 0) ? l.toLowerCase() : '';
          if (hasAltShift && altShiftKeys.hasOwnProperty(baseLower)) {
            finalChar = altShiftKeys[baseLower];
          } else if (altKeys.hasOwnProperty(baseLower)) {
            finalChar = altKeys[baseLower];
          }
          
        }

        if (hasCtrl) {
          ctrl = 0;
          var cel = document.getElementById("ctrl");
          if (cel) { cel.style.backgroundColor = "#222"; cel.style.color = "#fff"; }
          var lc = finalChar.toLowerCase();
          // Ctrl+C: copy selection or whole line
          if (lc === 'c') {
            var copyText = "";
            if (selectionStart !== -1 && selectionEnd !== -1) {
              var cs = Math.min(selectionStart, selectionEnd);
              var ce = Math.max(selectionStart, selectionEnd);
              copyText = line.substring(cs, ce);
            } else {
              copyText = line;
            }
            if (copyText.length > 0) {
              navigator.clipboard.writeText(copyText).catch(function(){});
            }
            cursor(1);
            return;
          }

          // Ctrl+V: paste from clipboard
          if (lc === 'v') {
            navigator.clipboard.readText().then(function(text) {
              if (text) {
                cursor(0);
                if (selectionStart !== -1 && selectionEnd !== -1) deleteSelection();
                selectionStart = -1; selectionEnd = -1;
                line = (line || "").substring(0, CURP) + text + (line || "").substring(CURP);
                CURP += text.length;
                pokeInput();
                setCursorToInputPos(CURP);
                cursor(1);
              }
            }).catch(function(){});
            cursor(1);
            return;
          }

          // Ctrl+A: select all input
          if (lc === 'a') {
            if (line.length > 0) {
              selectionStart = 0; selectionEnd = line.length;
              updateSelectionVisuals(selectionStart, selectionEnd);
            }
            cursor(1);
            return;
          }

          // All other ctrl combos: ignore (don't insert text)
          cursor(1);
          return;
        }

        // Typing clears any active selection (replacing selected text)
        if (SSTART !== -1 && SEND !== -1) {
          //
          // @@ this routine must be rewritten to use new variable set
          //
          // deleteSelection();
          //
        }
        SSTART = -1; SEND = -1;
        // Insert character into line at CURP
        LINE = (LINE || "").substring(0, CURP) + finalChar + (LINE || "").substring(CURP);
        CURP += finalChar.length;
        // Advance CURX, wrapping to next row if we hit W (screenWidth)
        CURX += finalChar.length;
        while (CURX >= W) { CURX -= W; CURY++; if (CURY >= H) { CURY = H - 1; } }
        pokeInput();
        if (typeof historyIndex !== 'undefined' && historyIndex !== -1) { historyIndex = -1; tempCommand = ""; }
        
        
      }

    } // end else (not run+keydown)
  } else {
    if (run) { keydown(k || l); }
  }
}

document.addEventListener('keydown', function (event) {
 if (event.keycode === 32) { event.preventDefault(); }
 press(event);
});


document.addEventListener('keyup', function (event) { pressup(event); });
document.addEventListener('paste', function (event) {
 if (keyon) {
  event.preventDefault();
  var pastedText;
  if (event.clipboardData && event.clipboardData.getData) {
   pastedText = event.clipboardData.getData('text/plain');
  } else if (clipboardData && clipboardData.getData) {
   pastedText = clipboardData.getData('Text');
  }
  if (pastedText) {
   cursor(0);
   if (selectionStart !== -1 && selectionEnd !== -1) deleteSelection();
   selectionStart = -1; selectionEnd = -1;
   line = (line || "").substring(0, CURP) + pastedText + (line || "").substring(CURP);
   CURP += pastedText.length;
   pokeInput();
   setCursorToInputPos(CURP);
   cursor(1);
  }
 }
});

function press(event) { 
 key=""; k=event.keyCode; shift=event.shiftKey;

 // Handle physical CapsLock keypress (keyCode 20)
 if (event.keyCode === 20) {
   // Determine the platform state if available
   var platformState = (typeof event.getModifierState === 'function') ? !!event.getModifierState('CapsLock') : null;

   // Compute the new desired caps state:
   // - If platformState is available, use it.
   // - But some browsers report the previous state on keydown; if platformState equals current caps,
   //   assume the toggle has not yet been applied and flip it.
   var newCaps;
   if (platformState === null) {
     newCaps = !caps; // no platform info -> just toggle
   } else {
     newCaps = platformState;
     if (platformState === caps) {
       // likely timing issue -> flip to reflect the user action
       newCaps = !caps;
     }
   }

   caps = !!newCaps;
   l = document.getElementById("kcaps") || document.getElementById("caps");
   if (l) {
     if (caps) { l.style.backgroundColor = "#fff"; l.style.color = "#000"; }
     else { l.style.backgroundColor = "#222"; l.style.color = "#fff"; }
   }

   // Cancel any transient flash timeout for the CAPS element so it won't reapply a flash style
   try {
     if (keyTimeouts && keyTimeouts['caps']) { clearTimeout(keyTimeouts['caps']); delete keyTimeouts['caps']; }
     // Also clear any stored flash marker on the element
     if (l) l.dataset._flash = '';
   } catch (e) { /* ignore */ }

   // Ensure label updates
   if (typeof updateKeyLabels === 'function') updateKeyLabels();

   // If we just turned it off, explicitly unhighlight the element (clear inline styles)
   if (!caps) {
     unhighlightKey('caps');
   } else {
     // Ensure locked appearance
     if (l) { l.style.backgroundColor = "#fff"; l.style.color = "#000"; }
   }

  // Prevent default browser handling side-effects and stop further processing for this key event
  event.preventDefault && event.preventDefault();
  return;
}

  if (event.ctrlKey && (event.key === 'v' || event.key === 'V')) {
    // Let the browser fire the native paste event (handled by the paste listener)
    return;
  }

 if (event.keyCode === 18 || event.altKey) { event.preventDefault(); }
 if (event.keyCode === 27) { event.preventDefault(); }
 if (event.keyCode === 16) {
  var capsBtn = document.getElementById("caps");
  if (capsBtn) { capsBtn.style.backgroundColor = "#444"; capsBtn.style.color = "#fff"; }
  updateKeyLabels();
 }
 if (event.keyCode === 17 && !ctrl) {
  ctrl=1; ctrlPhysical=true;
  document.getElementById("ctrl").style.backgroundColor = "#0a0";
  document.getElementById("ctrl").style.color = "#000";
  return;
 }
 if (event.keyCode === 18 && !alt) {
  highlightKey(k);
  alt = 1; altPhysical = true;
  document.getElementById("alt").style.backgroundColor = "#0a0";
  document.getElementById("alt").style.color = "#000";
  updateKeyLabels();
 }
 // For Ctrl+key combos, pass specific ones through to button() (Ctrl+C, Ctrl+A)
 // Ctrl+V is handled via the native paste event listener instead
 if (event.ctrlKey) {
  var ctrlKey = event.key ? event.key.toLowerCase() : '';
  if (ctrlKey === 'c' || ctrlKey === 'a') {
   event.preventDefault();
   highlightKey(k);
   button(k, event);
  }
  // All other ctrl combos: let browser handle
  return;
 }
 highlightKey(k);
 button(k, event);
}

function pressup(event) {
  // Prevent browser from handling ALT key - must be done before any conditionals
  if (event.keyCode === 18 || event.altKey) {
    event.preventDefault(); // Prevent browser menu from opening
  }
 
  // Handle physical CTRL key release (unhighlight)
  if (event.keyCode === 17 && ctrlPhysical) {
    ctrl = 0;
    ctrlPhysical = false;
    document.getElementById("ctrl").style.backgroundColor = "#222";
    document.getElementById("ctrl").style.color = "#fff";
    return;
  }

  // Handle physical SHIFT key release (unhighlight CAPS unless caps mode is active)
  if (event.keyCode === 16) {
    shift = 0;
    if (typeof updateKeyLabels === 'function') updateKeyLabels();
    if (!caps) { unhighlightKey('caps'); }
    return;
  }

  // Handle physical ALT key release (unhighlight)
  if (event.keyCode === 18 && altPhysical) {
    alt = 0;
    altPhysical = false;
    document.getElementById("alt").style.backgroundColor = "#222";
    document.getElementById("alt").style.color = "#fff";
    updateKeyLabels();
    return;
  }
 
  // Route keyup to active script if run is set
  if (run && typeof keyup !== 'undefined') {
    var k = String.fromCharCode(event.keyCode);
    keyup(k);
  }
}

function ensureBuffersAndRow(y) {
  console.log("old ensureBuffersAndRow function called");
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

function applyStyleToDom(el, styleObj) {
  if (!el) return;
  removeAnsiColorClasses(el);
  if (styleObj && typeof styleObj.color !== 'undefined') {
    el.classList.add('ansi-fg-' + String(styleObj.color));
  }
  if (styleObj && typeof styleObj.bgcolor !== 'undefined') {
    el.classList.add('ansi-bg-' + String(styleObj.bgcolor));
  }
  if (styleObj && styleObj.bold) {
    el.style.fontWeight = 'bold';
    el.classList.add('ansi-bold');
  } else {
    el.style.fontWeight = '';
    el.classList.remove('ansi-bold');
  }
  if (styleObj && styleObj.inverse) {
    el.classList.add('ansi-inverse');
  } else {
    el.classList.remove('ansi-inverse');
  }
}

function executeCode(code) {
  try {
    var trimmed = String(code).trim();
    var simpleNameRE = /^[$A-Za-z_][$A-Za-z0-9_]*(?:\s*\.\s*[$A-Za-z_][$A-Za-z0-9_]*)*$/;
    if (simpleNameRE.test(trimmed)) {
      try {
        var value = eval(trimmed);
      } catch (e) {
        print("Error: " + e.message + "\n\n");
        return false;
      }
      if (typeof value === "function") {
        print("ERROR: use: "+trimmed+"()\n\n");
        return true;
      }
      if (value !== undefined) { print(String(value) + "\n\n"); }
      return true;
    }
    var result = eval(code);
    if (result !== undefined) { print(String(result) + "\n\n"); }
    return true;
  } catch (error) {
    print("Error: " + error.message + "\n\n");
    return false;
  }
}


function scrollScreenDown() {
  VIDEO.shift();
  COLOR.shift();
  
  const newLine = [];
  const newStyleLine = [];
  for (let j = 0; j < W; j++) {
    newLine[j] = ' ';
    newStyleLine[j] = {
      color: currentStyle.color,
      bgcolor: currentStyle.bgcolor,
      bold: currentStyle.bold,
      inverse: currentStyle.inverse
    };
  }
  VIDEO.push(newLine);
  COLOR.push(newStyleLine);
}

// Helper functions

function showFiles() {
  print("ascii.js\n");
  print("sound.js\n");
  print("piano.js\n");
  print("demo.js\n");
  print("q.js\n");
  print("world.js\n");
  print("\n");
  
  // List files from localStorage
  var userFiles = [];
  for (var i = 0; i < localStorage.length; i++) {
    var key = localStorage.key(i);
    if (key.startsWith("qandy_file_")) {
      userFiles.push(key.substring(11)); // Remove "qandy_file_" prefix
    }
  }
  
  if (userFiles.length > 0) {
    print("\x1b[1;32mUSER FILES:\x1b[0m\n");
    for (var j = 0; j < userFiles.length; j++) {
      print(userFiles[j] + "\n");
    }
    print("\n");
  }
}

function print(txt) {
  txt = (typeof txt === 'undefined' || txt === null) ? '' : String(txt);
  pokeCursor(txt);
}

function resumePagination() {
  // Clear the pause message by removing last few lines
  if (VIDEO.length > 0) {
    // Remove the "Press Any Key" message line
    const lastLineIdx = VIDEO.length - 1;
    for (let x = 0; x < W; x++) {
      VIDEO[lastLineIdx][x] = ' ';
      COLOR[lastLineIdx][x] = {
        color: 37,
        bgcolor: 40,
        bold: false,
        inverse: false
      };
    }
  }
  
  // Reset pagination state
  paginationPaused = false;
  keyson();  // Re-enable keyboard input
  
  // Clear the screen and reset cursor
  cls();
  
  // Process queued print calls
  const bufferedText = paginationBuffer.slice();  // Copy array
  paginationBuffer = [];  // Clear buffer
  
  // Print all buffered content
  for (let i = 0; i < bufferedText.length; i++) {
    print(bufferedText[i]);
  }
}

function clearScreen() { cls(); }

// system ready

print("\nQandy Pocket\nComputer v1.j\n\n");
LINEX = CURX; LINEY = CURY;  

SFiles=1;
mySearch=location.search.substr(1).split("&")
for (i=0;i<mySearch.length;i++) {
 nameVal=mySearch[i].split("=");
 for (j in nameVal) { nameVal[j]=unescape(nameVal[j]); } 
 if (nameVal[0]=="run") {
  script=document.createElement('script');
  script.src=nameVal[1];
  document.head.appendChild(script);
  SFiles=0;
 }
}

// if (SFiles) { showFiles(); }

// Signal that qandy.js is ready
if (typeof qandySignalReady === 'function') {
  qandySignalReady('Qandy Core');
}
