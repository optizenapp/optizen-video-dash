# Discount Management Setup Guide

This guide explains how to set up and use the discount management feature in the Optizen Analytics Dashboard.

## Overview

The discount management feature allows you to create and manage pre-assigned discounts for merchant stores before they install the Optizen Video Upsell app. The discounts are automatically applied when merchants subscribe to a plan.

## Prerequisites

1. ✅ The main Optizen Video Upsell app must be running with admin API endpoints enabled
2. ✅ You need the admin API key from the main app
3. ✅ Both apps should use the same admin key for security

## Environment Variables Setup

### Step 1: Create `.env.local` file

Create a `.env.local` file in the root directory of your analytics dashboard:

```bash
cp .env.example .env.local
```

### Step 2: Configure Required Variables

Add the following variables to your `.env.local`:

```bash
# Main Optizen Video App URL
NEXT_PUBLIC_VIDEO_APP_URL=https://video.optizenai.com

# Admin API Key (must match the key in the main app)
NEXT_PUBLIC_ADMIN_KEY=your_secret_admin_key_here
```

### Step 3: Verify Configuration

Make sure both variables are set correctly:

- **NEXT_PUBLIC_VIDEO_APP_URL**: The URL where your main Optizen Video Upsell app is hosted
- **NEXT_PUBLIC_ADMIN_KEY**: The secret admin key that authorizes API requests

⚠️ **Security Note**: Never commit your `.env.local` file to version control. The `.gitignore` file is configured to exclude all `.env*` files.

## Using the Discount Management UI

### Accessing the Admin Panel

1. Navigate to: `https://analytics.optizenai.com/admin/discounts`
2. You'll see the discount management interface with:
   - Add new discount form
   - Search and filter options
   - List of existing discounts

### Adding a New Discount

1. Click the **"Add Discount"** button
2. Fill in the form:
   - **Shop Domain** (required): The merchant's `.myshopify.com` domain
     - Example: `acme-store.myshopify.com`
   - **Discount Type** (required): Choose between:
     - **Percentage (%)**: Discount as a percentage (e.g., 20%)
     - **Fixed Amount ($)**: Fixed dollar amount off (e.g., $20)
   - **Discount Amount** (required): The numeric value
     - For percentage: Enter 20 for 20%
     - For fixed: Enter 20 for $20
   - **Reason** (optional): Note why this discount was given
     - Examples: "Early adopter", "Beta tester", "Special promotion"
3. Click **"Apply Discount"**
4. You'll receive a confirmation with the generated discount code

### Managing Existing Discounts

#### Search and Filter
- **Search bar**: Search by shop domain or discount code
- **Status filter**: Filter by Active or Inactive discounts

#### View Discount Details
Each discount in the table shows:
- Shop Domain
- Discount Code (unique identifier)
- Type (% or $)
- Amount
- Reason
- Current Plan (if merchant has installed the app)
- Status (Active/Inactive)
- Creation Date

#### Remove a Discount
1. Find the discount in the list
2. Click the **"Remove"** button
3. Confirm the deletion
4. The discount will be removed from future subscriptions

### Pagination
- Use **Previous** and **Next** buttons to navigate through pages
- Shows 50 discounts per page by default

## How Discounts Work

### Discount Application Flow

1. **Admin creates discount**: You add a merchant's domain to the system
2. **System generates code**: A unique discount code is automatically created (e.g., `OPTIZEN-V97N72-ABCDEF`)
3. **Merchant installs app**: When the merchant installs from that domain
4. **Discount auto-applies**: On their first subscription (or any plan change), the discounted rate is sent to Shopify
5. **Persistence**: If they uninstall and reinstall, the discount still applies

### Important Notes

✅ **Discounts apply to**:
- Initial subscription charges
- Plan upgrades/downgrades
- Any future subscription changes

❌ **Discounts do NOT apply to**:
- Existing/active subscriptions (only new charges)
- One-time charges
- After the discount is manually removed

### Example Scenarios

#### Scenario 1: Early Adopter (20% off)
```
Shop: early-bird.myshopify.com
Type: Percentage
Amount: 20
Reason: Early adopter program

Result: When they subscribe to Pro plan ($99/month), they pay $79.20/month
```

#### Scenario 2: Beta Tester ($15 off)
```
Shop: beta-tester.myshopify.com
Type: Fixed
Amount: 15
Reason: Beta testing program

Result: When they subscribe to Starter plan ($29/month), they pay $14/month
```

## Troubleshooting

### Error: "NEXT_PUBLIC_ADMIN_KEY is not configured"
- Make sure you've added `NEXT_PUBLIC_ADMIN_KEY` to your `.env.local` file
- Restart your development server after adding environment variables

### Error: "NEXT_PUBLIC_VIDEO_APP_URL is not configured"
- Make sure you've added `NEXT_PUBLIC_VIDEO_APP_URL` to your `.env.local` file
- Verify the URL is correct and includes the protocol (https://)

### Error: "Failed to apply discount" or 401/403 errors
- Verify your admin key matches the one configured in the main app
- Check that the main app's admin endpoints are accessible
- Confirm both apps are using the same admin key

### Discount not appearing after creation
- Check the search/filter settings
- Try refreshing the page
- Verify the API call succeeded (check browser console for errors)

### Discount not applying to merchant
- Verify the shop domain exactly matches the merchant's `.myshopify.com` domain
- Check that the discount status is "Active"
- Confirm the merchant hasn't already subscribed before the discount was added

## API Endpoints Reference

The analytics app connects to these endpoints on the main app:

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/admin/discounts` | POST | Apply a new discount |
| `/api/admin/discounts` | DELETE | Remove a discount |
| `/api/admin/discounts` | GET | Get discount for a specific shop |
| `/api/admin/discounts/list` | GET | List all discounts with filters |

All requests require the `x-admin-key` header for authentication.

## Security Best Practices

1. ✅ **Never commit** `.env.local` or expose your admin key
2. ✅ **Use HTTPS** for the main app URL in production
3. ✅ **Share admin keys** only through secure channels (password managers, encrypted messages)
4. ✅ **Rotate keys** periodically for security
5. ✅ **Limit access** to the admin discount page to trusted administrators only

## Support

For issues or questions about the discount system:

1. Check the main app logs at the video app server
2. Verify MongoDB `PreAssignedDiscount` collection
3. Test API endpoints directly using curl (see ANALYTICS_DISCOUNT_INTEGRATION.md)
4. Check browser console for frontend errors

## Related Documentation

- `ANALYTICS_DISCOUNT_INTEGRATION.md` - Full technical integration guide
- `.env.example` - Template for environment variables
- Main app documentation - Admin API endpoints reference

