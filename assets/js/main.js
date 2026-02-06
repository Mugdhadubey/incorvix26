// Helper function to get base path
function getBasePath() {
  const path = window.location.pathname;
  const lastSlash = path.lastIndexOf('/');
  if (lastSlash === -1) return '';
  return path.substring(0, lastSlash + 1);
}

// Load Header and Footer dynamically
document.addEventListener('DOMContentLoaded', function() {
  // Early check: Skip if we're in React app context
  const isReactApp = document.getElementById('root') !== null || 
                     (window.location.hostname === 'localhost' && (window.location.port === '8080' || window.location.port === '5173')) ||
                     window.__REACT_DEVTOOLS_GLOBAL_HOOK__ !== undefined;
  
  if (isReactApp) {
    // React app has its own components, don't interfere
    return;
  }
  
  // Check if we're using file:// protocol - skip fetch entirely
  const isFileProtocol = window.location.protocol === 'file:';
  
  if (isFileProtocol) {
    // File:// protocol detected - using inline fallback (header/footer already loaded)
    // Header/footer should already be loaded by open-browser.js
    // Just initialize header functionality if available
    setTimeout(() => {
      if (typeof initializeHeader === 'function') {
        initializeHeader();
      }
      loadConsultationModal();
    }, 200);
    return;
  }
  
  // Check if header/footer are already loaded (from file:// fallback)
  const headerPlaceholder = document.getElementById('header-placeholder');
  const footerPlaceholder = document.getElementById('footer-placeholder');
  
  // If header is already loaded (file:// mode), skip fetch
  if (headerPlaceholder && headerPlaceholder.innerHTML.trim() !== '' && headerPlaceholder.querySelector('header')) {
    console.log('✅ Header already loaded (file:// mode), skipping fetch');
    // Initialize header functionality
    setTimeout(() => {
      initializeHeader();
      loadConsultationModal();
    }, 100);
    return;
  }
  
  // Use fetch (http/https mode)
  const basePath = getBasePath();
  const headerPath = basePath + 'includes/header.html';
  const footerPath = basePath + 'includes/footer.html';
  
  console.log('Loading header from:', headerPath);
  console.log('Loading footer from:', footerPath);
  
  // Load Header
  fetch(headerPath)
    .then(response => {
      if (!response.ok) {
        throw new Error(`Failed to load header: ${response.status} ${response.statusText}`);
      }
      return response.text();
    })
    .then(html => {
      const headerPlaceholder = document.getElementById('header-placeholder');
      if (headerPlaceholder) {
        headerPlaceholder.innerHTML = html;
        console.log('Header loaded successfully');
        console.log('Header HTML length:', html.length);
        
        // Ensure header is visible
        const loadedHeader = document.getElementById('main-header');
        if (loadedHeader) {
          loadedHeader.style.display = 'block';
          loadedHeader.style.visibility = 'visible';
          loadedHeader.style.opacity = '1';
          console.log('Header element found and made visible');
        }
        
        // Initialize header functionality after a short delay to ensure DOM is ready
        setTimeout(() => {
          initializeHeader();
          loadConsultationModal();
        }, 100);
      } else {
        console.error('Header placeholder not found. Available IDs:', 
          Array.from(document.querySelectorAll('[id]')).map(el => el.id));
      }
    })
    .catch(error => {
      console.error('Error loading header:', error);
      // Fallback: try direct path if base path didn't work
      if (!headerPath.includes('html/')) {
        fetch('includes/header.html')
          .then(r => r.text())
          .then(html => {
            const headerPlaceholder = document.getElementById('header-placeholder');
          if (headerPlaceholder) {
            headerPlaceholder.innerHTML = html;
            setTimeout(() => {
              initializeHeader();
              loadConsultationModal();
            }, 100);
          }
          })
          .catch(e => console.error('Fallback header load also failed:', e));
      }
    });

  // Only fetch footer if not already loaded (file:// mode fallback)
  if (!footerPlaceholder || footerPlaceholder.innerHTML.trim() === '' || !footerPlaceholder.querySelector('footer')) {
    const basePath = getBasePath();
    const footerPath = basePath + 'includes/footer.html';
    
    // Load Footer
    fetch(footerPath)
    .then(response => {
      if (!response.ok) {
        throw new Error(`Failed to load footer: ${response.status} ${response.statusText}`);
      }
      return response.text();
    })
    .then(html => {
      const footerPlaceholder = document.getElementById('footer-placeholder');
      if (footerPlaceholder) {
        footerPlaceholder.innerHTML = html;
        console.log('Footer loaded successfully');
        console.log('Footer HTML length:', html.length);
        
        // Ensure footer is visible
        const loadedFooter = footerPlaceholder.querySelector('footer');
        if (loadedFooter) {
          loadedFooter.style.display = 'block';
          loadedFooter.style.visibility = 'visible';
          loadedFooter.style.opacity = '1';
          console.log('Footer element found and made visible');
        }
      } else {
        console.error('Footer placeholder not found. Available IDs:', 
          Array.from(document.querySelectorAll('[id]')).map(el => el.id));
      }
    })
    .catch(error => {
      console.error('Error loading footer:', error);
      // Fallback: try direct path
      if (!footerPath.includes('html/')) {
        fetch('includes/footer.html')
          .then(r => r.text())
          .then(html => {
            const footerPlaceholder = document.getElementById('footer-placeholder');
            if (footerPlaceholder) {
              footerPlaceholder.innerHTML = html;
            }
          })
          .catch(e => console.error('Fallback footer load also failed:', e));
      }
    });
  } else {
    console.log('✅ Footer already loaded (file:// mode), skipping fetch');
  }

  // Smooth scroll behavior
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
});

