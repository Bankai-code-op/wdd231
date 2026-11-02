// Responsive Hamburger Navigation
const menuButton = document.getElementById("menu");
const navBar = document.getElementById("nav-bar");

if (menuButton && navBar) {
    menuButton.addEventListener("click", () => {
        navBar.classList.toggle("open");
        const isOpen = navBar.classList.contains("open");
        menuButton.setAttribute("aria-expanded", isOpen);
        menuButton.innerHTML = isOpen ? "&times;" : "&#9776;";
    });
}
