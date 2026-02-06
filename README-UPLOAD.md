# 🚀 Server Upload Package - Incorvix Website

## 📦 What's Included

This folder contains everything you need to upload to your web server.

## ⚠️ IMPORTANT: Before Uploading

### Download PHPMailer Files First!

1. **Visit:** https://github.com/PHPMailer/PHPMailer
2. **Click:** "Code" → "Download ZIP"
3. **Extract** the ZIP file
4. **Go to:** `PHPMailer-master/src/`
5. **Copy these 3 files:**
   - `PHPMailer.php`
   - `SMTP.php`
   - `Exception.php`
6. **Paste to:** `api/vendor/PHPMailer/` (create folder if needed)

**OR** after uploading, visit: `https://yourdomain.com/api/download-phpmailer-simple.php`

## 📤 Upload Instructions

### Quick Upload:
1. Upload **ALL files and folders** to your server root
2. Maintain the folder structure exactly as shown
3. Set proper file permissions (see below)

### File Permissions:
- **Folders:** 755
- **PHP files:** 644
- **HTML files:** 644
- **Image files:** 644

## 📁 What Gets Uploaded:

```
✅ HTML pages (9 files)
✅ Assets (CSS, JS, Images)
✅ API endpoints (3 PHP files)
✅ SEO files (JSON)
✅ Configuration (.htaccess, robots.txt, sitemap.xml)
✅ Includes (header, footer, modal)
⚠️ PHPMailer files (YOU MUST DOWNLOAD - see above)
```

## ✅ After Upload Checklist:

- [ ] All files uploaded
- [ ] PHPMailer files added to `api/vendor/PHPMailer/`
- [ ] Created `api/uploads/` folder (chmod 755)
- [ ] File permissions set correctly
- [ ] Test website loads
- [ ] Test contact form
- [ ] Test consultation form
- [ ] Test career form with CV
- [ ] Verify emails received

## 🎯 Expected Result:

Once uploaded and PHPMailer installed:
- ✅ Website fully functional
- ✅ All forms working
- ✅ Emails sending via SMTP
- ✅ CV attachments working
- ✅ Clean URLs (no .html extension)

---

**Everything is ready except PHPMailer files which you need to download manually!**

