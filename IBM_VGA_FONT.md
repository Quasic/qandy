# IBM VGA 8x16 Font Implementation

## Overview
Replaced Google Fonts (VT323) with authentic IBM VGA fonts from "The Ultimate Oldschool PC Font Pack" for a more authentic retro PC look that fits the screen better.

## Font Source
**The Ultimate Oldschool PC Font Pack**
- Project: https://int10h.org/oldschool-pc-fonts/
- License: Creative Commons Attribution-ShareAlike 4.0 (CC BY-SA 4.0)
- Repository: https://github.com/potatoes1286/oldschool-pc-fonts-gh

## Fonts Included

### IBM VGA 8x16 (Primary)
- **Character Cell**: 8x16 pixels
- **Original Source**: IBM MCGA and VGA (PS/2) video BIOS
- **Use Case**: 80x25 text mode (classic DOS prompt)
- **Features**: 
  - Full CP437 (DOS/US) character set
  - Extended Unicode support in "Plus" variant
  - Most iconic and recognizable DOS font
  - Perfect pixel-perfect recreation of original IBM VGA

### IBM VGA 8x14 (Alternative)
- **Character Cell**: 8x14 pixels
- **Original Source**: IBM EGA video BIOS
- **Use Case**: Slightly more compact for denser text
- **Features**: Good balance between height and readability

### IBM VGA 9x16 (Alternative)
- **Character Cell**: 9x16 pixels
- **Use Case**: Wider characters for better readability
- **Features**: Extra pixel width provides slightly looser spacing

## Implementation Details

### Font Files Location
```
fonts/
├── IBM_VGA_8x16.woff (23KB)
├── IBM_VGA_8x14.woff (23KB)
└── IBM_VGA_9x16.woff (23KB)
```

### CSS Configuration
```css
@font-face {
  font-family: 'IBM VGA 8x16';
  src: url('fonts/IBM_VGA_8x16.woff') format('woff');
  font-weight: normal;
  font-style: normal;
  font-display: swap;
}
```

### Font Stack Priority
```css
font-family: 'IBM VGA 8x16', 'IBM VGA 9x16', 'VT323', 'IBM Plex Mono', 
             'Consolas', 'DejaVu Sans Mono', 'Liberation Mono', 'Menlo', 
             'Monaco', 'Courier New', 'Courier', monospace;
```

1. **IBM VGA 8x16** - Primary authentic DOS font
2. **IBM VGA 9x16** - Slightly wider alternative
3. **VT323** - Google Fonts retro fallback (if CDN available)
4. **IBM Plex Mono** - Google Fonts with good Unicode
5. **Consolas** - System font (Windows)
6. **DejaVu Sans Mono** - System font (Linux)
7. **Liberation Mono** - System font (Linux)
8. **Menlo** - System font (macOS)
9. **Monaco** - System font (macOS)
10. **Courier New** - Universal fallback
11. **monospace** - Generic fallback

## Display Specifications

### Screen Dimensions
- **Width**: 256px
- **Height**: 384px
- **Font Size**: 16px
- **Line Height**: 1.2 (19.2px)
- **Text Mode**: Approximately 32 characters × 20 lines

### Character Support
- ✅ **ASCII 0-31**: Control characters (display names)
- ✅ **ASCII 32-126**: Full printable ASCII
- ✅ **ASCII 128-255**: Extended ASCII with CP437 box drawing characters
- ✅ **Unicode**: Extended Unicode support in Plus variant
- ✅ **Box Drawing**: ┌ ─ ┬ ─ ┐ │ ├ ┼ ┤ └ ┴ ┘ ║ ═ ╔ ╗ ╚ ╝
- ✅ **Special Symbols**: ☺ ☻ ♥ ♦ ♣ ♠ • ◘ ○ ◙ ♂ ♀ ♪ ♫ ☼

## Benefits

### Authenticity
- **Pixel-perfect**: Exact recreation of original IBM VGA BIOS font
- **Historical accuracy**: Used in DOS, early Windows, BIOS screens
- **Nostalgic**: Instantly recognizable to anyone who used DOS-era PCs

### Technical
- **Monospace**: Perfect character alignment for text-based UIs
- **Crisp rendering**: Designed for pixel-perfect display at 16px
- **Extended ASCII**: Full support for box drawing and special characters
- **Self-hosted**: No external CDN dependency
- **Fast loading**: Small file size (23KB each)

### Visual
- **Better fit**: 8x16 character cell fits the 256px × 384px screen perfectly
- **Clearer**: Sharper than VT323 at this size
- **More authentic**: True IBM VGA look vs. approximation
- **Blocky aesthetic**: Authentic pixel-based retro PC appearance

## Comparison: Before vs After

### Before (VT323)
- Google Fonts CDN dependency
- Could be blocked by ad blockers
- Approximation of retro look
- Less crisp at 16px

### After (IBM VGA 8x16)
- Self-hosted, always available
- Authentic IBM VGA BIOS font
- Perfect pixel rendering
- Better extended ASCII support
- More authentic retro PC experience

## Attribution

As per CC BY-SA 4.0 license requirements:

**Font Credits:**
- Fonts from "The Ultimate Oldschool PC Font Pack"
- Created by VileR (int10h.org)
- Based on original IBM MCGA/VGA/EGA video BIOS fonts
- License: Creative Commons Attribution-ShareAlike 4.0 International
- Source: https://int10h.org/oldschool-pc-fonts/

## References

- [The Ultimate Oldschool PC Font Pack](https://int10h.org/oldschool-pc-fonts/)
- [Font List and Showcase](https://int10h.org/oldschool-pc-fonts/fontlist/)
- [IBM VGA 8x16 Details](https://int10h.org/oldschool-pc-fonts/fontlist/font?ibm_vga_8x16)
- [Download Page](https://int10h.org/oldschool-pc-fonts/download/)
- [CC BY-SA 4.0 License](https://creativecommons.org/licenses/by-sa/4.0/)

## Future Considerations

### Alternative Fonts Available
If different aesthetics or sizes are needed, the pack includes:
- **IBM CGA** (8x8) - Early PC/XT look
- **IBM MDA** (9x14) - Monochrome Display Adapter
- **IBM EGA** (8x14) - EGA graphics adapter
- **Tandy** - Tandy 1000 computer fonts
- **Amstrad** - Amstrad PC fonts
- **Phoenix BIOS** - Various clone BIOS fonts

### Font Size Adjustments
If screen size changes, consider:
- **8x14** for more compact display
- **9x16** for wider, more readable text
- Adjust CSS `font-size` accordingly

## Testing

The font has been tested with:
- ✅ Main menu display
- ✅ ascii.js control characters (0-31)
- ✅ ascii.js printable ASCII (32-126)
- ✅ ascii.js extended ASCII (128-255)
- ✅ Box drawing characters
- ✅ Special DOS symbols
- ✅ Cross-browser compatibility
- ✅ Fallback font chain

All characters render correctly with authentic IBM VGA appearance.
