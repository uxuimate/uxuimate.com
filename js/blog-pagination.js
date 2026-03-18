// Blog Pagination - 6 articles per page, works with category filter
(function() {
    'use strict';

    const ARTICLES_PER_PAGE = 6;
    let initialized = false;

    if (!document.getElementById('blog-pagination-css')) {
        const style = document.createElement('style');
        style.id = 'blog-pagination-css';
        style.textContent = '.col-lg-12.pagination-hidden { display: none !important; }';
        document.head.appendChild(style);
    }

    function getCurrentPage() {
        const params = new URLSearchParams(window.location.search);
        return Math.max(1, parseInt(params.get('page'), 10) || 1);
    }

    function getArticleColumns(container) {
        if (!container) return [];
        const cols = [];
        container.querySelectorAll('.col-lg-12').forEach(function(col) {
            if (col.querySelector('.mil-pagination')) return;
            if (col.querySelector('a.mil-blog-card[data-category]')) {
                cols.push(col);
            }
        });
        return cols;
    }

    function applyPagination() {
        if (!document.querySelector('.mil-pagination')) return;

        const container = document.querySelector('#blog .container.mil-p-120-120');
        if (!container) return;

        const articleCols = getArticleColumns(container);
        const activeCategory = document.querySelector('.category-filter.mil-active')?.getAttribute('data-category') || 'all';

        var visibleCols = [];
        articleCols.forEach(function(col) {
            var card = col.querySelector('a.mil-blog-card[data-category]');
            var cardCategory = card ? card.getAttribute('data-category') : '';
            var matchesCategory = activeCategory === 'all' || cardCategory === activeCategory;
            if (matchesCategory) visibleCols.push(col);
        });

        const totalArticles = visibleCols.length;
        const totalPages = Math.max(1, Math.ceil(totalArticles / ARTICLES_PER_PAGE));
        const page = Math.min(getCurrentPage(), totalPages);
        const startIndex = (page - 1) * ARTICLES_PER_PAGE;
        const endIndex = Math.min(startIndex + ARTICLES_PER_PAGE, totalArticles);

        if (activeCategory === 'all') {
            articleCols.forEach(function(col) {
                var idx = visibleCols.indexOf(col);
                if (idx >= startIndex && idx < endIndex) {
                    col.classList.remove('pagination-hidden');
                    col.style.display = '';
                    col.style.visibility = '';
                } else {
                    col.classList.add('pagination-hidden');
                }
            });
            updateButtons(page, totalPages);
        } else {
            articleCols.forEach(function(col) {
                var card = col.querySelector('a.mil-blog-card[data-category]');
                var cardCategory = card ? card.getAttribute('data-category') : '';
                var matchesCategory = cardCategory === activeCategory;
                if (matchesCategory) {
                    col.classList.remove('pagination-hidden');
                    col.style.display = '';
                    col.style.visibility = '';
                } else {
                    col.style.display = 'none';
                    col.classList.add('pagination-hidden');
                }
            });
            var paginationContainer = document.querySelector('.mil-pagination');
            if (paginationContainer) paginationContainer.style.display = 'none';
        }
        initialized = true;
    }

    function updateButtons(currentPage, totalPages) {
        var container = document.querySelector('.mil-pagination');
        if (!container) return;

        container.innerHTML = '';

        if (totalPages <= 1) {
            container.style.display = 'none';
            return;
        }

        container.style.display = '';

        for (var i = 1; i <= totalPages; i++) {
            var btn = document.createElement('a');
            btn.href = i === 1 ? 'blog.html' : 'blog.html?page=' + i;
            btn.setAttribute('data-no-swup', ''); // Force full page load so pagination runs with correct ?page= param
            btn.className = 'mil-pagination-btn' + (i === currentPage ? ' mil-active' : '');
            btn.textContent = i;
            container.appendChild(btn);
        }
    }

    window.paginateArticles = applyPagination;

    function init() {
        applyPagination();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    window.addEventListener('load', init);

    var lastUrl = location.href;
    setInterval(function() {
        if (location.href !== lastUrl) {
            lastUrl = location.href;
            setTimeout(init, 100);
        }
    }, 200);

    window.addEventListener('popstate', function() {
        setTimeout(init, 100);
    });
})();
