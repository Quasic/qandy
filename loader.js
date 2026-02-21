(function() {
  'use strict';

  // Configuration array with script load order
  var SCRIPT_QUEUE = [
    { src: 'video.js', name: 'Video' },
    { src: 'gfx.js', name: 'Graphics' },
    { src: 'keyboard.js', name: 'Keyboard' },
    { src: 'dos.js', name: 'DOS', optional: true },
    { src: 'qandy.js', name: 'Qandy Core' }
  ];

  var startTime = Date.now();
  var currentIndex = 0;
  var signalAdvance = null;

  // Called by each script when its initialization is complete
  window.qandySignalReady = function(scriptName) {
    console.log('\u2713 ' + scriptName + ' signaled ready');
    if (typeof signalAdvance === 'function') {
      signalAdvance();
    }
  };

  function loadNext() {
    if (currentIndex >= SCRIPT_QUEUE.length) {
      var elapsed = Date.now() - startTime;
      console.log('\u2713 All scripts loaded successfully in ' + elapsed + 'ms');
      document.dispatchEvent(new CustomEvent('qandyReady'));
      return;
    }

    var entry = SCRIPT_QUEUE[currentIndex];
    currentIndex++;

    console.log('Loading: ' + entry.name + ' (' + entry.src + ')');

    var advanced = false;
    function advance() {
      if (advanced) return;
      advanced = true;
      signalAdvance = null;
      loadNext();
    }

    // Register advance as the handler for qandySignalReady for this script
    signalAdvance = advance;

    var script = document.createElement('script');
    script.src = entry.src;

    script.onerror = function() {
      signalAdvance = null;
      if (entry.optional) {
        console.warn('\u26a0 Optional script not found: ' + entry.name);
      } else {
        console.error('\u2717 Failed to load required script: ' + entry.name + ' (' + entry.src + ')');
        alert('Critical error: Failed to load ' + entry.src + '. The application may not work correctly.');
      }
      advance();
    };

    script.onload = function() {
      console.log('\u2713 Loaded: ' + entry.name);
      // If the script already called qandySignalReady, advance() is a no-op here
      advance();
    };

    document.head.appendChild(script);
  }

  // Start loading once the DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadNext);
  } else {
    loadNext();
  }
})();
