# 🎯 START HERE - Server Upload Guide

## 📦 Your Upload Package

The **`production-ready`** folder is your complete server upload package. Upload everything in this folder to your web server.

---

## ⚠️ CRITICAL: PHPMailer Installation Required

**Before or after uploading**, you MUST download PHPMailer files:

### Quick Download Steps:
1. Go to: **https://github.com/PHPMailer/PHPMailer**
2. Click **"Code"** → **"Download ZIP"**
3. Extract ZIP file
4. Navigate to: `PHPMailer-master/src/`
5. Copy these **3 files:**
   - ✅ `PHPMailer.php`
   - ✅ `SMTP.php`
   - ✅ `Exception.php`
6. Paste into: `api/vendor/PHPMailer/` folder on server

**OR** after uploading, visit: `https://yourdomain.com/api/download-phpmailer-simple.php`

---

## 📤 Upload Process

### Step 1: Connect to Server
- Use **FTP client** (FileZilla, WinSCP) OR
- Use **cPanel File Manager**

### Step 2: Upload Everything
Upload ALL contents of `production-ready` folder to:
- **Shared hosting:** `public_html/` or `www/`
- **VPS/Dedicated:** `/var/www/html/` or your web root

### Step 3: Maintain Structure
Keep the exact folder structure:
```
your-server-root/
├── index.html
├── about.html
├── [... all HTML files]
├── api/
│   ├── careers.php
│   ├── contact.php
│   ├── consultation.php
│   └── vendor/PHPMailer/
│       └── [PHPMailer files here]
├── assets/
│   ├── css/
│   ├── js/
│   └── images/
├── includes/
│   ├── header.html
│   ├── footer.html
│   └── consultation-modal.html
└── seo/
    └── [JSON files]
```

### Step 4: Set Permissions
```bash
# Folders: 755
chmod 755 api/
chmod 755 api/vendor/
chmod 755 api/vendor/PHPMailer/
chmod 755 assets/
chmod 755 includes/

# Files: 644
chmod 644 *.html
chmod 644 api/*.php
```

### Step 5: Create Uploads Folder
```bash
mkdir api/uploads
chmod 755 api/uploads
```

---

## ✅ Post-Upload Checklist

- [ ] All files uploaded successfully
- [ ] PHPMailer 3 files in `api/vendor/PHPMailer/`
- [ ] Created `api/uploads/` folder
- [ ] Set correct file permissions
- [ ] Website loads at domain
- [ ] Test contact form
- [ ] Test consultation form
- [ ] Test career form with CV upload
- [ ] Verify email received at contact@incorvix.nl

---

## 🧪 Quick Tests

### Test 1: Website Loads
Visit: `https://yourdomain.com`

### Test 2: Forms Work
- Submit contact form
- Open consultation modal
- Submit career application

### Test 3: Email Delivery
- Check inbox at `contact@incorvix.nl`
- CV should be attached

### Test 4: PHPMailer
Visit: `https://yourdomain.com/api/test-email.php`

---

## 📁 What's Included

✅ **9 HTML Pages** - Complete website  
✅ **API Endpoints** - 3 PHP form handlers  
✅ **Assets** - CSS, JS, Images (21 files)  
✅ **SEO Files** - 10 JSON files  
✅ **Configuration** - .htaccess, robots.txt, sitemap.xml  
✅ **Components** - Header, footer, modal includes  
⚠️ **PHPMailer** - You must download separately (3 files)

---

## 🚨 Troubleshooting

### Forms Not Working?
- Check `api/` folder permissions (755)
- Verify PHP files uploaded
- Check server error logs

### Emails Not Sending?
- Verify PHPMailer files uploaded
- Check `api/vendor/PHPMailer/` has 3 files
- Test with: `api/test-email.php`

### CV Not Attaching?
- Verify `api/uploads/` exists (755)
- Check file upload permissions
- Verify PHP upload_max_filesize

---

## 📞 Support Files

- `README.md` - Detailed documentation
- `UPLOAD-TO-SERVER.md` - Complete upload guide
- `api/INSTALL-PHPMailer.md` - PHPMailer setup
- `EMAIL-TROUBLESHOOTING.md` - Email issues

---

## ✨ You're Ready!

Everything is configured:
- ✅ SMTP settings already in code
- ✅ Forms ready to work
- ✅ CV attachment configured
- ✅ Clean URLs enabled

**Just upload and add PHPMailer files!** 🚀

