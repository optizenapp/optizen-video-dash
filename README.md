# Optizen Analytics Dashboard

A comprehensive B2B analytics dashboard for the Optizen app owner. This Next.js application aggregates analytics and user data from the main Optizen app's MongoDB database, providing insights into app-wide performance and per-store metrics.

## 🚀 Features

- **App-Wide Analytics**: View aggregated metrics across all installed stores
- **Per-Store Analytics**: Drill down into individual store performance
- **Discount Management**: Admin panel to manage pre-assigned merchant discounts
- **Secure Authentication**: Protected routes with Clerk authentication
- **Real-time Data**: Live data from MongoDB (no mock data)
- **Beautiful UI**: Modern, responsive design with Tailwind CSS
- **Data Visualization**: Interactive charts powered by Recharts

## 📋 Prerequisites

Before you begin, ensure you have:

- Node.js 18+ installed
- MongoDB connection string from the main Optizen app
- Clerk account for authentication
- npm, yarn, or pnpm package manager

## 🛠️ Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Authentication**: Clerk
- **Database**: MongoDB (read-only access)
- **Charts**: Recharts
- **Icons**: Lucide React

## 📦 Installation

1. **Clone and navigate to the project**:
   ```bash
   cd optizen-video-dash
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   ```bash
   cp .env.local.example .env.local
   ```

4. **Configure your `.env.local` file**:

   ```env
   # Clerk Authentication
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxx
   CLERK_SECRET_KEY=sk_test_xxxxx
   CLERK_SIGN_IN_URL=/sign-in
   CLERK_SIGN_UP_URL=/sign-up
   CLERK_AFTER_SIGN_IN_URL=/
   CLERK_AFTER_SIGN_UP_URL=/
   
   # App Owner ID (your Clerk user ID)
   CLERK_OWNER_ID=user_xxxxx
   
   # MongoDB Connection
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/optizen?retryWrites=true&w=majority
   MONGODB_DB_NAME=optizen
   
   # Discount Management (Admin)
   NEXT_PUBLIC_VIDEO_APP_URL=https://video.optizenai.com
   NEXT_PUBLIC_ADMIN_KEY=your_secret_admin_key_here
   
   # App Configuration
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   NEXT_PUBLIC_API_BASE_URL=http://localhost:3000/api
   
   # Feature Flags
   ENABLE_MOCK_DATA=false
   DEBUG_MODE=false
   ```

   **Note**: For discount management setup, see [DISCOUNT_SETUP.md](DISCOUNT_SETUP.md)

5. **Run the development server**:
   ```bash
   npm run dev
   ```

6. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔐 Setting Up Clerk Authentication

1. **Create a Clerk account** at [clerk.com](https://clerk.com)

2. **Create a new application** in the Clerk dashboard

3. **Copy your API keys**:
   - Go to **API Keys** in the Clerk dashboard
   - Copy the **Publishable Key** and **Secret Key**
   - Add them to your `.env.local` file

4. **Get your User ID**:
   - Sign up/sign in to your Clerk app
   - Go to **Users** in the dashboard
   - Copy your user ID (starts with `user_`)
   - Add it as `CLERK_OWNER_ID` in `.env.local`

## 🗄️ MongoDB Connection

This dashboard connects to your **main Optizen app's MongoDB database** in read-only mode.

### Getting Your MongoDB Connection String

1. Go to [MongoDB Atlas](https://cloud.mongodb.com)
2. Select your cluster
3. Click **Connect** → **Connect your application**
4. Copy the connection string
5. Replace `<password>` with your actual password
6. Add it to your `.env.local` as `MONGODB_URI`

### Expected Database Collections

The dashboard expects these collections in your MongoDB:

- `shops` - Store information
- `analytics` - Analytics records (revenue, orders, etc.)
- `campaigns` - Campaign data
- `aivideos` - AI video metadata

## 📁 Project Structure

```
optizen-video-dash/
├── app/
│   ├── (auth)/
│   │   ├── sign-in/          # Clerk sign-in page
│   │   └── sign-up/          # Clerk sign-up page
│   ├── (dashboard)/
│   │   ├── page.tsx          # Main dashboard
│   │   ├── app-overview/     # App-wide metrics
│   │   ├── stores/           # Store listings & details
│   │   ├── revenue/          # Revenue tracking
│   │   ├── campaigns/        # Campaign performance
│   │   ├── reports/          # Custom reports
│   │   └── admin/
│   │       └── discounts/    # Discount management
│   ├── api/
│   │   ├── analytics/        # Analytics endpoints
│   │   ├── stores/           # Store data endpoints
│   │   └── health/           # Health check
│   └── layout.tsx
├── components/
│   ├── dashboard/            # Dashboard components
│   ├── navigation/           # Sidebar navigation
│   └── common/               # Shared components
├── lib/
│   ├── mongodb.ts            # MongoDB connection
│   ├── analytics-queries.ts  # Query functions
│   ├── clerk-utils.ts        # Auth utilities
│   ├── discount-api.ts       # Discount API service
│   ├── utils.ts              # Helper functions
│   └── constants.ts          # App constants
├── middleware.ts             # Clerk auth middleware
├── .env.example              # Environment template
├── DISCOUNT_SETUP.md         # Discount feature setup guide
└── package.json
```

## 🌐 API Endpoints

### Health Check
```
GET /api/health
```
Returns database connection status

### App-Wide Analytics
```
GET /api/analytics/app-wide
```
Returns aggregated metrics across all stores

### Stores List
```
GET /api/analytics/stores
```
Returns all connected stores

### Store Details
```
GET /api/stores/[id]
```
Returns analytics for a specific store

## 🚀 Deployment

### Deploy to Vercel

1. **Push to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-repo-url>
   git push -u origin main
   ```