// Initialize Header functionality
function initializeHeader() {
  // Mobile menu toggle
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const menuIcon = document.getElementById('menu-icon');
  const closeIcon = document.getElementById('close-icon');

  if (mobileMenuBtn && mobileMenu) {
    // Create handler that always gets fresh DOM references
    const handleMenuToggle = function(e) {
      // Prevent default to avoid any form submission or page jump
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }
      
      // Always get fresh references from DOM
      const currentMenu = document.getElementById('mobile-menu');
      const currentMenuIcon = document.getElementById('menu-icon');
      const currentCloseIcon = document.getElementById('close-icon');
      const currentBtn = document.getElementById('mobile-menu-btn');
      
      if (!currentMenu || !currentBtn) return;
      
      const isOpen = !currentMenu.classList.contains('hidden');
      const isMobile = window.innerWidth < 1024;
      const mainHeader = document.getElementById('main-header');
      
      if (isOpen) {
        // Close menu
        currentMenu.classList.add('hidden');
        if (currentMenuIcon) currentMenuIcon.classList.remove('hidden');
        if (currentCloseIcon) currentCloseIcon.classList.add('hidden');
        currentBtn.setAttribute('aria-expanded', 'false');
        // Remove background when menu closes (only on mobile, and only if not scrolled)
        if (mainHeader && isMobile && window.scrollY <= 50) {
          mainHeader.classList.remove('bg-white', 'shadow-lg');
          mainHeader.style.backgroundColor = '';
          mainHeader.style.boxShadow = '';
        }
      } else {
        // Open menu
        currentMenu.classList.remove('hidden');
        if (currentMenuIcon) currentMenuIcon.classList.add('hidden');
        if (currentCloseIcon) currentCloseIcon.classList.remove('hidden');
        currentBtn.setAttribute('aria-expanded', 'true');
        // Add white background when menu opens (only on mobile)
        if (mainHeader && isMobile) {
          mainHeader.classList.add('bg-white');
          mainHeader.style.backgroundColor = '#ffffff';
        }
      }
    };
    
    // Remove any existing listeners first
    const newBtn = mobileMenuBtn.cloneNode(true);
    mobileMenuBtn.parentNode.replaceChild(newBtn, mobileMenuBtn);
    
    // Get fresh references - use setTimeout to ensure DOM is updated on server
    setTimeout(() => {
      const freshBtn = document.getElementById('mobile-menu-btn');
      const freshMenu = document.getElementById('mobile-menu');
      
      if (!freshBtn || !freshMenu) {
        // Retry once if elements not found (server timing issue)
        setTimeout(() => {
          const retryBtn = document.getElementById('mobile-menu-btn');
          const retryMenu = document.getElementById('mobile-menu');
          if (retryBtn && retryMenu) {
            // Add event listeners to button - multiple methods for reliability
            retryBtn.addEventListener('click', handleMenuToggle, { capture: true, passive: false });
            retryBtn.addEventListener('click', handleMenuToggle, { capture: false, passive: false });
            retryBtn.addEventListener('touchend', handleMenuToggle, { passive: false });
            retryBtn.onclick = handleMenuToggle;
            retryBtn.setAttribute('aria-label', 'Toggle mobile menu');
            retryBtn.setAttribute('aria-expanded', 'false');
            retryBtn.setAttribute('type', 'button');
            retryBtn.disabled = false;
            retryBtn.style.pointerEvents = 'auto';
            retryBtn.style.cursor = 'pointer';
            retryBtn.style.touchAction = 'manipulation';
          }
        }, 50);
        return;
      }
      
      // Add event listeners to fresh button - multiple methods for reliability
      freshBtn.addEventListener('click', handleMenuToggle, { capture: true, passive: false });
      freshBtn.addEventListener('click', handleMenuToggle, { capture: false, passive: false });
      freshBtn.addEventListener('touchend', handleMenuToggle, { passive: false });
      
      // Also add onclick as fallback
      freshBtn.onclick = handleMenuToggle;
      
      // Ensure button is accessible
      freshBtn.setAttribute('aria-label', 'Toggle mobile menu');
      freshBtn.setAttribute('aria-expanded', 'false');
      freshBtn.setAttribute('type', 'button');
      
      // Ensure button is not disabled
      freshBtn.disabled = false;
      freshBtn.style.pointerEvents = 'auto';
      freshBtn.style.cursor = 'pointer';
      freshBtn.style.touchAction = 'manipulation';
    }, 10);

    // Close mobile menu when clicking a link
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
    mobileNavLinks.forEach(link => {
      link.addEventListener('click', function(e) {
        // Ensure navigation works - don't prevent default
        // Close menu immediately to allow navigation
        const currentMenu = document.getElementById('mobile-menu');
        const currentMenuIcon = document.getElementById('menu-icon');
        const currentCloseIcon = document.getElementById('close-icon');
        if (currentMenu) currentMenu.classList.add('hidden');
        if (currentMenuIcon) currentMenuIcon.classList.remove('hidden');
        if (currentCloseIcon) currentCloseIcon.classList.add('hidden');
        // Remove background when menu closes (only on mobile, and only if not scrolled)
        const isMobile = window.innerWidth < 1024;
        const mainHeader = document.getElementById('main-header');
        if (mainHeader && isMobile && window.scrollY <= 50) {
          mainHeader.classList.remove('bg-white', 'shadow-lg');
          mainHeader.style.backgroundColor = '';
          mainHeader.style.boxShadow = '';
        }
        // Allow default navigation to proceed
      }, { passive: true });
    });
  }

  // Header scroll effect
  const header = document.getElementById('main-header');
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const isHomePage = currentPage === 'index.html' || currentPage === '' || window.location.pathname.endsWith('/');
  
  if (header) {
    // Check viewport width - mobile vs desktop
    const isMobile = window.innerWidth < 1024;
    
    // On mobile: Skip all scroll effects, header stays static via CSS
    if (isMobile) {
      // Remove any sticky classes that might interfere
      header.classList.remove('header-scrolled', 'bg-white', 'shadow-lg', 'fixed');
      // Force static position on mobile - override any inline styles
      header.style.position = 'static';
      header.style.top = 'auto';
      header.style.left = 'auto';
      header.style.right = 'auto';
      header.style.backgroundColor = 'transparent';
      header.style.boxShadow = 'none';
      // DO NOT attach scroll listener on mobile - CSS handles static position
      return; // Exit early - no scroll effects on mobile
    }
    
    // Desktop only: Set up scroll effects
    if (isHomePage) {
      // Home page: transparent initially, white on scroll (DESKTOP ONLY)
      header.style.backgroundColor = 'transparent';
      header.style.boxShadow = 'none';
      
      const updateHeaderColors = (isScrolled) => {
        // Double-check we're still on desktop
        if (window.innerWidth < 1024) return;
        
        const navLinks = header.querySelectorAll('.nav-link');
        const sapBadge = document.getElementById('sap-badge-text');
        const menuBtn = document.getElementById('mobile-menu-btn');
        const sapLogoDesktop = document.getElementById('sap-logo-desktop');
        const sapLogoMobile = document.getElementById('sap-logo-mobile');
        
        if (isScrolled) {
          // Sticky header: same as About Us page - white background, shadow, black text
          header.classList.add('header-scrolled', 'bg-white', 'shadow-lg');
          header.classList.remove('bg-transparent');
          header.style.backgroundColor = '#ffffff';
          header.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)';
          
          navLinks.forEach(link => {
            link.classList.remove('text-white', 'hover:text-white/80', 'text-black');
            link.classList.add('text-gray-700', 'hover:text-[#04adea]');
            link.style.color = '#374151';
          });
          
          if (sapBadge) {
            sapBadge.classList.remove('text-white', 'text-black');
            sapBadge.classList.add('text-gray-700');
            sapBadge.style.color = '#374151';
          }
          
          // Switch to black logo when scrolled (sticky) - same as About Us page
          if (sapLogoDesktop) {
            sapLogoDesktop.src = 'assets/images/Sap logo black.png';
          }
          if (sapLogoMobile) {
            sapLogoMobile.src = 'assets/images/Sap logo black.png';
          }
          
          if (menuBtn) {
            menuBtn.classList.remove('text-white');
            menuBtn.style.backgroundColor = '#ffffff';
            menuBtn.style.color = '#374151';
          }
        } else {
          header.classList.remove('header-scrolled', 'bg-white', 'shadow-lg');
          header.style.backgroundColor = 'transparent';
          header.style.boxShadow = 'none';
          
          navLinks.forEach(link => {
            link.classList.remove('text-gray-700', 'text-black', 'hover:text-[#04adea]');
            link.classList.add('text-white', 'hover:text-white/80');
            link.style.color = '#ffffff';
          });
          
          if (sapBadge) {
            sapBadge.classList.remove('text-gray-700', 'text-black');
            sapBadge.classList.add('text-white');
            sapBadge.style.color = '#ffffff';
          }
          
          // Switch back to original logo when at top
          if (sapLogoDesktop) {
            sapLogoDesktop.src = 'assets/images/Sap logo for incorvix.png';
          }
          if (sapLogoMobile) {
            sapLogoMobile.src = 'assets/images/Sap logo for incorvix.png';
          }
          
          if (menuBtn) {
            menuBtn.style.backgroundColor = 'transparent';
            menuBtn.style.color = '#ffffff';
          }
        }
      };
      
      // Desktop scroll listener - ONLY attached if NOT mobile
      let scrollHandler = function() {
        // Check viewport on each scroll - if mobile, do nothing
        if (window.innerWidth < 1024) {
          return; // Exit if switched to mobile
        }
        // Desktop only: apply sticky header effect
        updateHeaderColors(window.scrollY > 50);
      };
      
      window.addEventListener('scroll', scrollHandler, { passive: true });
      
      // Initial check (desktop only)
      updateHeaderColors(window.scrollY > 50);
      
      // Handle resize - switch between mobile/desktop behavior
      let resizeTimeout;
      window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(function() {
          // Viewport check: if mobile, remove scroll listener (CSS handles fixed position)
          if (window.innerWidth < 1024) {
            window.removeEventListener('scroll', scrollHandler);
            header.classList.remove('header-scrolled', 'bg-white', 'shadow-lg');
          } else {
            // Switched to desktop: re-apply initial state
            updateHeaderColors(window.scrollY > 50);
          }
        }, 100);
      });
    } else {
      // Other pages: always white background, use black logo (DESKTOP ONLY)
      header.classList.add('bg-white', 'shadow-lg');
      const sapLogoDesktop = document.getElementById('sap-logo-desktop');
      const sapLogoMobile = document.getElementById('sap-logo-mobile');
      if (sapLogoDesktop) {
        sapLogoDesktop.src = 'assets/images/Sap logo black.png';
      }
      if (sapLogoMobile) {
        sapLogoMobile.src = 'assets/images/Sap logo black.png';
      }
    }
  }
}

