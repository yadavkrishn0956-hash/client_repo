# Dataset Bazar - Frontend

React frontend for the Dataset Bazar marketplace.

## 🚀 Deploy to Vercel

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin YOUR_GITHUB_REPO_URL
   git push -u origin main
   ```

2. **Deploy on Vercel**
   - Go to https://vercel.com/new
   - Import your GitHub repository
   - Vercel will auto-detect React
   - Click **Deploy**

3. **Add Environment Variable**
   - Go to Project Settings → Environment Variables
   - Add: `REACT_APP_API_URL` = `YOUR_BACKEND_URL`
   - Example: `https://your-backend.vercel.app`

## 🛠️ Local Development

```bash
npm install
npm start
```

Open http://localhost:3000

## 📦 Build

```bash
npm run build
```

Creates optimized production build in `build/` folder.
