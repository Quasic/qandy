// QANDY PIANO
// Interactive ANSI piano keyboard that plays musical notes
// Load with: piano.js
// Click on keys or press keyboard keys to play notes
// Requires: sound.js to be loaded

run="piano.js"; 
if (typeof document !== 'undefined' && document.getElementById("run")) {
  document.getElementById("run").innerHTML = run;
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

function drawPiano() {
  cls();
  print("\x1b[1;36m╔═════════════════════════════════════════════════════════════╗\x1b[0m\n");
  print("\x1b[1;36m║\x1b[0m              \x1b[1;35mQANDY PIANO - MUSICAL KEYBOARD\x1b[0m              \x1b[1;36m║\x1b[0m\n");
  print("\x1b[1;36m╚═════════════════════════════════════════════════════════════╝\x1b[0m\n");
  print("\n");
  
  // Draw the piano keyboard with ANSI art
  // Black keys (sharps/flats) - row 1
  print("    \x1b[40;37m W \x1b[0m  \x1b[40;37m E \x1b[0m      \x1b[40;37m T \x1b[0m  \x1b[40;37m Y \x1b[0m  \x1b[40;37m U \x1b[0m\n");
  print("   \x1b[40;37m│C#│\x1b[0m\x1b[40;37m│D#│\x1b[0m    \x1b[40;37m│F#│\x1b[0m\x1b[40;37m│G#│\x1b[0m\x1b[40;37m│A#│\x1b[0m\n");
  print("   \x1b[40;37m└─┘\x1b[0m\x1b[40;37m└─┘\x1b[0m    \x1b[40;37m└─┘\x1b[0m\x1b[40;37m└─┘\x1b[0m\x1b[40;37m└─┘\x1b[0m\n");
  
  // White keys (natural notes) - row 2
  print("  \x1b[47;30m│ A ││ S ││ D ││ F ││ G ││ H ││ J ││ K │\x1b[0m\n");
  print("  \x1b[47;30m│ C ││ D ││ E ││ F ││ G ││ A ││ B ││ C │\x1b[0m\n");
  print("  \x1b[47;30m│ 4 ││ 4 ││ 4 ││ 4 ││ 4 ││ 4 ││ 4 ││ 5 │\x1b[0m\n");
  print("  \x1b[47;30m└───┘└───┘└───┘└───┘└───┘└───┘└───┘└───┘\x1b[0m\n");
  
  print("\n");
  print("\x1b[1;33mHow to Play:\x1b[0m\n");
  print("  • Press keyboard keys: \x1b[1;37mA S D F G H J K\x1b[0m (white keys)\n");
  print("  • Press keyboard keys: \x1b[1;37mW E T Y U\x1b[0m (black keys)\n");
  print("  • Or click on the piano keys above\n");
  print("\n");
  print("\x1b[1;33mExample Songs:\x1b[0m\n");
  print("  • \x1b[1;32mplayTwinkleTwinkle()\x1b[0m - Twinkle Twinkle Little Star\n");
  print("  • \x1b[1;32mplayMaryHadALamb()\x1b[0m - Mary Had a Little Lamb\n");
  print("  • \x1b[1;32mplayHappyBirthday()\x1b[0m - Happy Birthday\n");
  print("  • \x1b[1;32mplayScale()\x1b[0m - C Major Scale\n");
  print("\n");
  print("\x1b[37mPress ESC to return to normal mode.\x1b[0m\n");
}

// Key press handler for piano keys
function pianoKeyHandler(key) {
  // Convert to lowercase for comparison
  var keyLower = key.toLowerCase();
  
  // Check if this key is mapped to a piano note
  if (pianoKeyMap[keyLower]) {
    var note = pianoKeyMap[keyLower];
    playNote(note, 300);
    
    // Show visual feedback
    var keyLabel = pianoKeyLabels[note];
    print("\x1b[1;36m♪ " + note + " (" + keyLabel + ")\x1b[0m\n");
    
    return true;
  }
  
  return false;
}

// Example songs using the music API

function playScale() {
  print("\x1b[1;32mPlaying C Major Scale...\x1b[0m\n");
  playTune("C4:300 D4:300 E4:300 F4:300 G4:300 A4:300 B4:300 C5:500");
}

function playTwinkleTwinkle() {
  print("\x1b[1;32mPlaying Twinkle Twinkle Little Star...\x1b[0m\n");
  // Twinkle twinkle little star, how I wonder what you are
  playTune("C4:300 C4:300 G4:300 G4:300 A4:300 A4:300 G4:600 " +
           "F4:300 F4:300 E4:300 E4:300 D4:300 D4:300 C4:600 " +
           "G4:300 G4:300 F4:300 F4:300 E4:300 E4:300 D4:600 " +
           "G4:300 G4:300 F4:300 F4:300 E4:300 E4:300 D4:600 " +
           "C4:300 C4:300 G4:300 G4:300 A4:300 A4:300 G4:600 " +
           "F4:300 F4:300 E4:300 E4:300 D4:300 D4:300 C4:600");
}

function playMaryHadALamb() {
  print("\x1b[1;32mPlaying Mary Had a Little Lamb...\x1b[0m\n");
  // Mary had a little lamb, little lamb, little lamb
  playTune("E4:300 D4:300 C4:300 D4:300 E4:300 E4:300 E4:600 " +
           "D4:300 D4:300 D4:600 E4:300 G4:300 G4:600 " +
           "E4:300 D4:300 C4:300 D4:300 E4:300 E4:300 E4:300 E4:300 " +
           "D4:300 D4:300 E4:300 D4:300 C4:800");
}

function playHappyBirthday() {
  print("\x1b[1;32mPlaying Happy Birthday...\x1b[0m\n");
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
  
  print("\x1b[1;35m♫ Chord: " + notes.join(' ') + "\x1b[0m\n");
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
  print("\x1b[1;32mPlaying Chord Progression (C-F-G-C)...\x1b[0m\n");
  
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

// Initialize piano when script loads
drawPiano();

print("\x1b[1;32m♪ Piano loaded successfully!\x1b[0m\n");
print("\x1b[37mStart playing by pressing keys on your keyboard.\x1b[0m\n\n");
