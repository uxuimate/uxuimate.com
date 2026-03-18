/**
 * FLIP Impact Gallery
 * See the Work. Feel the Impact.
 *
 * Port of Vue FLIP gallery to vanilla JS.
 * First: measure. Last: apply class, measure. Invert: apply transform. Play: animate.
 */
(function () {
    'use strict';

    const TRANSITION_DURATION = 620;
    const EASY_FN = 'cubic-bezier(0.65, 0, 0.35, 1)';
    const DEFAULT_TRANSFORM = 'scale(1) translate3d(0, 0, 1px)';

    function waitForImages(callback) {
        const grid = document.getElementById('flip-gallery-grid');
        if (!grid) {
            callback();
            return;
        }

        const images = grid.querySelectorAll('img');
        if (images.length === 0) {
            callback();
            return;
        }

        let loadedCount = 0;
        const totalImages = images.length;
        let callbackFired = false;

        function checkComplete() {
            if (callbackFired) return;
            loadedCount++;
            if (loadedCount === totalImages) {
                callbackFired = true;
                // Wait for next frame to ensure layout is stable
                requestAnimationFrame(function() {
                    setTimeout(callback, 50);
                });
            }
        }

        images.forEach(function(img) {
            if (img.complete && img.naturalHeight !== 0) {
                // Image already loaded
                checkComplete();
            } else {
                // Wait for image to load
                img.addEventListener('load', checkComplete, { once: true });
                img.addEventListener('error', checkComplete, { once: true });
            }
        });
    }

    function initFlipGallery() {
        const grid = document.getElementById('flip-gallery-grid');
        if (!grid) return;

        const items = Array.from(grid.querySelectorAll('.mil-flip-gallery-item'));
        if (items.length === 0) return;

        let selectedIndex = 0;

        function deselectAll() {
            const prevRects = items.map(function (child) {
                return child.getBoundingClientRect();
            });

            items.forEach(function (child) {
                child.style.transition = 'none';
                child.style.transform = DEFAULT_TRANSFORM;
                child.classList.remove('mil-flip-gallery-item--selected', 'mil-flip-gallery-item--expand-left', 'mil-flip-gallery-item--expand-right');
            });
            selectedIndex = -1;

            requestAnimationFrame(function () {
                items.forEach(function (child, i) {
                    const prevRect = prevRects[i];
                    const newRect = child.getBoundingClientRect();
                    const scale = prevRect.width / newRect.width;
                    const x = (prevRect.x - newRect.x) * 1 / scale;
                    const y = (prevRect.y - newRect.y) * 1 / scale;
                    child.style.transform = 'scale(' + scale + ') translate3d(' + x + 'px, ' + y + 'px, 1px)';
                    setTimeout(function () {
                        child.style.transition = 'all ' + TRANSITION_DURATION + 'ms ' + EASY_FN;
                        child.style.transform = DEFAULT_TRANSFORM;
                    }, 0);
                });
            });
        }

        function selectImage(index) {
            if (selectedIndex === index) {
                return; /* already expanded, don't collapse */
            }
            selectedIndex = index;
            const currentElement = items[index];

            const prevRects = items.map(function (child) {
                return child.getBoundingClientRect();
            });

            items.forEach(function (child) {
                child.style.transition = 'none';
                child.style.transform = DEFAULT_TRANSFORM;
                child.classList.remove('mil-flip-gallery-item--selected', 'mil-flip-gallery-item--expand-left', 'mil-flip-gallery-item--expand-right');
            });

            currentElement.classList.add('mil-flip-gallery-item--selected');
            currentElement.classList.add(index === 2 || index === 5 ? 'mil-flip-gallery-item--expand-right' : 'mil-flip-gallery-item--expand-left');

            items.forEach(function (child, i) {
                const prevRect = prevRects[i];
                const newRect = child.getBoundingClientRect();

                const scale = prevRect.width / newRect.width;
                const x = (prevRect.x - newRect.x) * 1 / scale;
                const y = (prevRect.y - newRect.y) * 1 / scale;

                child.style.transform = 'scale(' + scale + ') translate3d(' + x + 'px, ' + y + 'px, 1px)';

                setTimeout(function () {
                    child.style.transition = 'all ' + TRANSITION_DURATION + 'ms ' + EASY_FN;
                    child.style.transform = DEFAULT_TRANSFORM;
                }, 0);
            });
        }

        items.forEach(function (item, index) {
            item.addEventListener('click', function (e) {
                e.preventDefault();
                selectImage(index);
            });

            item.addEventListener('keydown', function (e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    selectImage(index);
                }
            });
        });

        selectedIndex = 0;
        items[0].classList.add('mil-flip-gallery-item--selected', 'mil-flip-gallery-item--expand-left');
    }

    function init() {
        waitForImages(function() {
            initFlipGallery();
        });
    }

    // Initialize on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        // DOM already loaded, wait a bit for Swup if present
        setTimeout(init, 100);
    }

    // Always listen for Swup events (works even if Swup is loaded after this script)
    document.addEventListener('swup:contentReplaced', function() {
        setTimeout(init, 100);
    });

    // Also listen for page load to handle refresh scenarios
    window.addEventListener('load', function() {
        const grid = document.getElementById('flip-gallery-grid');
        if (grid) {
            setTimeout(init, 50);
        }
    });
})();
