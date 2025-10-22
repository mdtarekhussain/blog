// app/api/blog/[id]/route.js
import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { mongoUrl } from '/lib/mongodb'; // আপনার MongoDB হেল্পার ইমপোর্ট করুন

// GET: Fetch a single blog by ID
export async function GET(req, { params }) {
  try {
    const { id } = params;

    console.log("Fetching blog with ID:", id);

    // Validate if the provided ID is a valid MongoDB ObjectId
    if (!ObjectId.isValid(id)) {
      console.log("Invalid blog ID format:", id);
      return NextResponse.json({ 
        error: "Invalid blog ID format" 
      }, { status: 400 });
    }

    // হেল্পার ফাংশন ব্যবহার করে ডাটাবেস কানেকশন পান
    const db = await mongoUrl();
    const collection = db.collection('blogs');

    // Find the blog by ID
    const blog = await collection.findOne({ _id: new ObjectId(id) });
    console.log("Blog found:", blog);

    if (!blog) {
      console.log("Blog not found with ID:", id);
      return NextResponse.json({ 
        error: "Blog not found" 
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      blog: blog
    });
      
  } catch (error) {
    console.error("Error in GET handler:", error);
    return NextResponse.json({ 
      error: "Failed to fetch blog",
      details: error.message 
    }, { status: 500 });
  }
}

// PUT: Update a blog by ID
export async function PUT(req, { params }) {
  try {
    const { id } = params;
    
    console.log("Updating blog with ID:", id);
    
    // Validate ID
    if (!ObjectId.isValid(id)) {
      console.log("Invalid blog ID format:", id);
      return NextResponse.json({ 
        error: "Invalid blog ID format" 
      }, { status: 400 });
    }

    // Check if the request is multipart/form-data
    const contentType = req.headers.get('content-type') || '';
    
    let title, description, category, author, authorImg, status, image;
    
    if (contentType.includes('multipart/form-data')) {
      // Handle multipart/form-data
      const formData = await req.formData();
      
      // Extract fields from formData
      title = formData.get('title');
      description = formData.get('description');
      category = formData.get('category');
      author = formData.get('author');
      authorImg = formData.get('authorImg');
      status = formData.get('status');
      image = formData.get('image');
      
      console.log("Form data extracted:", { title, description, category, author, authorImg, status, image: image ? "Image file present" : "No image" });
    } else {
      // Handle JSON data
      const body = await req.json();
      console.log("Request body:", body);
      
      title = body.title;
      description = body.description;
      category = body.category;
      author = body.author;
      authorImg = body.authorImg;
      status = body.status;
      image = body.image;
    }

    // Validate required fields
    if (!title || !description || !category) {
      console.log("Missing required fields:", { title, description, category });
      return NextResponse.json({ 
        error: "Missing required fields" 
      }, { status: 400 });
    }

    // হেল্পার ফাংশন ব্যবহার করে ডাটাবেস কানেকশন পান
    const db = await mongoUrl();
    const collection = db.collection('blogs');

    // Prepare update data
    const updateData = {
      title, 
      description, 
      category, 
      author, 
      authorImg, 
      status,
      updatedAt: new Date()
    };
    
    // Only add image to update data if it exists
    if (image) {
      // If image is a file (from FormData), we need to handle it
      // For now, we'll assume it's a URL string
      updateData.image = image;
    }

    console.log("Update data:", updateData);

    // Update the blog
    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );
    
    console.log("Update result:", result);

    if (result.matchedCount === 0) {
      return NextResponse.json({ 
        error: "Blog not found" 
      }, { status: 404 });
    }

    // Return the updated blog
    const updatedBlog = await collection.findOne({ _id: new ObjectId(id) });

    return NextResponse.json({
      success: true,
      message: "Blog updated successfully",
      blog: updatedBlog
    });
      
  } catch (error) {
    console.error("Error in PUT handler:", error);
    return NextResponse.json({ 
      error: "Failed to update blog",
      details: error.message 
    }, { status: 500 });
  }
}

// DELETE: Delete a blog by ID
export async function DELETE(req, { params }) {
  try {
    const { id } = params;
    
    console.log("Deleting blog with ID:", id);
    
    // Validate ID
    if (!ObjectId.isValid(id)) {
      console.log("Invalid blog ID format:", id);
      return NextResponse.json({ 
        error: "Invalid blog ID format" 
      }, { status: 400 });
    }

    // হেল্পার ফাংশন ব্যবহার করে ডাটাবেস কানেকশন পান
    const db = await mongoUrl();
    const collection = db.collection('blogs');

    // Delete the blog
    const result = await collection.deleteOne({ _id: new ObjectId(id) });
    
    console.log("Delete result:", result);
    
    if (result.deletedCount === 0) {
      return NextResponse.json({ 
        error: "Blog not found" 
      }, { status: 404 });
    }
    
    return NextResponse.json({
      success: true,
      message: "Blog deleted successfully"
    });
      
  } catch (error) {
    console.error("Error in DELETE handler:", error);
    return NextResponse.json({ 
      error: "Failed to delete blog",
      details: error.message 
    }, { status: 500 });
  }
}

// PATCH: Update blog status or increment views
export async function PATCH(req, { params }) {
  try {
    const { id } = params;
    const body = await req.json();
    console.log("PATCH request body:", body);
    const { status, incrementView } = body; // incrementView true হলে views বাড়াবে

    console.log("PATCH ID:", id);
    console.log("PATCH status:", status);
    console.log("PATCH incrementView:", incrementView);

    if (!ObjectId.isValid(id)) {
      console.log("Invalid blog ID format:", id);
      return NextResponse.json({ error: "Invalid blog ID format" }, { status: 400 });
    }

    // হেল্পার ফাংশন ব্যবহার করে ডাটাবেস কানেকশন পান
    const db = await mongoUrl();
    const collection = db.collection('blogs');
    const objectId = new ObjectId(id);

    const blog = await collection.findOne({ _id: objectId });
    if (!blog) {
      console.log("Blog not found for PATCH with ID:", id);
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    // 🧮 যদি incrementView === true হয় → views বাড়ানো
    if (incrementView) {
      console.log("Incrementing views for blog:", id);
      await collection.updateOne(
        { _id: objectId },
        { $inc: { views: 1 }, $set: { updatedAt: new Date() } }
      );
    }

    // ✍️ status আপডেটের জন্য
    if (status) {
      if (status !== 'published' && status !== 'draft') {
        return NextResponse.json({ error: "Invalid status value" }, { status: 400 });
      }
      console.log("Updating status for blog:", id, "to", status);
      await collection.updateOne(
        { _id: objectId },
        { $set: { status, updatedAt: new Date() } }
      );
    }

    const updatedBlog = await collection.findOne({ _id: objectId });
    console.log("Updated blog:", updatedBlog);
    
    return NextResponse.json({ success: true, blog: updatedBlog });

  } catch (error) {
    console.error("Error in PATCH handler:", error);
    return NextResponse.json({ error: "Failed to update blog", details: error.message }, { status: 500 });
  }
}