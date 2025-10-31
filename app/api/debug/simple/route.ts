import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";

export async function GET() {
  try {
    const uri = process.env.MONGODB_URI!;
    
    // Try connecting without a specific database
    const client = new MongoClient(uri);
    await client.connect();
    
    // Try to get the default database from the connection string
    const db = client.db();
    const dbName = db.databaseName;
    
    // List collections in this database
    const collections = await db.listCollections().toArray();
    
    // Get sample from Sessions if it exists (common in Shopify apps)
    let sessionSample = null;
    if (collections.find(c => c.name === 'sessions')) {
      sessionSample = await db.collection('sessions').findOne({});
    }
    
    await client.close();

    return NextResponse.json({
      databaseName: dbName,
      collectionsCount: collections.length,
      collections: collections.map(c => c.name),
      sessionSample: sessionSample ? "Found" : "Not found",
    });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      {
        error: "Failed",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

