# PHPMailer Setup Instructions

## Why PHPMailer?

PHP's basic `mail()` function might not work with your custom SMTP server (server126.yourhosting.nl). PHPMailer provides proper SMTP support.

## Setup Steps:

### Option 1: Download PHPMailer (Easiest)

1. Download PHPMailer from: https://github.com/PHPMailer/PHPMailer
2. Extract and upload `PHPMailer` folder to your server
3. Place it in: `production-ready/api/vendor/PHPMailer/`

Or use Composer:
```bash
composer require phpmailer/phpmailer
```

### Option 2: Manual Files

Upload these files to `api/vendor/PHPMailer/`:
- src/PHPMailer.php
- src/SMTP.php
- src/Exception.php

---

## Current Status

**Basic PHP scripts are created:**
- ✅ `api/contact.php` - Uses PHP mail() function
- ✅ `api/consultation.php` - Uses PHP mail() function

**These will work IF:**
- Your server has PHP mail() properly configured
- Server allows sending emails

**If they don't work, you need PHPMailer.**

---

## Testing

After uploading PHP files, test by:
1. Fill out the contact form
2. Check browser console for errors
3. Check email inbox (contact@incorvix.nl)
4. Check server error logs if available

---

## Next Steps

1. **Test current PHP scripts first** - They might work!
2. **If errors occur** - Install PHPMailer and I'll update the scripts
3. **Alternative** - Use backend Node.js server (already configured)

