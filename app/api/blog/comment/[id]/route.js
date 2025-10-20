// /app/api/blog/comment/[id]/route.js
import { NextRequest, NextResponse } from 'next/server';
import { mongoUrl } from '/lib/mongodb';
import { ObjectId } from 'mongodb'; 
export async function GET(request, { params }) {
  try {
    const db = await mongoUrl();
    const commentsCollection = db.collection('comments');
    
    const comments = await commentsCollection
      .find({ blogId: params.id })
      .sort({ createdAt: -1 })
      .toArray();
    
    return NextResponse.json({ success: true, comments });
  } catch (error) {
    console.error('Error fetching comments:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch comments' }, { status: 500 });
  }
}

export async function POST(request, { params }) {
  try {
    const { name, email, text } = await request.json();
    
    if (!name || !email || !text) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }
    
    const db = await mongoUrl();
    const commentsCollection = db.collection('comments');
    
    const newComment = {
      blogId: params.id, // Use the blog ID from the URL params
      name,
      email,
      text,
      createdAt: new Date()
    };
    
    const result = await commentsCollection.insertOne(newComment);
    
    return NextResponse.json({ 
      success: true, 
      comment: { ...newComment, _id: result.insertedId }
    });
  } catch (error) {
    console.error('Error adding comment:', error);
    return NextResponse.json({ success: false, error: 'Failed to add comment' }, { status: 500 });
  }
}

// কমেন্ট আপডেট করার জন্য PUT মেথড যোগ করুন
export async function PUT(request, { params }) {
  try {
    const { text } = await request.json();
    if (!text) {
      return NextResponse.json({ success: false, error: 'Missing comment text' }, { status: 400 });
    }

    const db = await mongoUrl();
    const commentsCollection = db.collection('comments');

    const result = await commentsCollection.updateOne(
      { _id: new ObjectId(params.id) },
      { $set: { text, updatedAt: new Date() } }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ success: false, error: 'Comment not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating comment:', error);
    return NextResponse.json({ success: false, error: 'Failed to update comment' }, { status: 500 });
  }
}
export async function DELETE(request, { params }) {
  try {
    const db = await mongoUrl();
    const commentsCollection = db.collection('comments');

    const result = await commentsCollection.deleteOne({ _id: new ObjectId(params.id) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ success: false, error: 'Comment not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting comment:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete comment' }, { status: 500 });
  }
}
