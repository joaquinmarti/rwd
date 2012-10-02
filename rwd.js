/*! rwd - Author: Joaquin Marti - 2012  Dual MIT/BSD license */
/*! Javascript helper for responsive design */

(function(window, undefined) {

  // Enable strict mode
  "use strict";

  var document = window.document;
  var mq = [];
  var activeBreakpoint;
  var rpictures = []; // Save element reference, options
  var codeBlocks = []; // Save code blocks to execute
  var viewport = {};

  /* Breakpoints  */
  var breakpoints = {

    // Get media query names and media attributes
    get : function() {
      var stylesheets = document.getElementsByTagName('link');

      for (var i = 0, length = stylesheets.length; i < length; i++){
        if (stylesheets[i].getAttribute('data-name')) {
          mq.push({
            'name' : stylesheets[i].getAttribute('data-name'),
            'media' : stylesheets[i].getAttribute('media')
          });
        }
      }
    },

    // Set active breakpoint
    setActive : function() {
      for (var i = 0, length = mq.length; i < length; i++) {
        if (window.matchMedia(mq[i].media).matches) {
          if (activeBreakpoint !== mq[i].name) {
            activeBreakpoint = mq[i].name;
            events.breakpointChange(); // Triggers breakpoint change event
          }
        }
      }
    },

    // Get media from name
    getMedia : function(name) {
      for (var i = 0, length = mq.length; i < length; i++) {
        if (name === mq[i].name) {
          return mq[i].media;
        }
      }
    }

  };

  /* Events */
  var events = {
    bind : function() {
      window.addEventListener('resize', function() {
        breakpoints.setActive();
        picture.refresh();
      });
    },

    breakpointChange : function() {
      code.execute();
    }
  };

  /* Picture stuff */
  var picture = {

    process : function(rpicture) {
      var source, src, pr, oSrc;

      // Get picture sources
      source = picture.getActiveSource(rpicture.element);

      // Find active src
      oSrc = picture.getCurrentSrc(source);
      src = oSrc.src; // Current SRC
      pr = oSrc.pr; // Current Pixel ratio

      if (picture.testUpdateSrc(rpicture.element, src)) { // Test if src has to be changed
        // Execute before
        if (test.isFunction(rpicture.callback.before)) {
          rpicture.callback.before.call();
        }


        // Transform picture into img tag
        picture.render(rpicture, src, pr);

        // Execute After
        if (test.isFunction(rpicture.callback.after)) {
          rpicture.callback.after.call();
        }

      }

    },

    render : function(rpicture, src, pr) {
      // Get an existing img element
      var element = rpicture.element;
      var img = element.getElementsByTagName('img')[0];

      // Create new one for first time
      if (!img) {
        img = document.createElement('img');
        img.alt = element.getAttribute('alt');
        element.appendChild(img);
      }

      // Load callback
      img.onload = function() {
        // Clone the new image to memory to get real width and height
        // Not working just with img.cloneNode()
        var clonedImage = new Image();
        clonedImage.src = src;

        // Set the size of the image, depending on the pr value
        img.width = clonedImage.width / pr;
        img.height = clonedImage.height / pr;

        // Load Once callback, will execute just first time
        if (!rpicture.executed) {
          if (test.isFunction(rpicture.callback.loadonce)) {
            rpicture.callback.loadonce.call();
          }
          rpicture.executed = true;
        }

        // Load callback, it will execute every breakpoint
        if (test.isFunction(rpicture.callback.load)) {
          rpicture.callback.load.call();
        }

      };

      // Change SRC
      img.src = src;
    },

    refresh : function() {
      // Loop all cached images
      for (var i = 0, length = rpictures.length; i < length; i++) {
        picture.process(rpictures[i]);
      }

    },

    testUpdateSrc : function(element, src) {
      // Get an existing img element
      var img = element.getElementsByTagName('img')[0];
      var currentSrc = (img) ? img.getAttribute('src') : '';

      if (src !== currentSrc) {
        return true;
      }

      return false;
    },

    getActiveSource : function(element) {
      var sources = picture.getSources(element);
      var media;

      for (var i = 0, length = sources.length; i < length; i++) {
        // Get media attribute from source, or from media queries cache
        media = sources[i].getAttribute('media') || breakpoints.getMedia(sources[i].getAttribute('data-media'));

        if (media && window.matchMedia && window.matchMedia(media).matches) {
          return sources[i];
        }
      }
    },

    getSources : function(element) {
      return element.getElementsByTagName('source');
    },

    getCurrentSrc : function(source) {
      var srcset = source.getAttribute('srcset');

      if (srcset) {
        // Get device pixel ratio
        var pixelratio = window.devicePixelRatio || 1;

        // Get sources list
        var sources = srcset.split(',');

        // Loop inversely sources to get the one which matchs with pixelratio
        for (var i = sources.length - 1; i >= 0; i--) {
          var srcsetParts = helper.trim(sources[i]).split(' ');
          var imagePr = parseFloat(srcsetParts[1], 10);

          if (pixelratio >= imagePr) {
            return {
              src: srcsetParts[0],
              pr: pixelratio // Device pixel ratio
            };
          }
        }
      }
      else {
        return {
          src: source.getAttribute('src'),
          pr: 1
        };
      }
    }

  };

  /* Code stuff */
  var code = {
    execute : function() {
      // Loop codeblocks media
      for (var media in codeBlocks) {
        if (codeBlocks.hasOwnProperty(media)) {
          code.executeOne(media);
        }
      }
    },

    executeOne: function(media) {
      var mediaQuery = breakpoints.getMedia(media);

      // If media matches execute match callback collection
      if (window.matchMedia(mediaQuery).matches) {
        for (var i = 0, length = codeBlocks[media].match.length; i < length; i++) {
          codeBlocks[media].match[i].call(rwd, media, mediaQuery);
        }
      }

      // If media unmatches execute unmatch callback collection
      else {
        for (var n = 0, nlength = codeBlocks[media].unmatch.length; n < nlength; n++) {
          codeBlocks[media].unmatch[n].call(rwd, media, mediaQuery);
        }
      }
    }
  };

  /* Sizes */
  var size = {

    // Append test container
    appendDiv : function() {
      var rwdTester = document.createElement('div');
      rwdTester.id = 'rwd-test-viewport';
      rwdTester.style.cssText = 'position:fixed;height:100%;width:100%;top:-100%;left:-100%';
      document.body.appendChild(rwdTester);
      return rwdTester;
    },

    // Update sizes
    updateSize : function() {
      var rwdTester = document.getElementById('rwd-test-viewport');

      // Create rwdTester if it doesn't exist
      if (!rwdTester) {
        rwdTester = size.appendDiv();
      }

      // Reset sizes
      viewport.size = {};
      viewport.size.height = rwdTester.clientHeight;
      viewport.size.width = rwdTester.clientWidth;

      // Destroy rwdTester
      document.body.removeChild(rwdTester);
    },

    // Get Width
    getWidth : function() {
      size.updateSize();
      return viewport.size.width;
    },

    // Get Height
    getHeight : function() {
      size.updateSize();
      return viewport.size.height;
    }

  };

  /* Tests */
  var test = {
    // Test if <picture> is supported natively by browser
    nativePicture : function() {
      if (!!( document.createElement('picture') && document.createElement('source') && window.HTMLPictureElement ) ){
        return true;
      }
      return false;
    },

    // Test if the object is a picture element
    isPictureElement : function(o){
      return (
        typeof HTMLElement === 'object' ? o instanceof HTMLElement && o.tagName === 'PICTURE' : //DOM2
        o && typeof o === 'object' && o.nodeType === 1 && typeof o.nodeName === 'string' && o.tagName === 'PICTURE'
      );
    },

    // Test if the object is a function
    isFunction : function(o) {
      if (typeof(o) === "function") {
        return true;
      }
      else {
        return false;
      }
    }

  };

  /* Helpers */
  var helper = {

    // Merge objects
    merge : function(ob1, ob2) {
      for (var key in ob2) {
        if (ob2.hasOwnProperty(key)) {
          ob1[key] = ob2[key];
        }
      }
      return ob1;
    },

    trim : function(string) {
      return string.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
    }

  };

  /* Main object */
  var rwd = (function() {

    var core = {

      init : function() {
        breakpoints.get();
        breakpoints.setActive();
        events.bind();
      },

      getBreakpoint : function() {
        return activeBreakpoint;
      },

      getBreakpoints : function() {
        return mq;
      },

      nativePicture : test.NativePicture,

      picture : function(elements, options) { // Options: before, after, load, loadonce

        var rpicture;

        // Test native <picture tag>
        if (test.nativePicture()) {
          return;
        }

        // Loop elements
        for (var i = 0, length = elements.length; i < length; i++) {

          // Test if the element is a picture tag
          if(test.isPictureElement(elements[i])) {

            // Prepare rpicture object
            rpicture = {
              'element': elements[i],
              'callback': {
                'before': options.before,
                'after': options.after,
                'load': options.load,
                'loadonce': options.loadonce
              },
              'executed': false
            };

            // Save in cache
            rpictures.push(rpicture);

            // Process
            picture.process(rpictures[rpictures.length - 1]);
          }

        }

      },

      register : function(media, callbacks) {
        if (!codeBlocks[media]) {
          codeBlocks[media] = [];
          codeBlocks[media].match = [];
          codeBlocks[media].unmatch = [];
        }

        // Check callbacks and cache them
        if (callbacks.match && test.isFunction(callbacks.match)) {
          codeBlocks[media].match.push(callbacks.match);
        }

        if (callbacks.unmatch && test.isFunction(callbacks.unmatch)) {
          codeBlocks[media].unmatch.push(callbacks.unmatch);
        }

        // Execute once
        code.executeOne(media);
      },

      getViewporWidth : function() {
        return size.getWidth();
      },

      getViewporHeight : function() {
        return size.getHeight();
      }

    };

    return core;

  })();

  window.rwd = rwd;


})(window);

rwd.init();