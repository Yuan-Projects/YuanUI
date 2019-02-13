(function () {
  var dropdowns = document.querySelectorAll('.dropdown');
  Array.prototype.forEach.call(dropdowns, function(dropdown) {
    var toggleBtn = dropdown.querySelector('.dropdown__toggle'),
        drawer = dropdown.querySelector('.dropdown__drawer'),
        drawerHeight = drawer.scrollHeight;
    toggleBtn.addEventListener('click', function (event) {
      dropdown.classList.toggle('is-open');
      if (dropdown.classList.contains('dropdown--slide')) {
        if (dropdown.classList.contains('is-open')) {
          drawer.style.height = drawerHeight + 'px';
        } else {
          drawer.style.height = '0';
        }
      }
    });
  });
}());