// Load Consultation Modal
function loadConsultationModal() {
  // Helper function to detect React app
  function isReactAppContext() {
    // Check for React root element (most common)
    if (document.getElementById('root')) {
      return true;
    }
    
    // Check for Vite dev server
    if (window.location.hostname === 'localhost' && (window.location.port === '8080' || window.location.port === '5173')) {
      return true;
    }
    
    // Check for React data attributes
    if (document.querySelector('[data-reactroot]') || document.querySelector('[data-react-helmet]')) {
      return true;
    }
    
    // Check if React DevTools is present
    if (window.__REACT_DEVTOOLS_GLOBAL_HOOK__) {
      return true;
    }
    
    // Note: We don't check import.meta here because it only works in ES modules
    // The other detection methods above are sufficient
    
    return false;
  }
  
  // Skip if we're running in React app
  if (isReactAppContext()) {
    // React app uses its own ConsultationDialog component, skip HTML modal loading
    return;
  }
  
  const isFileProtocol = window.location.protocol === 'file:';
  const basePath = getBasePath();
  const modalPath = basePath + 'includes/consultation-modal.html';
  
  // Check if modal already exists
  if (document.getElementById('consultation-modal')) {
    return; // Modal already loaded
  }
  
  if (isFileProtocol) {
    // File:// protocol - modal should be loaded inline by open-browser.js
    // Wait longer for open-browser.js to load it (give it time to execute)
    // Check multiple times before warning, and silently fail if modal doesn't load
    let checkCount = 0;
    const maxChecks = 10; // Check 10 times over 5 seconds
    
    const checkModal = setInterval(() => {
      checkCount++;
      
      // If modal found, stop checking
      if (document.getElementById('consultation-modal')) {
        clearInterval(checkModal);
        return;
      }
      
      // After all checks, silently fail - no warning needed
      if (checkCount >= maxChecks) {
        clearInterval(checkModal);
        // Don't show warning - modal will be loaded on demand or may not be needed
        return;
      }
    }, 500); // Check every 500ms
    return;
  }
  
  // Load modal via fetch (http/https mode)
  fetch(modalPath)
    .then(response => {
      if (!response.ok) {
        throw new Error(`Failed to load consultation modal: ${response.status}`);
      }
      return response.text();
    })
    .then(html => {
      // Append modal to body
      const modalContainer = document.createElement('div');
      modalContainer.innerHTML = html;
      document.body.appendChild(modalContainer.firstElementChild);
      
      // Initialize form handler
      initializeConsultationForm();
    })
    .catch(error => {
      console.error('Error loading consultation modal:', error);
      // Fallback: try direct path
      fetch('includes/consultation-modal.html')
        .then(r => r.text())
        .then(html => {
          const modalContainer = document.createElement('div');
          modalContainer.innerHTML = html;
          document.body.appendChild(modalContainer.firstElementChild);
          initializeConsultationForm();
        })
        .catch(e => console.error('Fallback modal load also failed:', e));
    });
}

