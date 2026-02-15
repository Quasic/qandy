# Form Feed ASCII Code - Direct Answer

## Your Question

> "What is the ASCII code for the form feed that I insert into a string to execute the press any key?"

## Direct Answer

Use **`\f`** in your string.

## Example

```javascript
print("Page 1\f");
print("Page 2");
```

That's it! Just insert `\f` where you want the "Press Any Key to Continue" message.

## ASCII Details

- **Escape Sequence**: `\f`
- **Decimal**: 12
- **Hexadecimal**: 0x0C
- **Character Name**: Form Feed (FF)

## Quick Test

In qandy2.htm, type:

```javascript
print("Before\f");
print("After");
```

You'll see:
1. "Before"
2. "--- Press Any Key to Continue ---"
3. (press any key)
4. "After"

## More Information

- **FORM_FEED_QUICK_REF.md** - Full quick reference with all methods
- **form-feed-reference.html** - Visual reference page
- **form-feed-quick-test.js** - Interactive demo script

---

**Summary**: Just use `\f` in your strings! 🎯
