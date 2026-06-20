(function () {
    const loaderScript = document.currentScript;
    const searchButton = document.getElementById("search-button");

    if (!loaderScript || !searchButton) {
        return;
    }

    const elasticlunrSrc = loaderScript.dataset.elasticlunrSrc;
    const searchSrc = loaderScript.dataset.searchSrc;
    const searchIndexSrc = loaderScript.dataset.searchIndexSrc;
    let loadPromise = null;

    function getShortcut() {
        const userAgent = window.navigator.userAgent.toLowerCase();
        return userAgent.includes("mac") ? "Cmd + K" : "Ctrl + K";
    }

    function setShortcutLabel() {
        const shortcut = getShortcut();
        ["title", "aria-label"].forEach((attributeName) => {
            let attributeValue = searchButton.getAttribute(attributeName);
            if (attributeValue) {
                searchButton.setAttribute(
                    attributeName,
                    attributeValue.replace("$SHORTCUT", shortcut),
                );
            }
        });
    }

    function loadScript(src) {
        if (!src) {
            return Promise.resolve();
        }

        const selector = 'script[src="' + src.replace(/"/g, '\\"') + '"]';
        const existingScript = document.querySelector(selector);
        if (existingScript) {
            return Promise.resolve();
        }

        return new Promise((resolve, reject) => {
            const script = document.createElement("script");
            script.src = src;
            script.async = false;
            script.onload = resolve;
            script.onerror = () => reject(new Error("Failed to load " + src));
            document.head.appendChild(script);
        });
    }

    function loadSearch() {
        if (!loadPromise) {
            loadPromise = loadScript(elasticlunrSrc)
                .then(() => loadScript(searchIndexSrc))
                .then(() => loadScript(searchSrc))
                .catch((error) => {
                    loadPromise = null;
                    throw error;
                });
        }

        return loadPromise;
    }

    function openLoadedSearch() {
        if (window.reduxSearch && window.reduxSearch.open) {
            window.reduxSearch.open();
            return;
        }

        window.__reduxOpenSearchOnReady = true;
        window.addEventListener(
            "redux:search-ready",
            function () {
                if (window.reduxSearch && window.reduxSearch.open) {
                    window.reduxSearch.open();
                }
            },
            { once: true },
        );
    }

    function preloadSearch() {
        if (window.reduxSearch && window.reduxSearch.preload) {
            window.reduxSearch.preload();
            return;
        }

        loadSearch().catch((error) => {
            console.error(error);
        });
    }

    function openSearch(event) {
        if (window.reduxSearch && window.reduxSearch.open) {
            return;
        }

        if (event) {
            event.preventDefault();
        }

        loadSearch()
            .then(openLoadedSearch)
            .catch((error) => {
                console.error(error);
            });
    }

    setShortcutLabel();
    searchButton.addEventListener("mouseenter", preloadSearch);
    searchButton.addEventListener("focus", preloadSearch);
    searchButton.addEventListener("touchstart", openSearch, { passive: false });
    searchButton.addEventListener("click", openSearch);

    document.addEventListener("keydown", function (event) {
        const modifier = window.navigator.userAgent.toLowerCase().includes("mac")
            ? event.metaKey
            : event.ctrlKey;

        if (event.key === "k" && modifier) {
            if (window.reduxSearch && window.reduxSearch.open) {
                return;
            }

            openSearch(event);
        }
    });
})();
