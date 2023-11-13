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

    document
        .getElementById("link-posts")
        .addEventListener("click", function () {
            showSectionById("user-posts");
        });

    document
        .getElementById("link-followers")
        .addEventListener("click", function () {
            showSectionById("user-followers");
        });

    document
        .getElementById("link-followings")
        .addEventListener("click", function () {
            showSectionById("user-followings");
        });

    hideAllSections();
    showSectionById("user-posts");
});
