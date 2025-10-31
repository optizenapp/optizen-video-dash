import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";

export async function GET() {
  try {
    const { db } = await connectToDatabase();

    // Get sample campaigns
    const campaigns = await db
      .collection("campaigns")
      .find({})
      .limit(3)
      .toArray();

    // Get sample analytics summaries
    const summaries = await db
      .collection("analyticssummaries")
      .find({})
      .limit(3)
      .toArray();

    return NextResponse.json({
      campaigns,
      summaries,
      campaignsCount: campaigns.length,
      summariesCount: summaries.length,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message, stack: error.stack },
      { status: 500 }
    );
  }
}

