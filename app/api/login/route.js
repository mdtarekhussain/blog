import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { mongoUrl } from '/lib/mongodb';// Fixed import path

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    // Validate input
    if (!email || !password) {
      return NextResponse.json({ error: 'Missing email or password' }, { status: 400 });
    }

    // Connect to MongoDB
    const db = await mongoUrl(); // Added missing parentheses
    const usersCollection = db.collection('users');

    // Find user by email
    const user = await usersCollection.findOne({ email });
    
    if (!user) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    // Generate JWT token with user ID as string
    const token = jwt.sign(
      { userId: user._id.toString(), email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    // Return user without password
    const { password: _, ...userWithoutPassword } = user;
    
    return NextResponse.json({ 
      message: 'Login successful', 
      user: userWithoutPassword,
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}