# Career Form Network Error - Troubleshooting Guide

## 🔍 Issue
Network error when submitting "Apply for a Position" form on careers page.

## ✅ Fixes Applied

### 1. Enhanced Error Handling
- Added detailed console logging
- Better error messages
- Response debugging

### 2. PHP Script Improvements
- Added OPTIONS handler for CORS preflight
- Added error logging
- Better file upload handling
- Debug information in error responses

### 3. File Upload Configuration
- Created `.htaccess` in `api/` folder with upload settings
- Max file size: 10MB
- POST max size: 12MB

## 🧪 How to Debug

### Step 1: Check Browser Console
1. Open browser Developer Tools (F12)
2. Go to Console tab
3. Submit the form
4. Look for error messages with details

### Step 2: Check Network Tab
1. Open Developer Tools (F12)
2. Go to Network tab
3. Submit the form
4. Click on the `/api/careers.php` request
5. Check:
   - Status code (should be 200)
   - Response tab (see what server returned)
   - Headers tab (check Content-Type)

### Step 3: Check Server Logs
Check PHP error logs for:
- `Career Form Error: ...` messages
- File upload errors
- Email sending errors

## 🔧 Common Issues & Solutions

### Issue 1: 404 Not Found
**Problem:** `/api/careers.php` file not found
**Solution:**
- Verify `api/careers.php` exists on server
- Check file permissions (644)
- Verify path is correct

### Issue 2: PHP Not Processing
**Problem:** Server returns HTML or plain text instead of JSON
**Solution:**
- Ensure PHP is enabled
- Check `.htaccess` rules
- Verify file extension is `.php`

### Issue 3: File Upload Too Large
**Problem:** CV file exceeds size limit
**Solution:**
- Check `upload_max_filesize` in PHP settings
- Reduce file size
- Or update `.htaccess` settings

### Issue 4: CORS Errors
**Problem:** Cross-origin request blocked
**Solution:**
- Check PHP headers (already set in script)
- Verify server allows CORS
- Check browser console for CORS errors

### Issue 5: FormData Not Received
**Problem:** PHP `$_POST` is empty
**Solution:**
- Verify `Content-Type` header (should be multipart/form-data)
- Check PHP `post_max_size` setting
- Verify form encoding

## 📋 Checklist

- [ ] `api/careers.php` exists on server
- [ ] File permissions are correct (644)
- [ ] PHP is enabled on server
- [ ] `.htaccess` in `api/` folder is uploaded
- [ ] Browser console shows form data
- [ ] Network tab shows request going to `/api/careers.php`
- [ ] Server logs accessible

## 🚀 Quick Test

Run this in browser console after submitting:

```javascript
// Check if form handler exists
console.log('handleCareerSubmit:', typeof handleCareerSubmit);

// Test API endpoint directly
fetch('/api/careers.php', {
  method: 'POST',
  body: new FormData()
})
.then(r => r.text())
.then(console.log)
.catch(console.error);
```

## 📞 Next Steps

If error persists:
1. Share browser console errors
2. Share Network tab response
3. Check if other forms (contact, consultation) work
4. Verify PHP mail() function works on server

---

**Files Updated:**
- ✅ `production-ready/assets/js/form-handlers.js` - Enhanced error handling
- ✅ `production-ready/api/careers.php` - Better debugging and error handling
- ✅ `production-ready/api/.htaccess` - File upload configuration

