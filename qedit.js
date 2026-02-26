/**
 * retro_text_editor.js
 *
 * A small, retro-style line editor suitable for use in bbs.js or a simple
 * Node terminal. Features:
 * - Line-by-line input mode (append new lines)
 * - Commands beginning with '.' for file operations and editing:
 *     .help      - show commands
 *     .list      - show numbered lines
 *     .show      - show file contents
 *     .insert N  - enter insert mode before line N
 *     .append N  - enter append mode after line N
 *     .delete N  - delete line N (or N-M range)
 *     .replace N text... - replace line N
 *     .search t  - search for text
 *     .undo      - undo last edit (limited stack)
 *     .save [fn] - save to filename (or provided filename)
 *     .history   - view editor save history
 *     .quit/.q   - quit (prompts to save if unsaved)
 *
 * Usage (CLI):
 *   node retro_text_editor.js myfile.txt
 *
 * Usage (bbs.js integration):
 *   const editor = require('./retro_text_editor');
 *   await editor.runEditor({ input: conn, output: conn, filename: 'notes.txt', onSave: (fn, content)=>{/*...*/} });
 *
 * The editor tries to work with generic stream-like objects (net.Socket, tty, process.stdin).
 *
 * Note: This is intentionally simple and text-mode only; it uses minimal ANSI for prompts.
 */

const fs = require('fs');
const path = require('path');
const os = require('os');

const HISTORY_FILE = path.join(os.homedir() || '.', '.qandy_editor_history.json');

function write(out, s) {
  if (!out || typeof out.write !== 'function') return;
  out.write(s);
}

function eprintln(out, s='') {
  write(out, s + '\r\n');
}

function prompt(out, p='EDIT> ') {
  write(out, '\x1b[36m' + p + '\x1b[0m'); // cyan prompt
}

/**
 * Basic line reader for generic Node streams.
 * Calls onLine when a full line (terminated by \n or \r\n) is read.
 */
function createLineReader(input, onLine) {
  let buf = '';
  const onData = (data) => {
    const s = data.toString('utf8');
    buf += s;
    let idx;
    while ((idx = buf.indexOf('\n')) !== -1) {
      let line = buf.slice(0, idx);
      // strip trailing \r if present
      if (line.endsWith('\r')) line = line.slice(0, -1);
      buf = buf.slice(idx + 1);
      onLine(line);
    }
  };
  input.on('data', onData);
  return () => input.removeListener('data', onData);
}

function safeParseInt(s, fallback=NaN) {
  const n = parseInt(String(s).trim(), 10);
  return Number.isNaN(n) ? fallback : n;
}

