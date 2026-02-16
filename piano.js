// QANDY PIANO
// Interactive ANSI piano keyboard that plays musical notes
// Load with: piano.js
// Click on keys or press keyboard keys to play notes
// Requires: sound.js to be loaded

run="piano.js"; 
if (typeof document !== 'undefined' && document.getElementById("run")) {
  document.getElementById("run").innerHTML = run;
}

// Check if sound.js is loaded, if not load it automatically
if (typeof beep === 'undefined' || typeof playNote === 'undefined') {
  print("\x1b[1;33mLoading sound.js...\x1b[0m\n");
  var soundScript = document.createElement('script');
  soundScript.src = 'sound.js';
  soundScript.onload = function() {
    print("\x1b[1;32m✓ Sound system loaded\x1b[0m\n\n");
    // sound.js clears the run variable, so we need to restore it
    run = "piano.js";
    if (typeof document !== 'undefined' && document.getElementById("run")) {
      document.getElementById("run").innerHTML = run;
    }
    // Continue with piano initialization after sound.js loads
    initializePiano();
  };
  soundScript.onerror = function() {
    print("\x1b[1;31mError: Could not load sound.js\x1b[0m\n");
    print("Please ensure sound.js is in the same directory.\n");
  };
  document.head.appendChild(soundScript);
  
  // Define initializePiano as a placeholder that will be called after sound.js loads
  var initializePiano;
}

// Piano keyboard mapping
// Top row (black keys): W E  T Y U  (sharps/flats)
// Bottom row (white keys): A S D F G H J K (natural notes C-C)

var pianoKeyMap = {
  // White keys (natural notes)
  'a': 'C4',
  's': 'D4', 
  'd': 'E4',
  'f': 'F4',
  'g': 'G4',
  'h': 'A4',
  'j': 'B4',
  'k': 'C5',
  
  // Black keys (sharps/flats)
  'w': 'C#4',
  'e': 'D#4',
  't': 'F#4',
  'y': 'G#4',
  'u': 'A#4'
};

var pianoKeyLabels = {
  'C4': 'A', 'C#4': 'W',
  'D4': 'S', 'D#4': 'E',
  'E4': 'D',
  'F4': 'F', 'F#4': 'T',
  'G4': 'G', 'G#4': 'Y',
  'A4': 'H', 'A#4': 'U',
  'B4': 'J',
  'C5': 'K'
};

// Track which keys are currently pressed (for visual feedback)
var pressedKeys = {};

// Track the line number where we display the currently playing note
var noteDisplayLine = 20; // Updated for compact layout

function drawPiano() {
  cls();
  // Compact header (32 chars max)
  print("\x1b[1;36m╔══════════════════════════════╗\x1b[0m\n");
  print("\x1b[1;36m║\x1b[0m \x1b[1;35mQANDY PIANO KEYBOARD\x1b[0m    \x1b[1;36m║\x1b[0m\n");
  print("\x1b[1;36m╚══════════════════════════════╝\x1b[0m\n");
  print("\n");
  
  // Compact piano keyboard (32 chars max)
  // Black keys row
  print("  \x1b[40;37mW\x1b[0m \x1b[40;37mE\x1b[0m    \x1b[40;37mT\x1b[0m \x1b[40;37mY\x1b[0m \x1b[40;37mU\x1b[0m\n");
  print(" \x1b[40;37mC#D#\x1b[0m  \x1b[40;37mF#G#A#\x1b[0m\n");
  // White keys row
  print(" \x1b[47;30mA S D F G H J K\x1b[0m\n");
  print(" \x1b[47;30mC D E F G A B C\x1b[0m\n");
  print(" \x1b[47;30m4 4 4 4 4 4 4 5\x1b[0m\n");
  
  print("\n");
  print("\x1b[1;33mKeys:\x1b[0m White:\x1b[37mA-K\x1b[0m Black:\x1b[37mWETYU\x1b[0m\n");
  print("\x1b[1;33mESC:\x1b[0m Quit\n");
  print("\n");
  print("\x1b[1;33mSongs:\x1b[0m\n");
  print(" \x1b[32mplayScale()\x1b[0m\n");
  print(" \x1b[32mplayTwinkleTwinkle()\x1b[0m\n");
  print(" \x1b[32mplayMaryHadALamb()\x1b[0m\n");
  print(" \x1b[32mplayHappyBirthday()\x1b[0m\n");
  print("\n");
  print("Now playing:\n"); // Placeholder for note display
}

