document.addEventListener("DOMContentLoaded", () => {
  // first
  const tocTitle = document.querySelector(".toc-title");
  const tocList = document.querySelector(".toc-list");

  if (tocTitle && tocList) {
    const toggleToC = () => {
      const isExpanded = tocList.style.display === "block" ||
        window.getComputedStyle(tocList).display === "block";
      tocList.style.display = isExpanded ? "none" : "block";
      tocTitle.classList.toggle("expanded", !isExpanded);
    };

    tocTitle.addEventListener("click", toggleToC);
  }

  // second
  const tocLinks = [...document.querySelectorAll(".toc a")];
  const headingsAll = [
    ...document.querySelectorAll("h1[id], h2[id], h3[id], h4[id]"),
  ];

  if (!tocLinks.length || !headingsAll.length) return;

  // Map heading id -> <li> in TOC
  const liById = new Map(
    tocLinks
      .map((a) => [decodeURIComponent(a.hash).slice(1), a.closest("li")])
      .filter(([id, li]) => id && li),
  );

  // Only headings that exist in TOC, in document order
  const headings = headingsAll.filter((h) => liById.has(h.id));
  if (!headings.length) return;

  function clear() {
    document
      .querySelectorAll(".toc li.selected, .toc li.parent, .toc li.near")
      .forEach((li) => li.classList.remove("selected", "parent", "near"));
  }

  function markParents(li) {
    let p = li.parentElement?.closest("li");
    while (p) {
      p.classList.add("parent");
      p = p.parentElement?.closest("li");
    }
  }

  function activateWindow(activeId) {
    const idx = headings.findIndex((h) => h.id === activeId);
    if (idx === -1) return;

    clear();

    // current + next 2
    const ids = [
      headings[idx]?.id,
      headings[idx + 1]?.id,
      headings[idx + 2]?.id,
    ].filter(Boolean);

    ids.forEach((id, pos) => {
      const li = liById.get(id);
      if (!li) return;
      li.classList.add(pos === 0 ? "selected" : "near");
      markParents(li);
    });

    // Keep current visible inside the toc scroller
    liById.get(ids[0])?.querySelector("a")?.scrollIntoView({
      block: "nearest",
    });
  }

  let lastActive = headings[0].id;

  const obs = new IntersectionObserver(
    (entries) => {
      const visible = entries.filter((e) => e.isIntersecting);
      if (!visible.length) return;

      // pick the heading closest to the top
      visible.sort((a, b) =>
        a.boundingClientRect.top - b.boundingClientRect.top
      );
      const id = visible[0].target.id;

      lastActive = id;
      activateWindow(id);
    },
    {
      root: null,
      threshold: 0,
      // IMPORTANT: make the active zone less strict so the last heading can still win
      // (-50% is usually safer than -70%)
      rootMargin: "0px 0px -50% 0px",
    },
  );

  headings.forEach((h) => obs.observe(h));

  // Fallback: when you're near the bottom, force last heading active
  function nearBottom() {
    const scrollY = window.scrollY || window.pageYOffset;
    const vh = window.innerHeight;
    const docH = document.documentElement.scrollHeight;
    return scrollY + vh >= docH - 8; // "8px from bottom"
  }

  function onScrollFallback() {
    if (nearBottom()) {
      const lastId = headings[headings.length - 1].id;
      if (lastActive !== lastId) {
        lastActive = lastId;
        activateWindow(lastId);
      }
    }
  }

  window.addEventListener("scroll", onScrollFallback, { passive: true });

  // Initial paint
  activateWindow(lastActive);
});
