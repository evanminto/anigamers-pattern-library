var headers = document.querySelectorAll('.js-site-header');
var i;

function setUpHeader(header) {
  document.body.addEventListener('click', function (event) {
    if (!event.target.closest('.site-header')) {
      header.classList.remove('site-header--links-open');
      header.classList.remove('site-header--search-open');
    }
  });

  header.addEventListener('click', function(event) {
    if (event.target.closest('.menu-toggle')) {
      header.classList.remove('site-header--search-open');
      header.classList.toggle('site-header--links-open');
    }

    if (event.target.closest('.search-toggle')) {
      header.classList.remove('site-header--links-open');
      header.classList.toggle('site-header--search-open');
      header.querySelector('input[type="search"]').focus();
    }
  })
}

for (i = 0; i < headers.length; headers++) {
  setUpHeader(headers[i]);
}