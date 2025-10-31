import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";

export async function GET() {
  try {
    const { db } = await connectToDatabase();
    
    // List all collections
    const collections = await db.listCollections().toArray();
    
    // Get sample data from each collection
    const collectionData: Record<string, { count: number; sample: unknown }> = {};
    
    for (const collection of collections) {
      const name = collection.name;
      const sampleDoc = await db.collection(name).findOne({});
      collectionData[name] = {
        count: await db.collection(name).countDocuments(),
        sample: sampleDoc,
      };
    }

    return NextResponse.json({
      collections: collections.map((c) => c.name),
      details: collectionData,
    });
  } catch (error) {
    console.error("Error fetching collections:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch collections",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

