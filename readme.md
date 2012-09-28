# rwd - Javascript helper for responsive design

rwd is a Javascript library to help responsive design work. The basic idea is to name each media query link tags in &lt;header&gt; with a data-name attribute, and provide a set of tools to work:

1. A Javascript flag indicating which media query is active at the current window size.
2. A way to execute Javascript callbacks when a media query matches or unmatches after browser resize.
3. A polyfill for picture W3C tag, including a set of callbacks.

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

### Picture polyfill

Picture polyfill adds support for responsive content images and includes a set of optional callbacks to execute code before and after changing the image, in the first load of the image and after every load event.

The markdown has two options: with src attribute or with srcset for different dpr.

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
        // This code will run before chanching the image
      },
      after: function() {
        // This code will run inmdiately after chanching the image
      },
      loadonce: function() {
        // This code will run after the first load of each image
      },
      load: function() {
        // This code will run after every load of each image
      }
    });

#### jQuery adapter

With the jQuery adapter it's possible to use rwd picture polyfill as a jQuery plugin:

    $(document).ready(function() {
      $('picture').picture({
        before: function() {
          // This code will run before chanching the image
        },
        after: function() {
          // This code will run inmdiately after chanching the image
        },
        loadonce: function() {
          // This code will run after the first load of each image
        },
        load: function() {
          // This code will run after every load of each image
        }
      });

    });

## Matchmedia

For old browsers, matchmedia polyfill is needed.