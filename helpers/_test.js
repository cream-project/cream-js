//-----------------------------------------------------------------------------
//
// Tests
//
// Feature test functions.
//
// Self calling wrapper function, no need to initialize.
//
// Based on:
// Modernizr.prefixed() (https://github.com/Modernizr/Modernizr)
//
//-----------------------------------------------------------------------------


var test = (function (spec) {
  'use strict';

  var that = {};


  // Defaults -----------------------------------------------------------------

  spec = spec || {};


  // Private vars -------------------------------------------------------------

  var testElem = document.createElement('div');

  var omPrefixes = 'Webkit Moz O ms';
  var cssomPrefixes = omPrefixes.split(' ');
  var domPrefixes = omPrefixes.toLowerCase().split(' ');


  // Private functions --------------------------------------------------------

  // Move contains function to String object?
  var contains = function(str, substr) {
    return !!~('' + str).indexOf(substr);
  };

  // Test for CSS properties
  var testProps = function(props, prefixed) {
    for (var i in props) {
      var prop = props[i];
      if (!contains(prop, "-") && testElem.style[prop] !== undefined) {
        return prefixed == 'pfx' ? prop : true;
      }
    }
    return false;
  };

  // Return property prefix
  var testDOMProps = function(props, obj, elem) {
    for (var i in props) {
      var item = obj[props[i]];
      if (item !== undefined) {
        if (elem === false) {
          return props[i];
        }
        if (typeof item === 'function') {
          return item.bind(elem || obj);
        }
        return item;
      }
    }
    return false;
  };

  var testPropsAll = function(prop, prefixed, elem) {
    var ucProp  = prop.charAt(0).toUpperCase() + prop.slice(1);
    var props   = (prop + ' ' + cssomPrefixes.join(ucProp + ' ') + ucProp).split(' ');

    if (typeof prefixed === 'string' || typeof prefixed === 'undefined') {
      return testProps(props, prefixed);
    }
    else {
      props = (prop + ' ' + (domPrefixes).join(ucProp + ' ') + ucProp).split(' ');
      return testDOMProps(props, prefixed, elem);
    }
  };


  // Public functions ---------------------------------------------------------

  // Return the prefixed version of the CSS property for the current browser
  that.prefixed = function(prop) {
    return testPropsAll(prop, 'pfx');
  };


  // Return public functions object --------------------------------------------

  return that;
})();
