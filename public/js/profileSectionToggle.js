document.addEventListener("DOMContentLoaded", function () {
    function hideAllSections() {
        document
            .querySelectorAll(".profile-section")
            .forEach(function (section) {
                section.style.display = "none";
            });
    }

    function showSectionById(sectionId) {
        hideAllSections();
        document.getElementById(sectionId).style.display = "block";
    }

    function activateNavItem(navItemId) {
        document
            .querySelectorAll("#profile-toggle-menu a")
            .forEach(function (item) {
                item.classList.remove("active");
            });
        document.getElementById(navItemId).classList.add("active");
    }

    document
        .getElementById("link-posts")
        .addEventListener("click", function (e) {
            e.preventDefault();
            showSectionById("user-posts");
            activateNavItem("link-posts");
        });

    document
        .getElementById("link-followers")
        .addEventListener("click", function (e) {
            e.preventDefault();
            showSectionById("user-followers");
            activateNavItem("link-followers");
        });

    document
        .getElementById("link-followings")
        .addEventListener("click", function (e) {
            e.preventDefault();
            showSectionById("user-followings");
            activateNavItem("link-followings");
        });

    showSectionById("user-posts");
    activateNavItem("link-posts");
});
