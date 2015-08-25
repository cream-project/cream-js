//-----------------------------------------------------------------------------
//
// Events
//
// Event handling functions.
//
// Self calling wrapper function, no need to initialize.
//
//-----------------------------------------------------------------------------


var events = (function() {
  'use strict';

  var that = {};

  //---------------------------------------------------------------------------
  // Performance-optimized resize event using requestAnimationFrame.
  //
  // Based on the example here:
  // https://developer.mozilla.org/en-US/docs/Web/Events/resize
  //---------------------------------------------------------------------------

  that.optimizedResize = (function() {
    var that = {};


    // Private variables ------------------------------------------------------

    var callbacks = [];
    var running = false;
  

    // Private functions ------------------------------------------------------

    // Add callback to loop
    var addCallback = function(callback) {
      if (callback) {
        callbacks.push(callback);
      }
    };

    // Run on resize event
    var resize = function () {
      if (!running) {
        running = true;
        if (window.requestAnimationFrame) {
          window.requestAnimationFrame(runCallbacks);
        } else {
          setTimeout(runCallbacks, 66);
        }
      }
    };

    // Run the actual callbacks
    var runCallbacks = function() {
      callbacks.forEach(function(callback) {
        callback();
      });

      running = false;
    };


    // Public functions -------------------------------------------------------

    that.add = function(callback) {
      if (!callbacks.length) {
        window.addEventListener('resize', resize);
      }
      addCallback(callback);
    };


    // Return public functions object -----------------------------------------

    return that;
  }());


  // Return public functions object -------------------------------------------

  return that;
}());
