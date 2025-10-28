# Hosting Guide for Kanasu Design & Construction Website

This guide explains how to host your static website (HTML, CSS, JS) with a Supabase backend, using both **free** and **paid** hosting platforms. It covers deployment, custom domain setup, SSL, and Supabase integration.

---

## Project Stack
- **Frontend:** HTML, CSS, JavaScript (ESM)
- **Backend:** Supabase (PostgreSQL, REST, Realtime)
- **No server-side code** (static site)

---

## Free Hosting Options

| Platform           | Features                              | Limitations                        |
|--------------------|---------------------------------------|------------------------------------|
| **GitHub Pages**   | Free, easy, versioned, custom domain  | No serverless functions, 1GB repo, 100GB/month bandwidth |
| **Netlify**        | Free SSL, CI/CD, custom domain, env vars | 100GB bandwidth/month, 300 build min/month |
| **Vercel**         | Free SSL, CI/CD, custom domain, env vars | 100GB bandwidth/month, 100 deployments/day |
| **Cloudflare Pages** | Free SSL, custom domain, fast CDN    | 500 builds/month, 100 custom domains |

### 1. GitHub Pages
**Best for:** Simple static sites, no build step

**Steps:**
1. Push your project to a public GitHub repo.
2. Go to repo Settings > Pages > Source: select `main` branch and `/ (root)`.
3. Your site will be live at `https://<username>.github.io/<repo>/`.
4. For a custom domain: Add your domain in Pages settings, update DNS with a CNAME to `<username>.github.io`.
5. **SSL:** Automatic via GitHub.

**Supabase:** Set your Supabase URL and anon key in your JS (use `.env` for local dev, but for static hosting, you may need to expose these in the code or use Netlify/Vercel for env vars).

---

### 2. Netlify
**Best for:** Static sites with build step, easy custom domains, env vars

**Steps:**
1. Sign up at [Netlify](https://netlify.com) and connect your GitHub repo.
2. Set build command to `None` (for pure static) or `npm run build` if using a bundler.
3. Set `publish directory` to your project root.
4. Add environment variables (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`) in Site Settings > Environment.
5. Deploy. Your site will be live at `https://<sitename>.netlify.app`.
6. For a custom domain: Add your domain in Netlify, update DNS with CNAME/A records as instructed.
7. **SSL:** Automatic via Netlify.

---

### 3. Vercel
**Best for:** Modern static sites, fast global CDN, preview deploys

**Steps:**
1. Sign up at [Vercel](https://vercel.com) and import your GitHub repo.
2. Set framework to `Other` (for static), or use a build step if needed.
3. Add env vars (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`) in Project Settings > Environment Variables.
4. Deploy. Your site will be live at `https://<project>.vercel.app`.
5. For a custom domain: Add your domain in Vercel, update DNS as instructed.
6. **SSL:** Automatic via Vercel.

---

### 4. Cloudflare Pages
**Best for:** Fastest global CDN, privacy, custom domains

**Steps:**
1. Sign up at [Cloudflare Pages](https://pages.cloudflare.com/), connect your GitHub repo.
2. Set build command to `None` (for static) or as needed.
3. Set output directory to `/`.
4. Add env vars in Project Settings.
5. Deploy. Your site will be live at `https://<project>.pages.dev`.
6. For a custom domain: Add your domain in Cloudflare, update DNS as instructed.
7. **SSL:** Automatic via Cloudflare.

---

## Paid Hosting Options

| Platform         | Features                                 | Limitations/Notes                  |
|------------------|------------------------------------------|------------------------------------|
| **Hostinger**    | Shared/Cloud, free SSL, email, support   | Paid, storage/bandwidth tiers      |
| **Bluehost**     | Shared/WordPress, free SSL, email        | Paid, storage/bandwidth tiers      |
| **GoDaddy**      | Shared, free SSL, email, support         | Paid, storage/bandwidth tiers      |
| **DigitalOcean** | Cloud VMs, object storage, scalable      | Paid, more setup, no free tier     |
| **AWS S3+CF**    | Static hosting, global CDN, scalable     | Paid, complex setup, pay-as-you-go |

### Example: Hostinger
1. Buy a plan and domain (or use your own domain).
2. Upload your site files via File Manager or FTP.
3. Set up SSL (usually 1-click in dashboard).
4. For custom domain: Use Hostinger DNS or point your domain to Hostinger nameservers.
5. **Supabase:** Expose env vars in your JS or use a build tool to inject them.

### Example: AWS S3 + CloudFront
1. Create an S3 bucket, enable static website hosting.
2. Upload your site files.
3. Set up CloudFront for CDN and SSL (via ACM).
4. Point your domain to CloudFront distribution.
5. **Supabase:** Expose env vars in your JS or use a build tool to inject them.

---

## Supabase Integration
- **Frontend-only:** You must expose your Supabase URL and anon key in the frontend (these are safe for public use, but restrict DB rules in Supabase).
- **CORS:** Make sure your Supabase project allows requests from your domain (set in Supabase dashboard > Auth > URL Configuration).
- **Env Vars:** Use Netlify/Vercel/Cloudflare for secure env vars, or inject at build time.

---

## SSL Setup
- All recommended platforms provide free SSL automatically with custom domains.
- For manual setups (e.g., DigitalOcean, AWS), use Let's Encrypt or ACM.

---

## Recommendation

### **Best Option: Netlify or Vercel**
- **Why:**
  - Free for most static sites
  - Easy custom domain and SSL
  - Built-in CI/CD from GitHub
  - Supports environment variables for Supabase
  - Fast global CDN
- **When to upgrade:** If you exceed free tier bandwidth or need advanced features, upgrade to a paid plan or move to AWS S3/CloudFront.

---

## Quick Start: Netlify Example
1. Push your code to GitHub.
2. Sign up at [Netlify](https://netlify.com), connect your repo.
3. Set publish directory to `/` (root).
4. Add env vars for Supabase in Site Settings.
5. Deploy and add your custom domain.
6. Enjoy free SSL and global CDN!

---

For any questions or advanced deployment (CI/CD, custom build, etc.), consult the platform docs or ask your DevOps engineer. 