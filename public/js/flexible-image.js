document.addEventListener('DOMContentLoaded', function() {
  var wrapper;
  var i;

  if (!CSS.supports || !CSS.supports('object-fit', 'cover')) {
    wrappers = document.querySelectorAll('.js-flexible-image');

    for (i = 0; i < wrappers.length; i++) {
      setStyle(wrappers[i]);
    }

    function setStyle(wrapper) {
      var image = wrapper.querySelector('img');

      wrapper.style = 'background-image: url("' + image.src + '")';
    }
  }
});
