/**
 * First-visit glassmorphism popup – shows once after 28 seconds.
 * Uses localStorage key: uxuimate_first_visit_popup_seen
 */
(function () {
    "use strict";

    var STORAGE_KEY = "uxuimate_first_visit_popup_seen";
    var DELAY_MS = 28000; // 28 seconds

    function getPopup() {
        return document.getElementById("mil-first-visit-popup");
    }

    function isAlreadySeen() {
        try {
            return localStorage.getItem(STORAGE_KEY) === "1";
        } catch (e) {
            return false;
        }
    }

    function markAsSeen() {
        try {
            localStorage.setItem(STORAGE_KEY, "1");
        } catch (e) {}
    }

    function showPopup() {
        var popup = getPopup();
        if (!popup || isAlreadySeen()) return;
        popup.classList.add("mil-popup-visible");
        popup.setAttribute("aria-hidden", "false");
        document.body.style.overflow = "hidden";
        markAsSeen();
    }

    function hidePopup() {
        var popup = getPopup();
        if (!popup) return;
        popup.classList.remove("mil-popup-visible");
        popup.setAttribute("aria-hidden", "true");
        document.body.style.overflow = "";
    }

    function bindClose() {
        var popup = getPopup();
        if (!popup) return;
        var closers = popup.querySelectorAll("[data-popup-close]");
        for (var i = 0; i < closers.length; i++) {
            closers[i].addEventListener("click", function () {
                hidePopup();
            });
        }
        popup.addEventListener("click", function (e) {
            if (e.target === popup) hidePopup();
        });
    }

    function init() {
        var popup = getPopup();
        if (!popup) return;
        bindClose();
        if (isAlreadySeen()) return;
        setTimeout(showPopup, DELAY_MS);
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
})();
