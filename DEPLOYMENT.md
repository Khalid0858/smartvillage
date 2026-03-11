# 🚀 Deployment Guide

## Prerequisites
- GitHub account
- Firebase project
- MongoDB Atlas cluster
- Vercel account
- Render account

## Step 1: Firebase Setup
1. Go to https://console.firebase.google.com
2. Create a new project
3. Enable **Authentication** → Email/Password + Google
4. Enable **Storage** → Start in test mode
5. Enable **Realtime Database** → Start in test mode
6. Go to **Project Settings** → **Service Accounts** → Generate new private key
7. Copy credentials to backend `.env`

## Step 2: MongoDB Atlas
1. Go to https://cloud.mongodb.com
2. Create a free cluster
3. Create a database user
4. Whitelist IP: 0.0.0.0/0 (allow all)
5. Get connection string → paste in backend `.env`

## Step 3: Deploy Backend to Render
1. Push code to GitHub
2. Go to https://render.com → New Web Service
3. Connect GitHub → select `smartvillage` repo
4. **Root Directory**: `backend`
5. **Build Command**: `npm install`
6. **Start Command**: `npm start`
7. Add all variables from `backend/.env.example`
8. Copy your Render URL (e.g. `https://smartvillage-api.onrender.com`)

## Step 4: Deploy Frontend to Vercel
1. Go to https://vercel.com → New Project
2. Import from GitHub → `smartvillage`
3. **Root Directory**: `frontend`
4. **Framework**: Next.js
5. Add all variables from `frontend/.env.example`
6. Set `NEXT_PUBLIC_API_URL` = your Render URL + `/api`
7. Deploy!

## Environment Variables Checklist

### Backend
- [ ] MONGODB_URI
- [ ] JWT_SECRET
- [ ] FIREBASE_PROJECT_ID
- [ ] FIREBASE_CLIENT_EMAIL
- [ ] FIREBASE_PRIVATE_KEY
- [ ] WEATHER_API_KEY (from openweathermap.org — free tier)
- [ ] CLIENT_URL (your Vercel URL)

### Frontend
- [ ] NEXT_PUBLIC_API_URL
- [ ] NEXT_PUBLIC_FIREBASE_API_KEY
- [ ] NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
- [ ] NEXT_PUBLIC_FIREBASE_PROJECT_ID
- [ ] NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
- [ ] NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
- [ ] NEXT_PUBLIC_FIREBASE_APP_ID
- [ ] NEXT_PUBLIC_FIREBASE_DATABASE_URL
