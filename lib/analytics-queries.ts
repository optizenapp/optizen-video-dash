import { getCollection } from "./mongodb";
import { ObjectId } from "mongodb";

export async function getAppWideMetrics() {
  const analyticsCollection = await getCollection("analytics");
  
  const result = await analyticsCollection
    .aggregate([
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$revenue" },
          totalOrders: { $sum: "$orders" },
          totalStores: { $addToSet: "$shopId" },
        },
      },
      {
        $project: {
          _id: 0,
          totalRevenue: 1,
          totalOrders: 1,
          totalStores: { $size: "$totalStores" },
        },
      },
    ])
    .toArray();

  return result[0] || { totalRevenue: 0, totalOrders: 0, totalStores: 0 };
}

export async function getStoreAnalytics(storeId: string) {
  // Get store details
  const shopsCollection = await getCollection("shops");
  const store = await shopsCollection.findOne({ _id: new ObjectId(storeId) });
  
  if (!store) return null;
  
  const shopDomain = store.shopDomain || store.domain;
  
  // Get all campaigns for this store
  const campaignsCollection = await getCollection("campaigns");
  const campaigns = await campaignsCollection
    .find({ shopDomain })
    .sort({ createdAt: -1 })
    .toArray();
  
  // Get all analytics summaries for this store
  const analyticsSummaries = await getCollection("analyticssummaries");
  const summaries = await analyticsSummaries.find({ shopDomain }).toArray();
  
  // Create a map of campaign analytics by campaignId
  const analyticsMap = new Map();
  summaries.forEach((summary: any) => {
    const campaignId = summary.campaignId?.toString();
    if (campaignId) {
      if (!analyticsMap.has(campaignId)) {
        analyticsMap.set(campaignId, {
          impressions: 0,
          views: 0,
          addToCartConversions: 0,
          conversions: 0,
          revenue: 0,
        });
      }
      const stats = analyticsMap.get(campaignId);
      stats.impressions += summary.impressions || 0;
      stats.views += summary.views || 0;
      stats.addToCartConversions += summary.addToCartConversions || 0;
      stats.conversions += summary.conversions || 0;
      stats.revenue += summary.revenue || 0;
    }
  });
  
  // Get AI videos for this store
  const videosCollection = await getCollection("aivideos");
  const videos = await videosCollection
    .find({ shopDomain })
    .sort({ createdAt: -1 })
    .toArray();
  
  // Calculate aggregate stats
  let totalImpressions = 0;
  let totalViews = 0;
  let totalAddToCartConversions = 0;
  let totalConversions = 0;
  let totalRevenue = 0;
  
  campaigns.forEach((campaign: any) => {
    const campaignId = campaign._id.toString();
    const analytics = analyticsMap.get(campaignId);
    if (analytics) {
      totalImpressions += analytics.impressions;
      totalViews += analytics.views;
      totalAddToCartConversions += analytics.addToCartConversions;
      totalConversions += analytics.conversions;
      totalRevenue += analytics.revenue;
    }
  });
  
  const activeCampaigns = campaigns.filter((c: any) => c.isActive).length;
  const addToCartRate = totalViews > 0 
    ? ((totalAddToCartConversions / totalViews) * 100).toFixed(1) 
    : "0.0";
  const revenueConversionRate = totalViews > 0 
    ? ((totalConversions / totalViews) * 100).toFixed(1) 
    : "0.0";
  
  // Format campaigns with their analytics
  const formattedCampaigns = campaigns.map((campaign: any) => {
    const campaignId = campaign._id.toString();
    const analytics = analyticsMap.get(campaignId) || {
      impressions: 0,
      views: 0,
      addToCartConversions: 0,
      conversions: 0,
      revenue: 0,
    };
    
    const campaignAddToCartRate = analytics.views > 0 
      ? ((analytics.addToCartConversions / analytics.views) * 100).toFixed(1) 
      : "0.0";
    const campaignRevenueRate = analytics.views > 0 
      ? ((analytics.conversions / analytics.views) * 100).toFixed(1) 
      : "0.0";
    
    return {
      _id: campaignId,
      name: campaign.name || "Unnamed Campaign",
      status: campaign.isActive ? "active" : "inactive",
      impressions: analytics.impressions,
      views: analytics.views,
      addToCartConversions: analytics.addToCartConversions,
      revenueConversions: analytics.conversions,
      addToCartRate: campaignAddToCartRate,
      revenueRate: campaignRevenueRate,
      revenue: analytics.revenue,
      createdAt: campaign.createdAt,
    };
  });
  
  return {
    store: {
      _id: store._id.toString(),
      shopDomain: shopDomain,
      domain: shopDomain,
      isActive: store.isActive,
      planType: store.planType || "free",
      createdAt: store.createdAt,
      billing: store.billing,
      settings: store.settings,
      onboarding: store.onboarding,
    },
    summary: {
      totalImpressions,
      totalViews,
      totalRevenue,
      totalAddToCartConversions,
      totalConversions,
      addToCartRate,
      revenueConversionRate,
      activeCampaigns: campaigns.length,
    },
    campaigns: formattedCampaigns,
    videos: videos.map((v: any) => ({
      _id: v._id.toString(),
      status: v.status || "pending",
      createdAt: v.createdAt,
      productId: v.productId,
      productTitle: v.productTitle || v.title || "Untitled Video",
      videoUrl: v.videoUrl || v.url,
      thumbnailUrl: v.thumbnailUrl || v.thumbnail,
    })),
    stats: {
      totalCampaigns: campaigns.length,
      activeCampaigns,
      totalVideos: videos.length,
      totalImpressions,
      totalViews,
      totalRevenue,
      totalAddToCartConversions,
      totalConversions,
    },
  };
}

