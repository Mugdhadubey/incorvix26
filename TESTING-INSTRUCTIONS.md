# Form Testing Instructions

## ✅ What I've Set Up

1. **PHP Email Scripts Created:**
   - `api/contact.php` - Handles contact form submissions
   - `api/consultation.php` - Handles consultation form submissions

2. **JavaScript Updated:**
   - Forms now call PHP endpoints: `/api/contact.php` and `/api/consultation.php`
   - Error handling and toast notifications in place

3. **Test Page Created:**
   - `test-form.html` - Comprehensive testing page

## 🧪 How to Test

### Method 1: Use Test Page (Easiest)

1. Upload all files to your server
2. Open in browser: `https://yourdomain.com/test-form.html`
3. Click test buttons for each form
4. Check results - will show success/error messages

### Method 2: Test Actual Forms

1. **Contact Form:**
   - Go to `/contact` page
   - Fill out the form
   - Submit and check:
     - Browser console (F12) for errors
     - Network tab for API response
     - Email inbox (contact@incorvix.nl)

2. **Consultation Form (Get Started):**
   - Click "Get Started" button
   - Fill out the consultation form
   - Submit and check same as above

### Method 3: Manual API Testing

Open browser console and run:

```javascript
// Test Contact Form
fetch('/api/contact.php', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
        name: 'Test User',
        email: 'test@example.com',
        message: 'Test message'
    })
})
.then(r => r.json())
.then(console.log)
.catch(console.error);

// Test Consultation Form
fetch('/api/consultation.php', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        company: 'Test Co',
        service: 'Strategic SAP Consulting',
        message: 'Test message'
    })
})
.then(r => r.json())
.then(console.log)
.catch(console.error);
```

## 📋 Expected Results

### ✅ Success Response:
```json
{
    "success": true,
    "message": "Thank you for your message! We'll get back to you within 24 hours."
}
```

### ❌ Error Responses:

**If PHP not configured:**
- Network error in console
- 404 or 500 error
- "Failed to send email" message

**If PHP mail() not working:**
- Response shows `success: false`
- Error: "Failed to send email. Please try again later."
- Check server error logs

## 🔍 Troubleshooting

### Issue: "Network error" or 404
**Solution:**
- Verify `api/contact.php` and `api/consultation.php` exist on server
- Check file permissions (should be 644)
- Verify PHP is enabled on server

### Issue: "Failed to send email"
**Possible causes:**
1. PHP mail() not configured on server
2. SMTP restrictions
3. Email server blocking

**Solutions:**
- Check server error logs
- Install PHPMailer (see `api/PHPMailer-setup.md`)
- Use backend Node.js server instead

### Issue: CORS errors
**Solution:**
- PHP scripts have CORS headers enabled
- If still issues, check server configuration

## 📧 Email Verification

After successful form submission:
1. Check `contact@incorvix.nl` inbox
2. Check customer email (for auto-reply)
3. Check spam folder if emails not received

## 🚀 Next Steps Based on Results

### If Tests Pass ✅
- Forms are working!
- Emails should be sent
- Monitor inbox for form submissions

### If Tests Fail ❌
- Check server PHP configuration
- Consider PHPMailer setup (see `api/PHPMailer-setup.md`)
- Or use Node.js backend server (already configured)

---

## Files to Upload for Testing

Make sure these are uploaded:
- ✅ `api/contact.php`
- ✅ `api/consultation.php`
- ✅ `assets/js/form-handlers.js` (updated)
- ✅ `assets/js/main.js` (updated)
- ✅ `test-form.html` (for testing)

---

## Quick Test Checklist

- [ ] Upload all files to server
- [ ] Open `test-form.html` in browser
- [ ] Click "Test Contact Form API" button
- [ ] Check result (should show success or error)
- [ ] Click "Test Consultation Form API" button
- [ ] Check result
- [ ] Verify email received at contact@incorvix.nl
- [ ] Test actual forms on website
- [ ] Check browser console for any errors

---

**Note:** Local testing (file://) won't work - forms need to be on a web server with PHP support.

