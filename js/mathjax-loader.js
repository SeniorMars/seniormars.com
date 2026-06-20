(function () {
    const loaderScript = document.currentScript;
    const mathjaxSrc = loaderScript && loaderScript.dataset.mathjaxSrc;
    const dollarInline = loaderScript && loaderScript.dataset.dollarInline === "true";
    const loadStrategy = (loaderScript && loaderScript.dataset.loadStrategy) || "idle";

    if (!mathjaxSrc) {
        return;
    }

    function hasMath(root) {
        const text = root.textContent || "";
        const blockOrEscapedMath = /(?:\$\$|\\\(|\\\[|\\begin\{[a-z*]+\})/.test(text);
        const inlineDollarMath = dollarInline && /(^|[^\\])\$[^\s$][^$\n]{0,500}[^\s$]\$/.test(text);

        return blockOrEscapedMath || inlineDollarMath;
    }

    function typesetMath() {
        if (!window.MathJax) {
            return;
        }

        const typeset = function () {
            if (typeof window.MathJax.typesetPromise === "function") {
                window.MathJax.typesetPromise();
            }
        };

        if (window.MathJax.startup && window.MathJax.startup.promise) {
            window.MathJax.startup.promise.then(typeset);
        } else {
            typeset();
        }
    }

    function loadMathJax() {
        if (document.querySelector('script[data-mathjax-loaded="true"]')) {
            return;
        }

        const script = document.createElement("script");
        script.src = mathjaxSrc;
        script.defer = true;
        script.dataset.mathjaxLoaded = "true";
        script.onload = typesetMath;
        document.head.appendChild(script);
    }

    function afterPageLoad(callback) {
        if (document.readyState === "complete") {
            callback();
        } else {
            window.addEventListener("load", callback, { once: true });
        }
    }

    function scheduleMathJax() {
        if (loadStrategy === "eager") {
            loadMathJax();
            return;
        }

        afterPageLoad(function () {
            if (loadStrategy === "load") {
                loadMathJax();
            } else if ("requestIdleCallback" in window) {
                window.requestIdleCallback(loadMathJax, { timeout: 2000 });
            } else {
                window.setTimeout(loadMathJax, 500);
            }
        });
    }

    function loadIfNeeded() {
        if (document.body && hasMath(document.body)) {
            scheduleMathJax();
        }
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", loadIfNeeded, { once: true });
    } else {
        loadIfNeeded();
    }
})();
