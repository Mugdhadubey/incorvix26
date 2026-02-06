# 📤 Upload to Server - Complete Guide

## 📁 Folder Structure

Upload the entire contents of this folder to your web server root directory.

```
Your Server Root:
├── index.html
├── about.html
├── contact.html
├── services.html
├── industry.html
├── careers.html
├── privacy-policy.html
├── terms-of-service.html
├── cookie-policy.html
├── sitemap.xml
├── robots.txt
├── .htaccess
├── api/
│   ├── contact.php
│   ├── consultation.php
│   ├── careers.php
│   ├── .htaccess
│   └── vendor/
│       └── PHPMailer/
│           ├── PHPMailer.php      ← DOWNLOAD FROM GITHUB (see below)
│           ├── SMTP.php          ← DOWNLOAD FROM GITHUB
│           └── Exception.php     ← DOWNLOAD FROM GITHUB
├── assets/
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   ├── main.js
│   │   ├── form-handlers.js
│   │   ├── toast.js
│   │   ├── hero-carousel.js
│   │   ├── seo.js
│   │   └── open-browser.js
│   └── images/
│       └── [all image files]
├── includes/
│   ├── header.html
│   ├── footer.html
│   └── consultation-modal.html
└── seo/
    └── [all JSON files]
```

## ⚠️ IMPORTANT: PHPMailer Files Required

Before uploading, you **MUST** download and add PHPMailer files:

### Step 1: Download PHPMailer
1. Visit: https://github.com/PHPMailer/PHPMailer
2. Click **"Code"** → **"Download ZIP"**
3. Extract the ZIP
4. Go to: `PHPMailer-master/src/`

### Step 2: Copy Files
Copy these **3 files** to: `api/vendor/PHPMailer/`
- `PHPMailer.php`
- `SMTP.php`
- `Exception.php`

### Alternative: Use Download Script
After uploading, visit: `https://yourdomain.com/api/download-phpmailer-simple.php`

## 📤 Upload Process

### Method 1: FTP/File Manager
1. Connect to your hosting via FTP or File Manager
2. Upload entire folder contents to server root
3. Ensure file permissions:
   - Folders: 755
   - PHP files: 644
   - HTML files: 644

### Method 2: cPanel File Manager
1. Login to cPanel
2. Open File Manager
3. Upload all files to `public_html` or `www` folder
4. Maintain folder structure

## ✅ After Upload

### 1. Check PHPMailer
- Verify `api/vendor/PHPMailer/` contains 3 files
- If missing, use download script or upload manually

### 2. Set Permissions
```bash
# Folders
chmod 755 api/
chmod 755 api/vendor/
chmod 755 api/vendor/PHPMailer/
chmod 755 assets/
chmod 755 assets/js/
chmod 755 assets/css/
chmod 755 assets/images/

# Files
chmod 644 *.html
chmod 644 api/*.php
chmod 644 api/vendor/PHPMailer/*.php
```

### 3. Create Uploads Folder
```bash
mkdir api/uploads
chmod 755 api/uploads
```

### 4. Test Forms
- Contact Form
- Consultation Form
- Career Application Form

## 🔧 Server Requirements

- PHP 7.4 or higher
- PHP `mail()` function OR PHPMailer
- File upload enabled
- `upload_max_filesize` ≥ 10M
- `post_max_size` ≥ 12M

## 📧 Email Configuration

Already configured in code:
- **SMTP Host:** server126.yourhosting.nl
- **SMTP Port:** 465
- **SMTP User:** contact@incorvix.nl
- **SMTP Pass:** Sanket#01

No changes needed!

## 🧪 Testing Checklist

- [ ] All HTML pages load correctly
- [ ] Header and footer display
- [ ] Contact form submits
- [ ] Consultation form opens and submits
- [ ] Career form accepts CV and submits
- [ ] Email received at contact@incorvix.nl
- [ ] CV attachments work in emails

## ❓ Troubleshooting

### Forms Not Working?
1. Check `api/` folder permissions (755)
2. Verify PHP files uploaded correctly
3. Check server error logs

### Emails Not Sending?
1. Verify PHPMailer files uploaded
2. Check SMTP credentials
3. Verify port 465 not blocked
4. Check server logs

### CV Not Attaching?
1. Verify `api/uploads/` folder exists (755)
2. Check file permissions
3. Check upload_max_filesize in PHP

---

**Ready to upload! 🚀**

