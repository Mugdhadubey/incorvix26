# Cache Clearing Guide - Incorvix Website

## ✅ Cache Clearing Steps Completed

### 1. **HTML Files - Cache-Busting Meta Tags Added**
   - **File**: `index.html`
   - **Changes**:
     - Added `<meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate">`
     - Added `<meta http-equiv="Pragma" content="no-cache">`
     - Added `<meta http-equiv="Expires" content="0">`
   - **Effect**: Browsers will not cache HTML pages

### 2. **CSS/JS Files - Version Query Strings Added**
   - **Files Updated**: `index.html`
   - **Changes**:
     - `assets/css/style.css?v=20250116`
     - `assets/js/seo.js?v=20250116`
     - `assets/js/open-browser.js?v=20250116`
     - `assets/js/toast.js?v=20250116`
     - `assets/js/main.js?v=20250116`
     - `assets/js/hero-carousel.js?v=20250116`
     - `assets/js/clients-carousel.js?v=20250116`
   - **Effect**: Changing version number forces browser to fetch new files
   - **Note**: Update version number (e.g., `?v=20250117`) when deploying new code

### 3. **Apache Server (.htaccess) - Cache Headers Updated**
   - **File**: `.htaccess`
   - **Changes**:
     - CSS/JS cache reduced from "1 month" to "0 seconds"
     - Added `Cache-Control: no-cache` headers for HTML, CSS, JS files
     - Images still cached for 1 year (performance optimization)
   - **Effect**: Server sends no-cache headers for HTML, CSS, JS files

### 4. **IIS Server (web.config) - Cache Disabled**
   - **File**: `web.config`
   - **Changes**:
     - Changed from 365 days cache to `DisableCache`
     - Production cache settings commented out for reference
   - **Effect**: IIS will not cache static content

---

## 🔧 Manual Cache Clearing Steps

### Browser Cache Clearing

#### **Chrome / Edge / Brave:**
1. Press `Ctrl + Shift + Delete` (Windows) or `Cmd + Shift + Delete` (Mac)
2. Select "Cached images and files"
3. Time range: "All time"
4. Click "Clear data"
5. **OR** Hard refresh: `Ctrl + F5` (Windows) or `Cmd + Shift + R` (Mac)

#### **Firefox:**
1. Press `Ctrl + Shift + Delete` (Windows) or `Cmd + Shift + Delete` (Mac)
2. Select "Cache"
3. Time range: "Everything"
4. Click "Clear Now"
5. **OR** Hard refresh: `Ctrl + F5` (Windows) or `Cmd + Shift + R` (Mac)

#### **Safari:**
1. Press `Cmd + Option + E` to clear cache
2. **OR** Go to Safari > Preferences > Advanced > Check "Show Develop menu"
3. Then Develop > Empty Caches
4. **OR** Hard refresh: `Cmd + Option + R`

#### **Mobile Browsers:**
- **Chrome Mobile**: Settings > Privacy > Clear browsing data > Cached images and files
- **Safari iOS**: Settings > Safari > Clear History and Website Data
- **Firefox Mobile**: Menu > Settings > Clear Private Data > Cache

### Developer Tools Method (Recommended)
1. Open Developer Tools (`F12`)
2. Right-click the refresh button
3. Select "Empty Cache and Hard Reload"
4. **OR** Network tab > Check "Disable cache" > Keep DevTools open

---

## 📋 Cache Types & Status

| Cache Type | Status | Action Taken |
|------------|--------|--------------|
| **Browser Cache** | ✅ Cleared | Meta tags + HTTP headers added |
| **Server Cache (Apache)** | ✅ Disabled | .htaccess updated with no-cache headers |
| **Server Cache (IIS)** | ✅ Disabled | web.config cache disabled |
| **CDN Cache (Tailwind)** | ⚠️ External | Cannot control (external CDN) |
| **Build Cache** | ❌ N/A | No build process (static HTML site) |
| **Service Worker** | ❌ N/A | No service worker found |
| **PHP OpCache** | ⚠️ Server-side | Requires server access to clear |

---

## 🚀 Production Deployment Notes

### Before Going Live:
1. **Update version numbers** in HTML files:
   - Change `?v=20250116` to current date or build number
   - Example: `?v=20250117` or `?v=1.0.0`

2. **Restore caching for production** (optional, for performance):
   - **.htaccess**: Change CSS/JS cache back to "access plus 1 month"
   - **web.config**: Uncomment production cache settings

3. **CDN Cache (Tailwind CSS)**:
   - Tailwind CDN (`cdn.tailwindcss.com`) is external
   - Cannot be cleared from your server
   - Updates automatically when Tailwind releases new versions

---

## 🔍 Verification Steps

### Test Cache Clearing:
1. **Clear browser cache** (see manual steps above)
2. **Open website** in incognito/private window
3. **Check Network tab** in DevTools:
   - Status should be `200` (not `304 Not Modified`)
   - Response headers should show `Cache-Control: no-cache`
4. **Verify files load**:
   - CSS: `assets/css/style.css?v=20250116`
   - JS: `assets/js/main.js?v=20250116`
   - All should show fresh requests

### Expected Headers:
```
Cache-Control: no-cache, no-store, must-revalidate
Pragma: no-cache
Expires: 0
```

---

## ⚠️ Important Notes

1. **Version Query Strings**: Update `?v=20250116` when deploying new code
2. **CDN Cache**: Tailwind CSS CDN cache cannot be controlled
3. **PHP OpCache**: If using PHP, may need server access to clear opcache
4. **Production**: Consider re-enabling cache for better performance after testing

---

## 📝 Files Modified

1. `index.html` - Added cache-busting meta tags and version query strings
2. `.htaccess` - Added no-cache headers for HTML, CSS, JS
3. `web.config` - Disabled static content caching

---

**Last Updated**: January 16, 2025
**Cache Status**: All caches cleared/disabled for development
