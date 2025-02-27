 document.addEventListener('DOMContentLoaded', function() {
  // Add js-enabled class to body for CSS targeting
  document.body.classList.add('js-enabled');
  
  // Set up toggle functionality for all note components
  document.querySelectorAll('.note-toggle').forEach(function(toggleButton) {
    // Get the content element
    const content = toggleButton.nextElementSibling;
    
    // Set initial state based on content display
    const isHidden = content.style.display === 'none';
    toggleButton.setAttribute('aria-expanded', !isHidden);
    
    // Add collapsed class if initially hidden
    if (isHidden) {
      toggleButton.classList.add('collapsed');
    }
    
    // Set up click event
    toggleButton.addEventListener('click', function() {
      // Toggle expanded state
      const expanded = this.getAttribute('aria-expanded') === 'true';
      this.setAttribute('aria-expanded', !expanded);
      
      // Toggle display and classes
      if (expanded) {
        content.style.display = 'none';
        this.classList.add('collapsed');
      } else {
        content.style.display = 'block';
        this.classList.remove('collapsed');
      }
    });
  });
  
  // Make tables inside notes responsive
  document.querySelectorAll('.note-content table').forEach(function(table) {
    // Only wrap if not already wrapped
    if (!table.parentElement.classList.contains('table-container')) {
      const wrapper = document.createElement('div');
      wrapper.className = 'table-container';
      
      // Insert the wrapper before the table in the DOM
      table.parentNode.insertBefore(wrapper, table);
      
      // Move the table into the wrapper
      wrapper.appendChild(table);
    }
  });
});
