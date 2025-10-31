# Optizen Analytics Dashboard - Setup & Development Guide

## Project Overview

The **Optizen Analytics Dashboard** is a separate Next.js application that serves as a B2B analytics hub for the Optizen app owner. It aggregates analytics and user data from the main Optizen app's MongoDB database and provides comprehensive insights into app-wide performance and per-store metrics.

### Key Features
- **App-Wide Analytics**: View aggregated metrics across all installed stores
- **Per-Store Analytics**: Drill down into individual store performance
- **Authentication**: Secure login via Clerk
- **Real-time Data**: Live data from MongoDB (no mock data)
- **Future Enhancement**: Widget to display in main app showing ecosystem metrics

---

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Authentication**: Clerk
- **Database**: MongoDB (read-only access to main app database)
- **Data Visualization**: Recharts or Chart.js (recommendation pending)
- **Deployment**: Vercel (recommended for Next.js)
- **Environment**: Node.js 18+

---

## Prerequisites

### Local Development
1. **Node.js** (v18+) and npm/pnpm/yarn
2. **Git** for version control
3. **MongoDB Compass** (optional, for database exploration)
4. Access to the main Optizen app's MongoDB connection string

### Required Accounts
1. **Clerk Account** - Create one at https://clerk.com
2. **Vercel Account** (for deployment) - https://vercel.com
3. **MongoDB Atlas Access** - For the main app's database

---

## Project Structure

```
analytics-dashboard/
├── app/
│   ├── (auth)/
│   │   ├── sign-in/
│   │   └── sign-up/
│   ├── (dashboard)/
│   │   ├── page.tsx                 # Main dashboard
│   │   ├── app-overview/            # App-wide metrics
│   │   ├── stores/                  # Per-store analytics
│   │   │   ├── page.tsx
│   │   │   └── [storeId]/
│   │   │       └── page.tsx
│   │   ├── revenue/                 # Revenue tracking
│   │   ├── campaigns/               # Campaign performance
│   │   └── reports/                 # Custom reports
│   ├── api/
│   │   ├── analytics/               # Analytics data endpoints
│   │   ├── stores/                  # Store data endpoints
│   │   └── health/                  # Health check endpoint
│   ├── layout.tsx
│   └── globals.css
├── lib/
│   ├── mongodb.ts                   # MongoDB connection & queries
│   ├── analytics-queries.ts         # Analytics query functions
│   ├── clerk-utils.ts               # Clerk utility functions
│   ├── utils.ts                     # General utilities
│   └── constants.ts                 # App constants
├── components/
│   ├── dashboard/
│   │   ├── StatsCard.tsx
│   │   ├── RevenueChart.tsx
│   │   ├── StoresList.tsx
│   │   └── MetricsGrid.tsx
│   ├── navigation/
│   │   └── Sidebar.tsx
│   └── common/
│       └── LoadingSpinner.tsx
├── middleware.ts                    # Clerk authentication middleware
├── .env.local.example               # Environment variables template
├── next.config.js
├── tailwind.config.js
├── tsconfig.json
├── package.json
└── README.md
```

---

## Environment Variables Setup

Create a `.env.local` file in the project root with the following variables:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
CLERK_SIGN_IN_URL=/sign-in
CLERK_SIGN_UP_URL=/sign-up
CLERK_AFTER_SIGN_IN_URL=/
CLERK_AFTER_SIGN_UP_URL=/

# MongoDB Connection (from main Optizen app)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/optizen?retryWrites=true&w=majority

# Database Configuration
MONGODB_DB_NAME=optizen

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000          # Development
# NEXT_PUBLIC_APP_URL=https://analytics.optizenapp.com  # Production

# API Configuration
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000/api
# NEXT_PUBLIC_API_BASE_URL=https://analytics.optizenapp.com/api  # Production

