# Form Feed Quick Reference - ASCII Code for "Press Any Key"

## Quick Answer

To insert a form feed that triggers the "Press Any Key to Continue" message in qandy2.htm:

**Use the escape sequence: `\f`**

---

## ASCII Code Details

| Property | Value |
|----------|-------|
| **Character** | Form Feed (FF) |
| **Escape Sequence** | `\f` |
| **ASCII Decimal** | 12 |
| **ASCII Hex** | 0x0C |
| **ASCII Octal** | 014 |
| **Purpose** | Page break / pagination trigger |

---

## How to Use in JavaScript Strings

### Method 1: Escape Sequence (Recommended)
```javascript
print("Page 1 content\f");           // Form feed at end
print("More text\fNext page");       // Form feed in middle
```

### Method 2: String Literal
```javascript
print("Some text\f");                // \f triggers pagination
```

### Method 3: Using ANSI.codes Object
```javascript
print("Page 1 content");
print(ANSI.codes.pageBreak);         // pageBreak = '\f'
print("Page 2 content");
```

### Method 4: Character Code
```javascript
print("Page 1" + String.fromCharCode(12)); // ASCII 12 = Form Feed
```

### Method 5: Unicode
```javascript
print("Page 1\u000C");               // Unicode for Form Feed
```

---

## Practical Examples

### Example 1: Simple Two-Page Output
```javascript
print("This is page 1\n");
print("Line 2 of page 1\n");
print("\f");                         // Trigger pagination
print("This is page 2\n");
```

### Example 2: Multi-Section Document
```javascript
print("INTRODUCTION\n");
print("Welcome to the guide...\n");
print("\f");

print("CHAPTER 1\n");
print("First chapter content...\n");
print("\f");

print("CHAPTER 2\n");
print("Second chapter content...\n");
```

### Example 3: Inline Form Feed
```javascript
print("Section A\nContent here\fSection B\nMore content");
```

### Example 4: Using ANSI.codes
```javascript
cls();
print("Page 1 content\n");
print(ANSI.codes.pageBreak);         // Explicit page break
print("Page 2 content\n");
```

---

## Testing Your Code

To test if form feed works:

1. Open `qandy2.htm` in your browser
2. Run this test:
```javascript
print("Before page break\f");
print("After page break");
```
3. You should see:
   - "Before page break" displayed
   - "--- Press Any Key to Continue ---" message
   - After pressing a key: "After page break" appears

---

## Common Use Cases

### Menu Systems
```javascript
print("MAIN MENU\n");
print("1. Option A\n");
print("2. Option B\n");
print("\f");                         // Pause before details
print("OPTION DETAILS\n");
```

### Reports
```javascript
print("SALES REPORT\n");
print("Q1: $1000\n");
print("Q2: $2000\n");
print("\f");                         // Page break between sections
print("SUMMARY\n");
print("Total: $3000\n");
```

### Long Listings
```javascript
for (let i = 1; i <= 100; i++) {
    print(`Item ${i}\n`);
    if (i % 20 === 0) {
        print("\f");                 // Page break every 20 items
    }
}
```

### Story/Tutorial
```javascript
print("Once upon a time...\n");
print("There was a developer.\n");
print("\f");
print("Chapter 2\n");
print("The developer learned about form feed.\n");
```

---

## Important Notes

### When Form Feed Triggers Pagination
- ✅ When `paginationEnabled = true` (default)
- ✅ Immediately upon encountering `\f` in the string
- ✅ Independent of line count (doesn't wait for 20 lines)

### When Form Feed Does NOT Trigger Pagination
- ❌ When `paginationEnabled = false`
- ❌ In this case, `\f` acts as a newline

### Mixing with Automatic Pagination
You can combine form feed with automatic line-count pagination:
```javascript
// Automatic pagination will trigger at 20 lines
for (let i = 1; i <= 30; i++) {
    print(`Line ${i}\n`);
}
print("\f");                         // Additional explicit page break
print("Next section\n");
```

---

## Configuration

If you want to disable pagination (and form feed):
```javascript
paginationEnabled = false;           // Disables both triggers
```

To adjust automatic pagination threshold:
```javascript
paginationLinesBeforePause = 15;     // Trigger after 15 lines instead of 20
```

---

## Troubleshooting

### Form Feed Not Working?

1. **Check pagination is enabled**:
   ```javascript
   console.log(paginationEnabled);  // Should be true
   ```

2. **Verify you're using qandy2.htm** (not qandy.htm):
   - Form feed only works in qandy2.htm

3. **Check for syntax errors**:
   ```javascript
   print("Test\f");                 // ✓ Correct
   print("Test\\f");                // ✗ Wrong - double backslash
   ```

4. **Browser console**:
   - Press F12 to open developer tools
   - Check for JavaScript errors

### Form Feed Shows as Character?

If you see a weird character instead of pagination:
- You might be using `\\f` (escaped backslash + f)
- Use `\f` (single backslash)

---

## Comparison with Line Counting

| Feature | Form Feed (`\f`) | Line Counting |
|---------|------------------|---------------|
| **Trigger** | Explicit in code | Automatic at 20 lines |
| **Control** | Program decides | System decides |
| **Timing** | Immediate | After threshold |
| **Use Case** | Chapter breaks, sections | Long lists, logs |
| **Example** | `print("\f")` | Automatic |

---

## Summary

**Quick Copy-Paste Example**:
```javascript
// Simple form feed usage
print("First page content\n");
print("\f");                         // This triggers "Press Any Key"
print("Second page content\n");
```

**Remember**: Just use `\f` in your string where you want the page break!

---

## More Information

For detailed documentation, see:
- [FORM_FEED_IMPLEMENTATION.md](FORM_FEED_IMPLEMENTATION.md) - Complete implementation details
- [FORM_FEED_SUMMARY.md](FORM_FEED_SUMMARY.md) - Technical overview
- [PAGINATION_USER_GUIDE.md](PAGINATION_USER_GUIDE.md) - User guide
- [form-feed-test.js](form-feed-test.js) - Interactive demo

To see a live demo:
```javascript
form-feed-test.js
```
