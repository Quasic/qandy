// Test script for draw() function and word wrap improvements
print("=== Testing draw() Function ===\n\n");

// Test 1: Basic draw without scrolling
print("Test 1: Basic draw() at cursor position\n");
draw("\x1b[32mThis text is drawn in green\x1b[0m");
print("\n\n");

// Test 2: Draw with cursor positioning
print("Test 2: Draw with ANSI cursor positioning\n");
draw("\x1b[10;5HText at row 10, col 5");
draw("\x1b[11;10HText at row 11, col 10");
print("\n\n\n\n\n\n\n\n"); // Move down to see the drawn text

// Test 3: Draw near bottom of screen (should not scroll)
print("Test 3: Draw near screen bottom\n");
draw("\x1b[23;1HLine 23");
draw("\x1b[24;1HLine 24");
draw("\x1b[25;1HLine 25 - last visible line");
print("\n");

// Test 4: Word wrap in print()
print("\n=== Testing Word Wrap ===\n\n");
print("This is a sentence with several words that should wrap at word boundaries rather than breaking in the middle of a word.\n");
print("\n");
print("Short line here.\n");
print("\n");
print("Anotherverylongwordwithoutanyspaceswillstillhardwrapbecausetherearenowordbreakstouseforthewrapping.\n");
print("\n");

print("=== All Tests Complete ===\n");
