# Qandy Sound API Documentation

## Overview

The Qandy Sound Card (`sound.js`) provides a comprehensive audio API for the Qandy Pocket Computer. It allows developers to add sound effects and music to their games and applications.

## Features

- System beeps and tones at custom frequencies
- Musical notes across 9 octaves (C0 to B8)
- Music notation parser for playing melodies from strings
- Background music support with looping
- No console output - silent API perfect for embedding in games

## Installation

Simply load `sound.js` in your HTML file or Qandy script:

```html
<script src="sound.js"></script>
```

The script will beep once when loaded to confirm audio is working.

## API Reference

### Basic Sound Functions

#### `beep()`
Plays a standard system beep (800Hz, 200ms).

```javascript
beep();  // Standard beep
```

#### `beep(frequency)`
Plays a beep at a custom frequency (in Hz).

```javascript
beep(1000);  // 1000Hz beep
beep(440);   // A4 note (440Hz)
```

#### `beep(frequency, duration)`
Plays a beep at a custom frequency for a specified duration (in milliseconds).

```javascript
beep(800, 500);   // 800Hz for 500ms
beep(1200, 100);  // Short 1200Hz beep
```

### Musical Note Functions

#### `playNote(note)`
Plays a musical note from the chromatic scale. Default duration is 200ms.

```javascript
playNote('C');    // Middle C (C4)
playNote('C4');   // Middle C explicitly
playNote('A4');   // A above middle C (440Hz)
playNote('C#5');  // C sharp, octave 5
playNote('Db5');  // D flat (same as C#5)
```

