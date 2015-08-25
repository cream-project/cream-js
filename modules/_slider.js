//-----------------------------------------------------------------------------
//
// Slider
//
//-----------------------------------------------------------------------------

/*doc
---
title: Slider
name: slider
category: JS Modules
---

Content slider module.

```html_example
  <div class="slider" id="slider">
    <ul>
      <li class="slide">
        <p>Slide 1</p>
      </li>
      <li class="slide">
        <p>Slide 2</p>
      </li>
      <li class="slide">
        <p>Slide 3</p>
      </li>
    </ul>
    <nav id="slider-nav">
      <a class="slider-nav-prev" id="slider-nav-prev" href="#prev">
        Previous
      </a>
      <a class="slider-nav-next" id="slider-nav-next" href="#next">
        Next
      </a>
    </nav>
  </div>
```

```slim_example
  #slider.slider
    ul
      li.slide
        p Slide 1
      li.slide
        p Slide 2
      li.slide
        p Slide 3
    nav#slider-nav
      a#slider-nav-prev.slider-nav-prev[href="#prev"] Previous
      a#slider-nav-next.slider-nav-next[href="#next"] Next
```

```js_example
  // Initialze with defaults:
  var slider = slider();
  slider.init();

  // Initialize with options (These are the defaults):
  var slider = slider({
    // Ids of the HTML elements
    sliderId: 'slider',
    sliderNavId: 'slider-nav',
    sliderNavPrevId: 'slider-nav-prev',
    sliderNavNextId: 'slider-nav-next',
    // Automatically slide
    autoplay: false,
    // Automatic slide interval in milliseconds
    autoplayInterval: 3000,
    // Slide animation duration in milliseconds
    animationDuration: 800,
    // Loop Slides at beginning and end
    loop: false
  });
  slider.init();
```
*/

var slider = function(spec) {
  'use strict';

  var that = {};


  // Defaults -----------------------------------------------------------------

  spec = spec || {};

  // Ids
  spec.sliderId        = spec.sliderId        || 'slider';
  spec.sliderNavId     = spec.sliderNavId     || 'slider-nav';
  spec.sliderNavPrevId = spec.sliderNavPrevId || 'slider-nav-prev';
  spec.sliderNavNextId = spec.sliderNavNextId || 'slider-nav-next';

  // Options
  spec.animationDuration = spec.animationDuration || 800;
  spec.autoplay          = spec.autoplay          || false;
  spec.autoplayInterval  = spec.autoplayInterval  || 3000;
  spec.loop              = spec.loop              || false;


  // Private variables --------------------------------------------------------

  var currentSlide = 0;
  var init = false;
  var moving = false;
  var positions = ['center', 'left', 'right']

  var elements = {}
  elements.slider        = document.getElementById(spec.sliderId)
                           || null;
  elements.sliderNav     = document.getElementById(spec.sliderNavId)
                           || null;
  elements.sliderNavNext = document.getElementById(spec.sliderNavNextId)
                           || null;
  elements.sliderNavPrev = document.getElementById(spec.sliderNavPrevId)
                           || null;
  elements.slides        = (elements.slider)
                           ? elements.slider.getElementsByTagName('li')
                           : null;


  // Private functions --------------------------------------------------------

  var addEventListeners = function() {
    elements.sliderNavPrev.addEventListener('click', function(e) {
      e.preventDefault();

      move(true);
    });

    elements.sliderNavNext.addEventListener('click', function(e) {
      e.preventDefault();

      move(false);
    });
  };

  var animatePosition = function(slide, position) {
    slide.classList.add('animate');
    setPosition(slide, position);
    setTimeout(function() {
      slide.classList.remove('animate');
    }, spec.animationDuration);
  };

  var autoplay = function() {
    var autoplayId = window.setInterval(function() {
      move(false)
    }, spec.autoplayInterval);
  };

  var move = function(left) {
    if (!moving) {
      moving = true;

      if (currentSlide === 0 && left) {
        if (spec.loop) {
          for (var i = 0; i < elements.slides.length; i++) {
            if (i !== 0) {
              setPosition(elements.slides[i], 'left');
            }
          }

          animatePosition(elements.slides[0], 'left');
          animatePosition(elements.slides[elements.slides.length - 1],
                          'center');
          currentSlide = elements.slides.length - 1;
        }
      }
      else if (currentSlide === elements.slides.length - 1 && !left) {
        if (spec.loop) {
          for (var i = 0; i < elements.slides.length; i++) {
            if (i !== 0) {
              setPosition(elements.slides[i], 'right');
            }
          }

          animatePosition(elements.slides[elements.slides.length - 1],
                          'right');
          animatePosition(elements.slides[0], 'center');
          currentSlide = 0;
        }
      }
      else {
        if (left) {
          animatePosition(elements.slides[currentSlide], 'right');
          animatePosition(elements.slides[currentSlide - 1], 'center');
          currentSlide--;
        }
        else {
          animatePosition(elements.slides[currentSlide], 'left');
          animatePosition(elements.slides[currentSlide + 1], 'center');
          currentSlide++;
        }
      }

      setTimeout(function() { moving = false; }, spec.animationDuration);
    }
  };

  var setPosition = function (slide, position) {
    for (var i = 0; i < positions.length; i++) {
      if (position === positions[i]) {
        slide.classList.add(positions[i]);
      }
      else {
        slide.classList.remove(positions[i]);
      }
    }
  };


  // Private functions --------------------------------------------------------

  that.init = function() {
    // Check if DOM elements exist
    for (var element in elements) {
      if (!elements[element]) {
        return console.log('Slider: Element not found: "' + element + '".');
      }
    }

    for (var i = 0; i < elements.slides.length; i++) {
      elements.slides[i].style.position = 'absolute';
      setPosition(elements.slides[i], 'right');
    }

    elements.slider.style.overflow = 'hidden';
    elements.sliderNav.style.display = 'block';

    setPosition(elements.slides[currentSlide], 'center');

    addEventListeners();

    that.resize();

    if (spec.autoplay) {
      autoplay();
    }

    return init = true;
  };

  that.resize = function() {
    if (init) {
      var sliderHeight = 0;
      var windowHeight = window.innerHeight;

      for (var i = 0; i < elements.slides.length; i++) {
        if (elements.slides[i].offsetHeight > sliderHeight) {
          sliderHeight = elements.slides[i].offsetHeight;
        }
      }

      elements.slider.style.height = sliderHeight + 'px';
      elements.sliderNav.style.height = sliderHeight + 'px';
    }
  };


  // Return public functions object --------------------------------------------

  return that;
};