2. **Import to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Click **Import Project**
   - Select your GitHub repository
   - Click **Deploy**

3. **Add Environment Variables**:
   - Go to **Settings** → **Environment Variables**
   - Add all variables from `.env.local`
   - Update URLs to production values

4. **Configure Custom Domain** (optional):
   - Go to **Settings** → **Domains**
   - Add your custom domain (e.g., `analytics.optizenapp.com`)

## 🔧 Development

### Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Run linter
npm run lint
```

### Adding New Pages

1. Create a new folder in `app/(dashboard)/`
2. Add a `page.tsx` file with your component
3. Update the navigation in `components/navigation/Sidebar.tsx`
4. Create API routes if needed in `app/api/`

## 🐛 Troubleshooting

### MongoDB Connection Issues

- Verify your IP is whitelisted in MongoDB Atlas
- Check username/password in connection string
- Ensure database name is correct
- Test connection at `/api/health`

### Clerk Authentication Issues

- Verify both API keys are set correctly
- Check that Clerk URLs match your configuration
- Clear browser cookies and try again
- Ensure you're using the correct environment keys

### Build Errors

```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules
npm install

# Try building again
npm run build
```

## 📊 Database Schema Notes

For optimal performance, ensure your analytics collection includes:

```typescript
{
  shopId: string;           // Reference to store
  timestamp: Date;          // When data was recorded
  revenue: number;          // Total revenue
  orders: number;           // Number of orders
  videoViews?: number;      // Optional: video views
  campaigns?: number;       // Optional: campaign count
}
```

## 🔒 Security Notes

- This dashboard has **read-only** access to the database
- Only authenticated users can access the dashboard
- Restrict `CLERK_OWNER_ID` to app owner only
- Never commit `.env.local` to version control
- Use environment-specific credentials

## 📝 License

This project is proprietary and confidential.

## 🤝 Support

For issues or questions:
1. Check the troubleshooting section above
2. Review MongoDB and Clerk documentation
3. Contact the development team

---

**Built with ❤️ for Optizen**
