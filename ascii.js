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
  print("\x1b[1;33mControl Characters (0-31):\x1b[0m\n");
  for (i=0; i<32; i++) {
    var name=controlCharNames[i] || "?";
    var hex=i.toString(16);
    if (hex.length===1) hex="0"+hex;
    print(String(i).padStart(3)+" "+name);
    if ((i + 1) % 3 === 0) print("\n");
    else print("  ");
  }
  print("\n\f\n");
  // Printable ASCII (32-127)
  print("\x1b[1;33mPrintable ASCII:\x1b[0m\n");
  for (let i = 32; i < 128; i++) {
    var char = String.fromCharCode(i);
    var hex = i.toString(16);
    if (hex.length === 1) hex="0"+hex;
    //print(String(i).padStart(3) + " (0x" + hex + ") " + char);
    print(String(i).padStart(3) +" "+char);
    if ((i - 31) % 5 === 0) print("\n");
    else print(" ");
  }
  print("\n\l\n");
  
  // Extended ASCII (128-255)
  print("\x1b[1;33mExtended ASCII (128-255):\x1b[0m\n");
  for (let i = 128; i < 256; i++) {
    var char = String.fromCharCode(i);
    var hex = i.toString(16);
    if (hex.length === 1) hex = "0" + hex;
    print(String(i).padStart(3) +" "+char);
    if ((i - 127) % 5 === 0) print("\n");
    else print(" ");
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
  
  if (key === "A") {
    displayAll256();
  } else if (key === "N") {
    displayNiceCharacters();
  } else if (key === "Q") {
    cls();
    keyon = 1;
    print("Returned to input mode\n");
  }
}

// Start the script
showASCIIMenu();