export async function getAllStores() {
  const shopsCollection = await getCollection("shops");
  
  // Get ALL stores (including inactive)
  const shops = await shopsCollection.find({}).sort({ createdAt: -1 }).toArray();
  
  // Transform to match expected format
  return shops.map((shop: any) => ({
    _id: shop._id,
    name: shop.shopDomain || shop.domain || "Unnamed Store",
    domain: shop.shopDomain || shop.domain,
    createdAt: shop.createdAt,
    isActive: shop.isActive,
    planType: shop.planType,
    billing: shop.billing,
  }));
}

export async function getRevenueByDate(days: number = 30) {
  const analyticsCollection = await getCollection("analytics");
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  return await analyticsCollection
    .aggregate([
      {
        $match: {
          timestamp: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$timestamp" },
          },
          revenue: { $sum: "$revenue" },
          orders: { $sum: "$orders" },
        },
      },
      {
        $sort: { _id: 1 },
      },
      {
        $project: {
          _id: 0,
          date: "$_id",
          revenue: 1,
          orders: 1,
        },
      },
    ])
    .toArray();
}

export async function getTopPerformingStores(limit: number = 10) {
  const analyticsCollection = await getCollection("analyticssummaries");

  return await analyticsCollection
    .aggregate([
      {
        $group: {
          _id: "$shopId",
          totalRevenue: { $sum: "$totalRevenue" },
          totalOrders: { $sum: "$totalOrders" },
        },
      },
      {
        $sort: { totalRevenue: -1 },
      },
      {
        $limit: limit,
      },
      {
        $lookup: {
          from: "shops",
          localField: "_id",
          foreignField: "_id",
          as: "shop",
        },
      },
      {
        $unwind: { path: "$shop", preserveNullAndEmptyArrays: true },
      },
      {
        $project: {
          shopId: "$_id",
          shopName: { $ifNull: ["$shop.shopDomain", "$shop.domain"] },
          totalRevenue: 1,
          totalOrders: 1,
        },
      },
    ])
    .toArray();
}

