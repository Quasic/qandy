var normalKeys = {
  "1":"1","2":"2","3":"3","4":"4","5":"5",
  "6":"6","7":"7","8":"8","9":"9","0":"0",
  "q":"q","w":"w","e":"e","r":"r","t":"t",
  "y":"y","u":"u","i":"i","o":"o","p":"p",
  "a":"a","s":"s","d":"d","f":"f","g":"g",
  "h":"h","j":"j","k":"k","l":"l",
  "z":"z","x":"x","c":"c","v":"v","b":"b",
  "n":"n","m":"m",
  "[":"[", "]":"]", ";":";", "'":"'",
  ",":",", ".":".", "/":"/", "=":"=", "-":"-",
  "\\":"\\", "`":"`"
};

var shiftedKeys = {
  "1":"!","2":"@","3":"#","4":"$","5":"%",
  "6":"^","7":"&","8":"*","9":"(","0":")",
  "q":"Q","w":"W","e":"E","r":"R","t":"T",
  "y":"Y","u":"U","i":"I","o":"O","p":"P",
  "a":"A","s":"S","d":"D","f":"F","g":"G",
  "h":"H","j":"J","k":"K","l":"L",
  "z":"Z","x":"X","c":"C","v":"V","b":"B",
  "n":"N","m":"M",
  "[":"{", "]":"}", ";":":", "'":"\"",
  ",":"<", ".":">", "/":"?", "=":"+", "-":"_",
  "\\":"|", "`":"~"
};

var altKeys = {
  "q":"┌","w":"─","e":"┐","r":"├","t":"┤",
  "y":"└","u":"┴","i":"┘","o":"│","p":"┼",
  "a":"╔","s":"═","d":"╗","f":"╠","g":"╣",
  "h":"╚","j":"╩","k":"╝","l":"║",";":"╬",
  "z":"▀","x":"▄","c":"█","v":"▌","b":"▐",
  "n":"░","m":"▒",",":"▓",".":"■","/":"□",
  "1":"☺","2":"☻","3":"♥","4":"♦","5":"♣",
  "6":"♠","7":"•","8":"◘","9":"○","0":"◙",
  "[":"«", "]":"»", "-":"─", "=":"═",
  "\\":" ","`":"°", "'":"″"
};

var altShiftKeys = {
  "q":"╭","w":"╌","e":"╮","r":"╞","t":"╡",
  "y":"╰","u":"╴","i":"╯","o":"╎","p":"╪",
  "a":"┏","s":"━","d":"┓","f":"┣","g":"┫",
  "h":"┗","j":"┻","k":"┛","l":"┃",";":"╋",
  "z":"▔","x":"▁","c":"▪","v":"▸","b":"◂",
  "n":"▴","m":"▾",",":"◊",".":"●","/":"○",
  "1":"↑","2":"↓","3":"←","4":"→","5":"↔",
  "6":"↕","7":"★","8":"☆","9":"◆","0":"◇",
  "[":"‹", "]":"›", "-":"―", "=":"≡",
  "\\":" ","`":"¬", "'":"′"
};

