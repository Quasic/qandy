
function keyson() { keyon=1; cursor(1); }
function keysoff() { keyon=0; cursor(0); }

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
  btn.onclick = function() { button(key.keyCode); };
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
    element.style.backgroundColor = ctrlPhysical ? '#0a0' : '#fff';
    element.style.color = '#000';
    return;
  }
  if (elementId === 'alt' && (alt || altPhysical)) {
    element.style.backgroundColor = altPhysical ? '#0a0' : '#fff';
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

// Signal that keyboard.js is ready
if (typeof window.qandySignalReady === 'function') {
  window.qandySignalReady('Keyboard');
}
