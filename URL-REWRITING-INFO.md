# URL Rewriting Setup - Clean URLs (No .html Extension)

## ✅ Configuration Complete!

Your website is now configured to use clean URLs without `.html` extensions.

### How It Works:

**Before:** `https://incorvix.com/about.html`  
**After:** `https://incorvix.com/about` ✨

### Files Created:

1. **`.htaccess`** - For Apache servers (most common)
2. **`web.config`** - For IIS/Windows servers

### What's Configured:

1. ✅ **URL Rewriting** - Automatically adds `.html` to clean URLs
2. ✅ **Clean Links** - All internal links updated to use clean URLs
3. ✅ **Index Redirect** - Redirects `/index.html` to `/`
4. ✅ **Security Headers** - X-Content-Type-Options, X-Frame-Options, etc.
5. ✅ **Compression** - Gzip compression enabled
6. ✅ **Caching** - Browser caching for images and assets

### Server Requirements:

**For Apache (.htaccess):**
- `mod_rewrite` module must be enabled
- `.htaccess` files must be allowed
- Usually enabled by default on most hosting

**For IIS (web.config):**
- URL Rewrite module must be installed
- `.config` files must be allowed

### Testing:

After upload:
1. Visit `https://yourdomain.com/about` - Should load `about.html`
2. Visit `https://yourdomain.com/` - Should load `index.html`
3. All internal links should work with clean URLs

### Updated Links:

All links in header and footer now use clean URLs:
- `/` - Homepage
- `/about` - About page
- `/services` - Services page
- `/industry` - Industry page
- `/contact` - Contact page
- `/careers` - Careers page
- `/privacy-policy` - Privacy Policy
- `/terms-of-service` - Terms of Service
- `/cookie-policy` - Cookie Policy

### Backup:

If URL rewriting doesn't work on your server:
- The actual files still have `.html` extensions
- Server will serve them with or without rewriting
- Links can work both ways during transition

### Note:

- Physical files still named: `about.html`, `services.html`, etc.
- Server rewrites clean URLs to find the `.html` files
- No need to rename physical files!

