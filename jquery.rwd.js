/*! jQuery rwd - Author: Joaquin Marti - 2012 Dual MIT/BSD license */
/*! jQuery adapter for rwd picture */

(function($){

  $.fn.picture = function(options) {

    return this.each(function() {
      rwd.picture($(this).get(), options);
    });

  };

})(jQuery);