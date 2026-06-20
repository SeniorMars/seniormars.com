(function () {
    const loaderScript = document.currentScript;
    const mermaidSrc = loaderScript && loaderScript.dataset.mermaidSrc;
    const loadStrategy = (loaderScript && loaderScript.dataset.loadStrategy) || "visible";
    const diagrams = Array.from(document.querySelectorAll(".mermaid"));

    if (!mermaidSrc || !diagrams.length) {
        return;
    }

    const sourceByDiagram = new Map(diagrams.map((diagram) => [diagram, diagram.innerHTML]));
    let loadPromise;
    let renderPromise = Promise.resolve();
    const renderedDiagrams = new Set();

    function currentTheme() {
        return document.documentElement.classList.contains("dark") ? "dark" : "neutral";
    }

    function loadMermaid() {
        if (window.mermaid) {
            return Promise.resolve(window.mermaid);
        }

        if (loadPromise) {
            return loadPromise;
        }

        loadPromise = new Promise((resolve, reject) => {
            const script = document.createElement("script");
            script.src = mermaidSrc;
            script.async = true;
            script.onload = () => resolve(window.mermaid);
            script.onerror = () => reject(new Error("Failed to load Mermaid."));
            document.head.appendChild(script);
        });

        return loadPromise;
    }

    function resetDiagrams(nodes) {
        nodes.forEach((diagram) => {
            delete diagram.dataset.processed;
            diagram.innerHTML = sourceByDiagram.get(diagram);
        });
    }

    function renderMermaid(nodes = diagrams) {
        const nodesToRender = nodes.filter((diagram) => document.body.contains(diagram));
        if (!nodesToRender.length) {
            return renderPromise;
        }

        renderPromise = renderPromise
            .then(loadMermaid)
            .then((mermaid) => {
                resetDiagrams(nodesToRender);
                mermaid.initialize({
                    startOnLoad: false,
                    theme: currentTheme(),
                });
                return Promise.resolve(mermaid.run({ nodes: nodesToRender })).then(() => {
                    nodesToRender.forEach((diagram) => renderedDiagrams.add(diagram));
                });
            })
            .catch((error) => {
                console.error(error);
            });

        return renderPromise;
    }

    function renderAll() {
        return renderMermaid(diagrams);
    }

    function renderVisible() {
        if (!("IntersectionObserver" in window)) {
            scheduleRender(renderAll);
            return;
        }

        const observer = new IntersectionObserver((entries) => {
            const visibleDiagrams = entries
                .filter((entry) => entry.isIntersecting)
                .map((entry) => entry.target);

            visibleDiagrams.forEach((diagram) => observer.unobserve(diagram));
            renderMermaid(visibleDiagrams);
        }, {
            rootMargin: "600px 0px",
        });

        diagrams.forEach((diagram) => observer.observe(diagram));
    }

    function afterPageLoad(callback) {
        if (document.readyState === "complete") {
            callback();
        } else {
            window.addEventListener("load", callback, { once: true });
        }
    }

    function scheduleRender(callback) {
        afterPageLoad(() => {
            if ("requestIdleCallback" in window) {
                window.requestIdleCallback(callback, { timeout: 2000 });
            } else {
                window.setTimeout(callback, 500);
            }
        });
    }

    window.reduxRenderMermaid = renderAll;
    window.addEventListener("redux:themechange", function () {
        renderMermaid(Array.from(renderedDiagrams));
    });

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", function () {
            if (loadStrategy === "eager") {
                renderAll();
            } else if (loadStrategy === "idle") {
                scheduleRender(renderAll);
            } else {
                renderVisible();
            }
        }, { once: true });
    } else if (loadStrategy === "eager") {
        renderAll();
    } else if (loadStrategy === "idle") {
        scheduleRender(renderAll);
    } else {
        renderVisible();
    }
})();
