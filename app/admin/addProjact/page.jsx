"use client"
import { assets } from '@/Asstes/assets';
import axios from 'axios';
import Image from 'next/image';
import React, { useState, useRef, useEffect } from 'react';
import { toast } from 'react-toastify';

const Page = () => {
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [data, setData] = useState({
    title: '',
    description: '',
    category: 'Startup',
    author: 'Tarek',
    authorImg: '/Asstes/profile_icon.png'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  
  const fileInputRef = useRef(null);

  // Cleanup blob URLs to prevent memory leaks
  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const onChangeHandler = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setData(data => ({ ...data, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // ফাইল সাইজ চেক (5MB এর বেশি হলে এরর দেখাবে)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size exceeds 5MB limit");
        return;
      }
      
      // Revoke previous preview URL to avoid memory leaks
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
      
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
      setImage(file);
    }
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    
    if (!image) {
      toast.error("Please select an image");
      return;
    }
    
    setIsLoading(true);
    setUploadProgress(0);
    
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('description', data.description);
    formData.append('category', data.category);
    formData.append('author', data.author);
    formData.append('authorImg', data.authorImg);
    formData.append('image', image);
    
    try {
      const response = await axios.post('/api/blog', formData, {
        // আপলোড প্রোগ্রেস ট্র্যাক করার জন্য
        onUploadProgress: (progressEvent) => {
          const progress = Math.round(
            (progressEvent.loaded / progressEvent.total) * 100
          );
          setUploadProgress(progress);
        },
        // টাইমআউট সেট করা (30 সেকেন্ড)
        timeout: 30000,
      });
      
      if (response.data.success) {
        toast.success(response.data.msg);
        setData({
          title: '',
          description: '',
          category: 'Startup',
          author: 'Tarek',
          authorImg: '/Asstes/profile_icon.png'
        });
        setImage(null);
        setImagePreview(null);
        
        // Reset file input
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } else {
        toast.error(response.data.msg || "Error occurred");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      if (error.code === 'ECONNABORTED') {
        toast.error("Request timed out. Please try again.");
      } else {
        toast.error("Failed to submit the form");
      }
    } finally {
      setIsLoading(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New Blog</h1>
          <p className="text-gray-600">Share your thoughts with the world</p>
        </div>
        
        <form onSubmit={onSubmitHandler} className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
          {/* Image Upload Section */}
          <div className="mb-8">
            <label className="block text-lg font-medium text-gray-800 mb-3">Upload Thumbnail</label>
            <div className="flex items-center justify-center w-full">
              <label 
                htmlFor="image" 
                className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors duration-200"
              >
                {imagePreview ? (
                  <div className="relative w-full h-full flex items-center justify-center">
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      className="max-h-60 max-w-full object-contain"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-200">
                      <span className="text-white font-medium">Change Image</span>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <svg className="w-10 h-10 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                    <p className="mb-2 text-sm text-gray-500">
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
                  </div>
                )}
                <input 
                  ref={fileInputRef}
                  id="image" 
                  type="file" 
                  className="hidden" 
                  onChange={handleImageChange}
                  accept="image/*"
                  required
                  disabled={isLoading}
                />
              </label>
            </div>
          </div>
          
          {/* Title Input */}
          <div className="mb-6">
            <label htmlFor="title" className="block text-lg font-medium text-gray-800 mb-2">Blog Title</label>
            <input
              id="title"
              name="title"
              type="text"
              value={data.title}
              onChange={onChangeHandler}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
              placeholder="Enter your blog title"
              required
              disabled={isLoading}
            />
          </div>
          
          {/* Description Textarea */}
          <div className="mb-6">
            <label htmlFor="description" className="block text-lg font-medium text-gray-800 mb-2">Blog Description</label>
            <textarea
              id="description"
              name="description"
              value={data.description}
              onChange={onChangeHandler}
              rows={5}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
              placeholder="Write your blog content here..."
              required
              disabled={isLoading}
            ></textarea>
          </div>
          
          {/* Category Select */}
          <div className="mb-8">
            <label htmlFor="category" className="block text-lg font-medium text-gray-800 mb-2">Blog Category</label>
            <select
              id="category"
              name="category"
              value={data.category}
              onChange={onChangeHandler}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
              disabled={isLoading}
            >
              <option value="Startup">Startup</option>
              <option value="Technology">Technology</option>
              <option value="Lifestyle">Lifestyle</option>
            </select>
          </div>
          
          {/* Upload Progress */}
          {isLoading && (
            <div className="mb-6">
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">Uploading...</span>
                <span className="text-sm font-medium text-gray-700">{uploadProgress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-indigo-600 h-2.5 rounded-full transition-all duration-300" 
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            </div>
          )}
          
          {/* Submit Button */}
          <div className="flex justify-center">
            <button
              type="submit"
              disabled={isLoading}
              className={`px-8 py-3 font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 ${
                isLoading 
                  ? 'bg-indigo-400 cursor-not-allowed' 
                  : 'bg-indigo-600 text-white hover:bg-indigo-700'
              }`}
            >
              {isLoading ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Publishing...
                </div>
              ) : (
                'Publish Blog'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Page;