// Consultation Dialog Handler
function openConsultationDialog() {
  // First, try to find existing modal
  let modal = document.getElementById('consultation-modal');
  
  if (modal) {
    // Modal exists, just show it
    modal.classList.remove('hidden');
    modal.style.display = 'flex'; // Ensure it's visible
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
    return;
  }
  
  // Modal not found - need to load it
  const isFileProtocol = window.location.protocol === 'file:';
  
  if (isFileProtocol) {
    // For file:// protocol, try to load from placeholder or create inline
    const modalPlaceholder = document.getElementById('consultation-modal-placeholder');
    
    if (modalPlaceholder && !modalPlaceholder.querySelector('#consultation-modal')) {
      // Load from includes/consultation-modal.html file
      fetch('includes/consultation-modal.html')
        .then(response => response.text())
        .then(html => {
          modalPlaceholder.innerHTML = html;
          modal = document.getElementById('consultation-modal');
          if (modal) {
            modal.classList.remove('hidden');
            modal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
            initializeConsultationForm();
          }
        })
        .catch(() => {
          // If fetch fails, create modal inline
          createModalInline();
        });
    } else {
      // Try again after a short delay (in case open-browser.js is still loading it)
      setTimeout(() => {
        modal = document.getElementById('consultation-modal');
        if (modal) {
          modal.classList.remove('hidden');
          modal.style.display = 'flex';
          document.body.style.overflow = 'hidden';
        } else {
          // Still not found, create inline
          createModalInline();
        }
      }, 500);
    }
  } else {
    // For http/https, use loadConsultationModal and retry
    loadConsultationModal();
    setTimeout(() => {
      modal = document.getElementById('consultation-modal');
      if (modal) {
        modal.classList.remove('hidden');
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
      }
    }, 500);
  }
}

