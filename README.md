# 🏡 SmartVillage — Rural Community Digital Platform

A full-stack web app connecting rural communities: report problems, access services, trade goods, find jobs, request emergency help, and more.

## Tech Stack
- **Frontend**: Next.js 14, React 18, Tailwind CSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Atlas)
- **Auth & Storage**: Firebase
- **Hosting**: Vercel (frontend) + Render (backend)

## Quick Start

### 1. Clone & Setup
```bash
git clone https://github.com/YOUR_USERNAME/smartvillage.git
cd smartvillage
```

### 2. Backend Setup
```bash
cd backend
cp .env.example .env
# Fill in your credentials in .env
npm install
npm run dev
```

### 3. Frontend Setup
```bash
cd frontend
cp .env.example .env.local
# Fill in your credentials in .env.local
npm install
npm run dev
```

Visit http://localhost:3000

## Deployment

- **Backend → Render.com**: Connect GitHub repo, set env vars, deploy
- **Frontend → Vercel.com**: Import repo, set env vars, deploy

See [DEPLOYMENT.md](./DEPLOYMENT.md) for full guide.

## Modules
1. Authentication (Firebase)
2. Problem Reporting
3. Notice Board
4. Service Marketplace
5. Village Marketplace (Buy/Sell)
6. Emergency SOS
7. Job Board
8. Smart Agriculture
9. Community Forum
10. Donations & Fundraising
11. Admin Dashboard
