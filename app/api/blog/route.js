// app/api/blog/route.js
import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { MongoClient } from 'mongodb';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// POST handler
export async function POST(req) {
  try {
    if (!process.env.CLOUDINARY_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      console.error("Missing Cloudinary environment variables");
      return NextResponse.json({ 
        error: "Server configuration error. Please check Cloudinary environment variables." 
      }, { status: 500 });
    }

    const formData = await req.formData();

    const image = formData.get("image");
    const title = formData.get("title");
    const description = formData.get("description");
    const category = formData.get("category");
    const author = formData.get("author");
    const authorImg = formData.get("authorImg");
    const status = formData.get("status") || "Draft"; // Get status or default to "Draft"

    if (!image || typeof image === "string") {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    const maxSize = 5 * 1024 * 1024; 
    if (image.size > maxSize) {
      return NextResponse.json({ error: "Image size exceeds 5MB limit" }, { status: 400 });
    }

    const buffer = Buffer.from(await image.arrayBuffer());

    let result;
    try {
      result = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          { 
            resource_type: "image",
            folder: "blog_images",
          },
          (error, result) => {
            if (error) {
              console.error("Cloudinary upload error:", error);
              reject(error);
            } else {
              resolve(result);
            }
          }
        ).end(buffer);
      });
    } catch (cloudinaryError) {
      console.error("Cloudinary upload failed:", cloudinaryError);
      return NextResponse.json({ 
        error: "Failed to upload image to cloud storage" 
      }, { status: 500 });
    }

    let db;
    try {
      const client = new MongoClient(process.env.MONGO_DB_URL);
      await client.connect();
      db = client.db('test');
      
      if (!db) {
        throw new Error("Failed to connect to database");
      }
    } catch (dbError) {
      console.error("Database connection error:", dbError);
      return NextResponse.json({ 
        error: "Failed to connect to database" 
      }, { status: 500 });
    }

    try {
      const blogs = db.collection("blogs");
      const insertResult = await blogs.insertOne({
        title,
        description,
        category,
        author,
        authorImg,
        image: result.secure_url,
        status, // Include status in the document
        createdAt: new Date(),
      });

      return NextResponse.json({
        success: true,
        msg: `Blog ${status === 'Published' ? 'published' : 'saved as draft'} successfully!`,
        blogId: insertResult.insertedId,
      });
    } catch (insertError) {
      console.error("Database insert error:", insertError);
      return NextResponse.json({ 
        error: "Failed to save blog data" 
      }, { status: 500 });
    }

  } catch (err) {
    console.error("Server Error:", err);
    return NextResponse.json({ 
      error: "An unexpected error occurred" 
    }, { status: 500 });
  }
}

// GET handler
export async function GET(req) {
  try {
    // Check environment variable
    if (!process.env.MONGO_DB_URL) {
      console.error("Missing MongoDB environment variable");
      return NextResponse.json({ 
        error: "Server configuration error" 
      }, { status: 500 });
    }

    // Connect to MongoDB
    const client = new MongoClient(process.env.MONGO_DB_URL);
    await client.connect();
    const db = client.db('test'); // Explicit database name
    const collection = db.collection('blogs'); // Explicit collection name

    // Fetch all blogs sorted by newest first
    const blogs = await collection
      .find({})
      .sort({ createdAt: -1 })
      .toArray();
    
    return NextResponse.json({
      success: true,
      blogs: blogs,
      count: blogs.length // Include document count
    });
    
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return NextResponse.json({ 
      error: "Failed to fetch blogs",
      details: error.message 
    }, { status: 500 });
  }
}