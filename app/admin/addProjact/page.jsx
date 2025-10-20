"use client"
import { useAuth } from "/lib/AuthContext";
import { useRouter } from "next/navigation";
import axios from 'axios';
import Image from 'next/image';
import React, { useState, useRef, useEffect } from 'react';
import { toast } from 'react-toastify';

const Page = () => {
    const { user, loading } = useAuth();
    const router = useRouter();
  
    useEffect(() => {
      if (!loading) {
        // যদি ইউজার না থাকে → login এ পাঠাও
        if (!user) {
          router.push("/login");
        }
        // যদি ইউজার থাকে কিন্তু অ্যাডমিন না হয় → home এ পাঠাও
        else if (user.role !== "ADMIN") {
          router.push("/");
        }
      }
    }, [user, loading, router]);
  
    if (loading || !user || user.role !== "ADMIN") {
      return (
        <div className="flex justify-center items-center min-h-screen">
          <p className="text-lg font-semibold">Checking admin access...</p>
        </div>
      );
    }
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [data, setData] = useState({
    title: '',
    description: '',
    category: 'Startup',
    author: 'Tarek',
    authorImg: 'https://res.cloudinary.com/dpfrffp6j/image/upload/v1760210072/blog_images/g5c8fquym9co37kdn6rt.jpg',
    status: 'draft' // Added status field with default value 'Draft'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [serverError, setServerError] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState('create');
  const [dragActive, setDragActive] = useState(false);
  const [isFocused, setIsFocused] = useState({
    title: false,
    description: false
  });
  
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

  // ড্র্যাগ অ্যান্ড ড্রপ হ্যান্ডলার
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      
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
    setServerError(null);
    
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
    formData.append('status', data.status); // Added status to form data
    
    try {
      const response = await axios.post('/api/blog', formData, {
        // আপলোড প্রোগ্রেস ট্র্যাক করার জন্য
        onUploadProgress: (progressEvent) => {
          const progress = Math.round(
            (progressEvent.loaded / progressEvent.total) * 100
          );
          setUploadProgress(progress);
        },
        // টাইমআউট সেট করা (60 সেকেন্ড)
        timeout: 60000,
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
      });
      
      if (response.data.success) {
        setIsSuccess(true);
        toast.success(response.data.msg);
        setData({
          title: '',
          description: '',
          category: 'Startup',
          author: 'Tarek',
          authorImg: 'https://res.cloudinary.com/dpfrffp6j/image/upload/v1760210072/blog_images/g5c8fquym9co37kdn6rt.jpg',
          status: 'Draft' // Reset status to default
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
      
      // বিস্তারিত এরর মেসেজ সেট করুন
      if (error.response) {
        // সার্ভার রেসপন্স এরর
        const errorMsg = error.response.data.error || `Server error: ${error.response.status}`;
        setServerError(errorMsg);
        toast.error(errorMsg);
      } else if (error.code === 'ECONNABORTED') {
        const errorMsg = "Request timed out. Please try again with a smaller image.";
        setServerError(errorMsg);
        toast.error(errorMsg);
      } else if (error.request) {
        const errorMsg = "Network error. Please check your connection.";
        setServerError(errorMsg);
        toast.error(errorMsg);
      } else {
        const errorMsg = "Failed to submit the form";
        setServerError(errorMsg);
        toast.error(errorMsg);
      }
    } finally {
      setIsLoading(false);
      setUploadProgress(0);
    }
  };

  // ক্যাটাগরি আইকন
  const getCategoryIcon = (category) => {
    switch(category) {
      case 'Startup':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V8a2 2 0 00-2-2h-5L9 4H4zm3 6a1 1 0 000 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
          </svg>
        );
      case 'Technology':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
          </svg>
        );
      case 'Lifestyle':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01-25.066 0l5.508 2.361a3 3 0 002.364 0L9.3 16.573z" />
          </svg>
        );
      default:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
        );
    }
  };

  // স্ট্যাটাস আইকন
  const getStatusIcon = (status) => {
    switch(status) {
      case 'Draft':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M2 4a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V4z" />
          </svg>
        );
      case 'Published':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        );
      default:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
        );
    }
  };

  // সাকসেস মেসেজ রিসেট করার ফাংশন
  const resetSuccess = () => {
    setIsSuccess(false);
  };

  // ফোকাস হ্যান্ডলার
  const handleFocus = (field) => {
    setIsFocused({
      ...isFocused,
      [field]: true
    });
  };

  const handleBlur = (field) => {
    setIsFocused({
      ...isFocused,
      [field]: false
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-12 px-4 sm:px-6 lg:px-8">
      {/* অ্যানিমেটেড ব্যাকগ্রাউন্ড এলিমেন্ট */}
      <div className="fixed inset-0 overflow-hidden -z-10">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 mb-6 animate-fade-in-down">
            Create New Blog
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto animate-fade-in-up animation-delay-500">
            Share your thoughts with the world and inspire others with your unique perspective
          </p>
        </div>
        
        {/* সার্ভার এরর দেখানোর জন্য */}
        {serverError && (
          <div className="mb-8 p-4 bg-red-50 rounded-xl border border-red-200 shadow-sm animate-pulse">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800 mb-1">Server Error</h3>
                <p className="text-sm text-red-700">{serverError}</p>
                <p className="text-xs text-red-600 mt-1">Please check your environment variables and try again.</p>
              </div>
            </div>
          </div>
        )}
        
        {/* সাকসেস মেসেজ */}
        {isSuccess && (
          <div className="mb-8 p-6 bg-green-50 rounded-xl border border-green-200 shadow-sm animate-fade-in">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-green-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-green-800">Blog {data.status === 'Published' ? 'Published' : 'Saved as Draft'} Successfully!</h3>
                <p className="text-sm text-green-700 mt-1">
                  {data.status === 'Published' 
                    ? 'Your blog has been published and is now live for everyone to read.' 
                    : 'Your blog has been saved as draft and is not yet published.'}
                </p>
                <div className="mt-4">
                  <button
                    onClick={resetSuccess}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-300 transform hover:scale-105"
                  >
                    Create Another Blog
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl overflow-hidden border border-white/20 animate-fade-in-up animation-delay-300">
          {/* ট্যাব নেভিগেশন */}
          
          
          {/* কন্টেন্ট এরিয়া */}
          <div className="p-6 sm:p-8">

              <form onSubmit={onSubmitHandler}>
                {/* Image Upload Section */}
                <div className="mb-8">
                  <label className="block text-lg font-medium text-gray-800 mb-3">Upload Thumbnail</label>
                  <div 
                    className={`flex items-center justify-center w-full h-80 border-2 border-dashed rounded-2xl cursor-pointer transition-all duration-300 ${
                      dragActive 
                        ? 'border-indigo-500 bg-indigo-50/50 shadow-lg' 
                        : 'border-gray-300/50 bg-gray-50/30 hover:bg-gray-100/50 hover:border-indigo-300'
                    }`}
                    onDragEnter={handleDrag}
                    onDragOver={handleDrag}
                    onDragLeave={handleDrag}
                    onDrop={handleDrop}
                  >
                    <label htmlFor="image" className="flex flex-col items-center justify-center w-full h-full">
                      {imagePreview ? (
                        <div className="relative w-full h-full flex items-center justify-center">
                          <img 
                            src={imagePreview} 
                            alt="Preview" 
                            className="max-h-72 max-w-full object-contain"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end justify-center opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-2xl pb-4">
                            <span className="text-white font-medium px-4 py-2 bg-black/50 rounded-lg backdrop-blur-sm">
                              Change Image
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <div className="p-4 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full mb-4 animate-bounce">
                            <svg className="w-12 h-12 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                            </svg>
                          </div>
                          <p className="mb-2 text-sm text-gray-600">
                            <span className="font-semibold text-indigo-600">Click to upload</span> or drag and drop
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
                    onFocus={() => handleFocus('title')}
                    onBlur={() => handleBlur('title')}
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-300 ${
                      isFocused.title 
                        ? 'border-indigo-500 bg-indigo-50/50 shadow-lg ring-2 ring-indigo-500/30' 
                        : 'border-gray-300/50 bg-gray-50/30 hover:border-indigo-300'
                    }`}
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
                    onFocus={() => handleFocus('description')}
                    onBlur={() => handleBlur('description')}
                    rows={5}
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-300 ${
                      isFocused.description 
                        ? 'border-indigo-500 bg-indigo-50/50 shadow-lg ring-2 ring-indigo-500/30' 
                        : 'border-gray-300/50 bg-gray-50/30 hover:border-indigo-300'
                    }`}
                    placeholder="Write your blog content here..."
                    required
                    disabled={isLoading}
                  ></textarea>
                </div>
                
                {/* Category Select */}
                <div className="mb-8">
                  <label className="block text-lg font-medium text-gray-800 mb-2">Blog Category</label>
                  <div className="grid grid-cols-3 gap-4">
                    {['Startup', 'Technology', 'Lifestyle'].map((category) => (
                      <button
                        key={category}
                        type="button"
                        onClick={() => setData({...data, category})}
                        className={`flex flex-col items-center justify-center p-4 border rounded-xl transition-all duration-300 transform hover:scale-105 ${
                          data.category === category
                            ? 'border-indigo-500 bg-gradient-to-br from-indigo-50 to-purple-50 text-indigo-700 shadow-md'
                            : 'border-gray-300/50 bg-gray-50/30 hover:bg-gray-100/50 text-gray-700'
                        }`}
                        disabled={isLoading}
                      >
                        <div className="mb-2 text-indigo-600">
                          {getCategoryIcon(category)}
                        </div>
                        <span className="font-medium">{category}</span>
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Status Select */}
                <div className="mb-8">
                  <label className="block text-lg font-medium text-gray-800 mb-2">Blog Status</label>
                  <div className="grid grid-cols-2 gap-4">
                    {['draft', 'published'].map((status) => (
                      <button
                        key={status}
                        type="button"
                        onClick={() => setData({...data, status})}
                        className={`flex flex-col items-center justify-center p-4 border rounded-xl transition-all duration-300 transform hover:scale-105 ${
                          data.status === status
                            ? status === 'draft' 
                              ? 'border-yellow-500 bg-gradient-to-br from-yellow-50 to-amber-50 text-yellow-700 shadow-md'
                              : 'border-green-500 bg-gradient-to-br from-green-50 to-emerald-50 text-green-700 shadow-md'
                            : 'border-gray-300/50 bg-gray-50/30 hover:bg-gray-100/50 text-gray-700'
                        }`}
                        disabled={isLoading}
                      >
                        <div className={`mb-2 ${status === 'draft' ? 'text-yellow-600' : 'text-green-600'}`}>
                          {getStatusIcon(status)}
                        </div>
                        <span className="font-medium">{status}</span>
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Upload Progress */}
                {isLoading && (
                  <div className="mb-8">
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Uploading...</span>
                      <span className="text-sm font-medium text-indigo-600">{uploadProgress}%</span>
                    </div>
                    <div className="w-full bg-gray-200/50 rounded-full h-3 backdrop-blur-sm">
                      <div 
                        className="bg-gradient-to-r from-indigo-500 to-purple-500 h-3 rounded-full transition-all duration-500 ease-out" 
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                    <div className="mt-3 text-sm text-gray-500 flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Please wait while we upload your blog post...
                    </div>
                  </div>
                )}
                
                {/* Submit Button */}
                <div className="flex justify-center">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`px-8 py-4 font-bold rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 ${
                      isLoading 
                        ? 'bg-gradient-to-r from-indigo-400 to-purple-400 cursor-not-allowed' 
                        : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 hover:shadow-lg'
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
                      <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                        </svg>
                        {data.status === 'Published' ? 'Publish Blog' : 'Save as Draft'}
                      </div>
                    )}
                  </button>
                </div>
              </form>
          
            
          
          
          </div>
        </div>
        
       
      </div>

      {/* কাস্টম স্টাইলিং */}
      <style jsx global>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        
        @keyframes fade-in-down {
          0% {
            opacity: 0;
            transform: translateY(-20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-down {
          animation: fade-in-down 0.6s ease-out forwards;
        }
        
        @keyframes fade-in-up {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
          opacity: 0;
        }
        
        .animation-delay-300 {
          animation-delay: 0.3s;
        }
        .animation-delay-500 {
          animation-delay: 0.5s;
        }
        .animation-delay-700 {
          animation-delay: 0.7s;
        }
      `}</style>
    </div>
  );
};

export default Page;