// Key press handler for piano keys
function pianoKeyHandler(key) {
  // Note: ESC key is handled universally by qandy2.htm
  // It will terminate the script and return to OS automatically
  
  // Convert to lowercase for comparison
  var keyLower = key.toLowerCase();
  
  // Check if this key is mapped to a piano note
  if (pianoKeyMap[keyLower]) {
    var note = pianoKeyMap[keyLower];
    
    // Only play if key wasn't already pressed (prevents key repeat)
    if (!pressedKeys[keyLower]) {
      playNote(note, 300);
      pressedKeys[keyLower] = note;
      updateNowPlayingDisplay();
    }
    
    return true;
  }
  
  return false;
}

// Key release handler for piano keys
function pianoKeyUpHandler(key) {
  // Convert to lowercase for comparison
  var keyLower = key.toLowerCase();
  
  // Check if this key was a piano key
  if (pianoKeyMap[keyLower] && pressedKeys[keyLower]) {
    delete pressedKeys[keyLower];
    updateNowPlayingDisplay();
    return true;
  }
  
  return false;
}

// Update the "now playing" display based on currently pressed keys
function updateNowPlayingDisplay() {
  var keys = Object.keys(pressedKeys);
  
  // Move cursor to the note display line, clear it
  print("\x1b[" + noteDisplayLine + ";1H"); // Move to line noteDisplayLine, column 1
  print("\x1b[K"); // Clear from cursor to end of line
  
  if (keys.length === 0) {
    // No keys pressed - show placeholder
    print("Now playing:");
  } else if (keys.length === 1) {
    // Single note
    var note = pressedKeys[keys[0]];
    var keyLabel = pianoKeyLabels[note];
    print("\x1b[1;36m♪ " + keyLabel + " → " + note + "\x1b[0m");
  } else {
    // Multiple notes (chord)
    var notesList = [];
    var keysList = [];
    for (var i = 0; i < keys.length; i++) {
      var note = pressedKeys[keys[i]];
      notesList.push(note);
      keysList.push(pianoKeyLabels[note]);
    }
    print("\x1b[1;35m♫ Chord: " + keysList.join('+') + " → " + notesList.join('+') + "\x1b[0m");
  }
}

// Example songs using the music API

function playScale() {
  // Use cursor positioning to display message without scrolling
  print("\x1b[" + noteDisplayLine + ";1H\x1b[K");
  print("\x1b[1;32mPlaying C Major Scale...\x1b[0m");
  playTune("C4:300 D4:300 E4:300 F4:300 G4:300 A4:300 B4:300 C5:500");
}

function playTwinkleTwinkle() {
  print("\x1b[" + noteDisplayLine + ";1H\x1b[K");
  print("\x1b[1;32mPlaying Twinkle Twinkle Little Star...\x1b[0m");
  // Twinkle twinkle little star, how I wonder what you are
  playTune("C4:300 C4:300 G4:300 G4:300 A4:300 A4:300 G4:600 " +
           "F4:300 F4:300 E4:300 E4:300 D4:300 D4:300 C4:600 " +
           "G4:300 G4:300 F4:300 F4:300 E4:300 E4:300 D4:600 " +
           "G4:300 G4:300 F4:300 F4:300 E4:300 E4:300 D4:600 " +
           "C4:300 C4:300 G4:300 G4:300 A4:300 A4:300 G4:600 " +
           "F4:300 F4:300 E4:300 E4:300 D4:300 D4:300 C4:600");
}

