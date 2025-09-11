/**
 * Returns whether the current user is considered logged in.
 * @returns {boolean}
 */
function isLoggedIn() {
    return sessionStorage.getItem("isLoggedIn") === "true";
}

/**
 * Checks if a path is allowed without authentication.
 * @param {string} pathname - e.g., window.location.pathname
 * @returns {boolean}
 */
function hasAccessWithoutLogin(pathname) {
    return (pathname === "/html/privacy-policy.html" || pathname === "/html/legal-notice.html");
}

/**
 * Hides app-only UI when showing public pages to unauthenticated users.
 */
function hideContent() {
    document.getElementById("sidebar-main")?.classList.replace("links-container", "dni");
    document.getElementById("account-menue")?.classList.add("dni");
}

/**
 * Route guard: call this after templates are included.
 * - If logged in: do nothing.
 * - If public legal page: hide app UI, keep content.
 * - Else: redirect to the login page.
 * @returns {boolean} - false, if user has no access to this page
 */
function hasAccess() {
    if (isLoggedIn()) return true;
    if (hasAccessWithoutLogin(window.location.pathname)) {
        hideContent();
        return true;
    } else {
        window.location.href = "/index.html";
        return false;
    }
}
