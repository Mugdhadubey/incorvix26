# Upload Checklist

Before uploading to your server, verify this checklist:

## ✅ Files Present

### HTML Pages (9 files)
- [x] index.html
- [x] about.html
- [x] services.html
- [x] industry.html
- [x] contact.html
- [x] careers.html
- [x] privacy-policy.html
- [x] terms-of-service.html
- [x] cookie-policy.html

### Essential Files (2 files)
- [x] sitemap.xml
- [x] robots.txt

### Folders
- [x] assets/css/ (1 file: style.css)
- [x] assets/images/ (21 image files)
- [x] assets/js/ (7 JavaScript files)
- [x] includes/ (3 HTML components)
- [x] seo/ (10 JSON files)

### Total: 59 files

## ✅ Files Removed (Clean Production)

- [x] Test files removed (test-header.html)
- [x] Documentation files removed (*.md except README)
- [x] Server scripts removed (*.bat, *.ps1)
- [x] Duplicate files removed (root open-browser.js)
- [x] Development files excluded (client/, server/, dist/, node_modules/)

## 🚀 Upload Steps

1. **Create folder on server** (usually `public_html` or `htdocs`)
2. **Upload all files** maintaining folder structure
3. **Set permissions**:
   - Files: 644
   - Folders: 755
4. **Test the website** after upload
5. **Verify**:
   - All pages load correctly
   - Images display properly
   - Forms work (backend needs to be connected)
   - SEO meta tags are present

## 📝 Post-Upload Tasks

1. Update `sitemap.xml` with your actual domain
2. Update `robots.txt` if needed
3. Verify SEO JSON files have correct URLs
4. Test contact forms (connect backend API)
5. Submit sitemap to Google Search Console

## ⚠️ Important

- Backend API must be running for contact forms to work
- SMTP configuration is on the backend server
- All images are optimized and ready
- SEO tags are automatically injected via seo.js

