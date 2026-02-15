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
print("  \x1b[1;32mbeep(freq, duration)\x1b[0m - Custom freq + duration\n\n");
print("\x1b[1;33mExamples:\x1b[0m\n");
print("  beep()           - Standard beep (800Hz, 200ms)\n");
print("  beep(1000)       - 1000Hz beep\n");
print("  beep(440, 500)   - A4 note for 500ms\n\n");
print("Press \x1b[1;32mB\x1b[0m to test beep\n");
print("Press \x1b[1;32mQ\x1b[0m to quit\n\n");

// Create Web Audio context (lazily initialized on first beep)
var audioContext = null;

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
  } else if (key === "Q") {
    cls();
    keyon = 1;
    run = "";
    print("Returned to command mode\n");
  }
}

keyon = 1;
