(function () {
    const loaderScript = document.currentScript;
    const countSrc = loaderScript && loaderScript.dataset.countSrc;
    const goatcounterEndpoint = loaderScript && loaderScript.dataset.goatcounter;
    const goatcounterSettings = loaderScript && loaderScript.dataset.goatcounterSettings;

    if (!countSrc || !goatcounterEndpoint) {
        return;
    }

    function loadGoatCounter() {
        const script = document.createElement("script");
        script.async = true;
        script.src = countSrc;
        script.dataset.goatcounter = goatcounterEndpoint;

        if (goatcounterSettings) {
            script.dataset.goatcounterSettings = goatcounterSettings;
        }

        document.head.appendChild(script);
    }

    function afterPageLoad(callback) {
        if (document.readyState === "complete") {
            callback();
        } else {
            window.addEventListener("load", callback, { once: true });
        }
    }

    afterPageLoad(function () {
        if ("requestIdleCallback" in window) {
            window.requestIdleCallback(loadGoatCounter, { timeout: 3000 });
        } else {
            window.setTimeout(loadGoatCounter, 800);
        }
    });
})();
