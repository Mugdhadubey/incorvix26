# Network Error Fix - Career Form

## 🔍 Error: "Network error: Please check your connection and try again"

This error appears when the form cannot reach the `api/careers.php` endpoint.

## ✅ Common Causes & Solutions

### 1. PHP File Not Uploaded
**Problem:** `api/careers.php` doesn't exist on server

**Solution:**
- Verify file exists at: `yourdomain.com/api/careers.php`
- Check file was uploaded correctly
- Ensure file permissions are 644

### 2. Wrong File Path
**Problem:** Endpoint path is incorrect

**Check:**
- Open browser console (F12)
- Look for exact endpoint URL in error logs
- Verify it matches your server structure

### 3. PHP Not Enabled
**Problem:** Server doesn't process PHP files

**Solution:**
- Contact hosting provider
- Verify PHP is enabled
- Check `.htaccess` is uploaded

### 4. File Permissions
**Problem:** Server can't execute PHP file

**Solution:**
```bash
chmod 644 api/careers.php
chmod 755 api/
```

### 5. Server Configuration
**Problem:** Server blocking POST requests

**Check:**
- `.htaccess` in `api/` folder
- Server allows POST method
- No firewall blocking

## 🧪 Testing Steps

### Step 1: Check File Exists
Visit directly: `https://yourdomain.com/api/careers.php`

**Expected:** JSON error (Method not allowed) - This means file exists!  
**If 404:** File not uploaded

### Step 2: Check Browser Console
1. Open DevTools (F12)
2. Go to Console tab
3. Submit form
4. Look for detailed error messages

### Step 3: Check Network Tab
1. Open DevTools (F12)
2. Go to Network tab
3. Submit form
4. Click on `careers.php` request
5. Check:
   - Status code (404 = not found, 500 = server error)
   - Response tab (see what server returned)

## 🔧 Quick Fixes

### Fix 1: Verify Upload
- Confirm `api/careers.php` uploaded
- Check file size matches local file
- Verify no upload errors

### Fix 2: Test Endpoint
Create test file `api/test.php`:
```php
<?php
header('Content-Type: application/json');
echo json_encode(['test' => 'success']);
?>
```
Visit: `yourdomain.com/api/test.php`  
If works: PHP is fine, check careers.php  
If fails: PHP not enabled

### Fix 3: Check .htaccess
Ensure `api/.htaccess` is uploaded with:
```
php_value upload_max_filesize 10M
php_value post_max_size 12M
```

## 📊 Enhanced Error Messages

The updated code now shows:
- Exact endpoint URL
- Diagnostic information
- Specific error causes
- Testing suggestions

**Check browser console for detailed error information!**

## 🚀 Next Steps

1. **Check console** - Detailed errors now shown
2. **Verify file exists** - Visit endpoint directly
3. **Check Network tab** - See request/response
4. **Verify permissions** - Files and folders

---

**The error handling has been improved to show exactly what's wrong!**

