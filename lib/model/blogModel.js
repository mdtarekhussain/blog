import mongoose from "mongoose";

// স্কিমা তৈরি করা
const BlogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true, // ✅ 'require' ভুল ছিল, ঠিক করে 'required' করতে হবে
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  authorImg: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now, // ✅ 'Date.now()' না লিখে 'Date.now' লিখলে প্রতিবার নতুন তারিখ হবে
  },
});

// ✅ এই লাইনে আমরা চেক করছি মডেল আগে থেকে আছে কিনা, থাকলে নতুন করে তৈরি করবো না
const BlogModel = mongoose.models.Blog || mongoose.model("Blog", BlogSchema);

export default BlogModel;