// Export to window so legacy code expecting globals still works
window.normalKeys = window.normalKeys || normalKeys;
window.shiftedKeys = window.shiftedKeys || shiftedKeys;
window.altKeys = window.altKeys || altKeys;
window.altShiftKeys = window.altShiftKeys || altShiftKeys;
var keyboardData = [
  // Row 0: ESC, BACKTICK, BACKSLASH, OPEN, CLOSE, DASH, EQUAL, BACK (y=446)
  {id:"esc", label:"ESC", keyCode:27, x:47, y:446, width:52},
  {id:"backtick", label:"`", keyCode:192, x:103, y:446, width:28},
  {id:"backslash", label:"\\", keyCode:220, x:132, y:446, width:28},
  {id:"open", label:"[", keyCode:219, x:160, y:446, width:28},
  {id:"close", label:"]", keyCode:221, x:189, y:446, width:28},
  {id:"dash", label:"-", keyCode:173, x:218, y:446, width:28},
  {id:"equal", label:"=", keyCode:61, x:247, y:446, width:28},
  {id:"back", label:"BACK", keyCode:8, x:275, y:446, width:52},
  // Row 1: Number keys 1-0 (y=480)
  {id:"n1", label:"1", keyCode:49, x:47, y:480, width:28},
  {id:"n2", label:"2", keyCode:50, x:75, y:480, width:28},
  {id:"n3", label:"3", keyCode:51, x:103, y:480, width:28},
  {id:"n4", label:"4", keyCode:52, x:132, y:480, width:28},
  {id:"n5", label:"5", keyCode:53, x:160, y:480, width:28},
  {id:"n6", label:"6", keyCode:54, x:189, y:480, width:28},
  {id:"n7", label:"7", keyCode:55, x:218, y:480, width:28},
  {id:"n8", label:"8", keyCode:56, x:247, y:480, width:28},
  {id:"n9", label:"9", keyCode:57, x:275, y:480, width:28},
  {id:"n0", label:"0", keyCode:48, x:303, y:480, width:28},
  // Row 2: QWERTY (y=511)
  {id:"q", label:"q", keyCode:81, x:47, y:511, width:28},
  {id:"w", label:"w", keyCode:87, x:75, y:511, width:28},
  {id:"e", label:"e", keyCode:69, x:103, y:511, width:28},
  {id:"r", label:"r", keyCode:82, x:132, y:511, width:28},
  {id:"t", label:"t", keyCode:84, x:160, y:511, width:28},
  {id:"y", label:"y", keyCode:89, x:189, y:511, width:28},
  {id:"u", label:"u", keyCode:85, x:218, y:511, width:28},
  {id:"i", label:"i", keyCode:73, x:247, y:511, width:28},
  {id:"o", label:"o", keyCode:79, x:275, y:511, width:28},
  {id:"p", label:"p", keyCode:80, x:303, y:511, width:28},
  // Row 3: ASDF (y=542)
  {id:"a", label:"a", keyCode:65, x:47, y:542, width:28},
  {id:"s", label:"s", keyCode:83, x:75, y:542, width:28},
  {id:"d", label:"d", keyCode:68, x:103, y:542, width:28},
  {id:"f", label:"f", keyCode:70, x:132, y:542, width:28},
  {id:"g", label:"g", keyCode:71, x:160, y:542, width:28},
  {id:"h", label:"h", keyCode:72, x:189, y:542, width:28},
  {id:"j", label:"j", keyCode:74, x:218, y:542, width:28},
  {id:"k", label:"k", keyCode:75, x:247, y:542, width:28},
  {id:"l", label:"l", keyCode:76, x:275, y:542, width:28},
  {id:"quote", label:"'", keyCode:222, x:303, y:542, width:28},
  // Row 4: ZXCV (y=573)
  {id:"z", label:"z", keyCode:90, x:47, y:573, width:28},
  {id:"x", label:"x", keyCode:88, x:75, y:573, width:28},
  {id:"c", label:"c", keyCode:67, x:103, y:573, width:28},
  {id:"v", label:"v", keyCode:86, x:132, y:573, width:28},
  {id:"b", label:"b", keyCode:66, x:160, y:573, width:28},
  {id:"n", label:"n", keyCode:78, x:189, y:573, width:28},
  {id:"m", label:"m", keyCode:77, x:218, y:573, width:28},
  {id:"colon", label:";", keyCode:59, x:247, y:573, width:28},
  {id:"enter", label:"ENTER", keyCode:13, x:275, y:573, width:52},

  // Row 5: Bottom row with modifiers (y=604)
  {id:"caps", label:"CAPS", keyCode:20, x:47, y:604, width:52},
  {id:"space", label:"SPACE", keyCode:32, x:103, y:604, width:81},
  {id:"ctrl", label:"CTRL", keyCode:17, x:189, y:604, width:28},
  {id:"alt", label:"ALT", keyCode:18, x:218, y:604, width:28},
  {id:"comma", label:",", keyCode:188, x:247, y:604, width:28},
  {id:"dot", label:".", keyCode:190, x:275, y:604, width:28},
  {id:"slash", label:"/", keyCode:191, x:303, y:604, width:28}
];

function keyson() { keyon=1; cursor(1); }
function keysoff() { keyon=0; cursor(0); }
function cursor(a) {
  if (a === 1) {
    cursorOn = 1;
    pokeInverse(cursorX, cursorY, true);
  } else {
    cursorOn = 0;
    pokeInverse(window.cursorX, window.cursorY, false);  
  }
}

initKeyboard(); 
function initKeyboard() {
 // Create keyboard buttons dynamically from keyboard data array
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
}

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
var keyCodeToId = {};
keyboardData.forEach(function(key) {
  keyCodeToId[key.keyCode] = key.id;
});

// Store timeout IDs for each key to handle rapid key presses
var keyTimeouts = {};

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
 if (mode=="gfx") {
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
 const textElement=document.getElementById("txt");
 textElement.scrollTop=textElement.scrollHeight;
 Z=0; for (Y=0; Y<=mapy; Y++) {
  for (X=0; X<=mapx; X++) {
   e=document.getElementById("T"+Z).style.top=50+(Y*32)+"px";  
   e=document.getElementById("T"+Z).style.left=54+(X*32)+"px"; 
   Z++;
  }
 }
}

// Signal that keyboard.js is ready
if (typeof window.qandySignalReady === 'function') {
  window.qandySignalReady('Keyboard');
}
