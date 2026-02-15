// FORM FEED PAGINATION TEST
// Demonstrates using Form Feed (\f) character for explicit page breaks

cls();
print("\n");
print("\x1b[1;36mForm Feed Pagination Test\x1b[0m\n");
print("\x1b[33m=================================\x1b[0m\n\n");

print("This script demonstrates explicit page breaks using Form Feed (\\f).\n");
print("Each \\f character triggers pagination, regardless of line count.\n\n");

print("PAGE 1 - Introduction\n");
print("---------------------\n");
print("Form Feed (FF) is ASCII character 12 (0x0C).\n");
print("It's traditionally used for page breaks in text.\n");
print("In qandy2.htm, it triggers the pagination system.\n\n");

print("Benefits:\n");
print("1. Explicit control over page breaks\n");
print("2. Independent of line counting\n");
print("3. Mix with automatic pagination\n");
print("4. Standard across systems\n\n");

// Form Feed triggers page break here
print("Ready for next page?\f");

// PAGE 2
print("PAGE 2 - Usage Examples\n");
print("-----------------------\n");
print("To use Form Feed in your scripts:\n\n");

print("JavaScript: print('text\\f');\n");
print("Direct: print('\\f');\n");
print("ANSI.codes: print(ANSI.codes.pageBreak);\n\n");

print("The Form Feed can appear anywhere:\n");
print("- At the end of output\n");
print("- Between sections\n");
print("- Before important content\n\n");

print("Next page shows ASCII table excerpt...\f");

// PAGE 3
print("PAGE 3 - ASCII Control Characters\n");
print("----------------------------------\n");
print("Relevant control characters:\n\n");

print("LF  (10): \\n - Line Feed (newline)\n");
print("FF  (12): \\f - Form Feed (page break)\n");
print("CR  (13): \\r - Carriage Return\n\n");

print("Form Feed vs Line Count:\n");
print("- Line count: Automatic after N lines\n");
print("- Form Feed: Explicit page break\n");
print("- Both work together!\n\n");

print("One more page...\f");

// PAGE 4
print("PAGE 4 - Configuration\n");
print("----------------------\n");
print("Pagination settings:\n\n");

print("paginationEnabled = true/false\n");
print("  Controls both FF and line counting\n\n");

print("paginationLinesBeforePause = 20\n");
print("  Lines before auto-pause\n\n");

print("If pagination is disabled:\n");
print("  Form Feed acts as newline\n\n");

print("\x1b[32mTest Complete!\x1b[0m\n\n");
print("Press (Q) to return to command prompt\n");

keyon = 1;

function keydown(k) {
  var key = k.toUpperCase();
  if (key === "Q") {
    cls();
    keyon = 1;
    print("Returned to command mode\n");
  }
}
