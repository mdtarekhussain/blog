// app/api/blog/[id]/route.js
import { NextResponse } from 'next/server';
import { MongoClient, ObjectId } from 'mongodb';

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

    if (!process.env.MONGO_DB_URL) {
      console.error("Missing MongoDB environment variable");
      return NextResponse.json({ 
        error: "Server configuration error. Please check MongoDB environment variable." 
      }, { status: 500 });
    }

    const client = new MongoClient(process.env.MONGO_DB_URL);
    
    try {
      await client.connect();
      console.log("Connected to MongoDB");
      
      const db = client.db('test');
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
      console.error("Error in database operation:", error);
      return NextResponse.json({ 
        error: "Failed to fetch blog",
        details: error.message 
      }, { status: 500 });
    } finally {
      await client.close();
      console.log("MongoDB connection closed");
    }
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

    // Check environment variables
    if (!process.env.MONGO_DB_URL) {
      console.error("Missing MongoDB environment variable");
      return NextResponse.json({ 
        error: "Server configuration error" 
      }, { status: 500 });
    }

    // Parse the request body
    const body = await req.json();
    console.log("Request body:", body);
    const { title, description, category, author, authorImg, status } = body;

    // Validate required fields
    if (!title || !description || !category) {
      return NextResponse.json({ 
        error: "Missing required fields" 
      }, { status: 400 });
    }

    const client = new MongoClient(process.env.MONGO_DB_URL);
    try {
      await client.connect();
      console.log("Connected to MongoDB for update");
      
      const db = client.db('test');
      const collection = db.collection('blogs');

      // Update the blog
      const result = await collection.updateOne(
        { _id: new ObjectId(id) },
        { 
          $set: { 
            title, 
            description, 
            category, 
            author, 
            authorImg, 
            status,
            updatedAt: new Date()
          } 
        }
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
      console.error("Error in database operation during update:", error);
      return NextResponse.json({ 
        error: "Failed to update blog",
        details: error.message 
      }, { status: 500 });
    } finally {
      // Ensure client is closed
      await client.close();
      console.log("MongoDB connection closed after update");
    }
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

    // Check environment variables
    if (!process.env.MONGO_DB_URL) {
      console.error("Missing MongoDB environment variable");
      return NextResponse.json({ 
        error: "Server configuration error" 
      }, { status: 500 });
    }

    const client = new MongoClient(process.env.MONGO_DB_URL);
    
    try {
      await client.connect();
      console.log("Connected to MongoDB for deletion");
      
      const db = client.db('test');
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
      console.error("Error in database operation during deletion:", error);
      return NextResponse.json({ 
        error: "Failed to delete blog",
        details: error.message 
      }, { status: 500 });
    } finally {
      await client.close();
      console.log("MongoDB connection closed after deletion");
    }
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

    if (!process.env.MONGO_DB_URL) {
      console.error("Missing MongoDB environment variable");
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
    }

    const client = new MongoClient(process.env.MONGO_DB_URL);
    
    try {
      await client.connect();
      console.log("Connected to MongoDB for PATCH");
      
      const db = client.db('test');
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
      console.error("Error in database operation during PATCH:", error);
      return NextResponse.json({ error: "Failed to update blog", details: error.message }, { status: 500 });
    } finally {
      await client.close();
      console.log("MongoDB connection closed after PATCH");
    }
  } catch (error) {
    console.error("Error in PATCH handler:", error);
    return NextResponse.json({ error: "Failed to update blog", details: error.message }, { status: 500 });
  }
}