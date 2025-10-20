// pages/api/blog/[id]/view.js

import { mongoUrl } from '/lib/mongodb';
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
  // শুধুমাত্র PUT মেথড অনুমোদন করা হবে
  if (req.method !== 'PUT') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    const { id } = req.query;
    
    // ডাটাবেসে কানেক্ট করুন
    const db = await mongoUrl();
    
    // ব্লগ পোস্ট খুঁজে বের করুন এবং ভিউ কাউন্ট ১ করে বাড়ান
    const blog = await db.collection('blogs').findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $inc: { views: 1 } }, // $inc অপারেটর ব্যবহার করে views ফিল্ড ১ করে বাড়াবে
      { returnDocument: 'after' } // আপডেটেড ডকুমেন্ট রিটার্ন করবে
    );
    
    // ব্লগ পাওয়া না গেলে
    if (!blog.value) {
      return res.status(404).json({ success: false, message: 'Blog not found' });
    }
    
    // সফল হলে সাকসেস রেসপন্স পাঠান
    res.status(200).json({ 
      success: true, 
      message: 'View count updated',
      views: blog.value.views 
    });
  } catch (error) {
    console.error('Error updating view count:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
}