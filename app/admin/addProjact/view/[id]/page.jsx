// app/admin/addProjact/view/[id]/page.jsx
"use client"
import { useAuth } from "/lib/AuthContext";
import { useRouter } from "next/navigation";
import axios from 'axios';
import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useParams } from 'next/navigation';

const ViewBlogPage = () => {
    const { user, loading } = useAuth();
    const router = useRouter();
    const params = useParams();
    const blogId = params.id;
  
    useEffect(() => {
      if (!loading) {
        if (!user) {
          router.push("/login");
        } else if (user.role !== "ADMIN") {
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

  const [blog, setBlog] = useState(null);
  const [loadings, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ব্লগ ডেটা লোড করার জন্য
  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/blog/${blogId}`);
        if (response.data.success) {
          setBlog(response.data.blog);
        } else {
          setError("Failed to fetch blog data");
        }
      } catch (error) {
        console.error("Error fetching blog:", error);
        setError("Error fetching blog data");
      } finally {
        setLoading(false);
      }
    };

    if (blogId) {
      fetchBlog();
    }
  }, [blogId]);

  const formatDate = (dateString) => {
    if (!dateString) return "No date";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleBack = () => {
    router.push('/admin/blogList');
  };

  const handleEdit = () => {
    router.push(`/admin/addProjact/edit/${blogId}`);
  };

  if (loadings) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <p className="text-red-500 text-lg">{error}</p>
          <button 
            onClick={handleBack}
            className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded-lg"
          >
            Back to Blog List
          </button>
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <p className="text-lg">Blog not found</p>
          <button 
            onClick={handleBack}
            className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded-lg"
          >
            Back to Blog List
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-12 px-4 sm:px-6 lg:px-8">
      {/* অ্যানিমেটেড ব্যাকগ্রাউন্ড এলিমেন্ট */}
      <div className="fixed inset-0 overflow-hidden -z-10">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 mb-4">
            Blog Details
          </h1>
        </div>
        
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl overflow-hidden border border-white/20">
          <div className="p-6 sm:p-8">
            {/* Back Button */}
            <div className="mb-6">
              <button
                onClick={handleBack}
                className="flex items-center text-indigo-600 hover:text-indigo-800 transition-colors duration-300"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
                Back to Blog List
              </button>
            </div>

            {/* Blog Image */}
            {blog.image && (
              <div className="mb-8">
                <div className="rounded-xl overflow-hidden shadow-lg">
                  <img 
                    src={blog.image} 
                    alt={blog.title} 
                    className="w-full h-auto object-cover"
                  />
                </div>
              </div>
            )}

            {/* Blog Title */}
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{blog.title}</h1>
              
              {/* Author and Date */}
              <div className="flex items-center text-sm text-gray-600 mb-4">
                <div className="flex items-center mr-6">
                  <Image
                    src={blog.authorImg || '/default-avatar.png'}
                    alt={blog.author || "Author"}
                    width={30}
                    height={30}
                    className="rounded-full mr-2"
                  />
                  <span>{blog.author || "Unknown"}</span>
                </div>
                <div>
                  <span>{formatDate(blog.createdAt)}</span>
                </div>
              </div>

              {/* Category and Status */}
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="inline-block px-3 py-1 text-sm font-semibold rounded-full bg-indigo-100 text-indigo-800">
                  {blog.category}
                </span>
                <span className={`inline-block px-3 py-1 text-sm font-semibold rounded-full ${
                  blog.status === "published"
                    ? "bg-green-100 text-green-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}>
                  {blog.status}
                </span>
              </div>
            </div>

            {/* Blog Content */}
            <div className="prose max-w-none mb-8">
              <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                {blog.description}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200">
              <button
                onClick={handleEdit}
                className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-300"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
                Edit
              </button>
            </div>
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
      `}</style>
    </div>
  );
};

export default ViewBlogPage;