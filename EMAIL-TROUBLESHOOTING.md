# Email Not Being Received - Troubleshooting Guide

## 🔍 Issue
Emails are not being received at `contact@incorvix.nl` when career form is submitted.

## ✅ Diagnostics Added

### 1. Enhanced Error Logging
- Better error detection and logging
- Shows mail function status
- Logs SMTP/server configuration
- Captures PHP errors

### 2. Test Email Script
- Created `api/test-email.php` to test email functionality
- Can diagnose server email configuration

## 🔧 Common Causes & Solutions

### Issue 1: PHP mail() Not Configured for SMTP
**Problem:** PHP `mail()` uses `sendmail`, not SMTP directly.

**Solution Options:**
1. **Configure PHP to use SMTP** (in `php.ini`):
   ```ini
   [mail function]
   SMTP = server126.yourhosting.nl
   smtp_port = 465
   sendmail_from = contact@incorvix.nl
   ```
   
2. **Use PHPMailer** (Recommended):
   - Install PHPMailer library
   - Update `careers.php` to use PHPMailer with SMTP
   - I can provide updated code

### Issue 2: Server Blocks mail() Function
**Problem:** Some hosting providers disable `mail()` function.

**Check:**
- Logs now show if `mail()` function exists
- Check server error logs

**Solution:** Use PHPMailer with SMTP authentication

### Issue 3: Emails Going to Spam
**Problem:** Email delivered but in spam folder.

**Check:**
- Check spam/junk folder
- Check email server logs
- Verify SPF/DKIM records

### Issue 4: Firewall/Security Blocking
**Problem:** Server firewall blocking email ports.

**Check:**
- Port 465 should be open for SMTP
- Port 587 alternative for TLS

## 🧪 Testing Steps

### Step 1: Test Email Function
1. Open browser: `https://yourdomain.com/api/test-email.php`
2. You'll see diagnostics
3. Send POST request to test actual email sending

### Step 2: Check Server Logs
1. Look for error messages starting with "Career Form Error:"
2. Check PHP error logs
3. Look for mail-related errors

### Step 3: Check Response
When form is submitted, response includes:
```json
{
  "success": false,
  "error": "...",
  "debug": {
    "mail_function": "available/not available",
    "mail_error": "...",
    "smtp_server": "...",
    ...
  }
}
```

## 🚀 Recommended Solution: Use PHPMailer

PHP `mail()` function often doesn't work with custom SMTP. PHPMailer is the best solution:

### Option 1: I Update Code to Use PHPMailer
- Install PHPMailer on server
- I'll update `careers.php` to use SMTP
- No other changes needed

### Option 2: Configure PHP mail() for SMTP
- Edit `php.ini` (if you have access)
- Configure SMTP settings
- Restart web server

### Option 3: Contact Hosting Provider
- Ask them to configure PHP mail for your SMTP
- Provide them:
  - SMTP: server126.yourhosting.nl
  - Port: 465
  - Username: contact@incorvix.nl

## 📊 Current Status

The code now:
- ✅ Better error detection
- ✅ Detailed logging
- ✅ Diagnostic information in responses
- ⚠️ Still uses PHP mail() (may need PHPMailer)

## 🎯 Next Steps

1. **Check form response** - Look for debug info
2. **Check server logs** - See error messages
3. **Test email script** - Run `api/test-email.php`
4. **Decide on solution** - PHPMailer or PHP configuration

---

**I can update the code to use PHPMailer if you install it on the server!**

