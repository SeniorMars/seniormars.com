 document.addEventListener('DOMContentLoaded', function() {
  // Find all tables
  const tables = document.querySelectorAll('table');
  
  // Wrap each table in a container div
  tables.forEach(function(table) {
    const wrapper = document.createElement('div');
    wrapper.className = 'table-container';
    
    // Insert the wrapper before the table in the DOM
    table.parentNode.insertBefore(wrapper, table);
    
    // Move the table into the wrapper
    wrapper.appendChild(table);
  });
});
