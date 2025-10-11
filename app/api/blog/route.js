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
    const formData = await req.formData();

    const image = formData.get("image");
    const title = formData.get("title");
    const description = formData.get("description");
    const category = formData.get("category");
    const author = formData.get("author");
    const authorImg = formData.get("authorImg");

    if (!image || typeof image === "string") {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    const buffer = Buffer.from(await image.arrayBuffer());

    // Upload to Cloudinary
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { resource_type: "image" },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(buffer);
    });

    // 👉 Connect to MongoDB
    const db = await mongoUrl();
    const blogs = db.collection("blogs"); // collection name: blogs

    // 👉 Insert blog data to MongoDB
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

  } catch (err) {
    console.error("Server Error:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
