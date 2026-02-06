# Form Submission Setup Guide

## ⚠️ Current Issue

The "Get Started" (Consultation) form and Contact form are showing network errors because they're trying to send to backend API endpoints:
- `/api/consultation`
- `/api/contact`

These endpoints require a **running backend server** to process and send emails.

---

## ✅ Solution Options

### Option 1: Use Backend Server (Recommended for Production)

**Requires:**
- Node.js server running
- Backend API endpoints configured
- SMTP settings configured

**Steps:**
1. Upload backend server files to your hosting
2. Configure SMTP in `server/config/email.ts`
3. Start the server (it should run alongside your HTML files)
4. Make sure API routes `/api/consultation` and `/api/contact` are accessible

**Backend Files Needed:**
- `server/` folder
- `package.json` with dependencies
- Node.js environment

---

### Option 2: Use EmailJS (No Backend Required) - Easiest!

EmailJS is a service that sends emails directly from the browser without a backend.

**Steps:**
1. Sign up at https://www.emailjs.com/ (Free tier available)
2. Create email templates
3. Update form handlers to use EmailJS (I can help with this)

**Pros:**
- ✅ No backend needed
- ✅ Works with static hosting
- ✅ Free tier: 200 emails/month
- ✅ Easy setup

**Cons:**
- ⚠️ Client-side (email credentials visible in code - use service account)
- ⚠️ Rate limits on free tier

---

### Option 3: Use PHP Mail Script (Works on Most Hosting)

Create a simple PHP script that handles form submissions.

**Files Needed:**
- `api/contact.php`
- `api/consultation.php`

**Pros:**
- ✅ Works on shared hosting
- ✅ No Node.js required
- ✅ Secure (server-side)

**Cons:**
- ⚠️ Requires PHP support
- ⚠️ Need to configure SMTP in PHP

---

### Option 4: Use Form Submission Service

Services like:
- FormSpree (https://formspree.io/)
- Getform (https://getform.io/)
- Netlify Forms (if using Netlify hosting)

**Pros:**
- ✅ No backend setup
- ✅ Spam protection
- ✅ Easy integration

---

## 🔧 Quick Fix: Update API Endpoints

If your backend is on a different domain or path, update these files:

1. **production-ready/assets/js/main.js** (line ~594)
   - Change: `fetch('/api/consultation'`
   - To: `fetch('https://your-backend-domain.com/api/consultation'`

2. **production-ready/assets/js/form-handlers.js** (line ~21)
   - Change: `fetch('/api/contact'`
   - To: `fetch('https://your-backend-domain.com/api/contact'`

---

## 📧 Current Email Configuration

Your email is configured to use:
- **SMTP Server:** server126.yourhosting.nl
- **Port:** 465
- **Email:** contact@incorvix.nl
- **Password:** Sanket#01

This configuration is in `server/config/email.ts`

---

## 🚀 Recommended Next Steps

1. **If you have backend access:**
   - Make sure backend server is running
   - Verify API endpoints are accessible
   - Check server logs for errors

2. **If you need no-backend solution:**
   - Use EmailJS (I can help set this up)
   - Or use PHP mail scripts (I can create these)

3. **Test the endpoints:**
   - Open browser console
   - Submit a form
   - Check the network tab for the failed request
   - See the exact error message

---

## 🛠️ Need Help?

Tell me which solution you prefer, and I'll help you implement it!

- Option 1: Backend server setup
- Option 2: EmailJS integration (no backend)
- Option 3: PHP mail scripts
- Option 4: Form service integration

