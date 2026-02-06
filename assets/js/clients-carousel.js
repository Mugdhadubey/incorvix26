// Trusted Clients Carousel - Infinite Scrolling
document.addEventListener('DOMContentLoaded', function() {
  const clients = [
    { name: "Client 4", logo: "assets/images/4.png", alt: "Client 4" },
    { name: "Client 5", logo: "assets/images/5.png", alt: "Client 5" },
    { name: "Client 6", logo: "assets/images/6.png", alt: "Client 6" },
    { name: "Client 7", logo: "assets/images/7.png", alt: "Client 7" },
    { name: "Client 8", logo: "assets/images/8.png", alt: "Client 8" },
    { name: "Client 9", logo: "assets/images/9.png", alt: "Client 9" },
    { name: "Client 10", logo: "assets/images/10.png", alt: "Client 10" },
    { name: "Client 11", logo: "assets/images/11.png", alt: "Client 11" },
    { name: "Client 12", logo: "assets/images/12.png", alt: "Client 12" },
    { name: "Client 13", logo: "assets/images/13.png", alt: "Client 13" },
    { name: "Client 14", logo: "assets/images/14.png", alt: "Client 14" },
    { name: "Client 15", logo: "assets/images/15.png", alt: "Client 15" }
  ];
  
  // Duplicate clients array for seamless infinite scroll (2 copies = 50% translation)
  const duplicatedClients = [...clients, ...clients];
  
  const carouselWrapper = document.querySelector('#clients-carousel .animate-scroll');
  
  if (carouselWrapper) {
    // Clear any existing content and populate with client logos
    carouselWrapper.innerHTML = duplicatedClients.map((client, index) => `
      <div class="flex-shrink-0 flex items-center justify-center p-6 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 hover:bg-white/20 hover:scale-105 transition-all duration-300 min-w-[200px]">
        <img src="${client.logo}" alt="${client.alt}" class="h-12 w-auto object-contain max-w-full" loading="lazy" onerror="this.style.display='none'">
      </div>
    `).join('');
  }
  
  // Add hover pause functionality
  const carouselElement = document.getElementById('clients-carousel');
  if (carouselElement && carouselWrapper) {
    carouselElement.addEventListener('mouseenter', function() {
      carouselWrapper.style.animationPlayState = 'paused';
    });
    
    carouselElement.addEventListener('mouseleave', function() {
      carouselWrapper.style.animationPlayState = 'running';
    });
  }
});

