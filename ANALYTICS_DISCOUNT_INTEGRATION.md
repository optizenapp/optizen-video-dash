# Pre-Assigned Discount System - Analytics App Integration Guide

## Overview

The Optizen Video Upsell app now supports **pre-assigned discounts** that can be managed from the analytics dashboard. Merchants can be offered custom discounts on their monthly subscription plans before they install the app.

**How it works:**
1. Admin adds a merchant's `.myshopify.com` domain to the discount system
2. System generates a unique discount code
3. When merchant installs the app, the discount is automatically applied
4. On first subscription (or any plan change), the discounted rate is sent to Shopify
5. If merchant uninstalls/reinstalls, the discount persists

---

## What the Analytics App Needs to Implement

The analytics dashboard needs a **new admin section** for discount management at:
```
https://analytics.optizenai.com/admin/discounts
```

### 1. Requirements

**Backend Requirements:**
- ✅ ALREADY DONE - The main Optizen Video Upsell app has all backend APIs ready
- Your analytics app just needs to call these APIs with the admin key

**Frontend Requirements:**
- New page/route: `/admin/discounts`
- Search & filter UI for managing discounts
- Form to add new discounts
- Action buttons to remove/edit discounts
- List view with discount details

---

## API Reference

All admin discount APIs are in the **main Optizen app** at `video.optizenai.com`.

### Authentication
All requests require the admin key:
```
Header: x-admin-key: {OPTIZEN_ADMIN_KEY}
```

The admin key should be stored in your analytics app's environment:
```
NEXT_ADMIN_KEY=your_secret_admin_key
```

### Endpoints

#### 1. Apply Discount
```
POST https://video.optizenai.com/api/admin/discounts
Header: x-admin-key: {OPTIZEN_ADMIN_KEY}

Body: {
  "shopDomain": "acme-store.myshopify.com",
  "discountType": "percentage" | "fixed",
  "discountAmount": 20,  // 20% off or $20 off
  "reason": "Early adopter"  // optional
}

Response: {
  "success": true,
  "discount": {
    "shopDomain": "acme-store.myshopify.com",
    "discountCode": "OPTIZEN-V97N72-ABCDEF",
    "discountType": "percentage",
    "discountAmount": 20,
    "reason": "Early adopter"
  }
}
```

#### 2. Remove Discount
```
DELETE https://video.optizenai.com/api/admin/discounts?shopDomain=acme-store.myshopify.com
Header: x-admin-key: {OPTIZEN_ADMIN_KEY}

Response: {
  "success": true,
  "message": "Discount removed for acme-store.myshopify.com"
}
```

#### 3. Get Discount for Store
```
GET https://video.optizenai.com/api/admin/discounts?shopDomain=acme-store.myshopify.com
Header: x-admin-key: {OPTIZEN_ADMIN_KEY}

Response: {
  "discount": {
    "shopDomain": "acme-store.myshopify.com",
    "discountCode": "OPTIZEN-V97N72-ABCDEF",
    "discountType": "percentage",
    "discountAmount": 20,
    "active": true,
    "createdAt": "2025-10-31T12:34:56.789Z",
    "reason": "Early adopter"
  }
}

// If no discount exists:
{
  "discount": null,
  "message": "No discount found for acme-store.myshopify.com"
}
```

#### 4. List All Discounts
```
GET https://video.optizenai.com/api/admin/discounts/list?active=true&limit=50&offset=0&search=acme
Header: x-admin-key: {OPTIZEN_ADMIN_KEY}

Query Parameters:
  - active: 'true' | 'false' | undefined (default: all)
  - search: string (searches shopDomain or discountCode)
  - limit: number (default: 100, max: 1000)
  - offset: number (default: 0)

Response: {
  "success": true,
  "total": 42,
  "limit": 50,
  "offset": 0,
  "count": 42,
  "discounts": [
    {
      "shopDomain": "acme-store.myshopify.com",
      "discountCode": "OPTIZEN-V97N72-ABCDEF",
      "discountType": "percentage",
      "discountAmount": 20,
      "active": true,
      "createdAt": "2025-10-31T12:34:56.789Z",
      "reason": "Early adopter",
      "shopInfo": {
        "planType": "starter",
        "installedAt": "2025-11-01T10:00:00.000Z",
        "isActive": true
      }
    },
    // ... more discounts
  ]
}
```

---

## UI Implementation Checklist

### Page: `/admin/discounts`

#### Section 1: Add New Discount (Form)
- [ ] Input: Shop Domain (required, e.g., "acme-store.myshopify.com")
- [ ] Radio: Discount Type
  - [ ] "Percentage (%)" 
  - [ ] "Fixed Amount ($)"
- [ ] Input: Discount Amount (number)
- [ ] Input: Reason (optional, e.g., "Early adopter", "Beta tester")
- [ ] Button: "Apply Discount"
- [ ] Success/Error messages

#### Section 2: List & Search (Table)
- [ ] Search bar (searches shopDomain or discountCode)
- [ ] Filter dropdown: Active status (All / Active / Inactive)
- [ ] Pagination controls
- [ ] Table columns:
  - [ ] Shop Domain
  - [ ] Discount Code
  - [ ] Type (Percentage/Fixed)
  - [ ] Amount
  - [ ] Reason
  - [ ] Created Date
  - [ ] Plan Type (from shopInfo)
  - [ ] Status (Active/Inactive badge)
  - [ ] Actions (Remove button, Edit button)

#### Section 3: Actions
- [ ] Remove discount button (with confirmation)
- [ ] Edit discount button (optional - can remove and re-add)
- [ ] View shop info (plan type, install date, etc.)

---

