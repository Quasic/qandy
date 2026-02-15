// QANDY BEEP UTILITY
// Generates system beep sounds using Web Audio API
// Modern browsers don't support ASCII BEL character (\x07) for security reasons
// This provides an alternative using actual audio generation

run="beep.js";
keyon=0;

cls();
print("\n");
print("\x1b[1;36mQANDY BEEP UTILITY\x1b[0m\n");
print("\x1b[0;37m══════════════════════════════════════════\x1b[0m\n\n");
print("The ASCII BEL character (\\x07 or \\a) doesn't\n");
print("work in modern browsers like Firefox due to\n");
print("security restrictions.\n\n");
print("This utility provides working alternatives:\n\n");
print("\x1b[1;33mCommands:\x1b[0m\n");
print("  \x1b[1;32mbeep()\x1b[0m      - Play a standard beep\n");
print("  \x1b[1;32mbeep(freq)\x1b[0m  - Custom frequency (Hz)\n");
print("  \x1b[1;32mbeep(freq, duration)\x1b[0m - Custom freq + duration\n");
print("  \x1b[1;32mplayNote(note)\x1b[0m - Play a musical note\n");
print("  \x1b[1;32mplayNote(note, duration)\x1b[0m - Note with duration\n\n");
print("\x1b[1;33mExamples:\x1b[0m\n");
print("  beep()           - Standard beep (800Hz, 200ms)\n");
print("  beep(1000)       - 1000Hz beep\n");
print("  beep(440, 500)   - A4 note for 500ms\n");
print("  playNote('C')    - Play middle C (C4)\n");
print("  playNote('A4')   - Play A4 (440Hz)\n");
print("  playNote('C#5', 500) - C sharp octave 5, 500ms\n\n");
print("Press \x1b[1;32mB\x1b[0m to test beep\n");
print("Press \x1b[1;32mN\x1b[0m to play a note scale\n");
print("Press \x1b[1;32mQ\x1b[0m to quit\n\n");

// Create Web Audio context (lazily initialized on first beep)
var audioContext = null;

// Musical note frequencies (in Hz) based on A4 = 440Hz
// Supports notes from C0 to B8
var noteFrequencies = {
  // Octave 0
  'C0': 16.35, 'C#0': 17.32, 'Db0': 17.32, 'D0': 18.35, 'D#0': 19.45, 'Eb0': 19.45,
  'E0': 20.60, 'F0': 21.83, 'F#0': 23.12, 'Gb0': 23.12, 'G0': 24.50, 'G#0': 25.96, 'Ab0': 25.96,
  'A0': 27.50, 'A#0': 29.14, 'Bb0': 29.14, 'B0': 30.87,
  
  // Octave 1
  'C1': 32.70, 'C#1': 34.65, 'Db1': 34.65, 'D1': 36.71, 'D#1': 38.89, 'Eb1': 38.89,
  'E1': 41.20, 'F1': 43.65, 'F#1': 46.25, 'Gb1': 46.25, 'G1': 49.00, 'G#1': 51.91, 'Ab1': 51.91,
  'A1': 55.00, 'A#1': 58.27, 'Bb1': 58.27, 'B1': 61.74,
  
  // Octave 2
  'C2': 65.41, 'C#2': 69.30, 'Db2': 69.30, 'D2': 73.42, 'D#2': 77.78, 'Eb2': 77.78,
  'E2': 82.41, 'F2': 87.31, 'F#2': 92.50, 'Gb2': 92.50, 'G2': 98.00, 'G#2': 103.83, 'Ab2': 103.83,
  'A2': 110.00, 'A#2': 116.54, 'Bb2': 116.54, 'B2': 123.47,
  
  // Octave 3
  'C3': 130.81, 'C#3': 138.59, 'Db3': 138.59, 'D3': 146.83, 'D#3': 155.56, 'Eb3': 155.56,
  'E3': 164.81, 'F3': 174.61, 'F#3': 185.00, 'Gb3': 185.00, 'G3': 196.00, 'G#3': 207.65, 'Ab3': 207.65,
  'A3': 220.00, 'A#3': 233.08, 'Bb3': 233.08, 'B3': 246.94,
  
  // Octave 4 (Middle octave)
  'C4': 261.63, 'C#4': 277.18, 'Db4': 277.18, 'D4': 293.66, 'D#4': 311.13, 'Eb4': 311.13,
  'E4': 329.63, 'F4': 349.23, 'F#4': 369.99, 'Gb4': 369.99, 'G4': 392.00, 'G#4': 415.30, 'Ab4': 415.30,
  'A4': 440.00, 'A#4': 466.16, 'Bb4': 466.16, 'B4': 493.88,
  
  // Octave 5
  'C5': 523.25, 'C#5': 554.37, 'Db5': 554.37, 'D5': 587.33, 'D#5': 622.25, 'Eb5': 622.25,
  'E5': 659.25, 'F5': 698.46, 'F#5': 739.99, 'Gb5': 739.99, 'G5': 783.99, 'G#5': 830.61, 'Ab5': 830.61,
  'A5': 880.00, 'A#5': 932.33, 'Bb5': 932.33, 'B5': 987.77,
  
  // Octave 6
  'C6': 1046.50, 'C#6': 1108.73, 'Db6': 1108.73, 'D6': 1174.66, 'D#6': 1244.51, 'Eb6': 1244.51,
  'E6': 1318.51, 'F6': 1396.91, 'F#6': 1479.98, 'Gb6': 1479.98, 'G6': 1567.98, 'G#6': 1661.22, 'Ab6': 1661.22,
  'A6': 1760.00, 'A#6': 1864.66, 'Bb6': 1864.66, 'B6': 1975.53,
  
  // Octave 7
  'C7': 2093.00, 'C#7': 2217.46, 'Db7': 2217.46, 'D7': 2349.32, 'D#7': 2489.02, 'Eb7': 2489.02,
  'E7': 2637.02, 'F7': 2793.83, 'F#7': 2959.96, 'Gb7': 2959.96, 'G7': 3135.96, 'G#7': 3322.44, 'Ab7': 3322.44,
  'A7': 3520.00, 'A#7': 3729.31, 'Bb7': 3729.31, 'B7': 3951.07,
  
  // Octave 8
  'C8': 4186.01, 'C#8': 4434.92, 'Db8': 4434.92, 'D8': 4698.63, 'D#8': 4978.03, 'Eb8': 4978.03,
  'E8': 5274.04, 'F8': 5587.65, 'F#8': 5919.91, 'Gb8': 5919.91, 'G8': 6271.93, 'G#8': 6644.88, 'Ab8': 6644.88,
  'A8': 7040.00, 'A#8': 7458.62, 'Bb8': 7458.62, 'B8': 7902.13
};

