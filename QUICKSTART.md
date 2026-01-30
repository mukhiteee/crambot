# 🚀 CramBot - Quick Start Guide

Get CramBot live in 5 minutes!

## ⚡ 5-Minute Setup (Vercel)

### Step 1: Prepare (1 minute)
- [ ] Have a GitHub account
- [ ] Have a Groq API key (get free one at https://console.groq.com)

### Step 2: Deploy (2 minutes)
1. Go to https://vercel.com/import
2. Select your GitHub repository (crambot)
3. Click "Import"

### Step 3: Configure (2 minutes)
1. In Vercel dashboard → Settings → Environment Variables
2. Add: `GROQ_API_KEY = your_key_here`
3. Click "Deploy"

✅ **Done!** Your site is live at `yourproject.vercel.app`

---

## 📝 Configuration

### API Key Setup

**Option A: Vercel/Netlify (Easiest)**
```
In Platform Dashboard:
Environment Variables → Add
Name: GROQ_API_KEY
Value: gsk_xxxxxxxxxxxxx
Save and redeploy
```

**Option B: Local Development**
```bash
# 1. Copy example file
cp .env.example .env

# 2. Edit .env and add your key
GROQ_API_KEY=gsk_xxxxxxxxxxxxx

# 3. Start local server
python -m http.server 8000

# 4. Open http://localhost:8000
```

**Option C: Backend Proxy (Recommended for Production)**
```javascript
// In config.js, uncomment:
const response = await fetch('/api/config', { 
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
});
```

---

## ✅ Verification Checklist

After deployment, verify everything works:

- [ ] Homepage loads
- [ ] Can select courses
- [ ] Can generate timetable
- [ ] Can export as PNG
- [ ] Can export as PDF
- [ ] Can share timetable
- [ ] Blog page loads
- [ ] Blog posts can be read
- [ ] Dark/Light mode works
- [ ] Themes change properly

---

## 🐛 Troubleshooting

### "API Key not configured"
→ Add `GROQ_API_KEY` to environment variables

### "Cannot generate timetable"
→ Verify API key is valid at https://console.groq.com

### "Export not working"
→ Try different browser, check console errors

### "Blog not loading"
→ Verify `blogs.html` and `blogs.js` files exist

### "Slow response"
→ Check Groq API status, may be rate limited

---

## 📊 Platform Quick Links

### Vercel
- Deploy: https://vercel.com/import
- Dashboard: https://vercel.com/dashboard
- Docs: https://vercel.com/docs

### Netlify
- Deploy: https://app.netlify.com/sites
- Docs: https://docs.netlify.com

### GitHub Pages
- Requires backend for API
- Docs: https://pages.github.com

---

## 🔗 Important Links

- **Groq Console:** https://console.groq.com
- **Get API Key:** https://console.groq.com/keys
- **API Docs:** https://console.groq.com/docs
- **Full README:** See README.md
- **Deployment Guide:** See DEPLOYMENT.md

---

## 📱 Test Your Deployment

### Desktop
1. Open your live URL
2. Fill in courses
3. Generate timetable
4. Export and download
5. Share timetable

### Mobile
1. Open on phone
2. Test touch interactions
3. Test on different screen sizes
4. Verify responsive design

### API
1. Check network tab in DevTools
2. Verify API calls succeed
3. Check API response time
4. Monitor rate limits

---

## 🎯 Success Indicators

✅ Site loads in under 3 seconds  
✅ Timetable generates in 5-10 seconds  
✅ All buttons are clickable  
✅ No errors in console  
✅ Looks good on mobile  
✅ Share text is helpful  
✅ Blog is readable  

---

## 💡 Pro Tips

1. **Monitor API Usage**
   - Check Groq console for rate limits
   - Free tier: 30 requests/minute
   - Upgrade if needed

2. **Set Up Analytics** (Optional)
   - Add Google Analytics for insights
   - Track user engagement
   - Monitor errors

3. **Keep Updating**
   - Add new blog posts
   - Respond to user feedback
   - Fix bugs quickly
   - Update documentation

4. **Share Your Success**
   - Tweet @mukhiteee with your results
   - Share with friends
   - Ask for feedback
   - Help improve the project

---

## 🆘 Need Help?

1. **Check README.md** - Common issues and solutions
2. **Check DEPLOYMENT.md** - Platform-specific guides
3. **Check PRODUCTION-CHECKLIST.md** - Launch verification
4. **Review Console Errors** - Browser DevTools
5. **Verify API Key** - Check Groq console

---

## 🎉 Next Steps

After successful deployment:

1. **Share It**
   - Post on social media
   - Tell your friends
   - Get feedback

2. **Monitor It**
   - Check error logs daily (first week)
   - Monitor API usage
   - Track performance

3. **Improve It**
   - Add more blog posts
   - Gather user feedback
   - Plan new features
   - Fix any issues

4. **Grow It**
   - Add user accounts (future)
   - Add mobile app (future)
   - Add more features (future)
   - Become awesome (now!)

---

## 📞 Quick Contact

**Created by:** Mukhiteee

- 𝕏 (Twitter): [@mukhiteee](https://x.com/mukhiteee)
- Instagram: [@mukhiteee](https://instagram.com/mukhiteee)
- GitHub: [@mukhiteee](https://github.com/mukhiteee)

---

**Happy launching! 🚀**

For detailed deployment instructions, see DEPLOYMENT.md
