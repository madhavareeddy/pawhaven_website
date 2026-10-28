document.addEventListener("DOMContentLoaded", () => {
    const toggle = document.getElementById("profile-menu-toggle");
    const dropdown = document.getElementById("profile-dropdown");

    if (!toggle || !dropdown) return;

    const closeMenu = () => {
        dropdown.hidden = true;
        toggle.setAttribute("aria-expanded", "false");
    };

    toggle.addEventListener("click", (event) => {
        event.stopPropagation();
        const isOpening = dropdown.hidden;
        dropdown.hidden = !isOpening;
        toggle.setAttribute("aria-expanded", String(isOpening));
    });

    dropdown.addEventListener("click", (event) => {
        if (event.target.closest("a")) closeMenu();
    });

    document.addEventListener("click", (event) => {
        if (!event.target.closest(".dash-profile-menu-wrap")) closeMenu();
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && !dropdown.hidden) {
            closeMenu();
            toggle.focus();
        }
    });
});
