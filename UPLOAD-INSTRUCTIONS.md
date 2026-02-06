# 🚀 Complete Server Upload Instructions - Incorvix Website

## ✅ Folder is Production Ready!

This folder contains **everything** needed for your website. Just follow these steps:

---

## 📦 STEP 1: Upload to Server

### Option A: Using FTP/SFTP Client (FileZilla, WinSCP, etc.)
1. Connect to your server via FTP/SFTP
2. Navigate to your **root directory** (usually `public_html`, `www`, or `html`)
3. Upload **ALL contents** of this `production-ready` folder
4. **Important:** Upload files directly to root, not in a subfolder

### Option B: Using cPanel File Manager
1. Login to cPanel
2. Open **File Manager**
3. Navigate to `public_html` (or your root directory)
4. Upload the zip file of this folder
5. Extract the zip file
6. Move all files from extracted folder to root (if needed)

### Folder Structure After Upload:
```
public_html/ (or www/)
├── index.html
├── about.html
├── services.html
├── careers.html
├── contact.html
├── ... (all HTML files)
├── api/
│   ├── careers.php
│   ├── contact.php
│   ├── consultation.php
│   └── uploads/ (already created)
├── assets/
├── includes/
├── seo/
├── .htaccess
├── robots.txt
└── sitemap.xml
```

---

## 📋 STEP 2: Set File Permissions

### Using cPanel File Manager:
1. Select `api/uploads/` folder
2. Right-click → **Change Permissions** (or **CHMOD**)
3. Set to: **755** (folders) or **0755**

### Using FTP Client:
1. Right-click on `api/uploads/` folder
2. Select **File Permissions** or **CHMOD**
3. Enter: **755**
4. Check "Recurse into subdirectories" if option available

### Required Permissions:
- **Folders:** `755` (drwxr-xr-x)
- **PHP Files:** `644` (-rw-r--r--)
- **HTML Files:** `644` (-rw-r--r--)
- **api/uploads/:** `755` (must be writable)

---

## 📧 STEP 3: Install PHPMailer (Required for Email)

PHPMailer is needed for sending emails with attachments.

### Method 1: Download After Upload (Easiest)
1. After uploading, visit this URL in your browser:
   ```
   https://yourdomain.com/api/download-phpmailer-simple.php
   ```
2. It will automatically download and install PHPMailer
3. Wait for success message

### Method 2: Manual Installation
1. Download PHPMailer from: https://github.com/PHPMailer/PHPMailer/releases
2. Download the latest **ZIP** file
3. Extract and go to: `PHPMailer/src/`
4. Copy these 3 files:
   - `PHPMailer.php`
   - `SMTP.php`
   - `Exception.php`
5. Upload to: `api/vendor/PHPMailer/` folder on your server

### Verify Installation:
Visit: `https://yourdomain.com/api/test-email.php`
- If you see "PHPMailer loaded successfully" → ✅ Ready!
- If you see "PHPMailer not found" → Need to install

---

## ✅ STEP 4: Verify Setup

### Check These:
- [ ] All files uploaded to server root
- [ ] `api/uploads/` folder exists and permissions are 755
- [ ] PHPMailer files installed in `api/vendor/PHPMailer/`
- [ ] `.htaccess` file is present
- [ ] File permissions set correctly

### Test Your Website:
1. **Homepage:** `https://yourdomain.com`
2. **Contact Form:** Fill and submit → Check email
3. **Get Started Form:** Open modal, fill and submit → Check email
4. **Career Form:** 
   - Fill all fields
   - Upload PDF/DOC CV
   - Submit → Check email (should have CV attachment)

---

## 🔧 STEP 5: Configure Email (If Not Working)

### Current SMTP Settings (Already Configured):
- **Host:** server126.yourhosting.nl
- **Port:** 465
- **Security:** SSL
- **Username:** contact@incorvix.nl
- **Password:** Sanket#01

### If Emails Not Sending:
1. Check server error logs in cPanel
2. Verify SMTP credentials are correct
3. Test using: `https://yourdomain.com/api/test-email.php`

---

## 📝 Important Files:

### Core Files:
- ✅ All HTML pages (9 pages)
- ✅ `api/careers.php` - Career form with CV attachment
- ✅ `api/contact.php` - Contact form
- ✅ `api/consultation.php` - Get Started form
- ✅ `assets/js/form-handlers.js` - Form handling
- ✅ `.htaccess` - Clean URLs (no .html extension)

### Configuration:
- ✅ `sitemap.xml` - SEO sitemap
- ✅ `robots.txt` - Search engine instructions
- ✅ `api/uploads/.htaccess` - Protects uploaded files

### SEO Files:
- ✅ All meta JSON files in `seo/` folder

---

## 🎯 Expected Behavior After Upload:

### ✅ Working Features:
1. **Clean URLs:** `/about` (not `/about.html`)
2. **All Forms:** Send emails successfully
3. **CV Attachment:** PDF/DOC files attach to emails
4. **Responsive Design:** Works on mobile/tablet/desktop
5. **SEO Ready:** Meta tags and structured data

### ✅ Email Features:
1. Contact form → Sends email to contact@incorvix.nl
2. Consultation form → Sends email + auto-reply
3. Career form → Sends email with CV attachment + auto-reply

---

## 🆘 Troubleshooting:

### Problem: Forms not submitting
- **Check:** PHP is enabled on server
- **Check:** File permissions (644 for PHP files)

### Problem: CV not attaching
- **Check:** `api/uploads/` folder exists and is writable (755)
- **Check:** PHPMailer is installed correctly
- **Check:** Server error logs for details

### Problem: Emails not sending
- **Check:** PHPMailer is installed
- **Check:** SMTP credentials in `api/careers.php`, `api/contact.php`, `api/consultation.php`
- **Check:** Server allows outgoing SMTP connections
- **Check:** Firewall is not blocking port 465

### Problem: Clean URLs not working
- **Check:** `.htaccess` file is present
- **Check:** Apache mod_rewrite is enabled
- **Check:** Server supports `.htaccess` files

---

## 📞 Support:

All code is production-ready and tested. If you encounter issues:
1. Check server error logs
2. Verify file permissions
3. Ensure PHPMailer is installed
4. Test individual components using test files:
   - `api/test-email.php` - Test email
   - `api/test-careers.php` - Test API endpoint
   - `test-form.html` - Test form submission

---

## ✅ Final Checklist Before Going Live:

- [ ] All files uploaded
- [ ] File permissions set (folders: 755, files: 644)
- [ ] `api/uploads/` folder created (755 permissions)
- [ ] PHPMailer installed and verified
- [ ] Tested contact form
- [ ] Tested consultation form
- [ ] Tested career form with CV upload
- [ ] Verified emails are received
- [ ] Verified CV attachments work
- [ ] Clean URLs working (no .html in address bar)
- [ ] Website loads correctly
- [ ] Mobile responsive working

---

**🎉 Your website is ready! Just upload and follow these steps.**

**Last Updated:** Production-ready with CV attachment fix

