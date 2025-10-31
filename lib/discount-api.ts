// API service for discount management
// Connects to the main Optizen Video Upsell app's admin endpoints

const ADMIN_KEY = process.env.NEXT_PUBLIC_ADMIN_KEY;
const BASE_URL = process.env.NEXT_PUBLIC_VIDEO_APP_URL; // e.g., https://video.optizenai.com

export interface Discount {
  shopDomain: string;
  discountCode: string;
  discountType: "percentage" | "fixed";
  discountAmount: number;
  active: boolean;
  createdAt: string;
  reason?: string;
  shopInfo?: {
    planType?: string;
    installedAt?: string;
    isActive?: boolean;
  };
}

export interface DiscountListResponse {
  success: boolean;
  total: number;
  limit: number;
  offset: number;
  count: number;
  discounts: Discount[];
}

export interface ApplyDiscountResponse {
  success: boolean;
  discount: Discount;
}

export interface RemoveDiscountResponse {
  success: boolean;
  message: string;
}

export interface GetDiscountResponse {
  discount: Discount | null;
  message?: string;
}

/**
 * Apply a new discount to a shop domain
 */
export async function applyDiscount(
  shopDomain: string,
  discountType: "percentage" | "fixed",
  discountAmount: number,
  reason?: string
): Promise<ApplyDiscountResponse> {
  if (!ADMIN_KEY) {
    throw new Error("NEXT_PUBLIC_ADMIN_KEY is not configured");
  }
  if (!BASE_URL) {
    throw new Error("NEXT_PUBLIC_VIDEO_APP_URL is not configured");
  }

  const response = await fetch(`${BASE_URL}/api/admin/discounts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-admin-key": ADMIN_KEY,
    },
    body: JSON.stringify({
      shopDomain,
      discountType,
      discountAmount,
      reason,
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: "Failed to apply discount" }));
    throw new Error(error.message || "Failed to apply discount");
  }

  return response.json();
}

/**
 * Remove a discount from a shop domain
 */
export async function removeDiscount(
  shopDomain: string
): Promise<RemoveDiscountResponse> {
  if (!ADMIN_KEY) {
    throw new Error("NEXT_PUBLIC_ADMIN_KEY is not configured");
  }
  if (!BASE_URL) {
    throw new Error("NEXT_PUBLIC_VIDEO_APP_URL is not configured");
  }

  const response = await fetch(
    `${BASE_URL}/api/admin/discounts?shopDomain=${encodeURIComponent(shopDomain)}`,
    {
      method: "DELETE",
      headers: {
        "x-admin-key": ADMIN_KEY,
      },
    }
  );

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: "Failed to remove discount" }));
    throw new Error(error.message || "Failed to remove discount");
  }

  return response.json();
}

/**
 * List all discounts with optional filters
 */
export async function listDiscounts(
  search?: string,
  active?: boolean,
  limit = 50,
  offset = 0
): Promise<DiscountListResponse> {
  if (!ADMIN_KEY) {
    throw new Error("NEXT_PUBLIC_ADMIN_KEY is not configured");
  }
  if (!BASE_URL) {
    throw new Error("NEXT_PUBLIC_VIDEO_APP_URL is not configured");
  }

  const params = new URLSearchParams();
  if (search) params.append("search", search);
  if (active !== undefined) params.append("active", active.toString());
  params.append("limit", limit.toString());
  params.append("offset", offset.toString());

  const response = await fetch(
    `${BASE_URL}/api/admin/discounts/list?${params}`,
    {
      headers: {
        "x-admin-key": ADMIN_KEY,
      },
    }
  );

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: "Failed to list discounts" }));
    throw new Error(error.message || "Failed to list discounts");
  }

  return response.json();
}

/**
 * Get a specific discount for a shop domain
 */
export async function getDiscount(
  shopDomain: string
): Promise<GetDiscountResponse> {
  if (!ADMIN_KEY) {
    throw new Error("NEXT_PUBLIC_ADMIN_KEY is not configured");
  }
  if (!BASE_URL) {
    throw new Error("NEXT_PUBLIC_VIDEO_APP_URL is not configured");
  }

  const response = await fetch(
    `${BASE_URL}/api/admin/discounts?shopDomain=${encodeURIComponent(shopDomain)}`,
    {
      headers: {
        "x-admin-key": ADMIN_KEY,
      },
    }
  );

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: "Failed to get discount" }));
    throw new Error(error.message || "Failed to get discount");
  }

  return response.json();
}

