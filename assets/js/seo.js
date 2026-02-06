// Dynamic SEO System - Loads meta tags from JSON files
document.addEventListener('DOMContentLoaded', function() {
  // Check if file:// protocol (skip fetch, use fallback)
  const isFileProtocol = window.location.protocol === 'file:';
  
  if (isFileProtocol) {
    // File:// protocol - using built-in SEO fallback data
    // Use fallback SEO data for file:// protocol
    const currentPage = getCurrentPageName();
    const fallbackData = getFallbackSEOData(currentPage);
    injectSEOData(fallbackData);
    return;
  }

  // Get current page name
  const currentPage = getCurrentPageName();
  
  if (!currentPage) {
    console.warn('Could not determine current page for SEO');
    return;
  }

  // Load SEO metadata
  const seoFile = `seo/meta-${currentPage}.json`;
  
  fetch(seoFile)
    .then(response => {
      if (!response.ok) {
        throw new Error(`Failed to load SEO data: ${response.statusText}`);
      }
      return response.json();
    })
    .then(data => {
      injectSEOData(data);
    })
    .catch(error => {
      console.warn('Error loading SEO data (using fallback):', error.message);
      // Use fallback SEO data
      const fallbackData = getFallbackSEOData(currentPage);
      injectSEOData(fallbackData);
    });

  // Load Schema.org structured data (only if not file:// protocol)
  if (!isFileProtocol) {
    fetch('seo/schema.json')
      .then(response => response.json())
      .then(schema => {
        injectSchemaData(schema);
      })
      .catch(error => {
        console.warn('Error loading schema data (skipping):', error.message);
        // Silently fail - schema is optional
      });
  } else {
    // Use inline schema for file:// protocol
    const fallbackSchema = {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "Incorvix BV",
      "url": window.location.href,
      "logo": window.location.href.replace(/\/[^\/]*$/, '/') + "assets/images/logo-incorvix.png",
      "description": "SAP solutions and digital transformation partner helping businesses unlock their potential with innovative, reliable, and future-ready SAP solutions.",
      "foundingDate": "2025",
      "contactPoint": {
        "@type": "ContactPoint",
        "contactType": "customer service",
        "email": "contact@incorvix.nl",
        "availableLanguage": ["English"]
      },
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Daalwijkdreef 47",
        "addressLocality": "Amsterdam",
        "postalCode": "1103 AD",
        "addressCountry": "NL"
      },
      "sameAs": [
        "https://www.linkedin.com/company/107739158/"
      ],
      "areaServed": "Worldwide",
      "serviceType": [
        "SAP Consulting",
        "SAP Implementation",
        "SAP Support",
        "Cloud Migration",
        "Digital Transformation"
      ]
    };
    injectSchemaData(fallbackSchema);
  }
});

