# Railway Deployment Troubleshooting

## Current Status
- ✅ App builds successfully
- ✅ Model loads (85.23% accuracy)
- ✅ Healthcheck passes
- ❌ Public URL not accessible (DNS_PROBE_FINISHED_NXDOMAIN)

## Solution Steps

### 1. Check Service Settings in Railway Dashboard

Go to your Railway project and check:

**Settings → Networking:**
- [ ] Is "Public Networking" enabled?
- [ ] Is there a domain listed under "Domains"?
- [ ] Does it show a green checkmark next to the domain?

**Settings → Environment:**
- [ ] Is `PORT` variable set? (Should be automatically set by Railway)

### 2. Fix Domain Configuration

**Option A: Generate New Domain**
1. Go to Settings → Networking
2. Click "Remove Domain" (if any exists)
3. Click "Generate Domain"
4. Wait 30-60 seconds for DNS propagation
5. Try the new URL

**Option B: Check Service Type**
1. Go to Settings
2. Under "Service Type", ensure it's set to "Web Service"
3. NOT "Worker" or "Cron Job"

### 3. Verify Port Configuration

Railway expects your app to listen on `$PORT` (Railway sets this).

Your app should show in logs:
```
[INFO] Listening at: http://0.0.0.0:8080
```

If it shows a different port, that's the issue.

### 4. Check Deployment Logs

In Railway:
1. Click on your deployment
2. Check "Deploy Logs" tab
3. Look for:
   - ✅ "Model loaded: XGBoost"
   - ✅ "Listening at: http://0.0.0.0:8080"
   - ❌ Any error messages

### 5. Common Issues & Fixes

| Issue | Solution |
|-------|----------|
| DNS not resolving | Wait 2-5 minutes after domain generation |
| "This site can't be reached" | Service not set to "Web Service" type |
| Healthcheck failing | Check `/health` endpoint exists |
| Port mismatch | Ensure gunicorn uses `$PORT` variable |

### 6. Railway CLI Test (Alternative)

Install Railway CLI and test locally:
```bash
npm i -g @railway/cli
railway login
railway link
railway run gunicorn app:app
```

### 7. Contact Railway Support

If nothing works:
1. Go to Railway Dashboard
2. Click "?" (Help) icon
3. Describe issue: "Generated domain not resolving, healthcheck passes"
4. Include your project ID

## Quick Test Checklist

- [ ] Service type is "Web Service"
- [ ] Public networking enabled
- [ ] Domain generated and showing in dashboard
- [ ] Waited 2-5 minutes after domain generation
- [ ] Logs show "Listening at: http://0.0.0.0:8080"
- [ ] Healthcheck shows as passing
- [ ] No error messages in deploy logs

## Expected Working State

When fixed, you should see:
- Domain shows green checkmark in Railway
- URL opens in browser
- Returns JSON with API info
- `/health` returns 200 status

## Current Configuration

Your app is configured correctly:
- ✅ Procfile: `web: gunicorn app:app`
- ✅ railway.json: proper healthcheck
- ✅ Port: Uses $PORT from Railway
- ✅ Model: Loads successfully
- ✅ Worker: gthread (good for I/O)

The issue is **purely Railway networking/domain configuration**, not your code!
