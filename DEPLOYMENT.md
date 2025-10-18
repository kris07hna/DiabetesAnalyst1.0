# Deployment Guide - DiabetesAnalyst Pro

## 🚀 Quick Deploy to Vercel

### Prerequisites
- Node.js 16+ installed
- Vercel account (free tier available)
- Git repository

### Step 1: Deploy Backend API to Vercel

```bash
cd api
vercel --prod
```

**Configure Environment Variables in Vercel:**
- Go to Vercel Dashboard → Project Settings → Environment Variables
- Add `GEMINI_API_KEY` (optional, for AI recommendations)

**Note:** The API runs entirely on CPU with XGBoost optimized for serverless functions.

### Step 2: Deploy Frontend to Vercel

```bash
cd frontend
vercel --prod
```

**Configure Environment Variables:**
- `NEXT_PUBLIC_API_URL` - Your API URL from Step 1 (e.g., https://your-api.vercel.app)

### Alternative: Deploy from GitHub

✅ **Already pushed to:** `https://github.com/kris07hna/DiabetesAnalyst1.0`

**Important:** Vercel can only deploy ONE project per repository. You need to create TWO separate Vercel projects:

1. **Deploy Frontend (Project 1):**
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New" → "Project"
   - Import: `kris07hna/DiabetesAnalyst1.0`
   - **Framework Preset:** Next.js
   - **Root Directory:** `frontend` (click "Edit" and select this folder)
   - Click "Deploy"
   - After deployment, note the URL (e.g., `https://diabetes-analyst.vercel.app`)

2. **Deploy Backend API (Project 2):**
   - Go to [vercel.com](https://vercel.com) again
   - Click "Add New" → "Project"
   - Import **the same repository**: `kris07hna/DiabetesAnalyst1.0`
   - **Framework Preset:** Other
   - **Root Directory:** `api` (click "Edit" and select this folder)
   - Click "Deploy"
   - After deployment, note the API URL (e.g., `https://diabetes-analyst-api.vercel.app`)

3. **Connect Frontend to Backend:**
   - Go to Frontend project → Settings → Environment Variables
   - Add: `NEXT_PUBLIC_API_URL` = `https://your-backend-api-url.vercel.app`
   - Redeploy frontend (Deployments → ⋯ → Redeploy)

**Note:** Each deployment needs its own Vercel project with different root directories.

## 📦 Local Development

### Backend API (CPU-only)

```bash
cd api
pip install -r requirements.txt
python app.py
```

API runs on: http://localhost:5000

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on: http://localhost:3000

## 🔧 Environment Variables

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### API (.env - optional)
```env
GEMINI_API_KEY=your_gemini_api_key_here
```

## 🧪 Testing the Deployment

Test the API:
```bash
curl https://your-api.vercel.app/health
```

Expected response:
```json
{
  "status": "healthy",
  "model": "XGBoost",
  "model_accuracy": 0.8523,
  "timestamp": "2025-10-18T..."
}
```

## 📊 Model Information

- **Model**: XGBoost (CPU-optimized)
- **Accuracy**: ~85%
- **Features**: 21 health indicators
- **Inference**: Serverless, runs on CPU
- **No GPU Dependencies**: Works on any serverless platform

## 🛠️ Troubleshooting

### Build Errors

**Frontend TypeScript errors:**
```bash
cd frontend
npm install --legacy-peer-deps
```

**API Package errors:**
```bash
cd api
pip install --upgrade pip
pip install -r requirements.txt
```

### API Model Loading Issues

Ensure the model file exists:
```bash
ls -la ../models/diabetes_model.joblib
```

If missing, train the model:
```bash
python train_model.py
```

### CORS Issues

The API includes CORS middleware. If you still encounter CORS:
- Verify `NEXT_PUBLIC_API_URL` in frontend .env.local
- Check Vercel function logs for errors

## 📱 Production Checklist

- [ ] Backend API deployed and responding to `/health`
- [ ] Frontend deployed with correct API URL
- [ ] Model loading successfully (check logs)
- [ ] Test prediction endpoint with sample data
- [ ] Monitor serverless function cold starts
- [ ] Set up error monitoring (optional: Sentry)

## 🔒 Security Notes

- API uses evidence-based recommendations (no external API calls by default)
- Model runs locally in serverless function
- No patient data is stored or logged
- All predictions happen server-side

## 💡 Performance Tips

1. **Cold Starts**: First request may take 2-5 seconds
2. **Model Size**: ~2MB, optimized for serverless
3. **Caching**: Vercel caches static assets automatically
4. **CDN**: Frontend deployed to global edge network

## 📈 Monitoring

Check Vercel Analytics for:
- Function execution time
- Error rates
- Traffic patterns
- Cold start frequency

## 📸 Step-by-Step Vercel Deployment

### Visual Guide for GitHub Deployment:

**Step 1: Deploy Frontend**
```
Vercel Dashboard → Add New → Project
├─ Select: kris07hna/DiabetesAnalyst1.0
├─ Framework: Next.js (auto-detected)
├─ Root Directory: Click "Edit" → Select "frontend"
└─ Deploy → Copy URL
```

**Step 2: Deploy Backend**
```
Vercel Dashboard → Add New → Project
├─ Select: kris07hna/DiabetesAnalyst1.0 (SAME REPO)
├─ Framework: Other
├─ Root Directory: Click "Edit" → Select "api"
└─ Deploy → Copy URL
```

**Step 3: Link Them**
```
Frontend Project → Settings → Environment Variables
├─ Variable: NEXT_PUBLIC_API_URL
├─ Value: https://your-backend-url.vercel.app
└─ Deployments → Redeploy
```

**Result:**
- Frontend: `https://diabetes-analyst-frontend.vercel.app`
- Backend: `https://diabetes-analyst-api.vercel.app`
- Both use the same GitHub repo with different root directories!

---

**Need Help?** Check the logs in Vercel Dashboard → Deployments → Function Logs
