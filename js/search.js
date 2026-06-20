(function () {
  function initSearch() {
    if (!document.body.contains(document.getElementById("searchModal"))) {
      return;
    }

    if (window.reduxSearch && window.reduxSearch.ready) {
      return;
    }

  const lang = document.documentElement.lang.substring(0, 2);
  const searchInput = document.getElementById("searchInput");
  const searchModal = document.getElementById("searchModal");
  const searchButton = document.getElementById("search-button");
  const clearSearchButton = document.getElementById("clear-search");
  const resultsContainer = document.getElementById("results-container");
  const results = document.getElementById("results");
  // Get all spans holding the translated strings, even if they are only used on one language.
  const zeroResultsSpan = document.getElementById("zero_results");
  const oneResultsSpan = document.getElementById("one_result");
  const twoResultsSpan = document.getElementById("two_results");
  const fewResultsSpan = document.getElementById("few_results");
  const manyResultsSpan = document.getElementById("many_results");
  const loadingResultsSpan = document.getElementById("loading_results");
  const errorResultsSpan = document.getElementById("error_results");
  const limitedResultsSpan = document.getElementById("limited_results");
  const limitedResultsTemplate = limitedResultsSpan
    ? limitedResultsSpan.textContent
    : "";
  const SEARCH_DEBOUNCE_MS = 120;
  const MAX_DISPLAYED_RESULTS = 20;
  let searchDebounceTimer = null;
  let searchRequestId = 0;

  // Static mapping of keys to spans.
  const resultSpans = {
    zero_results: zeroResultsSpan,
    one_result: oneResultsSpan,
    two_results: twoResultsSpan,
    few_results: fewResultsSpan,
    many_results: manyResultsSpan,
    loading_results: loadingResultsSpan,
    error_results: errorResultsSpan,
  };
  const resultTextTemplates = Object.fromEntries(
    Object.entries(resultSpans).map(([key, span]) => [
      key,
      span ? span.textContent : "",
    ]),
  );

  // Replace $SHORTCUT in search icon title with actual OS-specific shortcut.
  function getShortcut() {
    const userAgent = window.navigator.userAgent.toLowerCase();
    if (userAgent.includes("mac")) {
      return "Cmd + K";
    } else {
      return "Ctrl + K";
    }
  }

  function setAttributes(element, attributeNames) {
    const shortcut = getShortcut();
    attributeNames.forEach((attributeName) => {
      let attributeValue = element.getAttribute(attributeName);
      if (attributeValue) {
        attributeValue = attributeValue.replace("$SHORTCUT", shortcut);
        element.setAttribute(attributeName, attributeValue);
      }
    });
  }
  setAttributes(searchButton, ["title", "aria-label"]);

  // Make search button keyboard accessible.
  searchButton.addEventListener("keydown", function (event) {
    if (event.key === "Enter" || event.key === " ") {
      searchButton.click();
    }
  });

  let lastFocusedElement;
  function isSearchModalOpen() {
    return searchModal.style.display === "block";
  }

  function openSearchModal() {
    if (isSearchModalOpen()) {
      searchInput.focus();
      return;
    }
    lastFocusedElement = document.activeElement;
    loadSearchIndex().catch(() => {});
    searchModal.style.display = "block";
    searchModal.setAttribute("aria-hidden", "false");
    searchButton.setAttribute("aria-expanded", "true");
    searchInput.focus();
  }

  function closeModal() {
    searchModal.style.display = "none";
    searchModal.setAttribute("aria-hidden", "true");
    searchButton.setAttribute("aria-expanded", "false");
    clearSearch();
    if (lastFocusedElement && document.body.contains(lastFocusedElement)) {
      lastFocusedElement.focus();
    }
  }

  function toggleModalVisibility() {
    const isModalOpen = isSearchModalOpen();
    if (isModalOpen) {
      closeModal();
    } else {
      openSearchModal();
    }
  }

  // Function to remove 'selected' class from all divs except the one passed.
  function clearSelected(exceptDiv = null) {
    const divs = results.querySelectorAll("#results > div");
    divs.forEach((div) => {
      if (div !== exceptDiv) {
        div.setAttribute("aria-selected", "false");
      }
    });
  }

  function updateSelection(div) {
    if (div.getAttribute("aria-selected") !== "true") {
      clearSelected(div);
      div.setAttribute("aria-selected", "true");
    }
    searchInput.setAttribute("aria-activedescendant", div.id);
  }

  function clearSearch() {
    searchRequestId++;
    clearTimeout(searchDebounceTimer);
    searchInput.value = "";
    results.innerHTML = "";
    resultsContainer.style.display = "none";
    searchInput.removeAttribute("aria-activedescendant");
    searchInput.setAttribute("aria-expanded", "false");
    clearSearchButton.style.display = "none";
  }

  // Close modal when clicking/tapping outside.
  function handleModalInteraction(event) {
    if (event.target === searchModal) {
      closeModal();
    }
    event.stopPropagation(); // Prevents tapping through the modal.
  }
  searchModal.addEventListener("click", handleModalInteraction);
  searchModal.addEventListener("touchend", handleModalInteraction, {
    passive: true,
  });

  // Close modal when pressing escape.
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && isSearchModalOpen()) {
      closeModal();
    }
  });

  clearSearchButton.addEventListener("click", function () {
    clearSearch();
    searchInput.focus();
  });
  clearSearchButton.addEventListener("keydown", function (event) {
    if (event.key === "Enter" || event.key === " ") {
      clearSearch();
      searchInput.focus();
      event.preventDefault();
    }
  });

  // The index loads on mouseover/tap.
  // Clicking/tapping the search button opens the modal.
  searchButton.addEventListener("mouseover", loadSearchIndex);
  searchButton.addEventListener("click", openSearchModal);
  searchButton.addEventListener("touchstart", openSearchModal, {
    passive: true,
  });

  let searchIndexPromise = null;
  function loadSearchIndex() {
    if (!searchIndexPromise) {
      // Check if the search index is already loaded in the window object
      if (window.searchIndex) {
        // If the index is pre-loaded, use it directly.
        searchIndexPromise = Promise.resolve(
          elasticlunr.Index.load(window.searchIndex),
        );
      } else {
        // If the index is not pre-loaded, fetch it from the JSON file.
        const language = document.documentElement
          .getAttribute("lang")
          .substring(0, 2);
        let basePath = document
          .querySelector("meta[name='base']")
          .getAttribute("content");
        if (basePath.endsWith("/")) {
          basePath = basePath.slice(0, -1);
        }

        searchIndexPromise = fetch(
          basePath + "/search_index." + language + ".json",
        )
          .then((response) => {
            if (!response.ok) {
              throw new Error("Search index request failed");
            }
            return response.json();
          })
          .then((json) => elasticlunr.Index.load(json))
          .catch((error) => {
            searchIndexPromise = null;
            throw error;
          });
      }
    }
    return searchIndexPromise;
  }

  function getByteByBinary(binaryCode) {
    // Binary system, starts with `0b` in ES6
    // Octal number system, starts with `0` in ES5 and starts with `0o` in ES6
    // Hexadecimal, starts with `0x` in both ES5 and ES6
    var byteLengthDatas = [0, 1, 2, 3, 4];
    var len = byteLengthDatas[Math.ceil(binaryCode.length / 8)];
    return len;
  }

  function getByteByHex(hexCode) {
    return getByteByBinary(parseInt(hexCode, 16).toString(2));
  }

  function substringByByte(str, maxLength) {
    let result = "";
    let flag = false;
    let len = 0;
    let length = 0;
    let length2 = 0;
    for (let i = 0; i < str.length; i++) {
      const code = str.codePointAt(i).toString(16);
      if (code.length > 4) {
        i++;
        if (i + 1 < str.length) {
          flag = str.codePointAt(i + 1).toString(16) === "200d";
        }
      }
      if (flag) {
        len += getByteByHex(code);
        if (i == str.length - 1) {
          length += len;
          if (length <= maxLength) {
            result += str.substr(length2, i - length2 + 1);
          } else {
            break;
          }
        }
      } else {
        if (len != 0) {
          length += len;
          length += getByteByHex(code);
          if (length <= maxLength) {
            result += str.substr(length2, i - length2 + 1);
            length2 = i + 1;
          } else {
            break;
          }
          len = 0;
          continue;
        }
        length += getByteByHex(code);
        if (length <= maxLength) {
          if (code.length <= 4) {
            result += str[i];
          } else {
            result += str[i - 1] + str[i];
          }
          length2 = i + 1;
        } else {
          break;
        }
      }
    }
    return result;
  }

  function truncateSnippetParts(parts, maxLength) {
    const truncated = [];
    let remaining = maxLength;
    let didTruncate = false;

    for (const part of parts) {
      if (remaining <= 0) {
        didTruncate = true;
        break;
      }

      if (part.text.length > remaining) {
        truncated.push({
          text: part.text.substring(0, remaining),
          highlight: part.highlight,
        });
        didTruncate = true;
        break;
      }

      truncated.push(part);
      remaining -= part.text.length;
    }

    if (didTruncate) {
      truncated.push({ text: "…", highlight: false });
    }

    return truncated;
  }

  function generateSnippet(text, searchTerms) {
    const BASE_SCORE = 2;
    const FIRST_WORD_SCORE = 8;
    const HIGHLIGHT_SCORE = 40;
    const PRE_MATCH_CONTEXT_WORDS = 4;
    const SNIPPET_LENGTH = 150;
    const WINDOW_SIZE = 30;

    const stemmedTerms = searchTerms.map(function (term) {
      return elasticlunr.stemmer(term.toLowerCase());
    });

    let totalLength = 0;
    const tokenScores = [];
    const sentences = text.toLowerCase().split(". ");

    for (const sentence of sentences) {
      const words = sentence.split(/[\s\n]/);
      let isFirstWord = true;

      for (const word of words) {
        if (word.length > 0) {
          let score = isFirstWord ? FIRST_WORD_SCORE : BASE_SCORE;
          for (const stemmedTerm of stemmedTerms) {
            if (elasticlunr.stemmer(word).startsWith(stemmedTerm)) {
              score = HIGHLIGHT_SCORE;
            }
          }
          tokenScores.push([word, score, totalLength]);
          isFirstWord = false;
        }
        totalLength += word.length + 1;
      }
      totalLength += 1;
    }

    if (tokenScores.length === 0) {
      return [{
        text: text.length > SNIPPET_LENGTH
          ? text.substring(0, SNIPPET_LENGTH) + "…"
          : text,
        highlight: false,
      }];
    }

    const scores = [];
    let windowScore = 0;

    for (var i = 0; i < Math.min(tokenScores.length, WINDOW_SIZE); i++) {
      windowScore += tokenScores[i][1];
    }
    scores.push(windowScore);

    // Slide the window and update the score.
    for (var i = 1; i <= tokenScores.length - WINDOW_SIZE; i++) {
      windowScore -= tokenScores[i - 1][1];
      windowScore += tokenScores[i + WINDOW_SIZE - 1][1];
      scores.push(windowScore);
    }

    let maxScoreIndex = 0;
    let maxScore = 0;
    for (var i = scores.length - 1; i >= 0; i--) {
      if (maxScore < scores[i]) {
        maxScore = scores[i];
        maxScoreIndex = i;
      }
    }

    const snippet = [];
    function appendSnippetText(text, highlight = false) {
      if (!text) {
        return;
      }
      const lastPart = snippet[snippet.length - 1];
      if (lastPart && lastPart.highlight === highlight) {
        lastPart.text += text;
      } else {
        snippet.push({ text, highlight });
      }
    }

    // From my testing, the context is more clear if we start a few words back.
    let start = adjustStartPos(
      text,
      tokenScores[maxScoreIndex][2],
      PRE_MATCH_CONTEXT_WORDS,
    );

    function adjustStartPos(text, matchStartIndex, numWordsBack) {
      let spaceCount = 0;
      let index = matchStartIndex - 1;
      while (index >= 0 && spaceCount < numWordsBack) {
        if (text[index] === " " && text[index - 1] !== ".") {
          spaceCount++;
        } else if (text[index] === "." && text[index + 1] === " ") {
          // Stop if the match is at the start of a sentence.
          break;
        }
        index--;
      }
      return spaceCount === numWordsBack ? index + 1 : matchStartIndex;
    }
    const re = /^[\x00-\xff]+$/; // Regular expression for ASCII check.
    for (
      var i = maxScoreIndex;
      i < maxScoreIndex + WINDOW_SIZE && i < tokenScores.length;
      i++
    ) {
      const wordData = tokenScores[i];
      if (start < wordData[2]) {
        appendSnippetText(text.substring(start, wordData[2]));
        start = wordData[2];
      }

      const end = wordData[2] + wordData[0].length;
      let snippetText;
      // Handle non-ASCII characters.
      if (!re.test(wordData[0]) && wordData[0].length >= 12) {
        const strBefore = text.substring(wordData[2], end);
        snippetText = substringByByte(strBefore, 12);
      } else {
        snippetText = text.substring(wordData[2], end);
      }
      appendSnippetText(snippetText, wordData[1] === HIGHLIGHT_SCORE);
      start = end;
    }

    appendSnippetText("…");
    return truncateSnippetParts(snippet, SNIPPET_LENGTH);
  }

  function getSearchOptions(bool) {
    return {
      bool,
      fields: {
        title: { boost: 3 },
        body: { boost: 2 },
        description: { boost: 1 },
        path: { boost: 1 },
      },
    };
  }

  function searchDocuments(searchIndex, searchTerm) {
    const strictResults = searchIndex.search(
      searchTerm,
      getSearchOptions("AND"),
    );
    if (strictResults.length > 0) {
      return strictResults;
    }
    return searchIndex.search(searchTerm, getSearchOptions("OR"));
  }

  function renderSnippet(snippetElement, snippetParts) {
    snippetElement.textContent = "";
    snippetParts.forEach((part) => {
      if (part.highlight) {
        const mark = document.createElement("mark");
        mark.textContent = part.text;
        snippetElement.appendChild(mark);
      } else {
        snippetElement.appendChild(document.createTextNode(part.text));
      }
    });
  }

  function createResultElement(result, resultId, searchTerms, searchTerm) {
    if (!result.doc.title && !result.doc.path && !result.doc.id) {
      return null;
    }

    const resultDiv = document.createElement("div");
    const linkElement = document.createElement("a");
    const titleElement = document.createElement("span");
    const snippetElement = document.createElement("span");

    resultDiv.setAttribute("role", "option");
    resultDiv.id = "result-" + resultId;
    titleElement.textContent = result.doc.title || result.doc.path ||
      result.doc.id;

    if (result.doc.body) {
      renderSnippet(
        snippetElement,
        generateSnippet(result.doc.body, searchTerms),
      );
    } else if (result.doc.description) {
      snippetElement.textContent = result.doc.description;
    }

    let href = result.ref;
    if (result.doc.body) {
      href += `#:~:text=${encodeURIComponent(searchTerm)}`;
    }
    linkElement.href = href;
    linkElement.append(titleElement, snippetElement);
    resultDiv.appendChild(linkElement);

    return resultDiv;
  }

  async function runSearch(searchTerm, requestId) {
    showResultInfo("loading_results");

    try {
      const searchIndex = await loadSearchIndex();
      if (requestId !== searchRequestId || searchTerm !== searchInput.value.trim()) {
        return;
      }

      const searchTerms = searchTerm.split(/\s+/);
      const searchResults = searchDocuments(searchIndex, searchTerm);
      results.innerHTML = "";
      updateResultText(searchResults.length);
      updateResultLimitText(searchResults.length);

      let resultIdCounter = 0;
      searchResults.slice(0, MAX_DISPLAYED_RESULTS).forEach(function (result) {
        const resultElement = createResultElement(
          result,
          resultIdCounter,
          searchTerms,
          searchTerm,
        );
        if (resultElement) {
          resultIdCounter++;
          results.appendChild(resultElement);
        }
      });

      searchInput.setAttribute(
        "aria-expanded",
        resultIdCounter > 0 ? "true" : "false",
      );

      if (results.firstChild) {
        updateSelection(results.firstChild);
      }
    } catch (_error) {
      if (requestId !== searchRequestId) {
        return;
      }
      results.innerHTML = "";
      searchInput.setAttribute("aria-expanded", "false");
      showResultInfo("error_results");
    }
  }

  // Handle input in the search box.
  searchInput.addEventListener("input", function () {
    const inputValue = this.value;
    const searchTerm = inputValue.trim();
    const requestId = ++searchRequestId;

    clearTimeout(searchDebounceTimer);
    results.innerHTML = "";
    searchInput.removeAttribute("aria-activedescendant");
    searchInput.setAttribute("aria-expanded", "false");

    // Use the raw input so the "clear" button appears even if there's only spaces.
    clearSearchButton.style.display = inputValue.length > 0
      ? "block"
      : "none";
    resultsContainer.style.display = searchTerm.length > 0 ? "block" : "none";

    if (searchTerm.length === 0) {
      updateResultText(0);
      return;
    }

    showResultInfo("loading_results");
    searchDebounceTimer = setTimeout(() => {
      runSearch(searchTerm, requestId);
    }, SEARCH_DEBOUNCE_MS);
  });

  results.addEventListener("mouseover", function (event) {
    const resultDiv = event.target.closest('div[role="option"]');
    if (resultDiv && results.contains(resultDiv)) {
      updateSelection(resultDiv);
    }
  });

  results.addEventListener("click", function (event) {
    const clickedElement = event.target.closest("a");
    if (!clickedElement || !results.contains(clickedElement)) {
      return;
    }

    const clickedHref = clickedElement.getAttribute("href");
    const currentPageUrl = window.location.href;

    // Normalise URLs by removing the text fragment and trailing slash.
    const normalizeUrl = (url) => url.split("#")[0].replace(/\/$/, "");

    // Check if the clicked link matches the current page.
    // If using Ctrl+click or Cmd+click, don't close the modal.
    if (
      normalizeUrl(clickedHref) === normalizeUrl(currentPageUrl) &&
      !event.ctrlKey && !event.metaKey
    ) {
      closeModal();
    }
  });

  results.addEventListener(
    "touchstart",
    function (event) {
      const resultDiv = event.target.closest('div[role="option"]');
      if (resultDiv && results.contains(resultDiv)) {
        updateSelection(resultDiv);
      }
    },
    { passive: true },
  );

  function showResultInfo(key, count = 0) {
    hideResultLimitText();

    // Hide all result text spans.
    Object.values(resultSpans).forEach((span) => {
      if (span) span.style.display = "none";
    });

    // Show the relevant result text span, replacing $NUMBER with the actual count.
    const activeSpan = resultSpans[key] || resultSpans.many_results;
    const template = resultTextTemplates[key] || resultTextTemplates.many_results;
    if (activeSpan) {
      activeSpan.style.display = "inline";
      activeSpan.textContent = template.replace("$NUMBER", count.toString());
    }
  }

  function updateResultText(count) {
    // Determine the correct pluralization key based on count and language.
    showResultInfo(getPluralizationKey(count, lang), count);
  }

  function hideResultLimitText() {
    if (limitedResultsSpan) {
      limitedResultsSpan.style.display = "none";
    }
  }

  function updateResultLimitText(count) {
    if (!limitedResultsSpan || count <= MAX_DISPLAYED_RESULTS) {
      hideResultLimitText();
      return;
    }

    limitedResultsSpan.style.display = "inline";
    limitedResultsSpan.textContent = limitedResultsTemplate
      .replace("$LIMIT", MAX_DISPLAYED_RESULTS.toString())
      .replace("$NUMBER", count.toString());
  }

  function getPluralizationKey(count, lang) {
    let key = "";
    const slavicLangs = ["uk", "be", "bs", "hr", "ru", "sr"];

    // Common cases: zero, one.
    if (count === 0) {
      key = "zero_results";
    } else if (count === 1) {
      key = "one_result";
    } else {
      // Arabic.
      if (lang === "ar") {
        let modulo = count % 100;
        if (count === 2) {
          key = "two_results";
        } else if (modulo >= 3 && modulo <= 10) {
          key = "few_results";
        } else {
          key = "many_results";
        }
      } else if (slavicLangs.includes(lang)) {
        // Slavic languages.
        let modulo10 = count % 10;
        let modulo100 = count % 100;
        if (modulo10 === 1 && modulo100 !== 11) {
          key = "one_result";
        } else if (
          modulo10 >= 2 &&
          modulo10 <= 4 &&
          !(modulo100 >= 12 && modulo100 <= 14)
        ) {
          key = "few_results";
        } else {
          key = "many_results";
        }
      } else {
        key = "many_results"; // Default plural.
      }
    }

    return key;
  }

  // Handle keyboard navigation.
  document.addEventListener("keydown", function (event) {
    // Add handling for the modal open/close shortcut.
    const isMac = navigator.userAgent.toLowerCase().includes("mac");
    const MODAL_SHORTCUT_KEY = "k";
    const modalShortcutModifier = isMac ? event.metaKey : event.ctrlKey;

    if (event.key === MODAL_SHORTCUT_KEY && modalShortcutModifier) {
      event.preventDefault();
      toggleModalVisibility();
      return;
    }

    const activeElement = document.activeElement;
    if (
      event.key === "Tab" &&
      (activeElement === searchInput || activeElement === clearSearchButton)
    ) {
      event.preventDefault();
      const nextFocusableElement = activeElement === searchInput
        ? clearSearchButton
        : searchInput;
      nextFocusableElement.focus();
      return;
    }

    function updateResultSelection(newIndex, divsArray) {
      updateSelection(divsArray[newIndex]);
      divsArray[newIndex].scrollIntoView({ block: "nearest", inline: "start" });
    }

    const resultDivs = results.querySelectorAll("#results > div");
    if (resultDivs.length === 0) return;

    const divsArray = Array.from(resultDivs);
    let activeDiv = results.querySelector('[aria-selected="true"]');
    let activeDivIndex = divsArray.indexOf(activeDiv);

    if (
      ["ArrowUp", "ArrowDown", "Home", "End", "PageUp", "PageDown"].includes(
        event.key,
      )
    ) {
      event.preventDefault();
      let newIndex = activeDivIndex;

      switch (event.key) {
        case "ArrowUp":
          newIndex = Math.max(activeDivIndex - 1, 0);
          break;
        case "ArrowDown":
          newIndex = Math.min(activeDivIndex + 1, divsArray.length - 1);
          break;
        case "Home":
          newIndex = 0;
          break;
        case "End":
          newIndex = divsArray.length - 1;
          break;
        case "PageUp":
          newIndex = Math.max(activeDivIndex - 3, 0);
          break;
        case "PageDown":
          newIndex = Math.min(activeDivIndex + 3, divsArray.length - 1);
          break;
      }

      if (newIndex !== activeDivIndex) {
        updateResultSelection(newIndex, divsArray);
      }
    }

    if (event.key === "Enter" && activeDiv) {
      event.preventDefault();
      event.stopImmediatePropagation();
      const anchorTag = activeDiv.querySelector("a");
      if (anchorTag) {
        window.location.href = anchorTag.getAttribute("href");
      }
      closeModal(); // Necessary when linking to the current page.
    }
  });

  window.reduxSearch = {
    close: closeModal,
    open: openSearchModal,
    preload: loadSearchIndex,
    ready: true,
  };
  window.dispatchEvent(new CustomEvent("redux:search-ready"));

  if (window.__reduxOpenSearchOnReady) {
    window.__reduxOpenSearchOnReady = false;
    openSearchModal();
  }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initSearch);
  } else {
    initSearch();
  }
})();
