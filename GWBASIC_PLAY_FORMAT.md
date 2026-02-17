# GWBASIC PLAY Command Format

## Overview

The Qandy Sound Card now supports the GWBASIC.COM "PLAY [string]" command format through the new `playNotes()` function. This allows game developers to use familiar BASIC music notation to add background music and sound effects to their games.

## Quick Start

```javascript
// Load sound.js first
// <script src="sound.js"></script>

// Play a simple melody
playNotes("C D E F G A B");

// Play with octave and note length
playNotes("O3 L8 CDEFGAB");

// Complex example with tempo
playNotes("T100 C#4 D8 F+16");
```

## Format Specification

The GWBASIC PLAY format uses a text string with the following commands:

### Notes (A-G)
Musical notes from the chromatic scale:
- `A`, `B`, `C`, `D`, `E`, `F`, `G`

### Modifiers
- `#` or `+` - Sharp (raise by one semitone)
  - Example: `C#`, `D+`
- `-` - Flat (lower by one semitone)
  - Example: `D-`, `E-`

### Length (L command)
Sets the default note length for subsequent notes:
- `L1` - Whole note
- `L2` - Half note
- `L4` - Quarter note (default)
- `L8` - Eighth note
- `L16` - Sixteenth note
- `L32` - Thirty-second note

You can also specify length for individual notes:
- `C4` - C as a quarter note
- `D8` - D as an eighth note
- `E16` - E as a sixteenth note

### Octave (O command)
Sets the current octave (0-6):
- `O0` - Very low octave
- `O1` - Low octave
- `O2` - Lower octave
- `O3` - Middle-low octave
- `O4` - Middle octave (default)
- `O5` - Upper octave
- `O6` - High octave

### Tempo (T command)
Sets the speed in quarter notes per minute:
- `T60` - Slow (60 BPM)
- `T120` - Normal (120 BPM, default)
- `T200` - Fast (200 BPM)
- Valid range: 1-255

### Pause/Rest (P command)
Creates silence:
- `P` - Rest using current default length
- `P4` - Quarter rest
- `P8` - Eighth rest
- `P16` - Sixteenth rest

## Examples

### Basic Melody
```javascript
playNotes("C D E F G A B");
// Plays C-major scale at default tempo and length
```

### With Octave and Length
```javascript
playNotes("O3 L8 CDEFGAB");
// Plays 3rd octave C-B scale using eighth notes
```

### Complex Example
```javascript
playNotes("T100 C#4 D8 F+16");
// Tempo 100 BPM
// C# quarter note
// D eighth note  
// F# sixteenth note
```

### Sharps and Flats
```javascript
// Using # for sharps
playNotes("C# D# F# G# A#");

// Using + for sharps (equivalent)
playNotes("C+ D+ F+ G+ A+");

// Using - for flats
playNotes("D- E- G- A- B-");
```

### Different Tempos
```javascript
// Slow tempo
playNotes("T60 C D E F G");

// Fast tempo
playNotes("T200 C D E F G");
```

### Different Note Lengths
```javascript
// Whole notes (long)
playNotes("L1 C D E");

// Eighth notes (quick)
playNotes("L8 C D E F G A B C");

// Mixed lengths
playNotes("C1 D2 E4 F8 G16");
```

### With Rests
```javascript
playNotes("C P4 E P4 G");
// Plays C, quarter rest, E, quarter rest, G
```

### Musical Example
```javascript
// Beginning of "Twinkle Twinkle Little Star"
playNotes("T120 L4 C C G G A A G2");
```

## Background Playback

The `playNotes()` function plays notes in the background using setTimeout, allowing your game code to continue executing while music plays:

```javascript
// Start playing music
playNotes("O4 L8 C D E F G A B C");

// Your game code continues executing immediately
console.log("Music is playing in background!");
player.move();
```

## Looping Background Music

Use `loopNotes()` to continuously repeat a melody:

```javascript
// Start looping background music
loopNotes("O4 L8 C E G E");

// Stop the loop when needed
stopTune();
```

### Game Example
```javascript
function startLevel() {
  // Start background music for the level
  loopNotes("T140 L8 C E G E F A C5 A F D C");
}

function gameOver() {
  // Stop background music
  stopTune();
  
  // Play game over sound
  playNotes("T80 L4 C G- E- C2");
}
```

## Compatibility with Existing Functions

The `playNotes()` function works alongside the existing Qandy sound functions:

```javascript
// Old format (still works)
playTune("C4:300 E4:300 G4:600");

// New GWBASIC format
playNotes("L4 C E G2");

// They can be used together
playNotes("C E G");
setTimeout(() => playTune("C:100 E:100 G:100"), 1000);
```

## Function Reference

### playNotes(gwbasicString, onComplete)
Plays notes in GWBASIC PLAY command format.

**Parameters:**
- `gwbasicString` (string) - Music string in GWBASIC format
- `onComplete` (function, optional) - Callback when music finishes

**Returns:** `true` if successful, `false` if string is invalid

**Example:**
```javascript
playNotes("C D E F G", function() {
  console.log("Scale finished!");
});
```

### loopNotes(gwbasicString)
Continuously loops notes in GWBASIC format.

**Parameters:**
- `gwbasicString` (string) - Music string in GWBASIC format

**Example:**
```javascript
loopNotes("O4 L8 C E G E");
```

### stopTune()
Stops currently playing music (works for both `playNotes` and `loopNotes`).

**Example:**
```javascript
stopTune();
```

## Duration Calculation

Note durations are calculated based on tempo and note length:

```
duration (ms) = (60000 / tempo) × (4 / length)
```

Examples at default T120:
- L1 (whole): (60000/120) × (4/1) = 2000ms
- L2 (half): (60000/120) × (4/2) = 1000ms
- L4 (quarter): (60000/120) × (4/4) = 500ms
- L8 (eighth): (60000/120) × (4/8) = 250ms
- L16 (sixteenth): (60000/120) × (4/16) = 125ms

## Tips for Game Developers

1. **Background Music**: Use `loopNotes()` for continuous background music
2. **Sound Effects**: Use short `playNotes()` calls for game events
3. **Control Flow**: Call `stopTune()` when changing game states
4. **Tempo**: Adjust tempo to match game pace (T60-T200 recommended)
5. **Testing**: Use the `test-gwbasic-play.html` file to experiment

## Differences from Original GWBASIC

While we've implemented the core GWBASIC PLAY functionality, there are some differences:

**Supported:**
- Notes (A-G)
- Sharps (#, +) and Flats (-)
- Length (L command and per-note)
- Octave (O command, 0-6)
- Tempo (T command)
- Pause (P command)

**Not Implemented:**
- Music style (MS/ML/MN for staccato/legato/normal)
- Dots (for dotted notes)
- N command (play by note number)
- > and < (octave up/down)

These features may be added in future updates if there's demand.

## Testing

A comprehensive test page is included at `test-gwbasic-play.html` that demonstrates all features of the GWBASIC PLAY format.

## Credits

The GWBASIC PLAY command format support was added to the Qandy Sound Card to provide compatibility with classic BASIC music notation, making it easier for retro game developers to add music to their games.
