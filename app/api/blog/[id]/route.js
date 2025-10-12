import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

export async function GET(req, { params }) {
  const { id } = params;

  if (!process.env.MONGO_DB_URL) {
    console.error("Missing MongoDB environment variable");
    return NextResponse.json({ 
      error: "Server configuration error. Please check MongoDB environment variable." 
    }, { status: 500 });
  }

  const client = new MongoClient(process.env.MONGO_DB_URL);
  
  try {
    await client.connect();
    const db = client.db('test');
    const collection = db.collection('blogs');

    // MongoDB ObjectId ব্যবহার করে ব্লগ খুঁজুন
    const { ObjectId } = require('mongodb');
    const blog = await collection.findOne({ _id: new ObjectId(id) });

    if (!blog) {
      return NextResponse.json({ 
        error: "Blog not found" 
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      blog: blog
    });
    
  } catch (error) {
    console.error("Error fetching blog:", error);
    return NextResponse.json({ 
      error: "Failed to fetch blog" 
    }, { status: 500 });
  } finally {
    await client.close();
  }
}