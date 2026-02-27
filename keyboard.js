
function keyson() {
  //keyon=1;
  //cursor(1);
}
function keysoff() {
  //keyon=0;
  //cursor(0);
}

keyboardData.forEach(function(key) {
  var btn = document.createElement('div');
  btn.id = key.id;
  btn.innerHTML = key.label;
  
  // inside initKeyboard() after btn.innerHTML = key.label;
  if (key.label === 'SPACE') btn.dataset.keyChar = ' ';
  else if (key.label && key.label.length === 1) btn.dataset.keyChar = key.label;
  else btn.dataset.keyChar = '';  
  
  // Assign appropriate CSS class based on width
  if (key.width === 28) {
   btn.className = 'k1';
  } else if (key.width === 40) {
   // Check if it's the ENTER key specifically
   if (key.id === 'enter') {
    btn.className = 'k-enter';  // ENTER key
   } else {
    btn.className = 'k-ctrl';  // CAPS key and other 40px keys
   }
  } else if (key.width === 52) {
   btn.className = 'k2';
  } else if (key.width === 81) {
   btn.className = 'k-space';  // SPACE key
  } else if (key.width === 109) {
   btn.className = 'k4';
  }
  
  // Set explicit width for custom-sized keys
  if (key.width === 40 || key.width === 81) {
   btn.style.width = key.width + 'px';
  } 
  
  // Reduce font size for CTRL and ALT keys to fit text better
  if (key.id === 'ctrl' || key.id === 'alt') {
   btn.style.fontSize = '9px';
  }
  btn.style.left = key.x + 'px';
  btn.style.top = key.y + 'px';
  btn.onclick = function() { button(key.keyCode,key); };
  document.getElementById('keyboard-container').appendChild(btn);
 });
 updateKeyLabels();

function updateKeyLabels() {
  // Decide current modifier priority:
  // If ALT active (virtual or physical) -> show ALT labels (shifted if Shift also active)
  window.altActive = !!alt || !!altPhysical;
  window.shiftActive = !!window.shift;
  window.capsActive = !!window.caps;

  keyboardData.forEach(function(key) {
    var el = document.getElementById(key.id);
    if (!el) return;
    var base = el.dataset.keyChar; // single-char canonical base (could be 'a' or 'A' etc)
    if (!base || base.length === 0) return;

    // Use lowercase for map lookups (maps are keyed by lower-case characters)
    var lookup = base.toLowerCase();
    var label = base;

    if (altActive) {
      // ALT is active: prefer altShiftKeys (if Shift also active), then altKeys
      if (shiftActive && typeof altShiftKeys === 'object' && altShiftKeys.hasOwnProperty(lookup)) {
        label = altShiftKeys[lookup];
      } else if (typeof altKeys === 'object' && altKeys.hasOwnProperty(lookup)) {
        label = altKeys[lookup];
      } else if (shiftActive && typeof shiftedKeys === 'object' && shiftedKeys.hasOwnProperty(lookup)) {
        // fallback to shiftedKeys if no alt mapping available
        label = shiftedKeys[lookup];
      } else if (typeof normalKeys === 'object' && normalKeys.hasOwnProperty(lookup)) {
        label = normalKeys[lookup];
      } else {
        label = base;
      }
    } else {
      // No ALT: existing CAPS/SHIFT logic
      if (capsActive) {
        // caps acts like shift for letters — show shifted label if available
        if (shiftActive) {
          // both shift and caps: show shifted label if present
          label = (typeof shiftedKeys === 'object' && shiftedKeys.hasOwnProperty(lookup)) ? shiftedKeys[lookup] : base.toUpperCase();
        } else {
          label = (typeof shiftedKeys === 'object' && shiftedKeys.hasOwnProperty(lookup)) ? shiftedKeys[lookup] : base.toUpperCase();
        }
      } else {
        // no caps: show shifted if shift is pressed (transient)
        if (shiftActive && typeof shiftedKeys === 'object' && shiftedKeys.hasOwnProperty(lookup)) {
          label = shiftedKeys[lookup];
        } else {
          label = (typeof normalKeys === 'object' && normalKeys.hasOwnProperty(lookup)) ? normalKeys[lookup] : base;
        }
      }
    }

    el.innerHTML = (label === ' ' && base === ' ') ? 'SPACE' : label;
  });
}

// Create a mapping from keyCode to element ID for quick lookup
window.keyCodeToId = {};
keyboardData.forEach(function(key) {
  keyCodeToId[key.keyCode] = key.id;
});

// Store timeout IDs for each key to handle rapid key presses
window.keyTimeouts = {};

