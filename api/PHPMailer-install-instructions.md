# PHPMailer Installation Instructions

## Automatic Installation (If server has ZipArchive)

1. Upload `download-phpmailer.php` to your server
2. Run via browser: `https://yourdomain.com/api/download-phpmailer.php`
3. Or run via command line: `php download-phpmailer.php`

## Manual Installation (Recommended)

### Option 1: Direct Download

1. Visit: https://github.com/PHPMailer/PHPMailer
2. Click "Code" → "Download ZIP"
3. Extract the ZIP file
4. Copy these files from `PHPMailer-master/src/`:
   - `PHPMailer.php`
   - `SMTP.php`
   - `Exception.php`
5. Paste them to: `api/vendor/PHPMailer/`

### Option 2: Composer (If available)

```bash
cd api
composer require phpmailer/phpmailer
```

## File Structure Should Be:

```
api/
├── vendor/
│   └── PHPMailer/
│       ├── PHPMailer.php
│       ├── SMTP.php
│       └── Exception.php
├── careers.php (updated to use PHPMailer)
└── ...
```

## After Installation

The `careers.php` file has been updated to automatically detect and use PHPMailer if available.

## Verify Installation

After uploading files, test by submitting the career form. Check server logs for:
- "Using PHPMailer for email sending" (success)
- "PHPMailer not found, using PHP mail()" (fallback)

