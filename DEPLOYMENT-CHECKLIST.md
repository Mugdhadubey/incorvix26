# ✅ Deployment Checklist - Sendmail.php Form

## Pre-Deployment Checks

### 1. Files Present
- [x] ✅ `sendmail.php` exists in root directory
- [x] ✅ `careers.html` updated with correct form action
- [x] ✅ `uploads/` folder exists
- [x] ✅ `uploads/.htaccess` created (security)
- [x] ✅ `uploads/index.html` created (prevents directory listing)

### 2. Form Configuration (`careers.html`)
- [x] ✅ `action="sendmail.php"`
- [x] ✅ `method="POST"`
- [x] ✅ `enctype="multipart/form-data"`
- [x] ✅ Form fields: `name`, `email`, `position`, `cv`
- [x] ✅ No JavaScript `onsubmit` handler blocking form

### 3. PHP Configuration (`sendmail.php`)
- [x] ✅ Recipient email: `contact@incorvix.nl`
- [x] ✅ From email: `noreply@incorvix.com`
- [x] ✅ File validation: PDF and DOC only
- [x] ✅ File size limit: 10MB max
- [x] ✅ Temporary file storage in `/uploads/`
- [x] ✅ File cleanup after sending
- [x] ✅ Proper MIME boundaries
- [x] ✅ Base64 encoding for attachments
- [x] ✅ Success message: "Your application has been submitted successfully."
- [x] ✅ Error message: "Something went wrong. Please try again later."

## Server Upload Instructions

### Step 1: Upload Files
```
Upload to server root:
├── sendmail.php
├── careers.html
├── uploads/
│   ├── .htaccess
│   └── index.html
└── (all other website files)
```

### Step 2: Set Folder Permissions
```bash
# Via FTP/File Manager:
uploads/ folder → 755 or 777 (writable)

# Via SSH (if available):
chmod 755 uploads/
chmod 644 sendmail.php
chmod 644 careers.html
```

### Step 3: Test Form Submission
1. Go to careers page
2. Fill out form:
   - Name: Test Name
   - Email: test@example.com
   - Position: Select any position
   - CV: Upload a PDF file (small size for testing)
3. Submit form
4. Verify:
   - ✅ Success message appears
   - ✅ Email received at contact@incorvix.nl
   - ✅ CV attachment is downloadable (opens as PDF)
   - ✅ Temporary file deleted from uploads/

## Post-Deployment Verification

### ✅ Working Correctly If:
1. Form submits without errors
2. Success page shows: "Your application has been submitted successfully."
3. Email received with:
   - HTML body with applicant details
   - CV file as downloadable attachment
   - Attachment opens correctly as PDF/DOC
4. No files left in `uploads/` folder after submission

### ❌ Troubleshooting

#### Issue: Form not submitting
**Check:**
- Form action points to `sendmail.php` (not `/api/careers.php`)
- No JavaScript errors in browser console
- Form has `enctype="multipart/form-data"`

#### Issue: Email not sending
**Check:**
- PHP `mail()` function enabled on server
- Server allows mail sending
- Check PHP error logs

#### Issue: CV attachment not working
**Check:**
- `uploads/` folder has write permissions (755 or 777)
- File size under 10MB
- File is PDF or DOC format
- Check email in different email clients (Gmail, Outlook)

#### Issue: "Something went wrong" error
**Check:**
- PHP error logs
- File permissions on uploads folder
- PHP mail() function enabled
- Check form field names match: `name`, `email`, `position`, `cv`

## Security Notes

✅ **Security Measures Implemented:**
- File type validation (PDF/DOC only)
- File size limit (10MB)
- Temporary files auto-deleted
- `.htaccess` prevents direct file access
- Input sanitization with `htmlspecialchars()`

## File Structure on Server

```
your-domain.com/
├── sendmail.php          ← Form processor
├── careers.html          ← Application form
├── uploads/              ← Temporary file storage
│   ├── .htaccess        ← Security (deny direct access)
│   └── index.html       ← Prevent directory listing
└── [other website files]
```

## Quick Test Script (Optional)

Create `test-form.html` to test:
```html
<form action="sendmail.php" method="POST" enctype="multipart/form-data">
    <input type="text" name="name" placeholder="Name" required>
    <input type="email" name="email" placeholder="Email" required>
    <select name="position" required>
        <option value="sap-consultant">SAP Consultant</option>
    </select>
    <input type="file" name="cv" accept=".pdf,.doc" required>
    <button type="submit">Test Submit</button>
</form>
```

## ✅ Checklist Complete!

All files are ready for deployment. Upload to server and test!

