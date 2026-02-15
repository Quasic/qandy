/**
 * Qandy Control Panel Configuration (cpanel.js)
 * 
 * This file provides user-editable configuration options for Qandy,
 * including customizable keyboard mappings for all three caps lock levels.
 * 
 * To use this file:
 * 1. Copy the keyboard configuration objects from qandy2.htm
 * 2. Modify the character mappings as desired
 * 3. Include this file BEFORE qandy2.htm in your HTML:
 *    <script src="cpanel.js"></script>
 * 4. The configurations will override the defaults in qandy2.htm
 * 
 * Security Note:
 * In JavaScript/Node.js, backticks (`) are used for template literals, not
 * command execution like in Perl. While backticks in template literals can
 * execute JavaScript expressions (e.g., `Hello ${name}`), they do NOT execute
 * system commands. This is fundamentally different from Perl's backtick operator.
 * 
 * In Qandy, backticks and other special characters are used only as text input
 * for ASCII/ANSI art and JavaScript code editing. They are not evaluated or
 * executed, so there is no security risk similar to Perl's command injection.
 */

// User-configurable keyboard mappings
var qandyConfig = {
  
  /**
   * Normal Keys (Caps Lock Level 0)
   * These are the default lowercase characters
   */
  normalKeys: {
    '1': '1', '2': '2', '3': '3', '4': '4', '5': '5',
    '6': '6', '7': '7', '8': '8', '9': '9', '0': '0',
    'q': 'q', 'w': 'w', 'e': 'e', 'r': 'r', 't': 't',
    'y': 'y', 'u': 'u', 'i': 'i', 'o': 'o', 'p': 'p',
    'a': 'a', 's': 's', 'd': 'd', 'f': 'f', 'g': 'g',
    'h': 'h', 'j': 'j', 'k': 'k', 'l': 'l',
    'z': 'z', 'x': 'x', 'c': 'c', 'v': 'v', 'b': 'b',
    'n': 'n', 'm': 'm',
    '[': '[', ']': ']', ';': ';', '\'': '\'',
    ',': ',', '.': '.', '/': '/', '=': '=', '-': '-',
    '\\': '\\', '`': '`'
  },
  
  /**
   * Shifted Keys (Caps Lock Level 1)
   * These are uppercase letters and shifted symbols
   */
  shiftedKeys: {
    '1': '!', '2': '@', '3': '#', '4': '$', '5': '%',
    '6': '^', '7': '&', '8': '*', '9': '(', '0': ')',
    'q': 'Q', 'w': 'W', 'e': 'E', 'r': 'R', 't': 'T',
    'y': 'Y', 'u': 'U', 'i': 'I', 'o': 'O', 'p': 'P',
    'a': 'A', 's': 'S', 'd': 'D', 'f': 'F', 'g': 'G',
    'h': 'H', 'j': 'J', 'k': 'K', 'l': 'L',
    'z': 'Z', 'x': 'X', 'c': 'C', 'v': 'V', 'b': 'B',
    'n': 'N', 'm': 'M',
    '[': '{', ']': '}', ';': ':', '\'': '"',
    ',': '<', '.': '>', '/': '?', '=': '+', '-': '_',
    '\\': '|', '`': '~'
  },
  
  /**
   * Extended Graphics Characters (Caps Lock Level 2)
   * These are special Unicode characters useful for ASCII/ANSI art
   * 
   * Box Drawing Characters:
   * - Single line: ─ │ ┌ ┐ └ ┘ ├ ┤ ┬ ┴ ┼
   * - Double line: ═ ║ ╔ ╗ ╚ ╝ ╠ ╣ ╦ ╩ ╬
   * 
   * Block Characters:
   * - Full blocks: █ ▀ ▄ ▌ ▐
   * - Partial blocks: ░ ▒ ▓
   * 
   * Geometric Shapes:
   * - Circles: ○ ● ◯ ◉
   * - Squares: □ ■ ▪ ▫
   * - Triangles: △ ▲ ▽ ▼
   * - Diamonds: ◇ ◆ ◊
   * 
   * Arrows:
   * - Basic: ↑ ↓ ← → ↔ ↕
   * - Double: ⇑ ⇓ ⇐ ⇒ ⇔ ⇕
   * 
   * Card Suits: ♠ ♥ ♦ ♣
   * 
   * Math/Symbols:
   * - × ÷ ± ≈ ≠ ≤ ≥
   * - ° ′ ″ ‰ √ ∞
   * 
   * Checkmarks: ✓ ✗ ✔ ✘
   * 
   * Stars: ★ ☆ ✦ ✧
   * 
   * Miscellaneous:
   * - · • ‣ ⁃ ⁌ ⁍
   * - ¦ (broken bar)
   */
  extendedChars: {
    // Top row - Box drawing (single and double lines)
    'q': '┌',   // top-left corner (single)
    'w': '┬',   // top T-junction (single)
    'e': '┐',   // top-right corner (single)
    'r': '─',   // horizontal line (single)
    't': '╔',   // top-left corner (double)
    'y': '╦',   // top T-junction (double)
    'u': '╗',   // top-right corner (double)
    'i': '═',   // horizontal line (double)
    'o': '╣',   // right T-junction (double)
    'p': '●',   // solid circle
    
    // Middle row - Box drawing continued
    'a': '├',   // left T-junction (single)
    's': '┼',   // cross (single)
    'd': '┤',   // right T-junction (single)
    'f': '│',   // vertical line (single)
    'g': '╠',   // left T-junction (double)
    'h': '╬',   // cross (double)
    'j': '╩',   // bottom T-junction (double)
    'k': '║',   // vertical line (double)
    'l': '▬',   // horizontal bar
    
    // Bottom row - Box drawing and blocks
    'z': '└',   // bottom-left corner (single)
    'x': '┴',   // bottom T-junction (single)
    'c': '┘',   // bottom-right corner (single)
    'v': '╚',   // bottom-left corner (double)
    'b': '╝',   // bottom-right corner (double)
    'n': '▀',   // upper half block
    'm': '▄',   // lower half block
    
    // Number row - Arrows and shapes
    '1': '↑',   // up arrow
    '2': '↓',   // down arrow
    '3': '←',   // left arrow
    '4': '→',   // right arrow
    '5': '■',   // solid square
    '6': '□',   // hollow square
    '7': '◆',   // solid diamond
    '8': '○',   // hollow circle
    '9': '★',   // solid star
    '0': '☆',   // hollow star
    
    // Punctuation - Card suits and symbols
    '[': '♠',   // spade suit
    ']': '♥',   // heart suit
    ';': '♦',   // diamond suit
    '\'': '♣', // club suit
    ',': '✓',   // checkmark
    '.': '✗',   // x mark
    '/': '÷',   // division sign
    '=': '×',   // multiplication sign
    '-': '±',   // plus-minus sign
    ' ': '·',   // middle dot
    
    // New keys for JavaScript/coding
    '\\': '¦',  // broken bar (alternative: '∥' for double vertical line)
    '`': '`'    // backtick (kept as-is for coding, alternative: '′' for prime)
  },
  
  /**
   * Display Options
   * Note: These are currently for documentation/reference purposes only.
   * Future versions may implement functionality to override qandy2.htm defaults.
   */
  displayOptions: {
    // Screen dimensions (defined in qandy2.htm)
    screenWidth: 29,
    screenHeight: 25,
    
    // Command history settings
    maxHistorySize: 50,
    
    // Pagination settings
    paginationEnabled: true,
    paginationLinesBeforePause: 22,
    
    // Selection colors
    selectionBgColor: '#ffffff',
    selectionFgColor: '#000000'
  },
  
  /**
   * Security Information
   * 
   * BACKTICK SECURITY CONSIDERATIONS:
   * 
   * In Perl, backticks execute shell commands:
   *   $output = `ls -la`;  // DANGEROUS - executes system command
   * 
   * In JavaScript/Node.js, backticks are for template literals:
   *   const output = `Hello ${name}`;  // Safe - string interpolation only
   * 
   * In Qandy:
   * - User input is stored as plain text strings
   * - Backticks and other characters are NOT evaluated or executed
   * - They are used only for text display in ASCII/ANSI art
   * - Even if used in JavaScript code editing, they are just text
   *   until explicitly evaluated (which Qandy does not do automatically)
   * 
   * PIPE CHARACTER (|) SECURITY:
   * - In shell contexts, pipe chains commands together
   * - In Qandy, it's just a text character for display/editing
   * - No shell command execution occurs from user input
   * 
   * CONCLUSION:
   * Both backtick (`) and pipe (|) are safe to include in Qandy's
   * character set. They are valuable for JavaScript code input and
   * ASCII/ANSI art without posing security risks.
   */
};

/**
 * Apply Configuration
 * 
 * This function should be called to apply the configuration.
 * If included before qandy2.htm, the configurations will override defaults.
 */
if (typeof window !== 'undefined') {
  window.qandyConfig = qandyConfig;
}

// Export for Node.js environments (if needed)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = qandyConfig;
}
