import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { mongoUrl } from "@/lib/mongodb";

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req) {
  try {
    // এনভায়রনমেন্ট ভেরিয়েবল চেক
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

    // ইমেজ ভ্যালিডেশন
    if (!image || typeof image === "string") {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    // ইমেজ সাইজ চেক
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (image.size > maxSize) {
      return NextResponse.json({ error: "Image size exceeds 5MB limit" }, { status: 400 });
    }

    // Buffer তৈরি
    const buffer = Buffer.from(await image.arrayBuffer());

    // ক্লাউডিনারিতে আপলোড
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

    // মঙ্গোডিবি সংযোগ
    let db;
    try {
      db = await mongoUrl();
      if (!db) {
        throw new Error("Failed to connect to database");
      }
    } catch (dbError) {
      console.error("Database connection error:", dbError);
      return NextResponse.json({ 
        error: "Failed to connect to database" 
      }, { status: 500 });
    }

    // মঙ্গোডিবিতে ডাটা সেভ
    try {
      const blogs = db.collection("blogs");
      const insertResult = await blogs.insertOne({
        title,
        description,
        category,
        author,
        authorImg,
        image: result.secure_url,
        createdAt: new Date(),
      });

      return NextResponse.json({
        success: true,
        msg: "Blog uploaded and saved to database!",
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