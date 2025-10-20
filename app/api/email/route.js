import { mongoUrl } from '/lib/mongodb';
import { NextResponse } from 'next/server';

// 📨 POST: নতুন subscriber যোগ করা
export async function POST(req) {
  try {
    const { email } = await req.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Valid email required' },
        { status: 400 }
      );
    }

    const db = await mongoUrl();
    const collection = db.collection('subscribers');

    const existing = await collection.findOne({ email });
    if (existing) {
      return NextResponse.json(
        { success: false, message: 'Email already subscribed' },
        { status: 200 }
      );
    }

    const result = await collection.insertOne({
      email,
      createdAt: new Date(),
    });

    return NextResponse.json({
      success: true,
      message: 'Subscribed successfully',
      id: result.insertedId,
    });
  } catch (error) {
    console.error('Error saving email:', error);
    return NextResponse.json(
      { error: 'Failed to subscribe', details: error.message },
      { status: 500 }
    );
  }
}

// 📬 GET: সব subscriber রিটার্ন করা
export async function GET() {
  try {
    const db = await mongoUrl();
    const collection = db.collection('subscribers');

    const subscribers = await collection
      .find({})
      .sort({ createdAt: -1 })  // latest first
      .toArray();

    return NextResponse.json({
      success: true,
      count: subscribers.length,
      data: subscribers,
    });
  } catch (error) {
    console.error('Error fetching subscribers:', error);
    return NextResponse.json(
      { error: 'Failed to fetch subscribers', details: error.message },
      { status: 500 }
    );
  }
}
