# Incorvix Website - Production Ready Package

## 🚀 Quick Start

This folder is **100% ready** to upload to your server. 

**Just upload and follow:** `UPLOAD-INSTRUCTIONS.md`

---

## 📦 Contents

### Main Pages (9 HTML files)
- `index.html` - Homepage
- `about.html` - About Us
- `services.html` - Services
- `industry.html` - Industries
- `careers.html` - Careers (with CV upload)
- `contact.html` - Contact
- `privacy-policy.html` - Privacy Policy
- `terms-of-service.html` - Terms
- `cookie-policy.html` - Cookie Policy

### Backend (API)
- `api/careers.php` - Career form handler (with CV attachment)
- `api/contact.php` - Contact form handler
- `api/consultation.php` - Consultation form handler
- `api/uploads/` - Temporary CV storage (protected)

### Assets
- `assets/css/` - Stylesheets
- `assets/js/` - JavaScript files
- `assets/images/` - Images and logos

### SEO & Configuration
- `seo/` - Meta tags and structured data (JSON)
- `.htaccess` - Clean URLs configuration
- `robots.txt` - Search engine instructions
- `sitemap.xml` - Site map
- `web.config` - IIS configuration (if needed)

### Includes (Shared Components)
- `includes/header.html` - Website header
- `includes/footer.html` - Website footer
- `includes/consultation-modal.html` - Get Started modal

---

## ✨ Features

✅ **Fully Responsive** - Mobile, Tablet, Desktop  
✅ **Clean URLs** - No .html extension needed  
✅ **SEO Optimized** - Meta tags, structured data, sitemap  
✅ **Contact Forms** - All forms working with email  
✅ **CV Upload** - PDF/DOC file attachment in emails  
✅ **SMTP Email** - Professional email delivery  
✅ **Auto-replies** - Confirmation emails to applicants  

---

## 📋 Setup Requirements

1. **Web Server:** Apache (recommended) or IIS
2. **PHP:** Version 7.4 or higher
3. **PHPMailer:** Will be auto-installed or download manually
4. **Permissions:** 
   - Folders: 755
   - Files: 644

---

## 🔧 Configuration

### Email Settings (Already Configured)
- SMTP Host: server126.yourhosting.nl
- Port: 465 (SSL)
- Email: contact@incorvix.nl

### File Upload
- Max size: 10MB
- Allowed types: PDF, DOC only
- Storage: `api/uploads/` (auto-cleaned after email)

---

## 📖 Documentation

- **UPLOAD-INSTRUCTIONS.md** - Complete upload guide
- **README-UPLOAD.md** - Quick reference
- **EMAIL-TROUBLESHOOTING.md** - Email debugging
- **TROUBLESHOOTING-CAREER-FORM.md** - Form debugging

---

## 🎯 What's Included

✅ All HTML pages  
✅ Complete backend API  
✅ All assets (CSS, JS, Images)  
✅ SEO configuration  
✅ Email functionality  
✅ CV attachment support  
✅ Clean URL rewrite rules  
✅ Protection for uploads folder  

---

## ⚠️ After Upload

1. Create `api/uploads/` folder (if not exists) - chmod 755
2. Install PHPMailer (see UPLOAD-INSTRUCTIONS.md)
3. Set file permissions
4. Test all forms

---

**Ready to deploy! Follow UPLOAD-INSTRUCTIONS.md for step-by-step setup.**
# incorvix26
