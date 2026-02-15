# Font Change for Extended ASCII Support

## Problem
The original font (Courier New) does not properly display extended ASCII characters (128-255), including:
- Box drawing characters (┌ ─ ┐ ║ ═ etc.)
- Special symbols (● ○ ■ □ ★ ☆ etc.)
- Latin extended characters (À Á Â Ã Ä Å etc.)
- Mathematical symbols (± × ÷ etc.)

## Update: Google Fonts Blocking Issue

**Issue Discovered**: When Google Fonts are blocked by ad blockers, browser extensions, or network policies, the VT323 and IBM Plex Mono fonts fail to load, causing the display to fall back to Courier New (which has poor extended ASCII support).

**Impact**: Users reported "I don't see the new font on the ascii.js output" because the Google Fonts CDN was being blocked (`ERR_BLOCKED_BY_CLIENT`).

## Solution
**Primary**: Upgraded to **VT323** from Google Fonts - a retro dot matrix terminal font that:
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

**Font stack (updated):**
```css
font-family: 'VT323', 'IBM Plex Mono', 'Consolas', 'DejaVu Sans Mono', 'Liberation Mono', 'Menlo', 'Monaco', 'Courier New', 'Courier', monospace;
```

**Fallback priority:**
1. **VT323** - Primary (retro dot matrix - from Google Fonts CDN)
2. **IBM Plex Mono** - Fallback (excellent Unicode - from Google Fonts CDN)
3. **Consolas** - System font (Windows, good Unicode support)
4. **DejaVu Sans Mono** - System font (Linux, excellent Unicode)
5. **Liberation Mono** - System font (Linux, comprehensive)
6. **Menlo** - System font (macOS)
7. **Monaco** - System font (macOS)
8. **Courier New** - Universal fallback
9. **Courier** - Universal fallback
10. **monospace** - Generic fallback

### Why the Extended Fallback Chain?

When Google Fonts are blocked or unavailable, the browser immediately falls back to system fonts. By adding high-quality monospace system fonts with good Unicode support (Consolas, DejaVu Sans Mono, Liberation Mono, Menlo, Monaco), we ensure extended ASCII characters display correctly even without internet access or when CDN is blocked.

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
- CDN delivery ensures fast loading **when available**
- **Graceful degradation**: System fonts load instantly when CDN is blocked
- Minimal impact on page load time
- **Works offline**: System fonts provide full functionality without internet

## Robustness

✅ **Works with ad blockers** - Falls back to system fonts  
✅ **Works offline** - No dependency on external CDN  
✅ **Works in restricted networks** - Corporate firewalls don't break functionality  
✅ **Cross-platform** - System fonts available on Windows, macOS, and Linux  
✅ **Future-proof** - Multiple fallback options ensure compatibility  

## Testing Results

### With Google Fonts Available
- VT323 loads successfully
- Retro dot matrix aesthetic
- Extended ASCII displays correctly

### With Google Fonts Blocked (ad blocker/firewall)
- Falls back to Consolas (Windows) or DejaVu Sans Mono (Linux) or Menlo (macOS)
- Extended ASCII still displays correctly
- Monospace alignment maintained
- Slightly different aesthetic but fully functional

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
