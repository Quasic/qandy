# Font Change for Extended ASCII Support

## Problem
The original font (Courier New) does not properly display extended ASCII characters (128-255), including:
- Box drawing characters (┌ ─ ┐ ║ ═ etc.)
- Special symbols (● ○ ■ □ ★ ☆ etc.)
- Latin extended characters (À Á Â Ã Ä Å etc.)
- Mathematical symbols (± × ÷ etc.)

## Solution
Upgraded to **VT323** from Google Fonts - a retro dot matrix terminal font that:
- ✅ Is monospaced (maintains character alignment)
- ✅ Has retro/terminal aesthetic matching Qandy's theme
- ✅ Supports extended Latin characters (160-255)
- ✅ Better support for special symbols
- ✅ Free and open source from Google Fonts

## Changes Made

### 1. Updated `qandy.css`
- Added Google Fonts import for VT323 and IBM Plex Mono
- Updated `.txt` class font-family to prioritize VT323
- Increased font-size from 14px to 16px (VT323 looks better slightly larger)
- Adjusted line-height from 1.1 to 1.2 for better readability

**Font stack:**
```css
font-family: 'VT323', 'IBM Plex Mono', 'Courier New', monospace;
```

**Fallback order:**
1. **VT323** - Primary (retro dot matrix style)
2. **IBM Plex Mono** - Fallback (excellent Unicode support)
3. **Courier New** - System fallback
4. **monospace** - Generic fallback

### 2. Created `test-font-extended-ascii.html`
- Visual comparison page showing old vs new font
- Demonstrates extended ASCII character rendering
- Useful for testing and documentation

## Font Characteristics

### VT323
- **Style**: Retro terminal / dot matrix printer
- **Designer**: Peter Hull
- **License**: SIL Open Font License
- **Character Support**: Latin, Latin Extended-A, some symbols
- **Best for**: Terminal emulation, retro computing aesthetics
- **Size**: Optimized at 16px+

### Why Not Other Fonts?

| Font | Reason |
|------|---------|
| Courier New | Poor extended ASCII support (original problem) |
| Consolas | Not available cross-platform, limited symbols |
| Monaco | Mac-only, licensing issues |
| Press Start 2P | Too pixelated, hard to read at small sizes |
| Share Tech Mono | Modern look, doesn't match retro theme |

## Testing

The font change has been tested with:
- Control characters (0-31)
- Printable ASCII (32-126)
- Extended ASCII (128-255)
- Box drawing characters
- Special symbols and shapes
- Latin extended characters

See test file: `test-font-extended-ascii.html`

## Browser Compatibility

✅ **All modern browsers support Google Fonts:**
- Chrome/Edge (Chromium)
- Firefox
- Safari
- Opera

⚠️ **Note:** Characters 128-159 are control characters in Windows-1252 encoding and may not display in any font. This is expected behavior.

## Performance

- Google Fonts are cached by browsers
- CDN delivery ensures fast loading
- Minimal impact on page load time
- Fallback to system fonts if CDN unavailable

## Future Considerations

If more comprehensive Unicode support is needed:
- **IBM Plex Mono** - Excellent Unicode coverage
- **DejaVu Sans Mono** - Very comprehensive character set
- **Noto Mono** - Google's universal font project

For now, VT323 provides the best balance of:
- Retro aesthetic
- Extended ASCII support
- Monospace character spacing
- Readability

## References

- [VT323 on Google Fonts](https://fonts.google.com/specimen/VT323)
- [IBM Plex Mono on Google Fonts](https://fonts.google.com/specimen/IBM+Plex+Mono)
- [ASCII Table Reference](https://www.ascii-code.com/)
- [Extended ASCII (Windows-1252)](https://en.wikipedia.org/wiki/Windows-1252)
