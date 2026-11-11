// Chamber of Commerce – Responsive Hamburger Navigation
const menuBtn = document.getElementById('menu');
const navBar  = document.getElementById('nav-bar');

if (menuBtn && navBar) {
  menuBtn.addEventListener('click', () => {
    const isOpen = navBar.classList.toggle('open');
    menuBtn.setAttribute('aria-expanded', isOpen);
    menuBtn.innerHTML = isOpen ? '&times;' : '&#9776;';
  });

  // Close menu when any nav link is clicked (mobile UX)
  navBar.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navBar.classList.remove('open');
      menuBtn.setAttribute('aria-expanded', 'false');
      menuBtn.innerHTML = '&#9776;';
    });
  });
}

// Mark the current page link as active
const currentPath = window.location.pathname.split('/').pop() || 'index.html';
navBar?.querySelectorAll('a').forEach(link => {
  const linkFile = link.getAttribute('href').split('/').pop();
  if (linkFile === currentPath) {
    link.classList.add('active');
    link.setAttribute('aria-current', 'page');
  }
});

