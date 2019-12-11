
jQuery(document).ready(function($) {

  $(window).load(function(){
    $('.flexslider').flexslider({
      animation: "slide",
      slideshow: true,
      controlNav: true,
      start: function(slider){
        $('body').removeClass('loading');
      }
    });
  });

});