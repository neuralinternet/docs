// Mermaid diagram expander functionality with zoom/pan
(function() {
  'use strict';

  // Modal HTML template with zoom controls
  const modalTemplate = `
    <div id="mermaid-modal" class="mermaid-modal">
      <div class="mermaid-modal-content">
        <div class="mermaid-modal-header">
          <div class="mermaid-modal-controls">
            <button class="mermaid-control-btn" id="zoom-in" aria-label="Zoom in">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="11" cy="11" r="8" stroke="currentColor" stroke-width="2"/>
                <path d="M11 8V14M8 11H14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                <path d="M21 21L16.65 16.65" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </button>
            <button class="mermaid-control-btn" id="zoom-out" aria-label="Zoom out">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="11" cy="11" r="8" stroke="currentColor" stroke-width="2"/>
                <path d="M8 11H14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                <path d="M21 21L16.65 16.65" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </button>
            <button class="mermaid-control-btn" id="zoom-reset" aria-label="Reset zoom">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="11" cy="11" r="8" stroke="currentColor" stroke-width="2"/>
                <path d="M21 21L16.65 16.65" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                <path d="M11 11L11 11.01" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>
              </svg>
            </button>
            <span class="mermaid-zoom-level">100%</span>
          </div>
          <button class="mermaid-modal-close" aria-label="Close expanded diagram">&times;</button>
        </div>
        <div class="mermaid-modal-body">
          <div class="mermaid-diagram-container"></div>
        </div>
      </div>
    </div>
  `;

  // Expand button template
  const expandButtonTemplate = `
    <button class="mermaid-expand-btn" aria-label="Expand diagram">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M4 8V4H8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M20 8V4H16" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M4 16V20H8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M20 16V20H16" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </button>
  `;

  let modal = null;
  let isModalOpen = false;
  let currentZoom = 1;
  let panX = 0;
  let panY = 0;
  let isDragging = false;
  let dragStartX = 0;
  let dragStartY = 0;
  let startPanX = 0;
  let startPanY = 0;

  // Initialize modal
  function initModal() {
    if (!modal) {
      const modalDiv = document.createElement('div');
      modalDiv.innerHTML = modalTemplate;
      document.body.appendChild(modalDiv.firstElementChild);
      modal = document.getElementById('mermaid-modal');
      
      // Close modal on backdrop click
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          closeModal();
        }
      });

      // Close button
      modal.querySelector('.mermaid-modal-close').addEventListener('click', closeModal);

      // Close modal on Escape key
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && isModalOpen) {
          closeModal();
        }
      });

      // Zoom controls
      const zoomIn = modal.querySelector('#zoom-in');
      const zoomOut = modal.querySelector('#zoom-out');
      const zoomReset = modal.querySelector('#zoom-reset');

      zoomIn.addEventListener('click', () => adjustZoom(0.2));
      zoomOut.addEventListener('click', () => adjustZoom(-0.2));
      zoomReset.addEventListener('click', resetZoom);

      // Pan functionality
      const modalBody = modal.querySelector('.mermaid-modal-body');
      const diagramContainer = modal.querySelector('.mermaid-diagram-container');

      diagramContainer.addEventListener('mousedown', startDragging);
      document.addEventListener('mousemove', drag);
      document.addEventListener('mouseup', stopDragging);

      // Touch support for mobile
      diagramContainer.addEventListener('touchstart', (e) => startDragging(e.touches[0]));
      document.addEventListener('touchmove', (e) => drag(e.touches[0]));
      document.addEventListener('touchend', stopDragging);

      // Mouse wheel zoom
      modalBody.addEventListener('wheel', (e) => {
        if (e.ctrlKey || e.metaKey) {
          e.preventDefault();
          const delta = e.deltaY > 0 ? -0.1 : 0.1;
          adjustZoom(delta, e);
        }
      });
    }
  }

  // Zoom functions
  function adjustZoom(delta, e) {
    const oldZoom = currentZoom;
    const newZoom = Math.max(0.2, Math.min(5, oldZoom + delta));

    if (newZoom === oldZoom) {
      return;
    }

    const modalBody = modal.querySelector('.mermaid-modal-body');
    const rect = modalBody.getBoundingClientRect();

    let mouseX, mouseY;
    if (e) {
      // Zoom to mouse cursor
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    } else {
      // Zoom to center for button clicks
      mouseX = rect.width / 2;
      mouseY = rect.height / 2;
    }

    currentZoom = newZoom;
    
    // Adjust pan to keep the point under the mouse stationary
    panX = mouseX - (mouseX - panX) * (newZoom / oldZoom);
    panY = mouseY - (mouseY - panY) * (newZoom / oldZoom);

    applyTransform();
  }

  function resetZoom() {
    currentZoom = 1;
    panX = 0;
    panY = 0;
    applyTransform(); // Apply base transform to allow measurement
    centerDiagram();  // Recenter the diagram
  }
  
  function centerDiagram() {
    const modalBody = modal.querySelector('.mermaid-modal-body');
    const diagramContainer = modal.querySelector('.mermaid-diagram-container');
    const diagramEl = diagramContainer.firstElementChild;
    if (!diagramEl) return;

    const viewRect = modalBody.getBoundingClientRect();
    // Use offsetWidth/Height for layout dimensions, which are unaffected by scale
    const diagramWidth = diagramEl.offsetWidth * currentZoom;
    const diagramHeight = diagramEl.offsetHeight * currentZoom;

    panX = (viewRect.width - diagramWidth) / 2;
    panY = (viewRect.height - diagramHeight) / 2;
    
    applyTransform();
  }

  function applyTransform() {
    const diagramContainer = modal.querySelector('.mermaid-diagram-container');
    diagramContainer.style.transformOrigin = '0 0';
    diagramContainer.style.transform = `translate(${panX}px, ${panY}px) scale(${currentZoom})`;
    
    const zoomLevel = modal.querySelector('.mermaid-zoom-level');
    zoomLevel.textContent = `${Math.round(currentZoom * 100)}%`;
  }

  // Pan functions
  function startDragging(e) {
    const diagramContainer = modal.querySelector('.mermaid-diagram-container');
    if (e.target.closest('.mermaid-diagram-container')) {
      e.preventDefault();
      isDragging = true;
      diagramContainer.style.cursor = 'grabbing';
      dragStartX = e.pageX || e.clientX;
      dragStartY = e.pageY || e.clientY;
      startPanX = panX;
      startPanY = panY;
    }
  }

  function drag(e) {
    if (!isDragging) return;
    e.preventDefault();
    const dx = (e.pageX || e.clientX) - dragStartX;
    const dy = (e.pageY || e.clientY) - dragStartY;
    panX = startPanX + dx;
    panY = startPanY + dy;
    applyTransform();
  }

  function stopDragging() {
    isDragging = false;
    const diagramContainer = modal.querySelector('.mermaid-diagram-container');
    if (diagramContainer) {
      diagramContainer.style.cursor = 'grab';
    }
  }

  // Open modal with diagram
  async function openModal(diagramElement) {
    if (!modal) initModal();
    
    const diagramContainer = modal.querySelector('.mermaid-diagram-container');
    
    // Get the original mermaid code
    let originalCode = diagramElement.getAttribute('data-original-mermaid-code');
    
    if (!originalCode) {
      console.error('[MermaidExpander] No original mermaid code found');
      return;
    }
    
    // Clear container
    diagramContainer.innerHTML = '';
    
    // Show modal
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    isModalOpen = true;

    // Create a new pre element for the modal diagram
    const modalPre = document.createElement('pre');
    modalPre.className = 'mermaid mermaid-modal-diagram';
    modalPre.textContent = originalCode;
    modalPre.setAttribute('data-original-mermaid-code', originalCode);
    diagramContainer.appendChild(modalPre);

    // Render the mermaid diagram in the modal
    if (window.mermaid && window.renderMermaidDiagrams) {
      await window.renderMermaidDiagrams();
    }

    // Reset zoom and center the diagram once rendered
    setTimeout(resetZoom, 50);
  }

  // Close modal
  function closeModal() {
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
      isModalOpen = false;
      
      // Clear modal content
      const diagramContainer = modal.querySelector('.mermaid-diagram-container');
      diagramContainer.innerHTML = '';
    }
  }

  // Add expand buttons to mermaid diagrams
  function addExpandButtons() {
    // Get all mermaid diagrams, including those that might have been rendered
    const mermaidDiagrams = document.querySelectorAll('pre.mermaid:not(.mermaid-modal-diagram)');
    
    console.log(`[MermaidExpander] Found ${mermaidDiagrams.length} diagrams to process`);
    
    mermaidDiagrams.forEach((diagram, index) => {
      // Skip if this diagram already has a wrapper with expand button
      if (diagram.closest('.mermaid-wrapper')?.querySelector('.mermaid-expand-btn')) {
        return;
      }

      // Create wrapper if not already wrapped
      let wrapper = diagram.parentElement;
      if (!wrapper || !wrapper.classList.contains('mermaid-wrapper')) {
        wrapper = document.createElement('div');
        wrapper.className = 'mermaid-wrapper';
        diagram.parentNode.insertBefore(wrapper, diagram);
        wrapper.appendChild(diagram);
      }

      // Add expand button
      const expandBtn = document.createElement('div');
      expandBtn.innerHTML = expandButtonTemplate;
      const button = expandBtn.firstElementChild;
      wrapper.appendChild(button);

      // Add click handler to button only
      button.addEventListener('click', (e) => {
        e.stopPropagation();
        openModal(diagram);
      });

      // Make the diagram clickable too, but not in modal
      if (!diagram.classList.contains('mermaid-modal-diagram')) {
        diagram.style.cursor = 'pointer';
        diagram.addEventListener('click', (e) => {
          e.stopPropagation();
          openModal(diagram);
        });
      }

      console.log(`[MermaidExpander] Added expand functionality to diagram ${index + 1}`);
    });
  }

  // Debounced version of addExpandButtons
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  const debouncedAddExpandButtons = debounce(addExpandButtons, 300);

  // Initialize on various events
  function initialize() {
    console.log('[MermaidExpander] Initializing...');
    // Add expand buttons after mermaid diagrams are rendered
    debouncedAddExpandButtons();
    
    // Watch for DOM changes
    const observer = new MutationObserver((mutations) => {
      let shouldUpdate = false;
      
      for (const mutation of mutations) {
        if (mutation.type === 'childList' || mutation.type === 'subtree') {
          // Check if any mermaid diagrams were added or modified
          const nodes = [...mutation.addedNodes, ...mutation.removedNodes];
          for (const node of nodes) {
            if (node.nodeType === 1 && (
              node.classList?.contains('mermaid') ||
              node.querySelector?.('.mermaid') ||
              node.querySelector?.('svg') // Mermaid renders SVGs
            )) {
              shouldUpdate = true;
              break;
            }
          }
        }
      }
      
      if (shouldUpdate) {
        console.log('[MermaidExpander] DOM change detected, updating buttons...');
        debouncedAddExpandButtons();
      }
    });

    // Start observing
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['class']
    });
  }

  // Hook into the renderMermaidDiagrams function
  let renderCheckInterval = setInterval(() => {
    if (window.renderMermaidDiagrams) {
      clearInterval(renderCheckInterval);
      
      const originalRenderMermaid = window.renderMermaidDiagrams;
      window.renderMermaidDiagrams = async function(...args) {
        console.log('[MermaidExpander] Mermaid render triggered');
        const result = await originalRenderMermaid.apply(this, args);
        // Add buttons after mermaid finishes rendering
        setTimeout(() => {
          debouncedAddExpandButtons();
        }, 100);
        return result;
      };
    }
  }, 100);

  // Initialize on various load events
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
  } else {
    initialize();
  }

  // Also listen for Astro page changes
  document.addEventListener('astro:page-load', () => {
    console.log('[MermaidExpander] Astro page load');
    initialize();
  });
  
  document.addEventListener('astro:after-swap', () => {
    console.log('[MermaidExpander] Astro after swap');
    debouncedAddExpandButtons();
  });

})(); 