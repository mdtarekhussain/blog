import { ObjectId } from 'mongodb';
import { NextResponse } from 'next/server';
import { mongoUrl } from '/lib/mongodb'; // আপনার existing mongoUrl function

export async function GET(request, { params }) {
  try {
    console.log('GET request received with params:', params);
    
    if (!params.id) {
      return NextResponse.json({ success: false, error: 'Blog ID is missing' }, { status: 400 });
    }
    
    const db = await mongoUrl();
    const commentsCollection = db.collection('comments');
    
    console.log('Fetching comments for blogId:', params.id);
    const comments = await commentsCollection
      .find({ blogId: params.id })
      .sort({ createdAt: -1 })
      .toArray();
    
    console.log('Found comments:', comments.length);
    return NextResponse.json({ success: true, comments });
    
  } catch (error) {
    console.error('Error fetching comments:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to fetch comments'
    }, { status: 500 });
  }
}

export async function POST(request, { params }) {
  try {
    if (!params.id) {
      return NextResponse.json({ success: false, error: 'Blog ID is missing' }, { status: 400 });
    }

    const { name, email, text } = await request.json();
    
    if (!name || !email || !text) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }
    
    const db = await mongoUrl();
    const commentsCollection = db.collection('comments');
    
    const newComment = {
      blogId: params.id,
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
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to add comment'
    }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    if (!params.id) {
      return NextResponse.json({ success: false, error: 'Comment ID is missing' }, { status: 400 });
    }

    const { text } = await request.json();
    if (!text) {
      return NextResponse.json({ success: false, error: 'Missing comment text' }, { status: 400 });
    }

    const db = await mongoUrl();
    const commentsCollection = db.collection('comments');

    let commentId;
    try {
      commentId = new ObjectId(params.id);
    } catch (error) {
      return NextResponse.json({ success: false, error: 'Invalid comment ID format' }, { status: 400 });
    }

    const result = await commentsCollection.updateOne(
      { _id: commentId },
      { $set: { text, updatedAt: new Date() } }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ success: false, error: 'Comment not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
    
  } catch (error) {
    console.error('Error updating comment:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to update comment'
    }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    if (!params.id) {
      return NextResponse.json({ success: false, error: 'Comment ID is missing' }, { status: 400 });
    }

    const db = await mongoUrl();
    const commentsCollection = db.collection('comments');

    let commentId;
    try {
      commentId = new ObjectId(params.id);
    } catch (error) {
      return NextResponse.json({ success: false, error: 'Invalid comment ID format' }, { status: 400 });
    }

    const result = await commentsCollection.deleteOne({ _id: commentId });

    if (result.deletedCount === 0) {
      return NextResponse.json({ success: false, error: 'Comment not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
    
  } catch (error) {
    console.error('Error deleting comment:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to delete comment'
    }, { status: 500 });
  }
}