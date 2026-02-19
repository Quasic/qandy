# Quick Start Guide - Qandy Sound API

## Get Started in 3 Steps

### 1. Load the Sound Card
```html
<script src="sound.js"></script>
```

You'll hear a beep when it loads successfully.

### 2. Play Your First Note
```javascript
playNote('C4');  // Middle C
```

### 3. Play Your First Melody
```javascript
playTune("C E G C5");  // Simple scale
```

That's it! You're making music! 🎵

---

## Common Use Cases

### Game Sound Effects

```javascript
// Jump sound
playNote('C5', 100);

// Collect item
playTune("E5:50 G5:100");

// Game over
playTune("C4:200 G3:200 E3:400");
```

### Background Music

```javascript
// Start background music
loopTune("C4:200 E4:200 G4:200 E4:200 F4:200 A4:200 G4:400");

// Stop when needed
stopTune();
```

### Interactive Piano

```javascript
// Load piano.js after sound.js
// Users can play by pressing keyboard keys:
// A S D F G H J K (white keys)
// W E T Y U (black keys)

// Or call built-in songs:
playTwinkleTwinkle();
playMaryHadALamb();
```

---

## Music Notation Cheat Sheet

### Basic Format
```
NOTE:DURATION NOTE:DURATION ...
```

### Examples
```javascript
"C E G"              // Simple (200ms each)
"C:100 E:100 G:400"  // With timing
"C4 R:100 E4"        // With rest (R)
"C#4 Db5 F#3"        // Sharps and flats
```

### Note Names
- **Natural:** C, D, E, F, G, A, B
- **Sharp:** C#, D#, F#, G#, A#
- **Flat:** Db, Eb, Gb, Ab, Bb
- **Octave:** 0-8 (4 is middle, default)
- **Rest:** R or REST

---

## Full API Reference

See [SOUND_API_DOCS.md](SOUND_API_DOCS.md) for complete documentation.

## Example Songs

Try these built-in examples from piano.js:

```javascript
playScale();              // C major scale
playTwinkleTwinkle();     // Classic lullaby
playMaryHadALamb();       // Nursery rhyme
playHappyBirthday();      // Birthday song
playCMajorChord();        // Harmony chord
playChordProgression();   // C-F-G-C
```

---

## Pro Tips

1. **Keep sound effects short** (50-200ms) for responsive gameplay
2. **Use loopTune()** for background music in menus/gameplay
3. **Always stopTune()** before starting a new loop
4. **Test timings** - adjust durations to match your game feel
5. **Use rests (R)** to add rhythm to melodies

---

## Troubleshooting

**No sound?**
- Check browser console for errors
- Ensure audio context is initialized (should beep on load)
- Some browsers require user interaction before audio plays

**Timing seems off?**
- Duration is in milliseconds (1000ms = 1 second)
- Try adjusting the tempo: shorter durations = faster

**Wrong notes?**
- Check octave number (4 is middle, 5 is higher)
- Remember: C4 is middle C, A4 is 440Hz

**Piano keys not working?**
- Make sure your script sets `run="yourscript.js"` at the beginning
- The qandy system only routes keyboard events to scripts with `run` set
- Example:
  ```javascript
  run="piano.js";
  if (typeof document !== 'undefined' && document.getElementById("run")) {
    document.getElementById("run").innerHTML = run;
  }
  ```

---

## What's Next?

- Read the full [Sound API Documentation](SOUND_API_DOCS.md)
- Try the [Piano Keyboard](piano.js)
- Compose your own game music!
- Add sound effects to your Qandy games

Happy composing! 🎹🎵
