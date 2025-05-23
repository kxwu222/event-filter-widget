// event-filter-widget.js
(function(global) {
  const cssPrefix = 'efw-';
  function createWidget({container, months = [], onFilter}) {
    const root = typeof container === 'string' ? document.querySelector(container) : container;
    if (!root) return;
    let searchTerm = '';
    let selectedMonth = '';
    // Create HTML
    root.innerHTML = `
      <div class="${cssPrefix}container">
        <div class="${cssPrefix}search-box">
          <input type="text" class="${cssPrefix}search-input" placeholder="Search by event name...">
          <button class="${cssPrefix}clear-btn" style="display:none">&times;</button>
        </div>
        <div class="${cssPrefix}month-filter">
          <span class="${cssPrefix}month-label">All months</span>
          <span class="${cssPrefix}dropdown-arrow">▼</span>
          <div class="${cssPrefix}month-dropdown"></div>
        </div>
      </div>
    `;
    // DOM refs
    const searchInput = root.querySelector(`.${cssPrefix}search-input`);
    const clearBtn = root.querySelector(`.${cssPrefix}clear-btn`);
    const monthFilter = root.querySelector(`.${cssPrefix}month-filter`);
    const monthLabel = root.querySelector(`.${cssPrefix}month-label`);
    const monthDropdown = root.querySelector(`.${cssPrefix}month-dropdown`);
    let isDropdownOpen = false;
    // Populate months
    function renderDropdown() {
      let html = `<div class="${cssPrefix}month-option${selectedMonth===''?' active':''}" data-month="">All months</div>`;
      months.forEach(m => {
        html += `<div class="${cssPrefix}month-option${selectedMonth===m?' active':''}" data-month="${m}">${m}</div>`;
      });
      monthDropdown.innerHTML = html;
    }
    renderDropdown();
    // Show/hide dropdown
    monthFilter.addEventListener('click', e => {
      e.stopPropagation();
      isDropdownOpen = !isDropdownOpen;
      monthDropdown.style.display = isDropdownOpen ? 'block' : 'none';
      renderDropdown();
      // Option click
      monthDropdown.querySelectorAll(`.${cssPrefix}month-option`).forEach(opt => {
        opt.onclick = function(ev) {
          ev.stopPropagation();
          selectedMonth = this.getAttribute('data-month');
          monthLabel.textContent = selectedMonth || 'All months';
          isDropdownOpen = false;
          monthDropdown.style.display = 'none';
          if (typeof onFilter === 'function') onFilter({search: searchTerm, month: selectedMonth});
        };
      });
    });
    // Hide dropdown on outside click
    document.addEventListener('click', e => {
      if (!monthFilter.contains(e.target)) {
        isDropdownOpen = false;
        monthDropdown.style.display = 'none';
      }
    });
    // Search input
    searchInput.addEventListener('input', e => {
      searchTerm = e.target.value;
      clearBtn.style.display = searchTerm ? 'block' : 'none';
      if (typeof onFilter === 'function') onFilter({search: searchTerm, month: selectedMonth});
    });
    clearBtn.addEventListener('click', () => {
      searchTerm = '';
      searchInput.value = '';
      clearBtn.style.display = 'none';
      if (typeof onFilter === 'function') onFilter({search: searchTerm, month: selectedMonth});
    });

    // Set up map functionality
    function setupMapLinks() {
      // Add click event to all building links
      document.querySelectorAll('.event.block strong a').forEach(link => {
        // Remove any existing event listeners
        const newLink = link.cloneNode(true);
        link.parentNode.replaceChild(newLink, link);
        
        newLink.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          
          // Remove any existing map options
          const existingOptions = document.querySelector(`.${cssPrefix}map-options`);
          if (existingOptions) {
            existingOptions.remove();
          }
          
          const buildingName = newLink.textContent;
          const googleMapsUrl = newLink.href;
          // Create Apple Maps URL with My Location as starting point
          const appleMapsUrl = `https://maps.apple.com/maps?saddr=My+Location&daddr=${encodeURIComponent(buildingName)}`;
          
          // Create map options container
          const mapOptions = document.createElement('div');
          mapOptions.className = `${cssPrefix}map-options`;
          mapOptions.innerHTML = `
            <a href="${googleMapsUrl}" target="_blank" rel="noopener noreferrer">
              Google Maps
            </a>
            <a href="${appleMapsUrl}" target="_blank" rel="noopener noreferrer">
              Apple Maps
            </a>
          `;
          
          // Add CSS to prevent flickering
          mapOptions.style.cssText = `
            position: fixed;
            z-index: 1003;
            display: block;
            background: white;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            border-radius: 4px;
            padding: 8px;
            transform: translateZ(0);
            will-change: transform;
            backface-visibility: hidden;
          `;
          
          // Position the options container
          const updatePosition = () => {
            const rect = newLink.getBoundingClientRect();
            mapOptions.style.top = `${rect.bottom + 4}px`;
            mapOptions.style.left = `${rect.left}px`;
          };
          
          // Initial positioning
          updatePosition();
          document.body.appendChild(mapOptions);
          
          // Use requestAnimationFrame for smooth updates
          let ticking = false;
          const scrollHandler = () => {
            if (!ticking) {
              window.requestAnimationFrame(() => {
                updatePosition();
                ticking = false;
              });
              ticking = true;
            }
          };
          
          // Add scroll listener
          window.addEventListener('scroll', scrollHandler, { passive: true });
          
          // Close options when clicking outside
          const closeOptions = (e) => {
            if (!mapOptions.contains(e.target) && e.target !== newLink) {
              mapOptions.remove();
              window.removeEventListener('scroll', scrollHandler);
              document.removeEventListener('click', closeOptions);
            }
          };
          
          // Add click handler to document
          document.addEventListener('click', closeOptions);
        });
      });
    }

    // Initialize map functionality
    setupMapLinks();
  }
  global.EventFilterWidget = {
    init: createWidget
  };
})(window);