// Function to highlight a virtual key
function highlightKey(keyCode) {
  var elementId = keyCodeToId[keyCode];
  if (!elementId) return; // Key not in virtual keyboard
  
  var element = document.getElementById(elementId);
  if (!element) return; // Element not found
  
  // Clear any existing timeout for this key to prevent race conditions
  if (keyTimeouts[elementId]) {
    clearTimeout(keyTimeouts[elementId]);
  }
  
  // Apply hover effect (using the same color as :hover in CSS)
  element.style.backgroundColor = '#444';
  
  // Set a timeout to restore original color
  keyTimeouts[elementId] = setTimeout(function() {
    unhighlightKey(elementId);
    delete keyTimeouts[elementId]; // Clean up timeout reference
  }, 200); // 200ms flash effect
}

// Function to unhighlight a virtual key
function unhighlightKey(elementId) {
  var element = document.getElementById(elementId);
  if (!element) return;

  // Keep locked appearance if key is logically locked
  if (elementId === 'caps' && caps) {
    element.style.backgroundColor = '#fff';
    element.style.color = '#000';
    return;
  }
  if (elementId === 'ctrl' && (ctrl || ctrlPhysical)) {
    element.style.backgroundColor = ctrlPhysical ? '#bbb' : '#fff';
    element.style.color = '#000';
    return;
  }
  if (elementId === 'alt' && (alt || altPhysical)) {
    element.style.backgroundColor = altPhysical ? '#444' : '#fff';
    element.style.color = '#000';
    return;
  }

  // Not locked -> clear inline styles
  element.style.backgroundColor = '';
  element.style.color = '';
}

img=document.createElement('img');
img.id="qpc"; img.src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAAA7EAAAOxAGVKw4bAAAAMklEQVRYhe3OMQEAMAjEwKei2wHxRQbLxUCu3u2fxc7mHAAAAAAAAAAAAAAAAAAAIEkGzIgCpxq6s7YAAAAASUVORK5CYII="; 
img.style.width="300px"; img.style.height="600px"; img.style.zIndex="0"; 
img.style.position="absolute";
document.body.appendChild(img);
document.getElementById("qpc").style.top = "32px";
document.getElementById("qpc").style.left = "32px";

resize(); function resize() {
 // Position text element based on mode
 if (window.mode=="gfx") {
  up=32+(404-(document.getElementById('txt').offsetHeight));
  left=32+22+300;
  document.getElementById("txt").style.left=left+"px";
  document.getElementById("txt").style.top=up+"px";
 } else {
  left=32+22;
  up=32+(402-(document.getElementById('txt').offsetHeight));
  document.getElementById("txt").style.left="54px";
  document.getElementById("txt").style.top=up+"px";
 }
 
 //const textElement=document.getElementById("txt");
 //textElement.scrollTop=textElement.scrollHeight;
 //Z=0; for (Y=0; Y<=mapy; Y++) {
 // for (X=0; X<=mapx; X++) {
 //  e=document.getElementById("T"+Z).style.top=50+(Y*32)+"px";  
 //  e=document.getElementById("T"+Z).style.left=54+(X*32)+"px"; 
 //  Z++;
 // }
 //}
}



// Qandy keyboard input glue
// Exposes: window.QandyKeyboard and global input(...) for guest scripts.
// Use: name = await input("Name: "); password = await input({ prompt: "Password: ", mask: true });

