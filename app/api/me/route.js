import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { mongoUrl } from '/lib/mongodb';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function GET(request) {
  try {
    // Get token from Authorization header
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer')) {
      return NextResponse.json({ error: 'Authorization token required' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    
    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Connect to MongoDB
    const db = await mongoUrl();
    const usersCollection = db.collection('users');

    // Find user by ID - make sure to convert string ID to ObjectId
    const { ObjectId } = require('mongodb');
    const user = await usersCollection.findOne({ _id: new ObjectId(decoded.userId) });
    console.log('user',user)
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Return user without password
    const { password, ...userWithoutPassword } = user;
    
    return NextResponse.json({ user: userWithoutPassword });
  } catch (error) {
    console.error('Auth me error:', error);
    return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
  }
}