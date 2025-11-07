# Custom Domain Setup Guide

Your site is now configured to work with a custom domain: **blog.ruchkar-vadval.com**

## ✅ Configuration Complete

The following changes have been made:
- ✅ Base path set to `/` (root) for custom domain
- ✅ CNAME file created with `blog.ruchkar-vadval.com`
- ✅ 404.html configured for root domain (segmentCount = 0)
- ✅ GitHub Actions workflow updated

## 📋 DNS Configuration Steps

To connect your custom domain, you need to configure DNS records:

### Step 1: Add DNS Records

Go to your domain registrar (where you purchased `ruchkar-vadval.com`) and add these DNS records:

**For a subdomain (blog.ruchkar-vadval.com):**
```
Type: CNAME
Name: blog
Value: hruturajvartak.github.io
TTL: 3600 (or default)
```

**OR if your registrar doesn't support CNAME for root/subdomain:**
```
Type: A
Name: blog
Value: 185.199.108.153
TTL: 3600

Type: A
Name: blog
Value: 185.199.109.153
TTL: 3600

Type: A
Name: blog
Value: 185.199.110.153
TTL: 3600

Type: A
Name: blog
Value: 185.199.111.153
TTL: 3600
```

**Note:** GitHub Pages IP addresses may change. Check the latest IPs at: https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site#configuring-a-subdomain

### Step 2: Configure GitHub Pages

1. **Push your code** (the CNAME file will be included in the build)
2. **Go to Repository Settings:**
   - Navigate to: https://github.com/hruturajvartak/ruchkar-vadval-kitchen/settings/pages
3. **Add Custom Domain:**
   - Under "Custom domain", enter: `blog.ruchkar-vadval.com`
   - Click "Save"
   - GitHub will verify the DNS configuration

### Step 3: Enable HTTPS (Automatic)

- GitHub Pages will automatically provision an SSL certificate
- This may take a few minutes to a few hours
- You can check the status in the Pages settings

## 🔄 Alternative: Use Root Domain

If you want to use `ruchkar-vadval.com` (without the `blog` subdomain):

1. Update `public/CNAME` to:
   ```
   ruchkar-vadval.com
   ```

2. Add DNS records:
   ```
   Type: A
   Name: @ (or leave blank for root)
   Value: 185.199.108.153
   
   Type: A
   Name: @
   Value: 185.199.109.153
   
   Type: A
   Name: @
   Value: 185.199.110.153
   
   Type: A
   Name: @
   Value: 185.199.111.153
   ```

## 🧪 Testing

After DNS propagation (can take up to 48 hours, usually much faster):

1. Visit: `https://blog.ruchkar-vadval.com`
2. Check that all routes work (e.g., `/recipes`, `/heritage`)
3. Verify HTTPS is enabled (green padlock)

## 📝 Notes

- **DNS Propagation:** Changes can take 5 minutes to 48 hours
- **HTTPS:** GitHub automatically provisions SSL certificates
- **CNAME File:** The `public/CNAME` file is automatically copied to the build output
- **Base Path:** All assets and routes now use root path (`/`) instead of `/ruchkar-vadval-kitchen/`

## 🆘 Troubleshooting

**Domain not working?**
- Check DNS propagation: https://www.whatsmydns.net/
- Verify CNAME/A records are correct
- Wait for DNS propagation (can take time)

**HTTPS not working?**
- Wait for GitHub to provision the certificate (can take up to 24 hours)
- Check Pages settings for certificate status

**Routes return 404?**
- Ensure 404.html is in the build output
- Check that base path is set to `/` in vite.config.ts

## 🔗 Resources

- [GitHub Pages Custom Domain Docs](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site)
- [DNS Configuration Guide](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site)

