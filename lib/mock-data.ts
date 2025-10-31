// Mock data for development/demo purposes

export const mockAppWideMetrics = {
  totalRevenue: 125840.50,
  totalOrders: 3420,
  totalStores: 15,
  revenueByDate: [
    { date: "2025-09-18", revenue: 3200, orders: 89 },
    { date: "2025-09-19", revenue: 3800, orders: 95 },
    { date: "2025-09-20", revenue: 4100, orders: 102 },
    { date: "2025-09-21", revenue: 3600, orders: 88 },
    { date: "2025-09-22", revenue: 4500, orders: 110 },
    { date: "2025-09-23", revenue: 5200, orders: 125 },
    { date: "2025-09-24", revenue: 4800, orders: 115 },
    { date: "2025-09-25", revenue: 3900, orders: 92 },
    { date: "2025-09-26", revenue: 4200, orders: 98 },
    { date: "2025-09-27", revenue: 4600, orders: 108 },
    { date: "2025-09-28", revenue: 5100, orders: 120 },
    { date: "2025-09-29", revenue: 4900, orders: 118 },
    { date: "2025-09-30", revenue: 5400, orders: 128 },
    { date: "2025-10-01", revenue: 5800, orders: 135 },
    { date: "2025-10-02", revenue: 6200, orders: 145 },
    { date: "2025-10-03", revenue: 5600, orders: 130 },
    { date: "2025-10-04", revenue: 5900, orders: 138 },
    { date: "2025-10-05", revenue: 6500, orders: 152 },
    { date: "2025-10-06", revenue: 7200, orders: 168 },
    { date: "2025-10-07", revenue: 6800, orders: 158 },
    { date: "2025-10-08", revenue: 6300, orders: 148 },
    { date: "2025-10-09", revenue: 5700, orders: 132 },
    { date: "2025-10-10", revenue: 6100, orders: 142 },
    { date: "2025-10-11", revenue: 6600, orders: 155 },
    { date: "2025-10-12", revenue: 7100, orders: 165 },
    { date: "2025-10-13", revenue: 6900, orders: 160 },
    { date: "2025-10-14", revenue: 7400, orders: 172 },
    { date: "2025-10-15", revenue: 7800, orders: 182 },
    { date: "2025-10-16", revenue: 8200, orders: 195 },
    { date: "2025-10-17", revenue: 7600, orders: 178 },
  ],
  topPerformingStores: [
    {
      shopId: "store_001",
      shopName: "Fashion Forward",
      totalRevenue: 28500.75,
      totalOrders: 845,
    },
    {
      shopId: "store_002",
      shopName: "Tech Haven",
      totalRevenue: 24200.00,
      totalOrders: 612,
    },
    {
      shopId: "store_003",
      shopName: "Home Essentials",
      totalRevenue: 19800.50,
      totalOrders: 523,
    },
    {
      shopId: "store_004",
      shopName: "Beauty Bliss",
      totalRevenue: 15600.25,
      totalOrders: 489,
    },
    {
      shopId: "store_005",
      shopName: "Sports Central",
      totalRevenue: 12400.00,
      totalOrders: 356,
    },
    {
      shopId: "store_006",
      shopName: "Pet Paradise",
      totalRevenue: 10200.75,
      totalOrders: 298,
    },
    {
      shopId: "store_007",
      shopName: "Kitchen Magic",
      totalRevenue: 8900.50,
      totalOrders: 245,
    },
    {
      shopId: "store_008",
      shopName: "Garden Grove",
      totalRevenue: 6800.00,
      totalOrders: 187,
    },
  ],
  timestamp: new Date().toISOString(),
};

export const mockStores = [
  {
    _id: "store_001",
    name: "Fashion Forward",
    domain: "fashionforward.myshopify.com",
    createdAt: "2025-01-15T10:30:00Z",
  },
  {
    _id: "store_002",
    name: "Tech Haven",
    domain: "techhaven.myshopify.com",
    createdAt: "2025-02-20T14:15:00Z",
  },
  {
    _id: "store_003",
    name: "Home Essentials",
    domain: "homeessentials.myshopify.com",
    createdAt: "2025-03-10T09:45:00Z",
  },
  {
    _id: "store_004",
    name: "Beauty Bliss",
    domain: "beautybliss.myshopify.com",
    createdAt: "2025-03-25T11:20:00Z",
  },
  {
    _id: "store_005",
    name: "Sports Central",
    domain: "sportscentral.myshopify.com",
    createdAt: "2025-04-05T16:00:00Z",
  },
  {
    _id: "store_006",
    name: "Pet Paradise",
    domain: "petparadise.myshopify.com",
    createdAt: "2025-05-12T13:30:00Z",
  },
  {
    _id: "store_007",
    name: "Kitchen Magic",
    domain: "kitchenmagic.myshopify.com",
    createdAt: "2025-06-08T10:00:00Z",
  },
  {
    _id: "store_008",
    name: "Garden Grove",
    domain: "gardengrove.myshopify.com",
    createdAt: "2025-07-14T15:45:00Z",
  },
];

export const mockStoreAnalytics = (storeId: string) => {
  const store = mockStores.find((s) => s._id === storeId);
  if (!store) return null;

  return {
    shopId: storeId,
    revenue: 12500 + Math.random() * 15000,
    orders: 300 + Math.floor(Math.random() * 500),
    videoViews: 5000 + Math.floor(Math.random() * 10000),
    campaigns: 8 + Math.floor(Math.random() * 12),
  };
};

