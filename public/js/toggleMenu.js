document.addEventListener("DOMContentLoaded", function () {
    const menuButton = document.querySelector(".mobile-menu");
    const menu = document.querySelector(".nav_menu");

    menuButton.addEventListener("click", function () {
        menu.classList.toggle("active");
    });
});