// Helper function to create modal inline if not found
function createModalInline() {
  const modalHTML = document.getElementById('consultation-modal-placeholder');
  if (!modalHTML) {
    // Create placeholder if it doesn't exist
    const placeholder = document.createElement('div');
    placeholder.id = 'consultation-modal-placeholder';
    document.body.appendChild(placeholder);
  }
  
  // Load the modal HTML from includes file
  fetch('includes/consultation-modal.html')
    .then(response => response.text())
    .then(html => {
      const placeholder = document.getElementById('consultation-modal-placeholder');
      if (placeholder) {
        placeholder.innerHTML = html;
        const modal = document.getElementById('consultation-modal');
        if (modal) {
          modal.classList.remove('hidden');
          modal.style.display = 'flex';
          document.body.style.overflow = 'hidden';
          initializeConsultationForm();
        }
      }
    })
    .catch(() => {
      // Last resort - create modal HTML directly
      const placeholder = document.getElementById('consultation-modal-placeholder') || document.body;
      const modalDiv = document.createElement('div');
      modalDiv.id = 'consultation-modal';
      modalDiv.className = 'fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm';
      modalDiv.innerHTML = `
        <div class="bg-white rounded-xl shadow-2xl max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
          <div class="p-6">
            <div class="flex items-center justify-between mb-6">
              <div>
                <h3 class="text-2xl font-bold text-gray-900">Schedule a Consultation</h3>
                <p class="text-gray-600 text-sm mt-1">Tell us about your needs and we'll get back to you shortly.</p>
              </div>
              <button onclick="closeConsultationDialog()" class="text-gray-400 hover:text-gray-600 transition-colors">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
            <form id="consultation-form" class="space-y-4">
              <div class="grid md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
                  <input type="text" id="consultation-firstname" name="firstName" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#04adea] focus:border-transparent" placeholder="John" />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
                  <input type="text" id="consultation-lastname" name="lastName" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#04adea] focus:border-transparent" placeholder="Doe" />
                </div>
              </div>
              <div class="grid md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                  <input type="email" id="consultation-email" name="email" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#04adea] focus:border-transparent" placeholder="john@company.com" />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Company *</label>
                  <input type="text" id="consultation-company" name="company" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#04adea] focus:border-transparent" placeholder="Company Name" />
                </div>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Service Interest</label>
                <select id="consultation-service" name="service" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#04adea] focus:border-transparent">
                  <option value="">Select a service</option>
                  <option value="Strategic SAP Consulting">Strategic SAP Consulting</option>
                  <option value="End-to-End Implementation & Integration">End-to-End Implementation & Integration</option>
                  <option value="Managed Services & Application Support">Managed Services & Application Support</option>
                  <option value="Cloud & SAP S/4HANA Services">Cloud & SAP S/4HANA Services</option>
                  <option value="Training & Change Management">Training & Change Management</option>
                  <option value="SAP AI Services">SAP AI Services</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Message</label>
                <textarea id="consultation-message" name="message" rows="4" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#04adea] focus:border-transparent" placeholder="Tell us about your project..."></textarea>
              </div>
              <div class="flex items-center justify-end space-x-4 pt-4">
                <button type="button" onclick="closeConsultationDialog()" class="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">Cancel</button>
                <button type="submit" id="consultation-submit" class="px-6 py-2 bg-[#04adea] hover:bg-[#0394c7] disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-all duration-300">Request Consultation</button>
              </div>
            </form>
          </div>
        </div>
      `;
      placeholder.appendChild(modalDiv);
      modalDiv.style.display = 'flex';
      document.body.style.overflow = 'hidden';
      initializeConsultationForm();
    });
}

