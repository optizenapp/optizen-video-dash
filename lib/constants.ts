export const APP_NAME = "Optizen Analytics Dashboard";
export const APP_DESCRIPTION = "B2B Analytics Hub for Optizen App Owner";

export const ROUTES = {
  HOME: "/",
  SIGN_IN: "/sign-in",
  SIGN_UP: "/sign-up",
  APP_OVERVIEW: "/app-overview",
  STORES: "/stores",
  REVENUE: "/revenue",
  CAMPAIGNS: "/campaigns",
  REPORTS: "/reports",
  ADMIN_DISCOUNTS: "/admin/discounts",
} as const;

export const API_ROUTES = {
  HEALTH: "/api/health",
  ANALYTICS_APP_WIDE: "/api/analytics/app-wide",
  ANALYTICS_STORES: "/api/analytics/stores",
  STORES: "/api/stores",
} as const;

