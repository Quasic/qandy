// ASCII Chart viewer for Qandy (32x25)
// Two columns × ~20 rows = 40 entries/page (covers ASCII 0..127 in four pages)
// Controls: n = next, p = prev, g = goto page, q or ESC = quit


  // Configuration
  var COLS = 32, ROWS = 25;
  var HEADER_LINES = 2;
  var FOOTER_LINES = 3;
  var CONTENT_ROWS = ROWS - HEADER_LINES - FOOTER_LINES; // e.g. 20
  var COLUMNS_PER_ROW = 2;
  var ENTRIES_PER_PAGE = CONTENT_ROWS * COLUMNS_PER_ROW; // 40 by default
  var MAX_CODE = 127; // show 0..127 by default

  // Short names for control characters
  var CONTROL_NAMES = {
    0: 'NUL', 1: 'SOH', 2: 'STX', 3: 'ETX', 4: 'EOT', 5: 'ENQ', 6: 'ACK', 7: 'BEL',
    8: 'BS', 9: 'TAB', 10: 'LF', 11: 'VT', 12: 'FF', 13: 'CR', 14: 'SO', 15: 'SI',
    16: 'DLE',17:'DC1',18:'DC2',19:'DC3',20:'DC4',21:'NAK',22:'SYN',23:'ETB',
    24:'CAN',25:'EM',26:'SUB',27:'ESC',28:'FS',29:'GS',30:'RS',31:'US',
    127:'DEL'
  };

  // Helpers to format an entry into a fixed-width cell (16 chars)
  function fmtEntry(code) {
    var dec = ('' + code).padStart(3, '0');
    var hex = '0x' + code.toString(16).toUpperCase().padStart(2, '0');
    var glyph;
    if (code in CONTROL_NAMES) {
      glyph = CONTROL_NAMES[code];
    } else if (code === 32) {
      glyph = 'SP';
    } else {
      var ch = String.fromCharCode(code);
      // For safety, show a visible representation for whitespace-like chars
      glyph = (ch === ' ') ? 'SP' : ch;
    }
    // make sure glyph fits in up to 6 chars; trim if needed
    if (glyph.length > 6) glyph = glyph.slice(0, 6);
    var s = dec + ' ' + hex + ' ' + glyph;
    // pad to 16 chars (left aligned)
    return s.padEnd(16, ' ');
  }

  // Build entries array for 0..MAX_CODE
  var entries = [];
  for (var c = 0; c <= MAX_CODE; c++) {
    entries.push({ code: c, text: fmtEntry(c) });
  }

  // Build pages: each page is an array of lines (strings)
  var pages = [];
  for (var i = 0; i < entries.length; i += ENTRIES_PER_PAGE) {
    var pageEntries = entries.slice(i, i + ENTRIES_PER_PAGE);
    // Build page lines: CONTENT_ROWS lines, each line contains COLUMNS_PER_ROW entries
    var lines = [];
    for (var r = 0; r < CONTENT_ROWS; r++) {
      var line = '';
      for (var col = 0; col < COLUMNS_PER_ROW; col++) {
        var idx = r * COLUMNS_PER_ROW + col;
        var e = pageEntries[idx];
        if (e) line += e.text;
        else line += ''.padEnd(16, ' ');
      }
      lines.push(line);
    }
    pages.push(lines);
  }

  var currentPage = 0;
  var totalPages = pages.length;

  // Rendering
  function renderPage(pg) {
    if (pg < 0) pg = 0;
    if (pg >= totalPages) pg = totalPages - 1;
    currentPage = pg;

    cls();

    // Header
    print("\x1b[1;33mASCII Chart\x1b[0m\n");
    print("\x1b[36mRange: " + (pg*ENTRIES_PER_PAGE) + " - " +
          Math.min(MAX_CODE, (pg+1)*ENTRIES_PER_PAGE - 1) +
          "    Page " + (pg+1) + "/" + totalPages + "\x1b[0m\n");

    // Content
    var pageLines = pages[pg];
    for (var i = 0; i < pageLines.length; i++) {
      // Use print so ANSI colors (if any) are honored
      print(pageLines[i] + "\n");
    }

    // Footer
    print("\n");
    print("\x1b[1;32mNavigation:\x1b[0m n=next  p=prev  g=goto  q=quit\n");
  }

  // Navigation handlers
  function nextPage() { if (currentPage < totalPages-1) renderPage(currentPage+1); else renderPage(0); }
  function prevPage() { if (currentPage > 0) renderPage(currentPage-1); else renderPage(totalPages-1); }

  function gotoPagePrompt() {
    // Simple prompt using print/ input() style if available — fallback: ask user to call gotoPage(n)
    try {
      // try to use qandy input if available: input(prompt) style (some qandy examples have input/LINe)
      var p = prompt ? prompt("Goto page (1-" + totalPages + "):") : null;
      if (p !== null && p !== undefined) {
        var n = parseInt(p, 10);
        if (!isNaN(n) && n >= 1 && n <= totalPages) renderPage(n-1);
      }
    } catch (e) {
      // ignore; not every qandy environment has prompt()
    }
  }

  // Safe keyboard integration (idempotent)
  if (!window._ascii_chart_installed) {
    window._ascii_chart_installed = true;

    function onKey(e) {
      // Accept both keydown events and direct key strings (some qandy scripts call keydown(key))
      var key = null;
      if (typeof e === 'string') key = e;
      else if (e && e.key) key = e.key;
      else if (e && e.which) key = String.fromCharCode(e.which);

      if (!key) return;

      key = key.toLowerCase();

      if (key === 'n' || key === 'pagedown' || key === 'arrowright') { nextPage(); haltEvent(e); }
      else if (key === 'p' || key === 'pageup' || key === 'arrowleft') { prevPage(); haltEvent(e); }
      else if (key === 'g') { gotoPagePrompt(); haltEvent(e); }
      else if (key === 'q' || key === 'escape') { cleanupAndExit(); haltEvent(e); }
    }

    function haltEvent(e) {
      if (!e) return;
      try { if (e.preventDefault) e.preventDefault(); if (e.stopPropagation) e.stopPropagation(); } catch (err) {}
    }

    // Prefer addEventListener so we don't clobber qandy's globals. Also expose wrapper for qandy's global key hooks.
    window.addEventListener && window.addEventListener('keydown', onKey, true);

    // Also provide global keydown for environments that call keydown(key) directly
    window._ascii_prev_keydown = (typeof window.keydown === 'function') ? window.keydown : null;
    window.keydown = function(k) {
      // call our handler first
      onKey(k);
      // then the previous one if any
      if (typeof window._ascii_prev_keydown === 'function') {
        try { window._ascii_prev_keydown(k); } catch (e) { console.error(e); }
      }
    };
  }

  function cleanupAndExit() {
    // remove listeners we installed (best-effort)
    try { window.removeEventListener && window.removeEventListener('keydown', onKey, true); } catch (e) {}
    // restore previous keydown if present
    if (window._ascii_prev_keydown) window.keydown = window._ascii_prev_keydown;
    // Optionally clear the screen or return to caller
    cls();
    print("ASCII chart exited.\n");
  }

  // Start viewer
  renderPage(0);

  // expose handy API
  window.asciiChart = {
    renderPage: renderPage,
    next: nextPage,
    prev: prevPage,
    pages: totalPages,
    entriesPerPage: ENTRIES_PER_PAGE
  };

