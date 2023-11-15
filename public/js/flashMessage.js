document.addEventListener("DOMContentLoaded", function () {
    const flashMessages = document.querySelectorAll(".flash");

    flashMessages.forEach(function (flash) {
        setTimeout(function () {
            flash.style.display = "none";
        }, 2000);
    });
});
