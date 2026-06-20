document.addEventListener("DOMContentLoaded", function () {
  // Find all tables
  const tables = document.querySelectorAll("table");

  // Process each table
  tables.forEach(function (table) {
    // Create wrapper div
    const wrapper = document.createElement("div");
    wrapper.className = "table-container";

    // Insert the wrapper before the table in the DOM
    table.parentNode.insertBefore(wrapper, table);

    // Move the table into the wrapper
    wrapper.appendChild(table);

    // Check if table is wider than its container
    // and add the 'scrollable' class if needed
    function checkOverflow() {
      if (table.offsetWidth > wrapper.offsetWidth) {
        wrapper.classList.add("scrollable");
      } else {
        wrapper.classList.remove("scrollable");
      }
    }

    // Check on load and on window resize
    checkOverflow();
    window.addEventListener("resize", checkOverflow);
  });
});