**Note Format:**
- Letter: C, D, E, F, G, A, B
- Optional sharp (#) or flat (b): C#, Db
- Optional octave: 0-8 (defaults to 4)
- Examples: C, C4, C#4, Db4, C5, C#5

#### `playNote(note, duration)`
Plays a musical note for a specified duration (in milliseconds).

```javascript
playNote('C4', 500);   // Play C4 for 500ms
playNote('E4', 300);   // Play E4 for 300ms
```

### Music Notation Functions

#### `playTune(musicString)`
Plays a sequence of notes from a music notation string. This is the easiest way to add melodies and soundtracks to your games.

**Music String Format:**
```
NOTE:DURATION NOTE:DURATION ...
```

- `NOTE`: Musical note (C4, E4, G4, etc.) or R/REST for silence
- `DURATION`: Duration in milliseconds (optional, defaults to 200ms)
- Separate notes with spaces

**Examples:**

```javascript
// Simple melody (durations default to 200ms)
playTune("C E G C5");

// Melody with custom durations
playTune("C4:300 E4:300 G4:600");

// Melody with rests
playTune("C4:200 R:100 E4:200 R:100 G4:400");

// Complete song
playTune("C4:300 C4:300 G4:300 G4:300 A4:300 A4:300 G4:600");
```

#### `playMelody(notesArray)`
Plays a sequence of notes from an array format.

**Array Format:**
```javascript
[
  [note, duration],
  [note, duration],
  ...
]
```

**Examples:**

```javascript
// Simple melody
playMelody([
  ['C4', 300],
  ['E4', 300],
  ['G4', 600]
]);

// With rests
playMelody([
  ['C4', 200],
  ['R', 100],
  ['E4', 200]
]);
```

#### `loopTune(musicString)`
Plays a music string continuously in a loop. Perfect for background music.

```javascript
// Simple background loop
loopTune("C E G E");

// More complex background music
loopTune("C4:200 E4:200 G4:200 E4:200 F4:200 A4:200 C5:400");
```

#### `stopTune()`
Stops the currently playing tune or loop.

```javascript
stopTune();
```

## Piano Keyboard

The `piano.js` script provides an interactive ANSI piano keyboard.

### Keyboard Mapping

**White Keys (Natural Notes):**
- A = C4
- S = D4
- D = E4
- F = F4
- G = G4
- H = A4
- J = B4
- K = C5

**Black Keys (Sharps/Flats):**
- W = C#4
- E = D#4
- T = F#4
- Y = G#4
- U = A#4

### Example Songs in Piano.js

The piano script includes several example songs:

```javascript
playScale();              // C Major scale
playTwinkleTwinkle();     // Twinkle Twinkle Little Star
playMaryHadALamb();       // Mary Had a Little Lamb
playHappyBirthday();      // Happy Birthday song
playCMajorChord();        // C-E-G chord
playChordProgression();   // C-F-G-C progression
```

## Music Notation Reference

### Inspired by Classic Computer Music Formats

The Qandy music notation is inspired by early computer music systems like:

- **BASIC PLAY Command**: Simple note sequences
- **Commodore 64 SID Chip**: Text-based music notation
- **PC Speaker Music**: DOS-era music strings

### Note Frequency Table (A4 = 440Hz)

| Note | Freq (Hz) | Note | Freq (Hz) |
|------|-----------|------|-----------|
| C4   | 261.63    | C5   | 523.25    |
| C#4  | 277.18    | C#5  | 554.37    |
| D4   | 293.66    | D5   | 587.33    |
| D#4  | 311.13    | D#5  | 622.25    |
| E4   | 329.63    | E5   | 659.25    |
| F4   | 349.23    | F5   | 698.46    |
| F#4  | 369.99    | F#5  | 739.99    |
| G4   | 392.00    | G5   | 783.99    |
| G#4  | 415.30    | G#5  | 830.61    |
| A4   | 440.00    | A5   | 880.00    |
| A#4  | 466.16    | A#5  | 932.33    |
| B4   | 493.88    | B5   | 987.77    |

## Game Development Examples

### Simple Jump Sound Effect

```javascript
function jumpSound() {
  playNote('C5', 100);
  setTimeout(function() { playNote('E5', 100); }, 100);
}
```

### Coin Collection Sound

```javascript
function coinSound() {
  playTune("E5:50 G5:100");
}
```

### Game Over Sound

```javascript
function gameOverSound() {
  playTune("C4:200 G3:200 E3:400");
}
```

### Background Music Loop

```javascript
function startGameMusic() {
  loopTune("C4:200 E4:200 G4:200 E4:200 F4:200 A4:200 G4:400 R:200");
}

function stopGameMusic() {
  stopTune();
}
```

### Victory Fanfare

```javascript
function victorySound() {
  playTune("C4:100 E4:100 G4:100 C5:400 R:100 G4:100 C5:400");
}
```

## Browser Compatibility

The Sound API uses the Web Audio API, which is supported in all modern browsers:
- Chrome/Edge (Chromium)
- Firefox
- Safari
- Opera

**Note:** Audio must be triggered by user interaction in modern browsers. The initial beep on script load serves as the audio initialization.

## Tips for Game Developers

1. **Keep melodies short**: For game sound effects, use 1-3 notes
2. **Use background loops**: The `loopTune()` function is perfect for game soundtracks
3. **Stop music during transitions**: Always call `stopTune()` when changing game states
4. **Test audio timing**: The duration values are in milliseconds
5. **Use rests for rhythm**: The 'R' note creates silence in melodies

## Advanced: Creating Custom Songs

To create your own songs, follow this pattern:

1. **Start with the melody**: Write out the note sequence
2. **Add timing**: Experiment with different durations
3. **Add rests**: Use pauses for rhythm
4. **Test and refine**: Play the tune and adjust as needed

Example process:
```javascript
// Step 1: Basic melody
playTune("C E G");

// Step 2: Add timing
playTune("C:200 E:200 G:400");

// Step 3: Add rests and more notes
playTune("C:200 R:50 E:200 R:50 G:400 R:100 C5:600");
```

## Future Enhancements

Potential additions to the Sound API:
- Waveform selection (sine, square, sawtooth, triangle)
- Volume control
- Envelope control (attack, decay, sustain, release)
- Multi-channel polyphony
- MIDI file import
- Sound effects library

## Credits

The Qandy Sound Card was developed for the Qandy Pocket Computer project, bringing retro computer music capabilities to modern web browsers.
