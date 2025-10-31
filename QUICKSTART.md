# 🚀 Quick Start Guide

Get your Optizen Analytics Dashboard up and running in 5 minutes!

## Step 1: Set Up Environment Variables

Copy the example environment file:
```bash
cp .env.local.example .env.local
```

Edit `.env.local` and add your credentials. You'll need to configure:

### 1️⃣ Clerk Authentication

1. Go to [clerk.com](https://clerk.com) and create a free account
2. Create a new application
3. Copy your API keys from the dashboard:
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - `CLERK_SECRET_KEY`
4. (Optional) Enable email allowlist:
   - Go to **User & Authentication** → **Restrictions**
   - Enable **Allowlist** and add `jono@silicondales.com`

### 2️⃣ MongoDB Connection

1. Get your MongoDB connection string from MongoDB Atlas
2. Add it as `MONGODB_URI`
3. Set `MONGODB_DB_NAME` to your database name (usually "optizen")

Your `.env.local` should look like:
```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxx
CLERK_SECRET_KEY=sk_test_xxxxx
ALLOWED_EMAIL=jono@silicondales.com
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/optizen
MONGODB_DB_NAME=optizen

# Optional: For discount management (admin only)
NEXT_PUBLIC_VIDEO_APP_URL=https://video.optizenai.com
NEXT_PUBLIC_ADMIN_KEY=your_secret_admin_key_here
```

## Step 2: Install Dependencies (if not already done)

```bash
npm install
```

## Step 3: Run the Development Server

```bash
npm run dev
```

## Step 4: Open in Browser

Navigate to [http://localhost:3000](http://localhost:3000)

You'll be redirected to the Clerk sign-in page. 

🔒 **Security Note:** The dashboard is restricted to `jono@silicondales.com` only. Anyone else who tries to sign in will be blocked!

## Step 5: Verify Everything Works

1. **Check authentication**: You should be signed in after Step 4
2. **Test database connection**: Visit [http://localhost:3000/api/health](http://localhost:3000/api/health)
   - Should show: `{"status":"healthy","database":"connected"}`
3. **View dashboard**: Go to the main dashboard to see your analytics

## 🎉 You're Done!

Your analytics dashboard is now running. Explore:

- **Dashboard** - Overview of all metrics
- **App Overview** - Aggregated app-wide stats
- **Stores** - Individual store performance
- **Revenue** - Revenue tracking and trends
- **Campaigns** - Campaign analytics (coming soon)
- **Reports** - Custom reports (coming soon)
- **Admin → Discounts** - Manage pre-assigned merchant discounts (requires admin API key)

## 🐛 Troubleshooting

### "Database disconnected" error
- Check your MongoDB connection string in `.env.local`
- Ensure your IP is whitelisted in MongoDB Atlas
- Verify the database name is correct

### Redirect loop on sign-in
- Verify all Clerk environment variables are set
- Check that `ALLOWED_EMAIL` matches your email in `.env.local`
- Clear browser cookies and try again
- Make sure you're signing in with `jono@silicondales.com`

### "Module not found" errors
- Run `npm install` again
- Delete `node_modules` and `.next` folders, then reinstall:
  ```bash
  rm -rf node_modules .next
  npm install
  ```

## 📚 Next Steps

- Read the full [README.md](./README.md) for detailed documentation
- Review [ANALYTICS_DASHBOARD_SETUP.md](./ANALYTICS_DASHBOARD_SETUP.md) for architecture details
- Set up [discount management](./DISCOUNT_SETUP.md) (admin feature, optional)
- Customize components in `components/` folder
- Add new pages in `app/(dashboard)/` folder
- Configure MongoDB collections structure as needed

## 🚀 Deploy to Production

When ready to deploy:

1. Push to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. Deploy to Vercel:
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Add all environment variables
   - Click Deploy!

---

**Need help?** Check the troubleshooting section in README.md or review the setup guide.

