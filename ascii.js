// QANDY ASCII CHARACTER DISPLAY UTILITY
// Displays all 256 ASCII characters or curated "nice" drawing characters

var controlCharNames = {
  0: "NUL", 1: "SOH", 2: "STX", 3: "ETX", 4: "EOT", 5: "ENQ",
  6: "ACK", 7: "BEL", 8: "BS", 9: "TAB", 10: "LF", 11: "VT",
  12: "FF", 13: "CR", 14: "SO", 15: "SI", 16: "DLE", 17: "DC1",
  18: "DC2", 19: "DC3", 20: "DC4", 21: "NAK", 22: "SYN", 23: "ETB",
  24: "CAN", 25: "EM", 26: "SUB", 27: "ESC", 28: "FS", 29: "GS",
  30: "RS", 31: "US"
};

cls();
print("\n");
print("ASCII Character Chart:\n");
print("\n");

ascii();

//print("ascii() to display all ASCII Characters\n\n");
//print("ansi() to display graphic characters\n\n");
//print("alpha() to display alpha-numeric characers\n\n");

keyon = 1;

function ascii() {
  cls();
  print("\x1b[1;36m\n");
  print("ASCII Character Table:\n\n");
    
  // Control characters (0-31)
  // Display in columns (top to bottom): 11 rows × 3 columns
  print("\x1b[1;33mControl Characters (0-31):\x1b[0m\n");
  var rows = 11;  // 32 items / 3 columns = 10.67, round up to 11
  for (var row = 0; row < rows; row++) {
    for (var col = 0; col < 3; col++) {
      var i = row + (col * rows);
      if (i < 32) {
        var name = controlCharNames[i] || "?";
        var hex = i.toString(16);
        if (hex.length === 1) hex = "0" + hex;
        // Pad name to 3 characters for alignment
        print(String(i).padStart(3) + " " + name.padEnd(3));
        if (col < 2) print("  ");  // Add spacing between columns
      }
    }
    print("\n");
  }
  print("\n\f\n");
  // Printable ASCII (32-126) - excluding 127 (DEL)
  // Display in columns (top to bottom): 19 rows × 5 columns
  print("\x1b[1;33mPrintable ASCII (32-126):\x1b[0m\n");
  var printableCount = 95;  // 32 to 126 inclusive
  var cols = 5;
  var rows = Math.ceil(printableCount / cols);  // 19 rows
  for (var row = 0; row < rows; row++) {
    for (var col = 0; col < cols; col++) {
      var i = 32 + row + (col * rows);
      if (i <= 126) {  // Stop at 126, not 127
        var char = String.fromCharCode(i);
        var hex = i.toString(16);
        if (hex.length === 1) hex = "0" + hex;
        print(String(i).padStart(3) + " " + char);
        if (col < cols - 1 && (32 + row + ((col + 1) * rows)) <= 126) print(" ");  // Add spacing between columns
      }
    }
    print("\n");
  }
  print("\n\f\n");
  
  // Extended ASCII (128-255)
  // Display in columns (top to bottom): 26 rows × 5 columns
  // Note: Characters 128-159 may not display correctly due to font limitations.
  // Many fonts treat these as control characters or may not have glyphs for them.
  print("\x1b[1;33mExtended ASCII (128-255):\x1b[0m\n");
  print("\x1b[0;37m(Note: Some characters may not display due to font limitations)\x1b[0m\n");
  var extendedCount = 128;  // 128 to 255 inclusive
  var cols = 5;
  var rows = Math.ceil(extendedCount / cols);  // 26 rows
  for (var row = 0; row < rows; row++) {
    for (var col = 0; col < cols; col++) {
      var i = 128 + row + (col * rows);
      if (i <= 255) {
        var char = String.fromCharCode(i);
        var hex = i.toString(16);
        if (hex.length === 1) hex = "0" + hex;
        print(String(i).padStart(3) + " " + char);
        if (col < cols - 1 && (128 + row + ((col + 1) * rows)) <= 255) print(" ");  // Add spacing between columns
      }
    }
    print("\n");
  }
  
  keyon = 1;
}

function ansi() {
  cls();
  print("\x1b[1;36m");
  print("NICE DRAWING CHARACTERS\n");
  print("═══════════════════════════════════\x1b[0m\n\n");
  
  print("\x1b[1;33mBox Drawing - Single Line:\x1b[0m\n");
  print("┌ ─ ┬ ┐   ┤ ├ ┼ │   └ ┴ ┘\n");
  print("Corners: ┌ ┐ └ ┘   Tees: ├ ┤ ┬ ┴   Cross: ┼   Straight: ─ │\n\n");
  
  print("\x1b[1;33mBox Drawing - Double Line:\x1b[0m\n");
  print("╔ ═ ╦ ╗   ╣ ╠ ╬ ║   ╚ ╩ ╝\n");
  print("Corners: ╔ ╗ ╚ ╝   Tees: ╠ ╣ ╦ ╩   Cross: ╬   Straight: ═ ║\n\n");
  
  print("\x1b[1;33mArrows:\x1b[0m\n");
  print("↑ (up)  ↓ (down)  ← (left)  → (right)  ↔ (horiz)  ↕ (vert)\n");
  print("⇑ (up2) ⇓ (down2) ⇐ (left2) ⇒ (right2)\n\n");
  
  print("\x1b[1;33mShapes & Symbols:\x1b[0m\n");
  print("■ (filled square)  □ (empty square)  ◆ (diamond)\n");
  print("● (filled circle)  ○ (empty circle)  ★ (filled star)  ☆ (empty star)\n");
  print("✓ (checkmark)  ✗ (x mark)\n\n");
  
  print("\x1b[1;33mMath Symbols:\x1b[0m\n");
  print("+ (plus)  × (multiply)  ÷ (divide)  = (equals)  ≠ (not equal)\n");
  print("± (plus-minus)  ≤ (less-equal)  ≥ (greater-equal)\n\n");
  
  print("\x1b[1;33mCard Suits & Misc:\x1b[0m\n");
  print("♠ (spade)  ♥ (heart)  ♦ (diamond)  ♣ (club)\n");
  print("© (copyright)  ® (registered)  ™ (trademark)  ° (degree)  § (section)  ¶ (pilcrow)\n\n");
  
  print("\x1b[32mPress (A) for All, (N) for Nice, (Q) to Quit\x1b[0m\n");
  keyon = 1;
}

function keydown(k) {
  var key = k.toUpperCase();
  
  if (key === "Q") {
    cls();
    keyon = 1;
    print("Returned to input mode\n");
  }
}