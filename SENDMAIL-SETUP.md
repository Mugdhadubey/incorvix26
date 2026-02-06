# Sendmail.php Setup Guide

## ✅ Files Created

1. **`sendmail.php`** - PHP backend that handles form submissions and sends emails

## 📁 File Placement

### Where to Place `sendmail.php`:

Place `sendmail.php` in the **root directory** of your website (same folder as `careers.html`, `index.html`, etc.)

```
your-website/
├── index.html
├── careers.html
├── sendmail.php    ← Place here
├── about.html
└── assets/
```

**Important:** The file must be in the same directory as `careers.html` because the form action is set to `action="sendmail.php"` (relative path).

## 📝 Form Configuration

The form in `careers.html` is already configured correctly:

```html
<form id="career-form" action="sendmail.php" method="POST" enctype="multipart/form-data">
```

### Required Form Fields:
- `name` - Full name (text input)
- `email` - Email address (email input)
- `position` - Position applied for (select/dropdown)
- `cv` - CV file upload (file input)

### Form Attributes Explained:
- `action="sendmail.php"` - Points to the PHP file that processes the form
- `method="POST"` - Sends data via POST method (required for file uploads)
- `enctype="multipart/form-data"` - Required for file uploads to work

## 🔧 How It Works

1. User fills out the form on `careers.html`
2. User clicks "Submit Application"
3. Form data is sent to `sendmail.php`
4. PHP script:
   - Validates all form fields
   - Validates uploaded CV file (PDF or DOC only, max 10MB)
   - Creates email with CV attachment
   - Sends email using PHP `mail()` function
   - Shows success or error message

## ✉️ Email Configuration

### Email Recipient:
- **To:** `contact@incorvix.nl`
- **From:** `noreply@incorvix.com`
- **Reply-To:** User's email address (from form)

### Email Includes:
- Applicant's name
- Applicant's email
- Position applied for
- CV file as attachment (PDF or DOC)

## ✅ Success/Error Messages

### Success Message:
Shows: **"Thank you! Your application has been submitted successfully."**
- Green checkmark icon
- Link back to careers page

### Error Messages:
Shows: **"Something went wrong. Please try again later."**
- Red X icon
- Specific error message
- Link back to careers page

## 🚀 Testing on Hostinger

1. Upload `sendmail.php` to your website root directory
2. Make sure file permissions are set to **644** (readable by web server)
3. Test the form:
   - Fill out all required fields
   - Upload a PDF or DOC file (max 10MB)
   - Click Submit
   - You should see success message
   - Check `contact@incorvix.nl` for the email with CV attachment

## ⚙️ Hostinger Shared Hosting Compatibility

This script is designed specifically for Hostinger shared hosting:
- ✅ Uses PHP `mail()` function (works on all Hostinger plans)
- ✅ No SMTP configuration required
- ✅ No external libraries needed
- ✅ Simple, clean code
- ✅ Proper error handling

## 🔒 Security Features

- Input validation and sanitization
- File type validation (PDF and DOC only)
- File size limit (10MB maximum)
- HTML escaping to prevent XSS attacks
- Secure file handling

## 📋 Requirements

- PHP 7.0 or higher (Hostinger supports PHP 7.0+)
- PHP `mail()` function enabled (enabled by default on Hostinger)
- File upload enabled in PHP (enabled by default on Hostinger)
- `upload_max_filesize` >= 10MB (check in PHP settings)

## 🐛 Troubleshooting

### Email Not Sending:
1. Check PHP error logs in Hostinger control panel
2. Verify `mail()` function is enabled (usually enabled by default)
3. Check spam folder - emails might be filtered

### File Upload Errors:
1. Check `upload_max_filesize` in PHP settings (should be >= 10MB)
2. Verify file is PDF or DOC format
3. Check file size is under 10MB

### Form Not Submitting:
1. Verify `sendmail.php` is in the same directory as `careers.html`
2. Check file permissions (should be 644)
3. Verify form action is set to `action="sendmail.php"`

## 📞 Support

If you encounter issues:
1. Check Hostinger error logs
2. Verify PHP `mail()` function is enabled
3. Test with a simple PHP mail script first
4. Contact Hostinger support if mail() function is disabled