function playNote(note, duration = 200) {
  // Convert note to uppercase and trim whitespace
  note = note.toString().trim().toUpperCase();
  
  // If only a letter is provided (e.g., "C"), default to octave 4 (middle C)
  if (note.length === 1 && note >= 'A' && note <= 'G') {
    note = note + '4';
  } else if (note.length === 2 && (note[1] === '#' || note[1] === 'B')) {
    // If note is like "C#" or "Db", default to octave 4
    note = note + '4';
  }
  
  // Look up the frequency for the note
  const frequency = noteFrequencies[note];
  
  if (!frequency) {
    print("\x1b[1;31mError: Unknown note '" + note + "'\x1b[0m\n");
    print("Valid notes: C, C#/Db, D, D#/Eb, E, F, F#/Gb, G, G#/Ab, A, A#/Bb, B\n");
    print("Octaves: 0-8 (e.g., 'C4' is middle C, 'A4' is 440Hz)\n");
    return false;
  }
  
  // Use the existing beep function with the note's frequency
  return beep(frequency, duration);
}

function beep(frequency = 800, duration = 200) {
  // Default values: 800 Hz, 200 milliseconds
  
  try {
    // Initialize audio context on first use (must be triggered by user interaction)
    if (!audioContext) {
      if (!window.AudioContext && !window.webkitAudioContext) {
        throw new Error('Web Audio API is not supported in this browser');
      }
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    
    // Create oscillator (tone generator)
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    // Configure oscillator
    oscillator.type = 'sine';  // sine wave for a pure tone
    oscillator.frequency.value = frequency;
    
    // Configure volume (gain)
    gainNode.gain.value = 0.3;  // 30% volume to avoid being too loud
    
    // Connect audio nodes: oscillator -> gain -> output
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    // Start and stop the tone
    const startTime = audioContext.currentTime;
    const endTime = startTime + (duration / 1000);
    
    oscillator.start(startTime);
    oscillator.stop(endTime);
    
    return true;
  } catch (error) {
    print("\x1b[1;31mError: " + error.message + "\x1b[0m\n");
    print("Your browser may not support Web Audio API.\n");
    return false;
  }
}

function keydown(k) {
  var key = k.toUpperCase();
  
  if (key === "B") {
    print("\x1b[1;33mPlaying beep...\x1b[0m\n");
    if (beep()) {
      print("\x1b[1;32m✓ Beep played successfully!\x1b[0m\n\n");
    }
  } else if (key === "N") {
    print("\x1b[1;33mPlaying C major scale (C4-C5)...\x1b[0m\n");
    // Play a C major scale with 300ms per note
    var scale = ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C5'];
    var delay = 0;
    for (var i = 0; i < scale.length; i++) {
      (function(note, waitTime) {
        setTimeout(function() {
          playNote(note, 300);
          print("  " + note + " ♪\n");
        }, waitTime);
      })(scale[i], delay);
      delay += 350; // 300ms note + 50ms gap
    }
    setTimeout(function() {
      print("\x1b[1;32m✓ Scale complete!\x1b[0m\n\n");
    }, delay);
  } else if (key === "Q") {
    cls();
    keyon = 1;
    run = "";
    print("Returned to command mode\n");
  }
}

keyon = 1;