(function(global) {
  if (global.QandyKeyboard) return; // don't re-install

  var pending = null; // { resolve, reject, options, buffer, timeoutId, savedLINE, savedCURP }

  function _ensureString(s) { return (typeof s === 'string') ? s : String(s || ""); }

  // Accept the pending input value and resolve the Promise
  function acceptPending(value) {
    if (!pending) return false;
    var p = pending;
    pending = null;
    try { if (p.timeoutId) clearTimeout(p.timeoutId); } catch(e) {}
    // resolve asynchronously to avoid reentrancy with key handlers
    setTimeout(function() {
      try { p.resolve(value); } catch (e) { p.reject(e); }
    }, 0);
    return true;
  }

  // Cancel pending input (reject)
  function cancelPending(reason) {
    if (!pending) return false;
    var p = pending;
    pending = null;
    try { if (p.timeoutId) clearTimeout(p.timeoutId); } catch(e) {}
    p.reject(reason || new Error('input cancelled'));
    return true;
  }

  // Called by key handler for printable character; return true if consumed
  function handleTypedChar(ch) {
    if (!pending) return false;
    var o = pending.options || {};
    if (o.mask) {
      // Append to internal buffer and show '*' in LINE at CURP
      pending.buffer = (pending.buffer || "") + ch;
      LINE = (LINE || "");
      LINE = LINE.substring(0, CURP) + '*' + LINE.substring(CURP);
      CURP = CURP + 1;
      pokeInput();
      return true;
    }
    // Not masked -> let normal insertion happen (not consumed)
    return false;
  }

  // Called by key handler for backspace; return true if consumed
  function handleBackspace() {
    if (!pending) return false;
    var o = pending.options || {};
    if (o.mask) {
      if (!pending.buffer || pending.buffer.length === 0) return true; // nothing to delete
      // remove last char from buffer
      pending.buffer = pending.buffer.slice(0, -1);
      // remove last '*' from LINE before CURP
      if (CURP > 0) {
        LINE = LINE.substring(0, CURP-1) + LINE.substring(CURP);
        CURP = Math.max(0, CURP - 1);
        pokeInput();
      }
      return true;
    }
    // not masked -> don't consume (let normal backspace handler run)
    return false;
  }

  // Called by key handler for Enter; return true if consumed
  function handleEnter() {
    if (!pending) return false;
    var o = pending.options || {};
    var val;
    if (o.mask) {
      val = pending.buffer || "";
    } else {
      val = _ensureString(LINE || "");
    }
    // Optionally trim final newline/CR
    // val = val.replace(/\r?\n$/, "");
    // Prevent pokeInput / eraseInput from erasing what was just typed.
    // pokeInput/eraseInput uses `lastin` to remove previous input; clear it.
    try { lastin = ""; } catch (e) { /* ignore if not defined */ }

    // Move the logical cursor to the start of the next line BEFORE resolving
    try {
      // Advance to column 0, next row
      CURX = 0;
      CURY = (typeof CURY === 'number' && typeof H === 'number') ? Math.min(H - 1, CURY + 1) :
             ((typeof CURY === 'number') ? CURY + 1 : 0);

      // Sync the LINE insertion coordinates to the new cursor position
      LINEX = (typeof CURX === 'number') ? CURX : 0;
      LINEY = (typeof CURY === 'number') ? CURY : 0;

      // Reset visible edit buffer and cursor-in-line, but DO NOT call pokeInput()
      // (calling pokeInput might call eraseInput and remove visible characters).
      LINE = "";
      CURP = 0;

      // Refresh UI cursor/viewport — avoid calling pokeInput which may erase;
      // a lightweight refresh is safer.
      pokeRefresh(); pokeCursorOn();
    } catch (e) {
      // ignore UI errors and still resolve the input
    }
    acceptPending(val);
    return true;
  }

  // helper: resolve when any paced pokeCursor output finishes (or immediately if none)
  function waitForCursorIdle(timeoutMs) {
    timeoutMs = typeof timeoutMs === 'number' ? timeoutMs : 5000;
    return new Promise(function(resolve) {
      if (!window._pokeCursor_state) return resolve();
      var start = Date.now();
      var iv = setInterval(function() {
        if (!window._pokeCursor_state) {
          clearInterval(iv);
          return resolve();
        }
        if (Date.now() - start > timeoutMs) {
          clearInterval(iv);
          return resolve();
        }
      }, 8);
    });
  }

  // Public input API (replaces the previous implementation)
  function input(opts) {
    if (pending) return Promise.reject(new Error('input already pending'));
    var options = {};
    if (typeof opts === 'string') options.prompt = opts;
    else if (typeof opts === 'object' && opts !== null) options = Object.assign({}, opts);

    // create the pending promise object early so we can return it immediately
    var p = {};
    var promise = new Promise(function(resolve, reject) {
      p.resolve = resolve;
      p.reject = reject;
    });
    // attach common fields now (pending will be set only after prompt printing finishes)
    p.options = options;
    p.buffer = "";
    p.savedLINE = LINE;
    p.savedCURP = CURP;

    // async setup: wait for any current printing to finish, then print prompt and wait for that,
    // then enable interactive pending state (so prompt doesn't cancel earlier output).
    (async function() {
      try {
        // 1) wait for any existing paced output (e.g., previous print()) to finish
        await waitForCursorIdle();

        // 2) print the prompt (if any)
        if (options.prompt) {
          print(options.prompt);
        }

        // 3) wait for the prompt's paced printing to finish
        await waitForCursorIdle();

        // 4) now it's safe to enable pending input without cancelling the printed prompt
        pending = p;

        // timeout handling
        if (typeof options.timeout === 'number' && options.timeout > 0) {
          p.timeoutId = setTimeout(function() {
            if (pending === p) {
              pending = null;
              p.reject(new Error('input timeout'));
            }
          }, options.timeout);
        }

        // Ensure the cursor is visible for user input
        try { pokeCursorOn(); } catch (e) {}

      } catch (err) {
        // If any error during setup, reject the promise
        try { p.reject(err); } catch (e) {}
      }
    })();

    // ensure finalizers clear timeout if any
    return promise.finally(function() {
      if (p.timeoutId) try { clearTimeout(p.timeoutId); } catch (e) {}
    });
  }

  // Read-only access to pending state (debug)
  function _pendingState() { return pending; }

  // Expose API
  var API = {
    input: input,
    acceptPending: acceptPending,
    cancelPending: cancelPending,
    handleTypedChar: handleTypedChar,
    handleBackspace: handleBackspace,
    handleEnter: handleEnter,
    _pendingState: _pendingState
  };

  global.QandyKeyboard = API;
  // convenience global for guest scripts: await input(...)
  global.input = input;

})(window);



// Signal that keyboard.js is ready
if (typeof window.qandySignalReady === 'function') {
  window.qandySignalReady('Keyboard');
}
