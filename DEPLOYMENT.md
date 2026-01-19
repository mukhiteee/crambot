# CramBot - Deployment Guide

Complete guide to deploy CramBot to production with secure API key handling.

## ✅ Pre-Deployment Checklist

- [ ] Remove all hardcoded API keys
- [ ] Update domain references in index.html
- [ ] Test all export functionality
- [ ] Test on mobile devices
- [ ] Set up CORS policy for API calls
- [ ] Add SSL/HTTPS certificate
- [ ] Test blog functionality
- [ ] Verify all external libraries load
- [ ] Set up analytics (optional)
- [ ] Configure security headers

## 🔐 API Key Security

### ❌ DON'T DO THIS

```javascript
// NEVER commit API keys to version control
const API_KEY = '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';

// NEVER expose keys in client-side code
window.apiKey = 'gsk_xxxx'; // ❌ Wrong!
```

### ✅ DO THIS INSTEAD

**Option 1: Backend Proxy (Recommended)**

Create a simple backend endpoint that proxies requests:

```javascript
// On your server (Node.js example)
app.post('/api/generate-timetable', async (req, res) => {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(req.body)
    });
    
    const data = await response.json();
    res.json(data);
});
```

**Option 2: Environment Variables (Vercel/Netlify)**

Platform handles injection at build time:

```bash
# In platform dashboard
GROQ_API_KEY = sk_live_xxxxx
```

**Option 3: Secure Config Endpoint**

Fetch config on app load:

```javascript
// In config.js
async function loadConfiguration() {
    const response = await fetch('/api/config', {
        method: 'GET',
        headers: { 'Authorization': 'Bearer your-secret-token' }
    });
    const config = await response.json();
    window.__CRAMBOT_CONFIG.apiKey = config.groqApiKey;
}
```

## 🌐 Deployment to Vercel

### Step 1: Prepare Repository

```bash
# Make sure you're in the crambot directory
cd crambot

# Initialize git if needed
git init
git add .
git commit -m "Initial commit"
```

### Step 2: Create Vercel Account

Go to https://vercel.com and sign up.

### Step 3: Connect Repository

1. Click "Import Project"
2. Select GitHub/GitLab/Bitbucket
3. Select your repository
4. Click "Import"

### Step 4: Configure Environment Variables

1. In Vercel dashboard, go to "Settings"
2. Click "Environment Variables"
3. Add your variables:

```
GROQ_API_KEY = your_actual_key_here
NODE_ENV = production
```

### Step 5: Deploy

Click "Deploy" - Vercel will build and deploy automatically.

### Step 6: Custom Domain

1. In Settings → Domains
2. Add your custom domain
3. Follow DNS configuration steps
4. Vercel provides free SSL/HTTPS

## 🌐 Deployment to Netlify

### Step 1: Prepare Repository

Same as Vercel - ensure code is in Git.

### Step 2: Create Netlify Account

Go to https://netlify.com and sign up.

### Step 3: Connect Site