function playMaryHadALamb() {
  print("\x1b[" + noteDisplayLine + ";1H\x1b[K");
  print("\x1b[1;32mPlaying Mary Had a Little Lamb...\x1b[0m");
  // Mary had a little lamb, little lamb, little lamb
  playTune("E4:300 D4:300 C4:300 D4:300 E4:300 E4:300 E4:600 " +
           "D4:300 D4:300 D4:600 E4:300 G4:300 G4:600 " +
           "E4:300 D4:300 C4:300 D4:300 E4:300 E4:300 E4:300 E4:300 " +
           "D4:300 D4:300 E4:300 D4:300 C4:800");
}

function playHappyBirthday() {
  print("\x1b[" + noteDisplayLine + ";1H\x1b[K");
  print("\x1b[1;32mPlaying Happy Birthday...\x1b[0m");
  // Happy birthday to you
  playTune("C4:200 C4:200 D4:400 C4:400 F4:400 E4:800 " +
           "C4:200 C4:200 D4:400 C4:400 G4:400 F4:800 " +
           "C4:200 C4:200 C5:400 A4:400 F4:400 E4:400 D4:800 " +
           "A#4:200 A#4:200 A4:400 F4:400 G4:400 F4:800");
}

function playChord(notes, duration) {
  // Play multiple notes simultaneously (or very close together)
  // Notes should be an array like ['C4', 'E4', 'G4']
  duration = duration || 500;
  
  for (var i = 0; i < notes.length; i++) {
    (function(note, delay) {
      setTimeout(function() {
        playNote(note, duration);
      }, delay);
    })(notes[i], i * 10); // IIFE to capture note and delay correctly
  }
  
  // Use cursor positioning to display message without scrolling
  print("\x1b[" + noteDisplayLine + ";1H\x1b[K");
  print("\x1b[1;35m♫ Chord: " + notes.join(' ') + "\x1b[0m");
}

function playCMajorChord() {
  playChord(['C4', 'E4', 'G4'], 600);
}

function playFMajorChord() {
  playChord(['F4', 'A4', 'C5'], 600);
}

function playGMajorChord() {
  playChord(['G4', 'B4', 'D5'], 600);
}

function playChordProgression() {
  print("\x1b[" + noteDisplayLine + ";1H\x1b[K");
  print("\x1b[1;32mPlaying Chord Progression (C-F-G-C)...\x1b[0m");
  
  setTimeout(function() { playCMajorChord(); }, 0);
  setTimeout(function() { playFMajorChord(); }, 800);
  setTimeout(function() { playGMajorChord(); }, 1600);
  setTimeout(function() { playCMajorChord(); }, 2400);
}

// Override the keydown function to handle piano keys
var originalKeydown = typeof keydown !== 'undefined' ? keydown : null;

function keydown(key) {
  // Try to handle as piano key first
  if (pianoKeyHandler(key)) {
    return;
  }
  
  // Otherwise, call original keydown if it exists
  if (originalKeydown) {
    originalKeydown(key);
  }
}

// Override the keyup function to handle piano key releases
var originalKeyup = typeof keyup !== 'undefined' ? keyup : null;

function keyup(key) {
  // Try to handle as piano key first
  if (pianoKeyUpHandler(key)) {
    return;
  }
  
  // Otherwise, call original keyup if it exists
  if (originalKeyup) {
    originalKeyup(key);
  }
}

// Function to initialize the piano display
initializePiano = function() {
  drawPiano();
  // Don't print extra messages that would cause scrolling
  // The piano keyboard display already shows all needed information
};

// If sound.js is already loaded, initialize immediately
// Otherwise, initialization happens in the onload callback above
if (typeof beep !== 'undefined' && typeof playNote !== 'undefined') {
  initializePiano();
}