# Feature Flags
ENABLE_MOCK_DATA=false                            # Always use live data
DEBUG_MODE=false                                   # Enable debug logging
```

---

## MongoDB Connection & Data Access

### Connection Details

The analytics dashboard will connect to the **same MongoDB database** as the main Optizen app. You'll have **read-only access** to the following collections:

- `shops` - Store information
- `campaigns` - Campaign data
- `analytics` - Analytics records
- `aivideos` - AI video metadata
- `users` (if needed) - User data

### Setting Up MongoDB Connection

1. **Get Connection String** from your MongoDB Atlas cluster
   - Go to Atlas Dashboard → Connect → Connect Your Application
   - Copy the connection string
   - Add your password and database name

2. **Create MongoDB utility** (`lib/mongodb.ts`):
   ```typescript
   import { MongoClient, Db } from "mongodb";

   const uri = process.env.MONGODB_URI!;
   const dbName = process.env.MONGODB_DB_NAME || "optizen";

   let cachedClient: MongoClient | null = null;
   let cachedDb: Db | null = null;

   export async function connectToDatabase() {
     if (cachedClient && cachedDb) {
       return { client: cachedClient, db: cachedDb };
     }

     const client = new MongoClient(uri);
     const db = client.db(dbName);

     cachedClient = client;
     cachedDb = db;

     return { client, db };
   }

   export async function getCollection(collectionName: string) {
     const { db } = await connectToDatabase();
     return db.collection(collectionName);
   }
   ```

3. **Verify Connection**: Create a health check endpoint (`app/api/health/route.ts`)

---

## Clerk Authentication Setup

### 1. Create Clerk Application

1. Go to [Clerk Dashboard](https://dashboard.clerk.com)
2. Create a new application
3. Choose "Next.js" as the framework
4. Copy your **Publishable Key** and **Secret Key**

### 2. Configure Clerk in Your App

1. Install Clerk SDK:
   ```bash
   npm install @clerk/nextjs
   ```

2. Add Clerk Provider to `app/layout.tsx`:
   ```typescript
   import { ClerkProvider } from "@clerk/nextjs";

   export default function RootLayout({
     children,
   }: {
     children: React.ReactNode;
   }) {
     return (
       <ClerkProvider>
         <html lang="en">
           <body>{children}</body>
         </html>
       </ClerkProvider>
     );
   }
   ```

3. Create middleware (`middleware.ts`):
   ```typescript
   import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

   const isPublicRoute = createRouteMatcher([
     "/sign-in(.*)",
     "/sign-up(.*)",
     "/api/health",
   ]);

   export default clerkMiddleware(async (auth, req) => {
     if (!isPublicRoute(req)) {
       await auth.protect();
     }
   });

   export const config = {
     matcher: [
       '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
       '/(api|trpc)(.*)',
     ],
   };
   ```

4. Create sign-in/sign-up pages in `app/(auth)/` using Clerk components

### 3. Restrict Access to App Owner Only

**Important**: Add middleware to verify the user is the app owner:

```typescript
// lib/clerk-utils.ts
export async function isAppOwner(userId: string): Promise<boolean> {
  // Add your app owner ID(s) here
  const APP_OWNER_IDS = [process.env.CLERK_OWNER_ID!];
  return APP_OWNER_IDS.includes(userId);
}
```

---

## Getting Started - Initial Setup

### 1. Create New Next.js Project

```bash
npx create-next-app@latest analytics-dashboard --typescript --tailwind --eslint
cd analytics-dashboard
```

### 2. Install Dependencies

```bash
npm install @clerk/nextjs mongodb recharts lucide-react
npm install -D @types/node @types/react
```

### 3. Set Up Environment Variables

```bash
cp .env.local.example .env.local
# Edit .env.local with your actual values
```

### 4. Create MongoDB Connection Utility

Create `lib/mongodb.ts` (see MongoDB section above)

### 5. Set Up Clerk

Follow the Clerk Authentication Setup section above

### 6. Run Development Server

```bash
npm run dev
# Navigate to http://localhost:3000
```

---

## Data Access Patterns

### Key Queries

All queries should be read-only from the main app's MongoDB database.

**Example Analytics Query** (`lib/analytics-queries.ts`):
```typescript
import { getCollection } from "./mongodb";

export async function getAppWideMetrics() {
  const analyticsCollection = await getCollection("analytics");
  
  return await analyticsCollection
    .aggregate([
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$revenue" },
          totalOrders: { $sum: "$orders" },
          totalStores: { $sum: 1 },
        },
      },
    ])
    .toArray();
}

