# 🚀 Vercel Deployment Guide - Hyper-Optimized

## 📋 Prerequisites
- GitHub repository pushed (✅ Already done)
- Vercel account (free tier works)
- Both backend and frontend optimized for serverless

## 🎯 Backend Deployment (API)

### Step 1: Deploy API to Vercel
```bash
cd api
vercel --prod
```

**Project Configuration:**
- Framework Preset: **Other**
- Build Command: (leave empty)
- Output Directory: (leave empty)  
- Install Command: `pip install -r requirements.txt`

**Important:** Copy the deployed API URL (e.g., `https://your-api.vercel.app`)

### Environment Variables:
None required - all dependencies included in model files

## 🎨 Frontend Deployment

### Step 2: Update API URL
Before deploying frontend, update `frontend/vercel.json`:
```json
"rewrites": [
  {
    "source": "/api/:path*",
    "destination": "https://YOUR-ACTUAL-API-URL.vercel.app/:path*"
  }
]
```

Replace `YOUR-ACTUAL-API-URL` with the URL from Step 1.

### Step 3: Deploy Frontend to Vercel
```bash
cd frontend
vercel --prod
```

**Project Configuration:**
- Framework Preset: **Next.js**
- Build Command: `npm run build`
- Output Directory: `.next`
- Install Command: `npm install --legacy-peer-deps`

**Environment Variable:**
- `NEXT_PUBLIC_API_URL` = Your backend URL from Step 1

## ⚡ Optimizations Applied

### Backend (API):
✅ Python 3.9 runtime (faster cold starts than 3.12)
✅ Updated dependencies with wheel support
✅ Response caching headers
✅ CORS optimization with 1-hour cache
✅ Compressed responses for faster transfers
✅ 3GB memory allocation
✅ 60-second timeout for ML inference
✅ Environment variables for Python optimization

### Frontend:
✅ SWC minification enabled
✅ Console removal in production
✅ CSS optimization
✅ Package import optimization (lucide-react, framer-motion)
✅ Standalone output for smaller deployments
✅ WebP image format support
✅ Security headers (XSS, CSP, etc.)
✅ Static asset caching (1 year)
✅ Gzip compression enabled

## 🔧 Quick Deploy (Alternative)

### Via Vercel CLI:
```powershell
# Install Vercel CLI globally
npm i -g vercel

# Deploy backend
cd C:\Users\krishna\Pictures\DiabetesAnalyst1.0\api
vercel --prod

# Deploy frontend (after updating API URL)
cd C:\Users\krishna\Pictures\DiabetesAnalyst1.0\frontend
vercel --prod
```

### Via Vercel Dashboard:
1. Go to https://vercel.com/new
2. Import GitHub repository: `kris07hna/DiabetesAnalyst1.0`
3. Deploy **api** folder first
4. Copy API URL
5. Update frontend/vercel.json with API URL
6. Deploy **frontend** folder

## 📊 Expected Performance

### Backend:
- Cold start: **2-4 seconds** (first request)
- Warm requests: **200-500ms**
- Prediction endpoint: **300-700ms**
- Model loading: **Cached after first request**

### Frontend:
- Build time: **1-3 minutes** (optimized)
- Page load: **< 1 second** (optimized bundles)
- Time to Interactive: **< 2 seconds**
- Lighthouse score: **90+**

## 🐛 Troubleshooting

### Backend Issues:

**Build taking too long?**
- Python 3.9 selected (faster than 3.12)
- Dependencies use pre-built wheels
- Should complete in 2-5 minutes

**Model not loading?**
- Check model files present in api/ directory
- Verify `diabetes_model.joblib`, `model_metadata.json`, `xgboost_booster.json` exist

**500 errors?**
- Check Vercel function logs
- Verify memory allocation (3008MB)
- Check timeout setting (60s)

### Frontend Issues:

**Build failing?**
- Use `--legacy-peer-deps` flag
- Verify Node.js 18+ installed
- Check for TypeScript errors

**API calls failing?**
- Verify `NEXT_PUBLIC_API_URL` environment variable
- Check CORS settings (already optimized)
- Test API endpoint directly

**Slow loading?**
- Enable caching in browser
- Check Network tab for bundle sizes
- Verify CDN serving static assets

## ✅ Post-Deployment Checklist

- [ ] Backend API responding at /health endpoint
- [ ] Model info available at /model-info
- [ ] Prediction working at /predict
- [ ] Frontend loads without errors
- [ ] Prediction form submits successfully
- [ ] Results display correctly
- [ ] No console errors in browser
- [ ] Mobile responsive working
- [ ] Security headers present (check DevTools)

## 🎯 Production URLs

After deployment, you'll have:
- **Backend API:** `https://diabetes-api-xyz.vercel.app`
- **Frontend App:** `https://diabetes-analyst-xyz.vercel.app`

Update README.md with these URLs once deployed!

## 💡 Performance Tips

1. **API calls:** Use response caching where possible
2. **Frontend:** Static assets cached for 1 year
3. **Images:** Automatically optimized to WebP
4. **Code splitting:** Automatic with Next.js
5. **Serverless:** Auto-scales with traffic

## 🔒 Security

All security best practices applied:
- XSS protection headers
- Content Security Policy
- Frame protection (prevents clickjacking)
- HTTPS enforced by Vercel
- No sensitive data in client code
- Environment variables for secrets

---

**Need help?** Check Vercel logs at: https://vercel.com/dashboard

**Ready to deploy!** 🚀 Just follow the steps above.
