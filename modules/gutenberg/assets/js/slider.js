
jQuery(document).ready(function($) {

  $(window).load(function(){
    $('.flexslider').flexslider({
      animation: "slide",
      slideshow: true,
      animationSpeed: 500,
      initDelay: 0, 
      controlNav: true,
      start: function(slider){
        $('body').removeClass('loading');
      }
    });
  });

});