1. Click "New site from Git"
2. Select your repository
3. Configure build settings:
   - Build command: (leave empty - it's static)
   - Publish directory: `.` (root directory)

### Step 4: Set Environment Variables

1. Go to "Site settings" → "Build & deploy"
2. Click "Environment" → "Edit variables"
3. Add:

```
GROQ_API_KEY = your_actual_key_here
```

### Step 5: Deploy

Netlify automatically deploys on push to main branch.

### Step 6: Custom Domain

1. Domain settings → Add domain
2. Point DNS to Netlify
3. Automatic SSL via Let's Encrypt

## 🌐 Deployment to GitHub Pages

### Step 1: Create gh-pages Branch

```bash
git checkout -b gh-pages
git push -u origin gh-pages
```

### Step 2: Configure Repository

1. Go to Settings → Pages
2. Select "Deploy from a branch"
3. Select `gh-pages` branch
4. Click "Save"

### Step 3: Handle API Key

For GitHub Pages, use a backend service:

```javascript
// In config.js, fetch from external API
async function loadConfiguration() {
    const response = await fetch('https://your-backend.com/api/config');
    const config = await response.json();
    window.__CRAMBOT_CONFIG.apiKey = config.groqApiKey;
}
```

### Step 4: Custom Domain

1. Add `CNAME` file to root:
   ```
   yourdomain.com
   ```

2. Point DNS to GitHub:
   ```
   CNAME record → username.github.io
   ```

## 📁 Self-Hosted Deployment

### Using Apache

1. Upload files to `/var/www/html/crambot/`

2. Create `.htaccess`:

```apache
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule ^(.*)$ index.html [QSA,L]
</IfModule>

# Add security headers
<FilesMatch "\.(js|css|png|jpg|gif|svg|woff|woff2|ttf|eot)$">
    Header set Cache-Control "public, max-age=31536000"
</FilesMatch>

# Prevent API key exposure
<FilesMatch "\.env$">
    Order allow,deny
    Deny from all
</FilesMatch>
```

3. Enable SSL/HTTPS (Let's Encrypt recommended)

### Using Nginx

```nginx
server {
    listen 443 ssl http2;
    server_name crambot.site;

    ssl_certificate /etc/ssl/certs/your_cert.pem;
    ssl_certificate_key /etc/ssl/private/your_key.pem;

    root /var/www/crambot;
    index index.html;

    # SPA routing
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static files
    location ~* \.(js|css|png|jpg|gif|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    # Prevent access to sensitive files
    location ~ /\.(env|git|htaccess) {
        deny all;
    }
}
```

### Using Docker

Create `Dockerfile`:

```dockerfile
FROM nginx:alpine

COPY . /usr/share/nginx/html/
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

Build and run:

```bash
docker build -t crambot .
docker run -p 80:80 crambot
```

## 🔒 Security Configuration

### CORS Settings

For your backend proxy, configure CORS:

```javascript
// Node.js with CORS middleware
const cors = require('cors');

app.use(cors({
    origin: ['https://crambot.site', 'https://www.crambot.site'],
    credentials: true
}));
```

### Security Headers

Add to your server:

```
X-Frame-Options: SAMEORIGIN
X-Content-Type-Options: nosniff
X-XSS-Protection: 1; mode=block
Strict-Transport-Security: max-age=31536000; includeSubDomains
Content-Security-Policy: default-src 'self' https:; script-src 'self' https: cdn.jsdelivr.net cdnjs.cloudflare.com; style-src 'self' 'unsafe-inline' https: fonts.googleapis.com; font-src https: fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https: api.groq.com
```

### HTTPS/SSL

- Use Let's Encrypt for free SSL
- Force redirect HTTP → HTTPS
- Set HSTS headers

## 📊 Post-Deployment

### Testing

1. Test timetable generation
2. Test exports (PNG/PDF)
3. Test sharing functionality
4. Test all themes
5. Test responsive design
6. Test blog navigation
7. Check console for errors
8. Verify API key is not exposed

### Monitoring

```javascript
// Add error logging
window.addEventListener('error', function(e) {
    // Send to monitoring service
    console.error('Error:', e);
});

// Monitor API usage
function logApiUsage() {
    // Track timetable generations
    // Monitor rate limits
}
```

### Analytics (Optional)

Add Google Analytics:

```html
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_ID"></script>
<script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'GA_ID');
</script>
```

## 🆘 Troubleshooting Deployment

### Issue: API Key Not Working

- Verify key is set in environment variables
- Check platform-specific documentation
- Test endpoint connectivity
- Review API usage in Groq console

### Issue: Static Files Not Loading

- Check file paths are relative (not absolute)
- Verify MIME types configured
- Check cache headers
- Clear browser cache

### Issue: Export Not Working

- Verify libraries loaded (check network tab)
- Test on different browser
- Check console for errors
- Verify sufficient disk space

### Issue: High Latency

- Use CDN for static files
- Optimize images/assets
- Consider regional servers
- Monitor API response times

## 📈 Performance Optimization

1. Minify CSS/JS for production
2. Compress images
3. Use CDN for libraries
4. Enable gzip compression
5. Set appropriate cache headers
6. Lazy load blog images

## 📞 Support

Need help deploying?

- Check platform-specific docs
- Review error logs
- Test locally first
- Ask in community forums

---

**Ready to launch? Let's make CramBot live! 🚀**