export async function getStoreAnalytics(storeId: string) {
  const analyticsCollection = await getCollection("analytics");
  
  return await analyticsCollection
    .findOne({ shopId: storeId });
}
```

### Recommended Collections Structure

Ensure your main app stores analytics with this structure:
- `shopId` - Reference to the store
- `timestamp` - When data was recorded
- `revenue` - Total revenue
- `orders` - Number of orders
- `campaigns` - Campaign performance data
- `videoViews` - Video engagement metrics

---

## API Routes

Create API endpoints that the frontend will consume:

### `/api/analytics/app-wide`
Returns aggregated app-wide metrics:
```json
{
  "totalRevenue": 50000,
  "totalOrders": 1200,
  "activeStores": 25,
  "topPerformingStores": [...],
  "revenueByDate": [...]
}
```

### `/api/analytics/stores`
Returns list of all stores with summary metrics

### `/api/analytics/stores/[id]`
Returns detailed metrics for a specific store

### `/api/health`
Health check endpoint to verify database connection

---

## Development Workflow

### Starting Development

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.local.example .env.local
# Edit with your values

# Start dev server
npm run dev
```

### Creating New Pages

1. Create a new folder in `app/(dashboard)/`
2. Add `page.tsx` with your component
3. Create API route in `app/api/` if needed
4. Import data fetching functions from `lib/`

### Best Practices

- ✅ Always use live data from MongoDB (no mock data per user preferences)
- ✅ Implement proper error handling and loading states
- ✅ Use TypeScript for type safety
- ✅ Create reusable components for charts and metrics
- ✅ Implement proper authentication checks
- ✅ Add logging for debugging

---

## Deployment to Production

### 1. Prepare for Production

```bash
# Build locally to test
npm run build
npm run start
```

### 2. Deploy to Vercel

```bash
# Push to git (make sure you have a GitHub repo)
git push origin main

# Go to https://vercel.com and import the GitHub repo
```

### 3. Configure Environment Variables in Vercel

In Vercel dashboard:
1. Go to Settings → Environment Variables
2. Add all variables from `.env.local`
3. Make sure to add production values (analytics.optizenapp.com)

### 4. Set Up Subdomain

In your DNS provider:
1. Add CNAME record pointing to your Vercel deployment
2. Configure SSL certificate (Vercel does this automatically)

Example DNS record:
```
analytics.optizenapp.com CNAME cname.vercel-dns.com.
```

---

## Database Backups & Safety

⚠️ **Important**: This app has **read-only access** to production data. 

- Never write to the main database from this app
- Never modify collections from this dashboard
- All queries should be read operations only
- Consider implementing query timeouts for complex aggregations

---

## Monitoring & Debugging

### Enable Debug Mode

Set `DEBUG_MODE=true` in `.env.local` to see detailed logging.

### Check Database Connection

Visit `/api/health` to verify MongoDB connection is working.

### Clerk Debugging

Use Clerk's dashboard to verify:
- User authentication status
- Session activity
- Organization settings

---

## Future Enhancements

1. **Phase 1 (Initial)**: App-wide dashboard and per-store metrics
2. **Phase 2**: Custom report generation and export
3. **Phase 3**: Real-time notifications and alerts
4. **Phase 4**: Widget integration into main app dashboard
5. **Phase 5**: Predictive analytics and recommendations

---

## Support & Resources

### Documentation Links
- [Next.js Documentation](https://nextjs.org/docs)
- [Clerk Documentation](https://clerk.com/docs)
- [MongoDB Node Driver](https://www.mongodb.com/docs/drivers/node/)
- [Tailwind CSS](https://tailwindcss.com/docs)

### Key Contacts/Variables
- Main App MongoDB Connection: `MONGODB_URI`
- Clerk Dashboard: https://dashboard.clerk.com
- Vercel Dashboard: https://vercel.com

---

## Troubleshooting

### MongoDB Connection Issues
- Verify IP is whitelisted in MongoDB Atlas
- Check connection string has correct username/password
- Ensure database name is correct

### Clerk Authentication Issues
- Verify NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY is set
- Check Clerk dashboard for active session
- Clear browser cookies and try again

### Build/Deploy Errors
- Clear `.next` folder: `rm -rf .next`
- Reinstall dependencies: `rm -rf node_modules && npm install`
- Check all environment variables are set in Vercel

---

## Getting Help

When starting development on this project:
1. Verify all environment variables are correctly set
2. Run `npm run dev` and check for errors
3. Visit `/api/health` to verify database connection
4. Check Clerk dashboard for authentication setup
5. Reference this guide for structure and setup details
