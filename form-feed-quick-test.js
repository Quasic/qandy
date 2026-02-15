// FORM FEED QUICK TEST
// This demonstrates how to use the form feed character (\f)
// to trigger the "Press Any Key to Continue" message

cls();
print("\n");
print("\x1b[1;36mForm Feed Quick Test\x1b[0m\n");
print("\x1b[33m" + "=".repeat(29) + "\x1b[0m\n\n");

print("The ASCII code for Form Feed:\n");
print("  Character: \\f\n");
print("  Decimal:   12\n");
print("  Hex:       0x0C\n\n");

print("\x1b[1;32mExample 1: Simple Usage\x1b[0m\n");
print("Type this in your code:\n");
print('  print("Page 1\\f");\n\n');

print("Let's demonstrate...\n");
print("This is page 1 content.\n");
print("About to trigger pagination...\n");

// This form feed will trigger pagination
print("\f");

// After user presses a key, this will show
print("SUCCESS! You pressed a key.\n\n");

print("This is page 2 content.\n");
print("The \\f character worked!\n\n");

print("\x1b[1;32mExample 2: Multiple Pages\x1b[0m\n");
print("You can use \\f multiple times:\n");
print("Ready for page 3?\f");

print("Welcome to page 3!\n");
print("Form feed is ASCII code 12.\n\n");

print("\x1b[1;32mExample 3: Using ANSI.codes\x1b[0m\n");
print("You can also use:\n");
print("  ANSI.codes.pageBreak\n\n");

print("Let's try it:");
print(ANSI.codes.pageBreak);

print("Page 4 - using ANSI.codes!\n\n");

print("\x1b[1;33mAll Methods to Insert Form Feed:\x1b[0m\n");
print("1. \\f              - Escape sequence\n");
print("2. \\u000C          - Unicode\n");
print("3. String.fromCharCode(12)\n");
print("4. ANSI.codes.pageBreak\n\n");

print("\x1b[1;32mTest Complete!\x1b[0m\n\n");

print("Now you know how to use form feed!\n");
print("Just insert \\f in your strings.\n\n");

keyon = 1;