## Implementation Example (Next.js)

### API Service (`lib/discount-api.ts`)
```typescript
const ADMIN_KEY = process.env.NEXT_ADMIN_KEY
const BASE_URL = process.env.NEXT_PUBLIC_VIDEO_APP_URL // e.g., https://video.optizenai.com

export async function applyDiscount(
  shopDomain: string,
  discountType: 'percentage' | 'fixed',
  discountAmount: number,
  reason?: string
) {
  const response = await fetch(`${BASE_URL}/api/admin/discounts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-admin-key': ADMIN_KEY!
    },
    body: JSON.stringify({
      shopDomain,
      discountType,
      discountAmount,
      reason
    })
  })
  return response.json()
}

export async function removeDiscount(shopDomain: string) {
  const response = await fetch(
    `${BASE_URL}/api/admin/discounts?shopDomain=${encodeURIComponent(shopDomain)}`,
    {
      method: 'DELETE',
      headers: {
        'x-admin-key': ADMIN_KEY!
      }
    }
  )
  return response.json()
}

export async function listDiscounts(
  search?: string,
  active?: boolean,
  limit = 50,
  offset = 0
) {
  const params = new URLSearchParams()
  if (search) params.append('search', search)
  if (active !== undefined) params.append('active', active.toString())
  params.append('limit', limit.toString())
  params.append('offset', offset.toString())

  const response = await fetch(
    `${BASE_URL}/api/admin/discounts/list?${params}`,
    {
      headers: {
        'x-admin-key': ADMIN_KEY!
      }
    }
  )
  return response.json()
}

export async function getDiscount(shopDomain: string) {
  const response = await fetch(
    `${BASE_URL}/api/admin/discounts?shopDomain=${encodeURIComponent(shopDomain)}`,
    {
      headers: {
        'x-admin-key': ADMIN_KEY!
      }
    }
  )
  return response.json()
}
```

### Page Component (`app/admin/discounts/page.tsx`)
```typescript
'use client'

import { useState, useEffect } from 'react'
import { applyDiscount, removeDiscount, listDiscounts } from '@/lib/discount-api'

export default function DiscountsPage() {
  const [discounts, setDiscounts] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadDiscounts()
  }, [search])

  const loadDiscounts = async () => {
    setLoading(true)
    try {
      const result = await listDiscounts(search || undefined)
      setDiscounts(result.discounts || [])
    } catch (error) {
      console.error('Failed to load discounts:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleApplyDiscount = async (formData: any) => {
    try {
      await applyDiscount(
        formData.shopDomain,
        formData.discountType,
        parseFloat(formData.discountAmount),
        formData.reason
      )
      loadDiscounts()
    } catch (error) {
      console.error('Failed to apply discount:', error)
    }
  }

  const handleRemoveDiscount = async (shopDomain: string) => {
    if (!confirm(`Remove discount for ${shopDomain}?`)) return
    try {
      await removeDiscount(shopDomain)
      loadDiscounts()
    } catch (error) {
      console.error('Failed to remove discount:', error)
    }
  }

  return (
    <div>
      {/* Add form here */}
      {/* List table here */}
    </div>
  )
}
```

---

## Environment Variables

Add these to your analytics app's `.env.local`:

```
# Optizen Video App API
NEXT_PUBLIC_VIDEO_APP_URL=https://video.optizenai.com
NEXT_ADMIN_KEY=your_secret_admin_key_here

# Make sure both apps share the same admin key for security
```

---

## Workflow: Admin Using the UI

### Example: Offer 20% discount to early adopter
1. Go to `/admin/discounts`
2. Fill form:
   - Shop Domain: `early-adopter-store.myshopify.com`
   - Discount Type: `Percentage`
   - Amount: `20`
   - Reason: `Early adopter - beta tester`
3. Click "Apply Discount"
4. System shows: "Discount code OPTIZEN-V97N72-ABCDEF created"
5. Merchant installs app from `early-adopter-store.myshopify.com`
6. Discount is auto-applied ✅
7. When they subscribe to Pro ($99/month), they pay $79.20 instead ✅

### Example: Remove discount
1. Search for store in the list
2. Click "Remove" button
3. Confirm deletion
4. Discount is removed from future subscriptions

---

## Important Notes

⚠️ **Security:**
- Keep `NEXT_ADMIN_KEY` secret (never commit to git)
- Share the same key between both apps securely
- Admin endpoints validate the key on every request

⚠️ **Discount Persistence:**
- Discounts apply to ANY subscription changes (upgrades/downgrades)
- If merchant uninstalls and reinstalls, discount still applies
- Discount applies only to **future subscriptions**, not existing ones

⚠️ **Shopify Billing:**
- The discounted price is sent directly to Shopify
- Merchant sees the discounted amount in their Shopify admin
- You can see all charges in Shopify's charge history

---

## Testing

### Test Discount Application
```bash
curl -X POST https://video.optizenai.com/api/admin/discounts \
  -H "x-admin-key: your_admin_key" \
  -H "Content-Type: application/json" \
  -d '{
    "shopDomain": "test-store.myshopify.com",
    "discountType": "percentage",
    "discountAmount": 10,
    "reason": "Testing"
  }'
```

### Test Discount List
```bash
curl https://video.optizenai.com/api/admin/discounts/list \
  -H "x-admin-key: your_admin_key"
```

---

## Support

For issues or questions:
1. Check the main app logs at `video.optizenai.com`
2. Check the MongoDB PreAssignedDiscount collection
3. Verify admin key is correctly configured
4. Test API endpoints directly with curl

---

**Status:** ✅ Backend ready for integration  
**Next Step:** Implement UI components in analytics app
