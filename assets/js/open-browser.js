// This script loads header/footer inline if running from file:// protocol
// Works even when double-clicking HTML files!

(function() {
  'use strict';
  
  // Check if we're using file:// protocol
  const isFileProtocol = window.location.protocol === 'file:';
  
  // Force file protocol mode for testing - remove this line in production
  // const isFileProtocol = true;
  
  if (isFileProtocol) {
    // Silent mode for file:// protocol - header/footer will load inline
    // console.warn('⚠️ Running from file:// protocol. Loading header/footer inline...');
    
    // Inline header HTML
    const headerHTML = `
<header id="main-header" class="fixed top-0 left-0 right-0 z-50 transition-all duration-300" style="background-color: transparent; width: 100%; margin: 0; padding: 0;">
  <div class="container mx-auto px-4">
    <div class="flex items-center justify-between h-20 w-full">
      <!-- Logo -->
      <a href="index.html" class="flex items-center space-x-2">
        <img src="assets/images/logo-incorvix.png" alt="Incorvix" class="w-auto md:h-12 lg:h-14" style="height: 55px; min-height: 55px;" />
      </a>

      <!-- Desktop Navigation -->
      <nav class="hidden lg:flex items-center space-x-8" id="main-nav">
        <div class="relative group">
          <a href="index.html" class="transition-colors duration-300 font-medium flex items-center space-x-1 nav-link text-gray-700 hover:text-[#04adea]">
            <span>Home</span>
          </a>
        </div>
        <div class="relative group">
          <a href="about.html" class="transition-colors duration-300 font-medium flex items-center space-x-1 nav-link text-gray-700 hover:text-[#04adea]">
            <span>About Us</span>
          </a>
        </div>
        <div class="relative group">
          <a href="services.html" class="transition-colors duration-300 font-medium flex items-center space-x-1 nav-link text-gray-700 hover:text-[#04adea]">
            <span>Services</span>
          </a>
        </div>
        <div class="relative group">
          <a href="industry.html" class="transition-colors duration-300 font-medium flex items-center space-x-1 nav-link text-gray-700 hover:text-[#04adea]">
            <span>Industry</span>
          </a>
        </div>
        <div class="relative group">
          <a href="careers.html" class="transition-colors duration-300 font-medium flex items-center space-x-1 nav-link text-gray-700 hover:text-[#04adea]">
            <span>Careers</span>
          </a>
        </div>
        <div class="relative group">
          <a href="contact.html" class="transition-colors duration-300 font-medium flex items-center space-x-1 nav-link text-gray-700 hover:text-[#04adea]">
            <span>Contact Us</span>
          </a>
        </div>
      </nav>

      <!-- Right side - SAP Badge and CTA -->
      <div class="hidden lg:flex items-center space-x-6">
        <img id="sap-logo-desktop" src="assets/images/Sap logo for incorvix.png" alt="SAP Experts" class="h-10 w-auto" style="display: block;" />
        <button onclick="openConsultationDialog()" class="bg-[#04adea] hover:bg-[#0394c7] text-white px-6 py-2 rounded-md font-medium transition-all duration-300">
          Get Started
        </button>
      </div>

      <!-- Mobile menu button -->
      <button id="mobile-menu-btn" class="lg:hidden p-3 transition-colors relative z-10 bg-white shadow-lg border border-gray-200 rounded-md text-gray-700">
        <svg id="menu-icon" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
        </svg>
        <svg id="close-icon" class="w-6 h-6 hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </button>
    </div>

    <!-- Mobile Navigation -->
    <div id="mobile-menu" class="hidden lg:hidden py-4 border-t border-gray-200 bg-white relative z-50">
      <nav class="flex flex-col space-y-4">
        <a href="index.html" class="transition-colors duration-300 font-medium px-4 py-2 flex items-center justify-between text-gray-700 hover:text-[#04adea] mobile-nav-link">Home</a>
        <a href="about.html" class="transition-colors duration-300 font-medium px-4 py-2 flex items-center justify-between text-gray-700 hover:text-[#04adea] mobile-nav-link">About Us</a>
        <a href="services.html" class="transition-colors duration-300 font-medium px-4 py-2 flex items-center justify-between text-gray-700 hover:text-[#04adea] mobile-nav-link">Services</a>
        <a href="industry.html" class="transition-colors duration-300 font-medium px-4 py-2 flex items-center justify-between text-gray-700 hover:text-[#04adea] mobile-nav-link">Industry</a>
        <a href="careers.html" class="transition-colors duration-300 font-medium px-4 py-2 flex items-center justify-between text-gray-700 hover:text-[#04adea] mobile-nav-link">Careers</a>
        <a href="contact.html" class="transition-colors duration-300 font-medium px-4 py-2 flex items-center justify-between text-gray-700 hover:text-[#04adea] mobile-nav-link">Contact Us</a>
        <div class="px-4 py-2 border-t mt-4 border-gray-200">
          <img id="sap-logo-mobile" src="assets/images/Sap logo for incorvix.png" alt="SAP Experts" class="h-10 w-auto mb-4" style="display: block;" />
          <button onclick="openConsultationDialog()" class="w-full bg-[#04adea] hover:bg-[#0394c7] text-white py-2 rounded-md font-medium">
            Get Started
          </button>
        </div>
      </nav>
    </div>
  </div>
</header>
`;

    // Inline footer HTML  
    const footerHTML = `
<footer class="bg-[#0f1220] text-white">
  <!-- Main Footer -->
  <div class="py-16">
    <div class="container mx-auto px-4">
      <div class="grid lg:grid-cols-4 md:grid-cols-2 gap-8">
        <!-- Company Info -->
        <div class="lg:col-span-1">
          <a href="index.html" class="flex items-center space-x-2 mb-6">
            <div class="bg-white p-2 rounded-lg">
              <img src="assets/images/logo-incorvix.png" alt="Incorvix" class="h-9 md:h-12 w-auto" />
            </div>
          </a>
          
          <p class="text-gray-400 leading-relaxed mb-6">
            Incorvix is your trusted SAP Experts, specializing in enterprise software solutions 
            that drive digital transformation and business growth. We help organizations unlock their 
            true potential through innovative technology.
          </p>
          
          <div class="flex space-x-4">
            <a href="https://www.linkedin.com/company/107739158/" target="_blank" rel="noopener noreferrer" 
               class="w-10 h-10 bg-gray-800 hover:bg-[#04adea] rounded-full flex items-center justify-center transition-colors duration-300" 
               aria-label="LinkedIn">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
              </svg>
            </a>
          </div>
        </div>

        <!-- Quick Links -->
        <div>
          <h3 class="text-lg font-semibold mb-6">Quick Links</h3>
          <ul class="space-y-3">
            <li><a href="about.html" class="text-gray-400 hover:text-white transition-colors duration-300 flex items-center group">→ About Us</a></li>
            <li><a href="services.html" class="text-gray-400 hover:text-white transition-colors duration-300 flex items-center group">→ Our Services</a></li>
            <li><a href="industry.html" class="text-gray-400 hover:text-white transition-colors duration-300 flex items-center group">→ Industry Solutions</a></li>
            <li><a href="contact.html" class="text-gray-400 hover:text-white transition-colors duration-300 flex items-center group">→ Contact</a></li>
            <li><a href="careers.html" class="text-gray-400 hover:text-white transition-colors duration-300 flex items-center group">→ Careers</a></li>
          </ul>
        </div>

        <!-- Services -->
        <div>
          <h3 class="text-lg font-semibold mb-6">Our Services</h3>
          <ul class="space-y-3">
            <li><a href="services.html" class="text-gray-400 hover:text-white transition-colors duration-300 flex items-center group">→ Strategic SAP Consulting</a></li>
            <li><a href="services.html" class="text-gray-400 hover:text-white transition-colors duration-300 flex items-center group">→ End-to-End Implementation</a></li>
            <li><a href="services.html" class="text-gray-400 hover:text-white transition-colors duration-300 flex items-center group">→ Managed Services & Support</a></li>
            <li><a href="services.html" class="text-gray-400 hover:text-white transition-colors duration-300 flex items-center group">→ Cloud & SAP S/4HANA</a></li>
            <li><a href="services.html" class="text-gray-400 hover:text-white transition-colors duration-300 flex items-center group">→ Training & Change Management</a></li>
            <li><a href="services.html" class="text-gray-400 hover:text-white transition-colors duration-300 flex items-center group">→ SAP AI Services</a></li>
          </ul>
        </div>

        <!-- Contact Info -->
        <div>
          <h3 class="text-lg font-semibold mb-6">Contact Info</h3>
          <div class="space-y-4">
            <div class="flex items-start space-x-3">
              <svg class="w-5 h-5 text-[#04adea] mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
              <div class="text-gray-400">
                <div>Daalwijkdreef 47</div>
                <div>1103 AD Amsterdam</div>
              </div>
            </div>
            
            <div class="flex items-center space-x-3">
              <svg class="w-5 h-5 text-[#04adea] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
              </svg>
              <div>
                <div class="text-sm text-gray-500">Email Support</div>
                <div class="font-semibold">contact@incorvix.nl</div>
              </div>
            </div>
          </div>

          <!-- SAP Partnership Badge -->
          <div class="mt-8">
            <img src="assets/images/Sap logo for incorvix.png" alt="SAP Experts" class="h-10 w-auto" style="display: block;" />
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Bottom Bar -->
  <div class="border-t border-gray-800 py-6">
    <div class="container mx-auto px-4">
      <div class="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
        <div class="text-gray-400 text-sm">
          © 2025 : IncorviX BV. All rights reserved. Powered by 
          <a href="https://nekdigital.nl/" target="_blank" rel="noopener noreferrer" 
             class="text-[#04adea] hover:text-white transition-colors duration-300">
            Nekdigital
          </a>
        </div>
        <div class="flex space-x-6 text-sm flex-wrap gap-4">
          <a href="privacy-policy.html" class="text-gray-400 hover:text-white transition-colors">Privacy Policy</a>
          <a href="terms-of-service.html" class="text-gray-400 hover:text-white transition-colors">Terms of Service</a>
          <a href="cookie-policy.html" class="text-gray-400 hover:text-white transition-colors">Cookie Policy</a>
          <a href="sitemap.xml" class="text-gray-400 hover:text-white transition-colors">Sitemap</a>
        </div>
      </div>
    </div>
  </div>
</footer>
`;

      // Consultation Modal HTML (for file:// protocol)
      const consultationModalHTML = `
<!-- Consultation Modal -->
<div id="consultation-modal" class="fixed inset-0 z-50 hidden flex items-center justify-center bg-black/50 backdrop-blur-sm">
  <div class="bg-white rounded-xl shadow-2xl max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
    <div class="p-6">
      <!-- Modal Header -->
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

      <!-- Consultation Form -->
      <form id="consultation-form" class="space-y-4">
        <div class="grid md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
            <input
              type="text"
              id="consultation-firstname"
              name="firstName"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#04adea] focus:border-transparent"
              placeholder="John"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
            <input
              type="text"
              id="consultation-lastname"
              name="lastName"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#04adea] focus:border-transparent"
              placeholder="Doe"
            />
          </div>
        </div>

        <div class="grid md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Email *</label>
            <input
              type="email"
              id="consultation-email"
              name="email"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#04adea] focus:border-transparent"
              placeholder="john@company.com"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Company *</label>
            <input
              type="text"
              id="consultation-company"
              name="company"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#04adea] focus:border-transparent"
              placeholder="Company Name"
            />
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Service Interest</label>
          <select
            id="consultation-service"
            name="service"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#04adea] focus:border-transparent"
          >
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
          <textarea
            id="consultation-message"
            name="message"
            rows="4"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#04adea] focus:border-transparent"
            placeholder="Tell us about your project..."
          ></textarea>
        </div>

        <div class="flex items-center justify-end space-x-4 pt-4">
          <button
            type="button"
            onclick="closeConsultationDialog()"
            class="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            id="consultation-submit"
            class="px-6 py-2 bg-[#04adea] hover:bg-[#0394c7] disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-all duration-300"
          >
            Request Consultation
          </button>
        </div>
      </form>
    </div>
  </div>
</div>
`;

      // Function to load header and footer
      function loadInlineHeaderFooter() {
        // Load Header
        const headerPlaceholder = document.getElementById('header-placeholder');
        if (headerPlaceholder) {
          headerPlaceholder.innerHTML = headerHTML;
          
          // Make sure header is visible
          setTimeout(() => {
            const header = document.getElementById('main-header');
            if (header) {
              header.style.display = 'block';
              header.style.visibility = 'visible';
              header.style.opacity = '1';
              header.style.width = '100%';
              header.style.position = 'fixed';
              header.style.top = '0';
              header.style.left = '0';
              header.style.right = '0';
              header.style.zIndex = '50';
              header.style.backgroundColor = 'transparent';
              
              // Check if homepage and adjust accordingly
              const currentPage = window.location.pathname.split('/').pop() || '';
              if (currentPage === 'index.html' || currentPage === '' || currentPage.endsWith('/')) {
                header.style.backgroundColor = 'transparent';
              } else {
                header.style.backgroundColor = '#ffffff';
                header.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
              }
            }
          }, 50);
        } else {
          // Header placeholder not found yet, will retry
          return false;
        }

        // Load Footer
        const footerPlaceholder = document.getElementById('footer-placeholder');
        if (footerPlaceholder) {
          footerPlaceholder.innerHTML = footerHTML;
          
          // Make sure footer is visible
          setTimeout(() => {
            const footer = footerPlaceholder.querySelector('footer');
            if (footer) {
              footer.style.display = 'block';
              footer.style.visibility = 'visible';
              footer.style.opacity = '1';
              footer.style.width = '100%';
            }
          }, 50);
        } else {
          // Footer placeholder not found yet, will retry
          return false;
        }
        
        return true;
      }
      
      // Wait for DOM to be ready with multiple retry attempts
      let retryCount = 0;
      const maxRetries = 20;
      
      function tryLoad() {
        const headerPlaceholder = document.getElementById('header-placeholder');
        const footerPlaceholder = document.getElementById('footer-placeholder');
        
        if (headerPlaceholder && footerPlaceholder) {
          loadInlineHeaderFooter();
        } else {
          retryCount++;
          if (retryCount < maxRetries) {
            setTimeout(tryLoad, 100);
          }
        }
      }
      
      // Try when DOM is ready
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
          setTimeout(tryLoad, 100);
        });
      } else {
        // DOM already loaded
        setTimeout(tryLoad, 100);
      }
      
      // Also try immediately as backup
      setTimeout(tryLoad, 200);
      
      // Initialize header functionality
      setTimeout(() => {
        // Try to call initializeHeader from main.js
        if (typeof initializeHeader === 'function') {
          initializeHeader();
        } else {
          // Fallback: basic header initialization
          const mobileMenuBtn = document.getElementById('mobile-menu-btn');
          const mobileMenu = document.getElementById('mobile-menu');
          const menuIcon = document.getElementById('menu-icon');
          const closeIcon = document.getElementById('close-icon');

          if (mobileMenuBtn && mobileMenu && menuIcon && closeIcon) {
            mobileMenuBtn.addEventListener('click', function() {
              const isOpen = !mobileMenu.classList.contains('hidden');
              // Only apply background changes on mobile screens (less than 1024px)
              const isMobile = window.innerWidth < 1024;
              const mainHeader = document.getElementById('main-header');
              
              if (isOpen) {
                mobileMenu.classList.add('hidden');
                menuIcon.classList.remove('hidden');
                closeIcon.classList.add('hidden');
                // Remove background when menu closes (only on mobile, and only if not scrolled)
                if (mainHeader && isMobile && window.scrollY <= 50) {
                  mainHeader.classList.remove('bg-white');
                  mainHeader.style.backgroundColor = '';
                }
              } else {
                mobileMenu.classList.remove('hidden');
                menuIcon.classList.add('hidden');
                closeIcon.classList.remove('hidden');
                // Add white background when menu opens (only on mobile)
                if (mainHeader && isMobile) {
                  mainHeader.classList.add('bg-white');
                  mainHeader.style.backgroundColor = '#ffffff';
                }
              }
            });
          }
        }
      }, 300);
  }
})();

