# Railway Deployment Guide

## Quick Deploy to Railway

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/new/template)

## Manual Deployment Steps

### 1. Create Railway Project

1. Go to [railway.app](https://railway.app)
2. Sign in with GitHub
3. Click "New Project"
4. Select "Deploy from GitHub repo"
5. Choose: `kris07hna/DiabetesAnalyst1.0`
6. Railway will auto-detect the Python app

### 2. Configure Root Directory

1. In Project Settings → "Root Directory"
2. Set to: `api`
3. Railway will use the files in the `api/` folder

### 3. Environment Variables (Optional)

No environment variables are required! The app uses evidence-based recommendations.

If you want to add Gemini AI later:
- Variable: `GEMINI_API_KEY`
- Value: Your Google Gemini API key

### 4. Deploy

1. Railway will automatically deploy
2. Wait for build to complete (2-3 minutes)
3. Copy your Railway URL (e.g., `https://your-app.up.railway.app`)

### 5. Connect Frontend

Update your frontend's API URL:
- Variable: `NEXT_PUBLIC_API_URL`
- Value: `https://your-app.up.railway.app`

## Railway Configuration Files

- **Procfile**: Defines the web process command
- **railway.json**: Railway-specific configuration
- **nixpacks.toml**: Build and start commands
- **requirements.txt**: Python dependencies (includes gunicorn)

## Features

✅ Automatic HTTPS
✅ Auto-scaling
✅ Zero-downtime deploys
✅ Free tier available (500 hours/month)
✅ Metrics and logs included

## Testing the Deployment

```bash
# Health check
curl https://your-app.up.railway.app/health

# Model info
curl https://your-app.up.railway.app/model-info

# Test prediction
curl -X POST https://your-app.up.railway.app/predict \
  -H "Content-Type: application/json" \
  -d '{"features": {...}}'
```

## Troubleshooting

### Build Fails
- Check logs in Railway dashboard
- Ensure `api/` folder contains all necessary files
- Verify requirements.txt is valid

### App Crashes
- Check runtime logs
- Ensure model file exists: `models/diabetes_model.joblib`
- Verify Python version compatibility

### CORS Issues
- Frontend CORS is already configured
- Ensure API URL is correct in frontend env vars

## Production Checklist

- [ ] API deployed and responding to `/health`
- [ ] Model loads successfully (check logs)
- [ ] Frontend connected with correct API URL
- [ ] Test prediction endpoint
- [ ] Monitor Railway metrics
- [ ] Set up custom domain (optional)

## Railway Free Tier

- 500 execution hours/month
- 512 MB RAM
- 1 GB disk
- Perfect for small projects!

## Upgrade Options

For production apps with high traffic:
- Hobby Plan: $5/month
- More RAM and execution hours
- Custom domains included

---

**Need Help?** Check Railway docs: https://docs.railway.app
