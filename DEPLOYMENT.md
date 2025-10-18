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

1. **Push to GitHub:**
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin <your-github-repo>
git push -u origin main
```

2. **Import to Vercel:**
- Go to [vercel.com](https://vercel.com)
- Click "Import Project"
- Select your GitHub repository
- Vercel will auto-detect Next.js (frontend) and Python (api)
- Configure root directories:
  - Frontend: `frontend/`
  - API: `api/`

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

---

**Need Help?** Check the logs in Vercel Dashboard → Deployments → Function Logs
