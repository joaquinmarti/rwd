# rwd - Javascript helper for responsive design

rwd is a Javascript library to help responsive design work. The basic idea is to name each media query link tags in &lt;header&gt; with a data-name attribute, and provide a set of tools to work:

1. A Javascript flag indicating which media query is active at the current window size.
2. A way to execute Javascript callbacks when a media query matches or unmatches after browser resize.
3. Picture W3C tag support, including a set of callbacks, but not exactly as a polyfill.

## Examples

### How to name media queries

You have to add a data-name attribute to the link tags of each media query. These names will be used in the other two functionalityies of rwd. The idea behind them is to define the breakpoints in the &lt;header&gt; of the document and use an alias in other parts of the document, instead of writing the media attribute everywhere.

    <link href="stylesheets/mobile.css" media="screen and (max-width: 767px)" type="text/css" rel="stylesheet" data-name="mobile">
    <link href="stylesheets/portrait.css" media="screen and (min-width: 768px) and (max-width: 1023px)" type="text/css" rel="stylesheet" data-name="portrait">
    <link href="stylesheets/landscape.css" media="screen and (min-width: 1024px) and (max-width: 1200px)" type="text/css" rel="stylesheet" data-name="landscape">
    <link href="stylesheets/desktop.css" media="screen and (min-width: 1200px)" type="text/css" rel="stylesheet" data-name="desktop">

### Javascript flag

    rwd.getBreakpoint();

rwd.getBreakpoint() will return the content of data-name attribute of the active media query at the current window size.

### Get all breakpoints

    rwd.getBreakpoints();

rwd.getBreakpoints(); will return an array with the media queries defined in the <link> tags. Each media query has "name" and "media" properties.

### Media Query callbacks

    rwd.register('mobile', {
      match: function() {
        // This code will run when mobile media query matches
      },
      unmatch: function() {
        // This code will run when mobile media query unmatches
      }
    });

rwd.register() needs two parameters:

1. Name of the media query you want to attach the callbacks to.
2. An object with two optional properties: match and unmatch.

Each callback has two optional parameters: name and media. With the next code you can set a class (using jQuery) in the body for each breakpoint, using getBreakpoints() and the optional callback parameters.

    var breakpoints = rwd.getBreakpoints();

    for (var i = 0, length = breakpoints.length; i < length; i++) {
      rwd.register(breakpoints[i].name, {
        match: function(name) {
          $('body').addClass(name);
        },
        unmatch: function(name) {
          $('body').removeClass(name);
        }
      });
    }

### Get Viewport sizes

    rwd.getViewporHeight();
    rwd.getViewporWidth();

### Picture support

rwd adds picture tag support for responsive content images and includes a set of optional callbacks to execute code before and after changing the image, in the first load of the image and after every load event.

It's not exactly a polyfill because you will need to init by Javascript the picture support, with the advantage of setting up the callbacks. If you need a real picture polyfill I recommend you <a href="https://github.com/scottjehl/picturefill">Picturefill</a>.

The html code needed in rwd has two options: with src attribute or with srcset for different dpr.

#### SRC attribute

    <picture alt="Průhonice" class="picture_1">
      <source src="http://farm8.staticflickr.com/7118/7409677288_48733a0bda_m.jpg" data-media="mobile">
      <source src="http://farm8.staticflickr.com/7118/7409677288_48733a0bda_z.jpg" data-media="portrait">
      <source src="http://farm8.staticflickr.com/7118/7409677288_48733a0bda_c.jpg" data-media="landscape">
      <source src="http://farm8.staticflickr.com/7118/7409677288_48733a0bda_b.jpg" data-media="desktop">

      <noscript>
        <img src="http://farm8.staticflickr.com/7118/7409677288_48733a0bda_c.jpg" alt="Průhonice">
      </noscript>
    </picture>

#### SRCSET attribute

    <picture alt="Průhonice" class="picture_3">
      <source srcset="http://farm6.staticflickr.com/5468/7413015628_230da0a4f6_s.jpg 1x, http://farm6.staticflickr.com/5468/7413015628_230da0a4f6_q.jpg 2x" data-media="mobile">
      <source srcset="http://farm6.staticflickr.com/5468/7413015628_230da0a4f6_n.jpg 1x, http://farm6.staticflickr.com/5468/7413015628_230da0a4f6_z.jpg 2x" data-media="portrait">
      <source srcset="http://farm6.staticflickr.com/5468/7413015628_230da0a4f6_c.jpg 1x, http://farm6.staticflickr.com/5468/7413015628_2836389289_h.jpg 2x" data-media="landscape">
      <source srcset="http://farm6.staticflickr.com/5468/7413015628_230da0a4f6_b.jpg 1x, http://farm6.staticflickr.com/5468/7413015628_6d428d121a_k.jpg 2x" data-media="desktop">

      <noscript>
        <img src="http://farm8.staticflickr.com/7118/7409677288_48733a0bda_c.jpg" alt="Průhonice">
      </noscript>
    </picture>

#### Javascript code

    rwd.picture(document.getElementsByTagName('picture'), {
      before: function() {
        // This code will run before changing the image
      },
      after: function() {
        // This code will run inmdiately after changing the image
      },
      loadonce: function() {
        // This code will run after the first load of each image
      },
      load: function() {
        // This code will run after every load of each image
      }
    });

#### jQuery adapter

With the jQuery adapter it's possible to use rwd picture support as a jQuery plugin:

    $(document).ready(function() {
      $('picture').picture({
        before: function() {
          // This code will run before changing the image
        },
        after: function() {
          // This code will run inmdiately after changing the image
        },
        loadonce: function() {
          // This code will run after the first load of each image
        },
        load: function() {
          // This code will run after every load of each image
        }
      });

    });

#### Native picture support

In rwd picture it's possible to work with media attributes in source tag, instead of data-media naming. If you set the media attribute, rwd picture will use it instead of data-media reference. It gives compatibilty for future browsers which will support natively the picture tag.

## Matchmedia

For old browsers, matchmedia polyfill is needed.