
// video.js variables
var screenBuffer = [];
var cursorX = 0;
var cursorY = 0;
var cursorOn=0;

var styleBuffer = [];
var currentStyle = {
  color: 37,      // white foreground
  bgcolor: 40,    // black background
  bold: false,
  inverse: false
};

// gfx.js variables
var txt="";
var mode="txt"; // gfx or txt display
var allowScriptESC=false; // if true, script handles ESC instead of universal termination

var PopX=0;
var PopY=0;
var PopHide="hidden";
var PopAlign="center";
var PForce="hidden";
var mapx=7;
var mapy=11;
var map="";

// keyboard.js variables
var keyon=1;
var caps=0;  // caps lock state: 0=lowercase, 1=uppercase, 2=extended graphics
var shift=0; // shift key pressed  
var ctrl=0;  // ctrl key pressed
var alt=0;   // alt key pressed
var ctrlPhysical=false;  // track if ctrl was activated by physical keyboard
var altPhysical=false;   // track if alt was activated by physical keyboard
var keyboard=1; // turn keyboard input on/off

// memory.js — ensure shared globals are properties of window
window.line = (typeof window.line === 'string') ? window.line : "";
window.inputStartX = (typeof window.inputStartX === 'number') ? window.inputStartX : 0;
window.inputStartY = (typeof window.inputStartY === 'number') ? window.inputStartY : 0;
window.cursorPos = (typeof window.cursorPos === 'number') ? window.cursorPos : 0;
window.inputScrollPos = (typeof window.inputScrollPos === 'number') ? window.inputScrollPos : 0;

var commandHistory = [];  // Array to store command history
var historyIndex = -1;    // Current position in history (-1 = not browsing, typing new command)
var maxHistorySize = 50;  // Maximum number of commands to remember
var tempCommand = "";     // Temporary storage for command being typed when browsing history

var selectionStart = -1;  // Start position of selection (-1 = no selection)
var selectionEnd = -1;    // End position of selection
var selectionBgColor = '#ffffff';   // Selection background color
var selectionFgColor = '#000000';   // Selection text color

// qandy.js variables

var devteam=1;  // developer mode
var run="";
var RAM="";           // Current file content in memory
var RAMFILE="";       // Current filename loaded in RAM
var RAMTYPE="";       // Current file type (js, txt, etc)

var paginationEnabled = true;  // Enable/disable pagination feature
var paginationPaused = false;  // Is print() currently paused?
var paginationBuffer = [];     // Queued text waiting to be printed
var paginationLinesBeforePause = 25;  // Lines to show before pausing
var inInputMode = false;       // True when processing user input (prevents pagination)

