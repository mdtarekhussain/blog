import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { mongoUrl } from '/lib/mongodb';



export async function POST(request) {
  try {
    const { name, email, password } = await request.json();

    // Validate input
    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Connect to MongoDB
    const db = await mongoUrl();
    const usersCollection = db.collection('users');

    // Check if user already exists
    const existingUser = await usersCollection.findOne({ email });
    
    if (existingUser) {
      return NextResponse.json({ error: 'User already exists with this email' }, { status: 400 });
    }

    // Hash password
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user document
    const newUser = {
      name,
      email,
      password: hashedPassword,
      role: 'CUSTOMER',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Insert user into database
    const result = await usersCollection.insertOne(newUser);
    
    // Return success response without password
    const { password: _, ...userWithoutPassword } = newUser;
    
    return NextResponse.json({ 
      message: 'User created successfully', 
      user: {
        ...userWithoutPassword,
        _id: result.insertedId
      } 
    });
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}