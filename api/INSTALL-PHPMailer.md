# PHPMailer Installation Guide

## ✅ Code is Ready!

The `careers.php` file has been updated to automatically use PHPMailer if available. It will fall back to PHP mail() if PHPMailer is not installed.

## 📥 Step 1: Download PHPMailer

### Option A: Direct Download (Easiest)

1. Visit: **https://github.com/PHPMailer/PHPMailer**
2. Click green **"Code"** button → **"Download ZIP"**
3. Extract the ZIP file
4. Open the extracted `PHPMailer-master` folder
5. Go to `PHPMailer-master/src/` folder

### Option B: Use Download Script

1. Upload `download-phpmailer.php` to your server
2. Access via browser: `https://yourdomain.com/api/download-phpmailer.php`
3. Or run: `php download-phpmailer.php`

## 📁 Step 2: Upload Files

Copy these **3 files** from `PHPMailer-master/src/`:

- ✅ `PHPMailer.php`
- ✅ `SMTP.php`
- ✅ `Exception.php`

**Upload them to:** `api/vendor/PHPMailer/`

## 📂 Final Structure

Your server should have:

```
api/
├── vendor/
│   └── PHPMailer/
│       ├── PHPMailer.php      ← Upload this
│       ├── SMTP.php          ← Upload this
│       └── Exception.php     ← Upload this
└── careers.php               ← Already updated!
```

## ✅ Step 3: Verify Installation

After uploading files:

1. Submit a test career application
2. Check server logs - you should see:
   - ✅ "Email sent successfully via PHPMailer" (if PHPMailer works)
   - ⚠️ "PHPMailer not available, using PHP mail()" (fallback)

## 🔧 SMTP Settings (Already Configured)

The code uses these SMTP settings:
- **Host:** server126.yourhosting.nl
- **Port:** 465
- **Security:** SSL
- **Username:** contact@incorvix.nl
- **Password:** Sanket#01

These are already set in the code - no changes needed!

## 🧪 Testing

1. Upload PHPMailer files
2. Submit career form
3. Check email at `contact@incorvix.nl`
4. CV should be attached!

## ❓ Troubleshooting

If emails still don't work:

1. Check file permissions (644 for files, 755 for folders)
2. Verify all 3 PHPMailer files are in correct location
3. Check server error logs
4. Ensure SMTP credentials are correct
5. Verify port 465 is not blocked by firewall

---

**After installation, the system will automatically use PHPMailer! 🚀**