function closeConsultationDialog() {
  const modal = document.getElementById('consultation-modal');
  if (modal) {
    modal.classList.add('hidden');
    modal.style.display = 'none'; // Ensure it's hidden
    document.body.style.overflow = ''; // Restore scrolling
    // Reset form
    const form = document.getElementById('consultation-form');
    if (form) {
      form.reset();
    }
  }
}

// Initialize consultation form handler
function initializeConsultationForm() {
  const consultationForm = document.getElementById('consultation-form');
  if (consultationForm && !consultationForm.dataset.initialized) {
    consultationForm.dataset.initialized = 'true'; // Prevent multiple handlers
    consultationForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      
      const submitBtn = document.getElementById('consultation-submit');
      const originalText = submitBtn ? submitBtn.textContent : '';
      
      // Disable submit button
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';
      }
      
      // Collect form data
      const formData = {
        firstName: document.getElementById('consultation-firstname').value,
        lastName: document.getElementById('consultation-lastname').value,
        email: document.getElementById('consultation-email').value,
        company: document.getElementById('consultation-company').value,
        service: document.getElementById('consultation-service').value,
        message: document.getElementById('consultation-message').value
      };
      
      try {
        // Try PHP endpoint first, fallback to Node.js API
        const apiEndpoint = '/api/consultation.php';
        const response = await fetch(apiEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
        
        const result = await response.json();
        
        if (result.success) {
          // Show success toast
          if (typeof showToast === 'function') {
            showToast('Thank you! Your consultation request has been sent successfully. We\'ll get back to you within 24 hours.', 'success', 6000);
          } else {
            alert('Consultation request sent successfully! 🎉\n\nThank you for your interest. We\'ll get back to you within 24 hours.');
          }
          consultationForm.reset();
          setTimeout(() => closeConsultationDialog(), 1000);
        } else {
          // Show error toast
          if (typeof showToast === 'function') {
            showToast('Failed to send consultation request: ' + (result.error || 'Please try again later.'), 'error');
          } else {
            alert('Failed to send consultation request: ' + (result.error || 'Please try again later.'));
          }
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
          }
        }
      } catch (error) {
        console.error('Error submitting consultation:', error);
        if (typeof showToast === 'function') {
          showToast('Network error: Please check your connection and try again.', 'error');
        } else {
          alert('Network error: Please check your connection and try again.');
        }
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = originalText;
        }
      }
    });
  }
}

// Handle consultation form submission
document.addEventListener('DOMContentLoaded', function() {
  // Initialize form handler if modal already exists
  setTimeout(() => {
    if (document.getElementById('consultation-modal')) {
      initializeConsultationForm();
    }
  }, 500);
  
  // Close modal when clicking outside
  const modal = document.getElementById('consultation-modal');
  if (modal) {
    modal.addEventListener('click', function(e) {
      if (e.target === modal) {
        closeConsultationDialog();
      }
    });
  }
  
  // Close modal with Escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      const modal = document.getElementById('consultation-modal');
      if (modal && !modal.classList.contains('hidden')) {
        closeConsultationDialog();
      }
    }
  });
});

// Close mobile menu on window resize
window.addEventListener('resize', function() {
  const mobileMenu = document.getElementById('mobile-menu');
  const menuIcon = document.getElementById('menu-icon');
  const closeIcon = document.getElementById('close-icon');
  
  if (window.innerWidth >= 1024 && mobileMenu) {
    mobileMenu.classList.add('hidden');
    if (menuIcon) menuIcon.classList.remove('hidden');
    if (closeIcon) closeIcon.classList.add('hidden');
  }
});

