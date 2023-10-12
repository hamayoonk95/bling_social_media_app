document.addEventListener("DOMContentLoaded", function () {
    // Ensures the script runs after the document is loaded
    const menuButton = document.querySelector(".mobile-menu");
    const menu = document.querySelector(".nav_menu");

    menuButton.addEventListener("click", function () {
        menu.classList.toggle("active");
    });
});