async function runEditor(opts = {}) {
  const input = opts.input || process.stdin;
  const output = opts.output || process.stdout;
  const filename = opts.filename || null;
  const onSave = typeof opts.onSave === 'function' ? opts.onSave : null;
  const maxUndo = opts.maxUndo || 30;

  let buffer = [];
  let dirty = false;
  let undoStack = [];
  let redoStack = [];

  function pushUndo() {
    undoStack.push(buffer.slice());
    if (undoStack.length > maxUndo) undoStack.shift();
    // clear redo on new action
    redoStack = [];
  }

  function loadFile(fn) {
    try {
      const data = fs.readFileSync(fn, 'utf8');
      buffer = data.replace(/\r\n/g, '\n').split('\n');
      if (buffer.length === 1 && buffer[0] === '') buffer = [];
      dirty = false;
      undoStack = [];
      redoStack = [];
      return true;
    } catch (e) {
      return false;
    }
  }

  function saveFile(fn) {
    const data = buffer.join('\n');
    if (onSave) {
      try {
        onSave(fn, data);
      } catch (e) {
        // swallow callback errors
      }
    } else {
      fs.writeFileSync(fn, data, 'utf8');
    }
    // record in history
    try {
      const hist = fs.existsSync(HISTORY_FILE) ? JSON.parse(fs.readFileSync(HISTORY_FILE, 'utf8') || '[]') : [];
      hist.unshift({ file: fn, saved_at: new Date().toISOString() });
      // keep only recent 50
      fs.writeFileSync(HISTORY_FILE, JSON.stringify(hist.slice(0,50),null,2), 'utf8');
    } catch (e) {
      // ignore history write failures
    }
    dirty = false;
  }

  function printHelp() {
    eprintln(output, '\x1b[33mRetro Editor Commands (start commands with .)\x1b[0m');
    eprintln(output, '.help                Show this help');
    eprintln(output, '.list [s,e]          List lines with numbers (optional range)');
    eprintln(output, '.show                Show file contents without numbers');
    eprintln(output, '.insert N            Insert lines BEFORE line N (end with a single dot on its own)');
    eprintln(output, '.append N            Insert lines AFTER line N (end with . on its own)');
    eprintln(output, '.delete N or N-M     Delete line N or range N through M');
    eprintln(output, '.replace N text...   Replace line N with text');
    eprintln(output, '.search text         Find text (case-insensitive)');
    eprintln(output, '.undo                Undo last edit');
    eprintln(output, '.redo                Redo last undone edit');
    eprintln(output, '.save [filename]     Save to filename (or editor filename)');
    eprintln(output, '.history             Show recent editor saves');
    eprintln(output, '.quit / .q           Quit (prompts to save if unsaved)');
    eprintln(output, '');
    eprintln(output, 'Notes: Normal lines (not starting with .) are appended to the buffer.');
  }

  function listLines(start, end) {
    if (buffer.length === 0) {
      eprintln(output, '\x1b[2m<empty file>\x1b[0m');
      return;
    }
    start = Math.max(1, start || 1);
    end = Math.min(buffer.length, end || buffer.length);
    for (let i = start; i <= end; i++) {
      const ln = buffer[i-1];
      write(output, '\x1b[36m' + String(i).padStart(4) + '\x1b[0m: ');
      eprintln(output, (ln === '' ? '\x1b[2m·\x1b[0m' : ln));
    }
  }

  function show() {
    eprintln(output, '\x1b[2m---- start ----\x1b[0m');
    eprintln(output, buffer.join('\r\n'));
    eprintln(output, '\x1b[2m----  end  ----\x1b[0m');
  }

  // try to pre-load file if provided
  if (filename) {
    if (fs.existsSync(filename)) {
      loadFile(filename);
      eprintln(output, '\x1b[32mLoaded:\x1b[0m ' + filename + ' (' + buffer.length + ' lines)');
    } else {
      eprintln(output, '\x1b[33mStarting new file:\x1b[0m ' + filename);
    }
  } else {
    eprintln(output, '\x1b[33mStarting new anonymous file\x1b[0m');
  }
  eprintln(output, 'Type lines to append. Type .help for commands. End insert/append mode with a single dot on its own.');
  prompt(output);

  // editor modes:
  //  - normal: lines appended; lines starting with '.' are commands
  //  - insert/append mode: collects lines until single '.'
  let mode = 'normal';
  let insertPos = null;
  let collecting = []; // for insert/append collected lines
  let closeFn = null;

  function handleCommand(line) {
    const parts = line.slice(1).trim().split(' ');
    const cmd = (parts.shift() || '').toLowerCase();
    try {
      switch (cmd) {
        case 'help':
          printHelp();
          break;
        case 'list': {
          const arg = parts[0];
          if (!arg) listLines(1, buffer.length);
          else {
            if (arg.includes(',')) {
              const [a,b] = arg.split(',').map(x => safeParseInt(x, NaN));
              listLines(a,b);
            } else if (arg.includes('-')) {
              const [a,b] = arg.split('-').map(x => safeParseInt(x, NaN));
              listLines(a,b);
            } else {
              const n = safeParseInt(arg, NaN);
              if (!Number.isNaN(n)) listLines(1, n);
              else listLines(1, buffer.length);
            }
          }
          break;
        }
        case 'show':
          show();
          break;
        case 'insert': {
          const n = safeParseInt(parts[0], 1);
          insertPos = Math.max(1, Math.min(n, buffer.length+1));
          collecting = [];
          mode = 'insert';
          eprintln(output, `\x1b[33mInsert mode before line ${insertPos}. End with a single dot '.' on its own.\x1b[0m`);
          break;
        }
        case 'append': {
          const n = safeParseInt(parts[0], buffer.length);
          // append after line n
          insertPos = Math.max(0, Math.min(n, buffer.length));
          collecting = [];
          mode = 'insert';
          eprintln(output, `\x1b[33mAppend mode after line ${insertPos}. End with a single dot '.' on its own.\x1b[0m`);
          break;
        }
        case 'delete': {
          const arg = parts[0];
          if (!arg) {
            eprintln(output, '\x1b[31mdelete requires an argument (N or N-M)\x1b[0m');
            break;
          }
          let a, b;
          if (arg.includes('-')) {
            [a,b] = arg.split('-').map(x => safeParseInt(x, NaN));
          } else {
            a = safeParseInt(arg, NaN);
            b = a;
          }
          if (Number.isNaN(a) || Number.isNaN(b) || a < 1) {
            eprintln(output, '\x1b[31minvalid range\x1b[0m');
            break;
          }
          a = Math.max(1, a);
          b = Math.min(buffer.length, b);
          if (a > b) { eprintln(output, '\x1b[31minvalid range\x1b[0m'); break; }
          pushUndo();
          buffer.splice(a-1, b-a+1);
          dirty = true;
          eprintln(output, `\x1b[32mDeleted lines ${a}-${b}\x1b[0m`);
          break;
        }
        case 'replace': {
          const idx = safeParseInt(parts[0], NaN);
          if (Number.isNaN(idx) || idx < 1 || idx > buffer.length) {
            eprintln(output, '\x1b[31minvalid line number\x1b[0m');
            break;
          }
          const text = parts.slice(1).join(' ');
          pushUndo();
          buffer[idx-1] = text;
          dirty = true;
          eprintln(output, `\x1b[32mReplaced line ${idx}\x1b[0m`);
          break;
        }
        case 'search': {
          const term = parts.join(' ');
          if (!term) { eprintln(output, '\x1b[31msearch requires text\x1b[0m'); break; }
          const t = term.toLowerCase();
          for (let i=0;i<buffer.length;i++) {
            if ((buffer[i]||'').toLowerCase().includes(t)) {
              write(output, '\x1b[36m' + String(i+1).padStart(4) + '\x1b[0m: ');
              eprintln(output, buffer[i]);
            }
          }
          break;
        }
        case 'undo': {
          if (undoStack.length === 0) { eprintln(output, '\x1b[33mNothing to undo\x1b[0m'); break; }
          redoStack.push(buffer.slice());
          buffer = undoStack.pop();
          dirty = true;
          eprintln(output, '\x1b[32mUndone\x1b[0m');
          break;
        }
        case 'redo': {
          if (redoStack.length === 0) { eprintln(output, '\x1b[33mNothing to redo\x1b[0m'); break; }
          pushUndo();
          buffer = redoStack.pop();
          dirty = true;
          eprintln(output, '\x1b[32mRedone\x1b[0m');
          break;
        }
        case 'save': {
          const fn = parts.join(' ') || filename;
          if (!fn) { eprintln(output, '\x1b[31mNo filename specified\x1b[0m'); break; }
          pushUndo();
          saveFile(fn);
          eprintln(output, '\x1b[32mSaved to\x1b[0m ' + fn);
          break;
        }
        case 'history': {
          try {
            const hist = fs.existsSync(HISTORY_FILE) ? JSON.parse(fs.readFileSync(HISTORY_FILE,'utf8')||'[]') : [];
            if (hist.length === 0) eprintln(output, '\x1b[2m<no history>\x1b[0m');
            else {
              hist.slice(0,50).forEach((h, i) => {
                eprintln(output, `${i+1}. ${h.file}  (${h.saved_at})`);
              });
            }
          } catch (e) {
            eprintln(output, '\x1b[31mCould not read history\x1b[0m');
          }
          break;
        }
        case 'q':
        case 'quit': {
          if (dirty) {
            eprintln(output, '\x1b[33mYou have unsaved changes. Type .save filename or .q again to quit and lose changes.\x1b[0m');
            // mark a second .q to force quit
            // we set a short-lived state that next .q quits without prompt
            mode = 'normal';
            // set a flag requiring immediate .q to quit
            expectingForceQuit = true;
          } else {
            finishedResolve({ saved: false, filename });
            // done
          }
          break;
        }
        default:
          eprintln(output, '\x1b[31mUnknown command. Type .help\x1b[0m');
      }
    } catch (e) {
      eprintln(output, '\x1b[31mCommand error:\x1b[0m ' + String(e.message || e));
    }
  }

  // allow .q twice to force quit
  let expectingForceQuit = false;

  function handleNormalLine(line) {
    if (expectingForceQuit && (line.trim().toLowerCase() === '.q' || line.trim().toLowerCase() === '.quit')) {
      finishedResolve({ saved: false, filename });
      return;
    }
    expectingForceQuit = false;

    if (line.startsWith('.')) {
      handleCommand(line);
      prompt(output);
      return;
    }
    // append line
    pushUndo();
    buffer.push(line);
    dirty = true;
    prompt(output);
  }

  // finished promise
  let finishedResolve;
  const finished = new Promise((res) => { finishedResolve = res; });

  // setup reader
  const stopReader = createLineReader(input, (line) => {
    // modes: if 'insert' then collect lines until single '.'
    if (mode === 'insert') {
      if (line === '.') {
        // apply collected
        pushUndo();
        if (insertPos === 0) {
          // append at start? insert at pos 0 means prepend
          buffer = collecting.concat(buffer);
        } else {
          // insertPos is index after which to insert? For 'append' we set insertPos to N
          // For 'insert' we set insertPos to N where we want to insert BEFORE N.
          // We stored insertPos as a number per earlier logic:
          // For 'insert', insertPos is 1-based position BEFORE which we insert.
          // For 'append', insertPos is N (0..buffer.length) and we want to insert after that.
          if (collecting && collecting.length > 0) {
            // Determine actual index where to splice
            let idx;
            if (insertPos >= 1 && insertPos <= buffer.length) {
              // insert BEFORE line insertPos (1-based)
              idx = insertPos - 1;
            } else {
              // insert after a line (append mode) -> insertPos is N, 0..buffer.length
              idx = insertPos;
            }
            buffer.splice(idx, 0, ...collecting);
          }
        }
        collecting = [];
        mode = 'normal';
        insertPos = null;
        dirty = true;
        eprintln(output, '\x1b[32mInserted.\x1b[0m');
        prompt(output);
      } else {
        collecting.push(line);
        // remain in insert mode; no prompt echo to avoid double prompts.
      }
      return;
    }
    // normal mode
    handleNormalLine(line);
  });

  // expose a small API to callers
  const api = {
    getBuffer: () => buffer.slice(),
    setBuffer: (arr) => { buffer = arr.slice(); dirty = true; },
    save: (fn) => saveFile(fn)
  };

  // await finished
  const result = await finished;

  // cleanup
  stopReader();

  return { result, api };

}

// If script invoked directly, run CLI mode
if (require.main === module) {
  const fn = process.argv[2] || null;
  runEditor({ filename: fn }).then(({ result }) => {
    // if caller quit without saving, result.saved may be false
    process.exit(0);
  }).catch(err => {
    console.error('Editor error:', err);
    process.exit(1);
  });
}

module.exports = { runEditor };