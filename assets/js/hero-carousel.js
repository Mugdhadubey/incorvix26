// Hero Carousel Functionality
let currentSlide = 0;
const slides = [
  {
    title: "Making Business Work Smarter",
    subtitle: "We help businesses unlock their true potential through innovative, reliable, and future-ready SAP solutions that simplify operations, inspire innovation, and deliver measurable results.",
    buttonText: "Our Services",
    buttonLink: "services.html"
  },
  {
    title: "Transform Your Business with SAP Solutions",
    subtitle: "Expert SAP consulting and implementation services designed to streamline your operations and accelerate digital transformation for sustainable growth.",
    buttonText: "Get Started",
    buttonLink: "contact.html"
  },
  {
    title: "Innovation Meets Enterprise Excellence",
    subtitle: "As SAP Gold Partners, we deliver cutting-edge technology solutions that drive efficiency, innovation, and measurable business outcomes.",
    buttonText: "Contact Us",
    buttonLink: "contact.html"
  }
];

document.addEventListener('DOMContentLoaded', function() {
  const slide1 = document.getElementById('slide-1');
  const slide2 = document.getElementById('slide-2');
  const slide3 = document.getElementById('slide-3');
  const titleEl = document.getElementById('hero-title');
  const subtitleEl = document.getElementById('hero-subtitle');
  const buttonEl = document.getElementById('hero-button');
  
  // Helper function to setup button based on text
  function setupButton(buttonEl, buttonText, buttonLink) {
    if (!buttonEl) return;
    
    if (buttonText === 'Get Started') {
      // Remove href and add onclick for Get Started
      buttonEl.removeAttribute('href');
      buttonEl.setAttribute('onclick', 'openConsultationDialog(); return false;');
    } else {
      // For other buttons, use normal href
      buttonEl.setAttribute('href', buttonLink);
      buttonEl.removeAttribute('onclick');
    }
  }
  
  function updateSlide(index) {
    // Update slide visibility
    slide1.style.opacity = index === 0 ? '1' : '0';
    slide2.style.opacity = index === 1 ? '1' : '0';
    slide3.style.opacity = index === 2 ? '1' : '0';
    
    // Update indicators
    for (let i = 0; i < 3; i++) {
      const indicator = document.getElementById(`indicator-${i}`);
      if (indicator) {
        indicator.classList.toggle('bg-white', i === index);
        indicator.classList.toggle('bg-white/50', i !== index);
      }
    }
    
    // Update content with fade animation
    if (titleEl && subtitleEl && buttonEl) {
      titleEl.style.opacity = '0';
      setTimeout(() => {
        titleEl.textContent = slides[index].title;
        subtitleEl.textContent = slides[index].subtitle;
        buttonEl.textContent = slides[index].buttonText;
        
        // Setup button based on text
        setupButton(buttonEl, slides[index].buttonText, slides[index].buttonLink);
        
        titleEl.style.opacity = '1';
      }, 300);
    }
  }
  
  window.changeSlide = function(index) {
    currentSlide = index;
    updateSlide(currentSlide);
  };
  
  // Initialize first slide on load
  if (buttonEl && titleEl && subtitleEl) {
    setupButton(buttonEl, slides[0].buttonText, slides[0].buttonLink);
  }
  
  // Auto-advance slides
  setInterval(() => {
    currentSlide = (currentSlide + 1) % slides.length;
    updateSlide(currentSlide);
  }, 5000);
});

