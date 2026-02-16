# Multi-Note and Chord Capabilities

## Overview

The Qandy Piano supports playing multiple notes simultaneously (chords) through both physical keyboards and touchscreens. This document details the hardware capabilities, software implementation, and usage.

## Hardware Capabilities

### Physical Keyboards

**Can Play Multiple Notes Simultaneously: YES ✓**

Physical keyboards support multiple simultaneous key presses through "n-key rollover" (NKRO):

| Keyboard Type | Typical Rollover | Notes |
|---------------|------------------|-------|
| Standard/Office | 2-3 keys | Basic typing use |
| Laptop | 3-4 keys | Varies by model |
| Gaming | 6+ keys (6KRO) | Common standard |
| High-end Gaming | Full NKRO | All keys tracked |

**How It Works:**
1. Each key press generates a separate `keydown` event
2. Each key release generates a separate `keyup` event
3. JavaScript receives events independently for each key
4. Events include key code to identify which key

**Testing Your Keyboard:**
1. Load piano.js in qandy
2. Press and hold multiple keys simultaneously (e.g., A+S+D)
3. Display shows: `♫ Chord: A+S+D → C4+D4+E4`
4. Number of keys that register = your keyboard's rollover capability

**Common Limitations:**
- Some key combinations blocked by design (e.g., Ctrl+Alt+Del)
- Certain key positions may share circuitry (matrix scanning)
- Laptop keyboards typically more limited than desktop keyboards

### Touchscreens

**Can Play Multiple Notes Simultaneously: YES ✓**

Modern touchscreens support multi-touch input:

| Device Type | Typical Touch Points | Notes |
|-------------|---------------------|-------|
| Smartphones | 5-10 points | Most modern phones |
| Tablets | 10+ points | iPad, Android tablets |
| Touch Monitors | 10+ points | Professional displays |

**How It Works:**
1. Touch events include `touches` array with all active touch points
2. Each touch point has unique identifier
3. JavaScript can process multiple touches simultaneously
4. Touch start/end events fired for each touch independently

**Piano.js Touch Implementation:**
- Touch events would trigger key press for touched piano key
- Multiple simultaneous touches = multiple notes
- Release touch = key release
- Currently keyboard-focused; touch API integration possible enhancement

## Software Implementation

### sound.js - Web Audio API

**Can Produce Multiple Notes Simultaneously: YES ✓**

The Web Audio API creates independent audio nodes:

```javascript
// Each note creates a separate oscillator
function playNote(note, duration = 200) {
  const frequency = noteFrequencies[note];
  
  // Create NEW oscillator for this note
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  
  oscillator.type = 'sine';
  oscillator.frequency.value = frequency;
  gainNode.gain.value = 0.3;
  
  // Connect: oscillator → gain → speakers
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  
  // Play for specified duration
  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + duration / 1000);
}
```

**Key Points:**
- Each `playNote()` call creates independent oscillator
- Oscillators run in parallel, not sequentially
- Audio context mixes all active oscillators automatically
- No practical limit on simultaneous notes (hardware dependent)

**Existing Chord Functions:**
```javascript
// Play C major chord
playChord(['C4', 'E4', 'G4'], 600);

// Internally calls playNote() for each note with slight offset
function playChord(notes, duration) {
  for (var i = 0; i < notes.length; i++) {
    (function(note, delay) {
      setTimeout(function() {
        playNote(note, duration);
      }, delay);
    })(notes[i], i * 10); // 10ms stagger for cleaner attack
  }
}
```

### piano.js - Key Tracking

**Can Display Multiple Notes: YES ✓**

The enhanced display system tracks all pressed keys:

```javascript
// Track which keys are currently pressed
var pressedKeys = {};  // { 'a': 'C4', 's': 'D4', ... }

// On key press
if (!pressedKeys[keyLower]) {
  playNote(note, 300);
  pressedKeys[keyLower] = note;
  updateNowPlayingDisplay();
}

// On key release
if (pressedKeys[keyLower]) {
  delete pressedKeys[keyLower];
  updateNowPlayingDisplay();
}
```

**Display Logic:**

| Keys Pressed | Display Format | Example |
|--------------|----------------|---------|
| 0 | Placeholder | `Now playing:` |
| 1 | Single note | `♪ A → C4` |
| 2+ | Chord | `♫ Chord: A+S+D → C4+D4+E4` |

**Display Features:**
- Real-time updates on key press/release
- Shows keyboard letters → musical notes
- Color coded (cyan for single, magenta for chord)
- Uses ANSI cursor positioning (no scrolling)

## Usage Examples

### Single Note

**Action:** Press and hold 'A' key

**Display:**
```
♪ A → C4
```

