// the viewers
jQuery(function() {



  // create the 2d sliders
  jQuery("#blue_slider").slider({
    slide: volumeslicingAx
  });
  jQuery("#blue_slider .ui-slider-handle").unbind('keydown');

  jQuery("#red_slider").slider({
    slide: volumeslicingSag
  });
  jQuery("#red_slider .ui-slider-handle").unbind('keydown');

  jQuery("#green_slider").slider({
    slide: volumeslicingCor
  });
  jQuery("#green_slider .ui-slider-handle").unbind('keydown');

  // jQuery('.rotateCounter').button();

});