// Get current page name from filename
function getCurrentPageName() {
  let path = window.location.pathname || window.location.href;
  const filename = path.split('/').pop() || 'index.html';
  
  // Remove .html extension
  const pageName = filename.replace('.html', '').replace(/^.*\//, '');
  
  // Map page names
  const pageMap = {
    'index': 'home',
    '': 'home'
  };
  
  return pageMap[pageName] || pageName;
}

// Get fallback SEO data for each page
function getFallbackSEOData(pageName) {
  const seoData = {
    home: {
      title: 'Home | Incorvix - SAP Solutions & Digital Transformation',
      description: 'Incorvix provides innovative SAP solutions, digital transformation services, and expert consulting to help businesses unlock their potential with reliable, future-ready technology.',
      keywords: 'SAP solutions, digital transformation, SAP consulting, S/4HANA, business transformation, SAP implementation, cloud solutions',
      image: 'assets/images/logo-incorvix.png',
      url: window.location.href,
      type: 'website',
      siteName: 'Incorvix BV'
    },
    about: {
      title: 'About Us | Incorvix - Making Business Work Smarter',
      description: 'Learn about Incorvix BV, a trusted SAP transformation partner helping businesses grow smarter with innovative solutions, long-term partnerships, and measurable results.',
      keywords: 'about Incorvix, SAP partner, business transformation, SAP consulting company',
      image: 'assets/images/logo-incorvix.png',
      url: window.location.href,
      type: 'website',
      siteName: 'Incorvix BV'
    },
    services: {
      title: 'Our Services | SAP Consulting, Implementation & Support | Incorvix',
      description: 'Expert SAP services including strategic consulting, end-to-end implementation, managed services, cloud migration, training, and SAP AI solutions.',
      keywords: 'SAP services, SAP consulting, SAP implementation, S/4HANA migration, SAP support',
      image: 'assets/images/logo-incorvix.png',
      url: window.location.href,
      type: 'website',
      siteName: 'Incorvix BV'
    },
    industry: {
      title: 'Industries We Serve | SAP Solutions by Industry | Incorvix',
      description: 'Incorvix provides specialized SAP solutions for Healthcare, Manufacturing, Oil & Gas, Retail, and Technology industries.',
      keywords: 'SAP healthcare, SAP manufacturing, SAP oil and gas, SAP retail, industry-specific SAP',
      image: 'assets/images/logo-incorvix.png',
      url: window.location.href,
      type: 'website',
      siteName: 'Incorvix BV'
    },
    contact: {
      title: 'Contact Us | Get in Touch | Incorvix',
      description: 'Contact Incorvix for SAP solutions and digital transformation services. Our experts are available to help you navigate your digital transformation journey.',
      keywords: 'contact Incorvix, SAP support contact, business consultation, SAP services inquiry',
      image: 'assets/images/logo-incorvix.png',
      url: window.location.href,
      type: 'website',
      siteName: 'Incorvix BV'
    },
    careers: {
      title: 'Careers | Join Our Team | Incorvix',
      description: 'Join Incorvix and be part of a team that helps businesses transform with SAP solutions. Explore career opportunities in SAP consulting and technology.',
      keywords: 'Incorvix careers, SAP jobs, technology careers, consulting opportunities',
      image: 'assets/images/logo-incorvix.png',
      url: window.location.href,
      type: 'website',
      siteName: 'Incorvix BV'
    },
    'privacy-policy': {
      title: 'Privacy Policy | Incorvix - Your Data Protection Rights',
      description: 'Learn how Incorvix BV protects your personal information. Our privacy policy explains how we collect, use, and safeguard your data when you use our SAP services.',
      keywords: 'privacy policy, data protection, GDPR, personal information, data privacy, Incorvix privacy',
      image: 'assets/images/logo-incorvix.png',
      url: window.location.href,
      type: 'website',
      siteName: 'Incorvix BV'
    },
    'terms-of-service': {
      title: 'Terms of Service | Incorvix - Legal Terms & Conditions',
      description: 'Read Incorvix BV\'s terms of service. Understand the legal terms and conditions that govern your use of our website and SAP consulting services.',
      keywords: 'terms of service, terms and conditions, legal terms, Incorvix terms, service agreement',
      image: 'assets/images/logo-incorvix.png',
      url: window.location.href,
      type: 'website',
      siteName: 'Incorvix BV'
    },
    'cookie-policy': {
      title: 'Cookie Policy | Incorvix - Cookie Usage & Preferences',
      description: 'Learn about how Incorvix BV uses cookies on our website. Understand cookie types, manage your preferences, and control your privacy settings.',
      keywords: 'cookie policy, cookies, web cookies, tracking cookies, cookie preferences, Incorvix cookies',
      image: 'assets/images/logo-incorvix.png',
      url: window.location.href,
      type: 'website',
      siteName: 'Incorvix BV'
    }
  };
  
  return seoData[pageName] || seoData.home;
}

// Inject SEO data into <head>
function injectSEOData(data) {
  const head = document.head;
  
  // Update title
  if (data.title) {
    document.title = data.title;
  }
  
  // Remove existing meta tags
  const existingMetaTags = [
    'meta[name="description"]',
    'meta[name="keywords"]',
    'meta[property="og:title"]',
    'meta[property="og:description"]',
    'meta[property="og:image"]',
    'meta[property="og:url"]',
    'meta[property="og:type"]',
    'meta[property="og:site_name"]',
    'meta[property="twitter:card"]',
    'meta[property="twitter:title"]',
    'meta[property="twitter:description"]',
    'meta[property="twitter:image"]',
    'link[rel="canonical"]'
  ];
  
  existingMetaTags.forEach(selector => {
    const existing = document.querySelector(selector);
    if (existing) {
      existing.remove();
    }
  });
  
  // Get full image URL
  const fullImageUrl = data.image && data.image.startsWith('http') 
    ? data.image 
    : (data.image ? `${window.location.origin}/${data.image}` : '');
  
  // Inject new meta tags
  const metaTags = [
    { name: 'description', content: data.description },
    { name: 'keywords', content: data.keywords },
    { property: 'og:title', content: data.title },
    { property: 'og:description', content: data.description },
    { property: 'og:image', content: fullImageUrl },
    { property: 'og:url', content: data.url },
    { property: 'og:type', content: data.type || 'website' },
    { property: 'og:site_name', content: data.siteName || 'Incorvix BV' },
    { property: 'twitter:card', content: 'summary_large_image' },
    { property: 'twitter:title', content: data.title },
    { property: 'twitter:description', content: data.description },
    { property: 'twitter:image', content: fullImageUrl }
  ];
  
  metaTags.forEach(tag => {
    const meta = document.createElement('meta');
    if (tag.name) {
      meta.setAttribute('name', tag.name);
    }
    if (tag.property) {
      meta.setAttribute('property', tag.property);
    }
    meta.setAttribute('content', tag.content || '');
    head.appendChild(meta);
  });
  
  // Add canonical link
  if (data.url) {
    const canonical = document.createElement('link');
    canonical.setAttribute('rel', 'canonical');
    canonical.setAttribute('href', data.url);
    head.appendChild(canonical);
  }
}

// Inject Schema.org JSON-LD structured data
function injectSchemaData(schema) {
  // Remove existing schema script
  const existingSchema = document.querySelector('script[type="application/ld+json"]');
  if (existingSchema) {
    existingSchema.remove();
  }
  
  // Inject new schema
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify(schema);
  document.head.appendChild(script);
}