**Sound:** Plays C4 (middle C) for 300ms

### Two-Note Interval

**Action:** Press and hold 'A' and 'D' simultaneously

**Display:**
```
♫ Chord: A+D → C4+E4
```

**Sound:** Plays C4 and E4 together (major third interval)

### Three-Note Chord

**Action:** Press and hold 'A', 'S', and 'D' simultaneously

**Display:**
```
♫ Chord: A+S+D → C4+D4+E4
```

**Sound:** Plays C major triad (C4, D4, E4 - though technically not a standard triad)

### Proper C Major Chord

**Action:** Press and hold 'A', 'D', and 'G' simultaneously

**Display:**
```
♫ Chord: A+D+G → C4+E4+G4
```

**Sound:** Plays C major triad (C4, E4, G4)

### Release Behavior

**Action:** 
1. Press A+S+D (displays chord)
2. Release S (displays A+D)
3. Release D (displays A only)
4. Release A (clears to "Now playing:")

**Display Sequence:**
```
♫ Chord: A+S+D → C4+D4+E4
♫ Chord: A+D → C4+E4
♪ A → C4
Now playing:
```

## Technical Limitations

### Browser Limitations
- Web Audio API requires user interaction before first sound
- Some browsers limit number of active audio contexts
- Mobile browsers may have additional restrictions

### Performance Considerations
- Each oscillator uses CPU resources
- Typical modern hardware: 20-30 simultaneous notes easily
- More notes = more mixing/processing required
- Quality depends on device audio hardware

### Keyboard Limitations
- Key rollover varies by keyboard model
- Some key combinations impossible on certain keyboards
- Ghosting can occur on low-quality keyboards
- USB keyboards generally better than PS/2 for rollover

### Display Limitations
- Screen width: 32 characters
- Very long chord displays may truncate
- Current implementation shows all pressed keys (no limit)
- Example long chord: `♫ Chord: A+S+D+F+G+H → ...` (truncates at edge)

## Testing Multi-Note Capability

### Test 1: Basic Chord
1. Load qandy2.htm in browser
2. Run: `piano.js`
3. Press A+D+G simultaneously
4. Expected: Three-note sound + chord display
5. Release keys one by one
6. Expected: Display updates for each release

### Test 2: Keyboard Rollover
1. Start with all keys released
2. Press and hold A
3. Add S (keep A held)
4. Add D (keep A+S held)
5. Add F (keep A+S+D held)
6. Continue adding keys
7. Count how many register simultaneously
8. This is your keyboard's rollover capability

### Test 3: Programmatic Chord
```javascript
// Test from qandy command line
playChord(['C4', 'E4', 'G4', 'C5'], 800);
```
Expected: Four-note C major chord with octave

### Test 4: Large Chord
```javascript
// Test many simultaneous notes
var bigChord = ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C5'];
playChord(bigChord, 1000);
```
Expected: Eight notes playing together

## Best Practices

### For Users
1. **Check keyboard capability** - Test with multiple keys
2. **Use gaming keyboard** - If serious about chords
3. **Try different combinations** - Some work better than others
4. **Release keys cleanly** - For best display behavior

### For Developers
1. **Limit simultaneous notes** - Keep under 10 for performance
2. **Stagger note starts** - 10ms offset for cleaner attack
3. **Use gain control** - Multiple notes = louder, adjust volume
4. **Handle edge cases** - What if 20 keys pressed?

## Future Enhancements

### Possible Improvements
- Touch event support for mobile
- Visual highlighting of pressed keys
- Chord name recognition (C major, G7, etc.)
- Sustain pedal simulation
- MIDI input support
- Recording and playback
- Arpeggiator mode

### Touch Implementation Sketch
```javascript
// Potential touch event handler
canvas.addEventListener('touchstart', function(e) {
  e.preventDefault();
  for (var i = 0; i < e.touches.length; i++) {
    var touch = e.touches[i];
    var key = findKeyAtPosition(touch.clientX, touch.clientY);
    if (key) {
      pianoKeyHandler(key);
    }
  }
});
```

## Summary

✅ **Physical keyboards**: 2-6+ simultaneous keys (hardware dependent)
✅ **Touchscreens**: 5-10+ simultaneous touches (hardware dependent)
✅ **sound.js**: Unlimited simultaneous notes (performance dependent)
✅ **Display**: Shows all pressed keys as single note or chord
✅ **Key tracking**: Proper press/release handling
✅ **Real-time updates**: Display updates immediately

The Qandy Piano fully supports playing multiple notes simultaneously through both keyboard and programmatic interfaces. The limiting factor is typically the input hardware (keyboard rollover or touch points) rather than the software.
