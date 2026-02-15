# Pagination Feature - User Guide

## What is Pagination?

The pagination feature helps you read long text outputs by automatically pausing the display after a certain number of lines, just like the classic DOS/Unix `more` command. When activated, you'll see:

```
--- Press Any Key to Continue ---
```

Press any key to see the next page of content.

## When Does It Activate?

Pagination activates in two ways:

### 1. Automatic (Line Counting)
- A program prints more than **20 lines** of text
- Happens automatically without special codes

### 2. Explicit (Form Feed)
- A program uses the Form Feed character (`\f`) for explicit page breaks
- Triggers immediately, regardless of line count
- Gives programs control over pagination

You're using **qandy2.htm** (the advanced version with screen buffer).

Programs that benefit from pagination:
- **ascii.js** - Displays 256 ASCII characters (~67 lines)
- **ansi-demo.js** - Shows ANSI color demonstrations
- **form-feed-test.js** - Demonstrates explicit Form Feed control
- Any script that prints extensive output

## How to Use

### Running a Program with Pagination

1. Open `qandy2.htm` in your web browser
2. Type the program name (e.g., `ascii.js`) and press Enter
3. Read the first page of output (20 lines)
4. When you see the pause message, press **any key** to continue
5. Repeat until all content is displayed

### Using Form Feed in Your Scripts

Programs can explicitly control page breaks using the Form Feed character:

```javascript
// Method 1: Inline
print("Section 1 content\f");

// Method 2: Standalone
print("Section 1 content\n");
print("\f");  // Page break here

// Method 3: Using ANSI.codes
print("Section 1 content\n");
print(ANSI.codes.pageBreak);
```

**Example Script**:
```javascript
cls();
print("Welcome to my program!\n\n");
print("This is page 1.\n");
print("You can read this at your own pace.\n");
print("\f");  // Explicit page break

print("Page 2 starts here.\n");
print("The Form Feed triggered the pause.\n");
```

### Example Session

```
> ascii.js
[Enter]

ASCII Character Table:

Control Characters (0-31):
  0 NUL   1 SOH   2 STX
  3 ETX   4 EOT   5 ENQ
  ...
  [20 lines displayed]

--- Press Any Key to Continue ---
[Press any key]

[Next 20 lines displayed]
--- Press Any Key to Continue ---
[Press any key]

[Remaining lines displayed]
Press (A) for All, (N) for Nice, (Q) to Quit
>
```

## Configuration

### Disable Pagination (Advanced)

If you want to disable pagination for a session, open the browser console (F12) and type:

```javascript
paginationEnabled = false;
```

To re-enable:

```javascript
paginationEnabled = true;
```

### Adjust Pause Frequency (Advanced)

Change how many lines are shown before pausing:

```javascript
// Show 15 lines before pausing (for smaller screens)
paginationLinesBeforePause = 15;

// Show 30 lines before pausing (for larger screens)
paginationLinesBeforePause = 30;
```

## Comparison: qandy.htm vs qandy2.htm

### qandy.htm (Simple Version)
- **Keeps all text** in memory
- Uses **scrollbar** to view past content
- May **slow down** with very long outputs
- **No pagination** - continuous scrolling

### qandy2.htm (Advanced Version)
- **Pagination enabled** by default
- More **memory efficient**
- **Controlled reading** pace
- **Screen buffer** management
- Better for **long outputs**

## Tips

1. **Preferred Version**: Use `qandy2.htm` for programs with extensive output
2. **Reading Speed**: Take your time reading each page before continuing
3. **Going Back**: Currently, you can't scroll back to previous pages - they're cleared to save memory
4. **Saving Output**: Use browser console to copy text if you need to save it

## Troubleshooting

### Pagination Not Working?

- ✓ Make sure you're using **qandy2.htm** (not qandy.htm)
- ✓ Check that `paginationEnabled = true` in console
- ✓ Verify the program outputs more than 20 lines

### Can't See Previous Content?

- This is **by design** - pagination clears previous pages to save memory
- Consider using qandy.htm if you need full scrollback
- Or increase `paginationLinesBeforePause` to show more lines per page

### Output Still Too Fast?

- Press **Ctrl+P** before running the program (to print/save)
- Or adjust `paginationLinesBeforePause` to a lower value
- For very long outputs, consider exporting the program output to a file

## Technical Details

For developers and advanced users, see [PAGINATION_FEATURE.md](PAGINATION_FEATURE.md) for:
- Implementation details
- Performance analysis
- Pros and cons comparison
- Memory usage statistics
- Architecture decisions

## Feedback

Have suggestions or issues with the pagination feature? Open an issue on the GitHub repository!
