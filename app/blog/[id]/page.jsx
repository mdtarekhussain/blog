// Page.js (Blog Detail Page)
'use client'
import { CiFacebook } from "react-icons/ci";
import { FaLinkedin } from "react-icons/fa6";
import { FaFacebookMessenger } from "react-icons/fa";
import { FaEdit, FaTrash } from "react-icons/fa"; // আইকন ইমপোর্ট করুন

import { usePathname, useRouter } from 'next/navigation';

import { assets } from '/Asstes/assets';
import Footer from '/Components/Footer';
import Image from 'next/image';
import Link from 'next/link';
import React, { use, useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '/lib/AuthContext'; // AuthContext ইমপোর্ট করুন
import { toast } from "react-toastify";

// টুলস ফাংশনগুলো কম্পোনেন্টের বাইরে রাখা
const calculateReadingTime = (html) => {
  if (!html) return 0;

  // HTML ট্যাগ বাদ দিয়ে শুধু টেক্সট বের করা
  const text = html.replace(/<[^>]+>/g, '');
  const wordCount = text.trim().split(/\s+/).length;

  // সময় মিনিটে (wordCount ÷ 200)
  const minutes = Math.ceil(wordCount / 200);
  return minutes;
};

const Page = ({ params }) => {
    const pathname = usePathname();
    const router = useRouter();
    const [readingTime, setReadingTime] = useState(0);
    const { id } = use(params);
    const [data, setData] = useState(null);
    const [relatedPosts, setRelatedPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [pendingComment, setPendingComment] = useState(""); // পেন্ডিং কমেন্ট স্টেট
    const [editingCommentId, setEditingCommentId] = useState(null); // যে কমেন্ট এডিট হচ্ছে তার ID
    const [editCommentText, setEditCommentText] = useState(""); // এডিট করা কমেন্ট টেক্সট
    
    // AuthContext থেকে ইউজার এবং ফাংশনগুলি নিন
    const { user, login, logout, loading: authLoading } = useAuth();

    // পেন্ডিং কমেন্ট চেক করার ফাংশন
    useEffect(() => {
        const savedComment = localStorage.getItem('pendingComment');
        if (savedComment && user) {
            // কমেন্ট যোগ করা
            handleAddCommentDirectly(savedComment);
            localStorage.removeItem('pendingComment');
            setPendingComment("");
        }
    }, [user]);

    // কমেন্ট ফেচ করার ফাংশন
    const fetchComments = async () => {
        try {
            const response = await axios.get(`/api/blog/comment/${id}`);
            if (response.data.success) {
                // Format comments for display
                const formattedComments = response.data.comments.map(comment => ({
                    id: comment._id,
                    name: comment.name,
                    email: comment.email,
                    text: comment.text,
                    time: new Date(comment.createdAt).toLocaleString()
                }));
                setComments(formattedComments);
            }
        } catch (error) {
            console.error("Error fetching comments:", error);
        }
    };

    // ব্লগ ডেটা ফেচ করার useEffect
    useEffect(() => {
        const fetchBlog = async () => {
            try {
                setLoading(true);
                console.log("Fetching blog with ID:", id);
                
                // নির্দিষ্ট ব্লগ ডেটা ফেচ করুন
                const response = await axios.get(`/api/blog/${id}`);
                console.log("Blog response:", response.data);
                
                if (response.data.success) {
                    setData(response.data.blog);
                } else {
                    console.error("Blog fetch failed:", response.data.error);
                    toast.error(response.data.error || "Failed to fetch blog");
                }
                
                // কমেন্ট ফেচ করুন
                await fetchComments();
                
                // সম্পর্কিত পোস্ট ফেচ করুন
                const allBlogsResponse = await axios.get('/api/blog');
                const allBlogs = allBlogsResponse.data.blogs;
                const related = allBlogs.filter(post => post._id !== id).slice(0, 3);
                setRelatedPosts(related);
            } catch (error) {
                console.error("Error fetching blog:", error);
                
                if (error.response) {
                    console.error("Error response:", error.response.data);
                    toast.error(error.response.data.error || "Failed to fetch blog");
                } else if (error.request) {
                    console.error("Error request:", error.request);
                    toast.error("Network error. Please check your connection.");
                } else {
                    console.error("Error message:", error.message);
                    toast.error("Failed to fetch blog");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchBlog();
    }, [id]);

    // রিডিং টাইম ক্যালকুলেশনের useEffect
    useEffect(() => {
      if (data?.description) {
        const time = calculateReadingTime(data.description);
        setReadingTime(time);
      }
    }, [data]);

    // কমেন্ট MongoDB এ সেভ করার ফাংশন
    const saveCommentToMongoDB = async (commentData) => {
        try {
            // Fixed: Include blog ID in the URL path
            const response = await axios.post(`/api/blog/comment/${id}`, commentData);
            
            if (response.data.success) {
                console.log("Comment saved to MongoDB:", response.data);
                return true;
            } else {
                console.error("Failed to save comment:", response.data.error);
                return false;
            }
        } catch (error) {
            console.error("Error saving comment to MongoDB:", error);
            return false;
        }
    };

    // কমেন্ট আপডেট করার ফাংশন
    const updateCommentInMongoDB = async (id, updatedText) => {
        try {
            const response = await axios.put(`/api/blog/comment/${id}`, {
                text: updatedText
            });
            
            if (response.data.success) {
                console.log("Comment updated in MongoDB:", response.data);
                return true;
            } else {
                console.error("Failed to update comment:", response.data.error);
                return false;
            }
        } catch (error) {
            console.error("Error updating comment in MongoDB:", error);
            return false;
        }
    };

    // কমেন্ট ডিলিট করার ফাংশন
    const deleteCommentFromMongoDB = async (id) => {
        try {
            const response = await axios.delete(`/api/blog/comment/${id}`);
            
            if (response.data.success) {
                console.log("Comment deleted from MongoDB:", response.data);
                return true;
            } else {
                console.error("Failed to delete comment:", response.data.error);
                return false;
            }
        } catch (error) {
            console.error("Error deleting comment from MongoDB:", error);
            return false;
        }
    };

    // সরাসরি কমেন্ট যোগ করার ফাংশন
    const handleAddCommentDirectly = async (commentText) => {
        if (commentText.trim() === '') return;
        
        // লগইন থাকলে কমেন্ট ডেটা তৈরি করুন - ইউজারের আসল তথ্য ব্যবহার করে
        const commentData = {
            name: user.name,      // লগইন করা ইউজারের নাম
            email: user.email,    // লগইন করা ইউজারের ইমেল
            text: commentText
        };
        
        // MongoDB এ কমেন্ট সেভ করুন
        const savedToMongoDB = await saveCommentToMongoDB(commentData);
        
        // লোকাল স্টেট আপডেট করুন
        const comment = {
            id: comments.length + 1,
            ...commentData,
            time: "Just now"
        };
        
        setComments([comment, ...comments]);
        
        // ইউজারকে অবহিত করুন যে কমেন্ট সফলভাবে সেভ হয়েছে - টোস্ট নোটিফিকেশন দিয়ে
        if (savedToMongoDB) {
            toast.success(`Comment posted successfully by ${user.name} (${user.email})!`, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        } else {
            toast.error("Comment posted but failed to save to database. Please try again later.", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }
    };

    const handleAddComment = async (e) => {
        e.preventDefault();
        if (newComment.trim() === '') return;
        
        // চেক করুন ইউজার লগইন আছে কিনা
        if (!user) {
            // পেন্ডিং কমেন্ট সেভ করুন
            localStorage.setItem('pendingComment', newComment);
            setPendingComment(newComment);
            
            // লগইন পেজে রিডাইরেক্ট করুন
            router.push('/login');
            return;
        }
        
        // সরাসরি কমেন্ট যোগ করুন
        await handleAddCommentDirectly(newComment);
        setNewComment("");
    };

    // কমেন্ট এডিট শুরু করার ফাংশন
    const startEditComment = (comment) => {
        setEditingCommentId(comment.id);
        setEditCommentText(comment.text);
    };

    // কমেন্ট এডিট বাতিল করার ফাংশন
    const cancelEditComment = () => {
        setEditingCommentId(null);
        setEditCommentText("");
    };

    // কমেন্ট আপডেট সাবমিট করার ফাংশন
    const handleUpdateComment = async (e) => {
        e.preventDefault();
        if (editCommentText.trim() === '') return;
        
        // MongoDB এ কমেন্ট আপডেট করুন
        const updated = await updateCommentInMongoDB(editingCommentId, editCommentText);
        
        if (updated) {
            // লোকাল স্টেট আপডেট করুন
            setComments(comments.map(comment => 
                comment.id === editingCommentId 
                    ? { ...comment, text: editCommentText } 
                    : comment
            ));
            
            // এডিট মোড বন্ধ করুন
            setEditingCommentId(null);
            setEditCommentText("");
            
            toast.success("Comment updated successfully!", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        } else {
            toast.error("Failed to update comment. Please try again later.", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }
    };

    // কমেন্ট ডিলিট করার ফাংশন
    const handleDeleteComment = async (commentId) => {
       
        
        // MongoDB থেকে কমেন্ট ডিলিট করুন
        const deleted = await deleteCommentFromMongoDB(commentId);
        
        if (deleted) {
            // লোকাল স্টেট আপডেট করুন
            setComments(comments.filter(comment => comment.id !== commentId));
            
            toast.success("Comment deleted successfully!", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        } else {
            toast.error("Failed to delete comment. Please try again later.", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }
    };

    // চেক করুন ইউজার কমেন্ট এডিট/ডিলিট করতে পারবে কিনা
// চেক করুন ইউজার কমেন্ট ডিলিট করতে পারবে কিনা (মালিক বা অ্যাডমিন)
const canDeleteComment = (comment) => {
    // যদি ইউজার লগইন আছে এবং কমেন্টের মালিক হয়
    if (user && user.email === comment.email) {
        return true;
    }
    
    // যদি ইউজার অ্যাডমিন হয়
    if (user && user.role === 'ADMIN') {
        return true;
    }
    
    return false;
};

// চেক করুন ইউজার কমেন্ট এডিট করতে পারবে কিনা (শুধুমাত্র মালিক)
const canEditComment = (comment) => {
    // যদি ইউজার লগইন আছে এবং কমেন্টের মালিক হয়
    if (user && user.email === comment.email) {
        return true;
    }
    
    return false;
};
    // লোডিং স্টেট চেক করুন
    if (loading || authLoading) {
        return (
            <div className="min-h-screen flex justify-center items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="min-h-screen flex justify-center items-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">Blog not found</h1>
                    <Link href="/" className="text-indigo-600 hover:text-indigo-800">
                        Go back to home
                    </Link>
                </div>
            </div>
        );
    }

    const currentURL = `https://yourwebsite.com${pathname}`; // ✅ ডাইনামিক কারেন্ট পেজ URL
    const facebookShare = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentURL)}`;
    const linkedinShare = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentURL)}`;
    const messengerShare = `https://www.facebook.com/dialog/send?link=${encodeURIComponent(currentURL)}&app_id=123456789&redirect_uri=${encodeURIComponent(currentURL)}`;

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
            {/* Header */}
            <div className="bg-white shadow-sm py-5 px-5 md:px-12 lg:px-28 sticky top-0 z-10">
                <div className='flex justify-between items-center'>
                    <Link href={'/'} className="flex items-center space-x-2">
                        <Image src={assets.logo} width={180} alt='' className='w-[130px] sm:w-auto'/>
                    </Link>
                    
                    {/* লগইন/লগআউট বাটন */}
                    <div className="flex items-center space-x-4">
                        {user ? (
                            <>
                                <div className="flex items-center sm:hidden space-x-2">
                                    {user?.avatar && (
                                        <Image 
                                            src={user.avatar} 
                                            width={32} 
                                            height={32} 
                                            alt={user.name}
                                            className="rounded-full"
                                        />
                                    )}
                                    <span className="text-gray-700 sm:hidden">{user?.name}!</span>
                                </div>
                                <button 
                                    onClick={logout} // AuthContext থেকে logout ফাংশন ব্যবহার করুন
                                    className='flex items-center gap-2 font-medium py-2 px-4 sm:py-3 sm:px-6 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all'
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <button 
                                onClick={() => router.push('/login')} // লগইন পেজে রিডাইরেক্ট করুন
                                className='flex items-center gap-2 font-medium py-2 px-4 sm:py-3 sm:px-6 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all shadow-lg hover:shadow-indigo-200'
                            >
                                Login
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Hero Section */}
            <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10"></div>
                <div className='relative container mx-auto px-5 md:px-12 lg:px-28 py-16 text-center'>
                    <div className="inline-block bg-indigo-100 text-indigo-800 text-sm font-semibold px-4 py-1 rounded-full mb-4">
                        {data.category}
                    </div>
                    <h1 className='text-3xl sm:text-5xl font-bold text-gray-900 max-w-4xl mx-auto mb-6'>
                        {data.title}
                    </h1>
                    
                    <div className='flex flex-col sm:flex-row items-center justify-center gap-10 mb-8'>
                        <div className='flex items-center space-x-3'>
                            <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-md">
                                <Image 
                                    className='w-full h-full object-cover' 
                                    src={data.authorImg} 
                                    alt=''
                                    fill
                                />
                            </div>
                            <div className="text-left">
                                <p className='font-semibold text-gray-900'>{data.author}</p>
                                <p className='text-sm text-gray-600'>Published on {new Date(data.createdAt).toLocaleDateString()}</p>
                            </div>
                        </div>
                        
                        <div className="flex flex-col space-x-4 text-sm text-gray-600">
                            <div className="flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                It will take <span className='text-[20px] font-medium mx-2'>{readingTime}</span> minutes to finish.
                            </div>
                            <div className="flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                                {data.views || 0} views
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className='container mx-auto px-5 md:px-12 lg:px-28 py-12'>
                <div className='grid grid-cols-1 lg:grid-cols-3 gap-12'>
                    {/* Blog Content */}
                    <div className='lg:col-span-2'>
                        <div className='bg-white rounded-2xl shadow-lg overflow-hidden mb-8'>
                            <Image 
                                className='w-full h-auto' 
                                src={data.image} 
                                width={1280} 
                                height={720} 
                                alt='' 
                                priority
                            /> 
                        </div>
                        
                        <div className='bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-8'>
                            <div className="prose prose-lg max-w-none">
                                <div className='blog-content' dangerouslySetInnerHTML={{__html:data.description}}></div>
                            </div>
                        </div>
                        
                        {/* Social Sharing */}
                        <div className='bg-white rounded-2xl shadow-lg p-6 mb-8'>
                            <h3 className='text-lg font-semibold text-gray-900 mb-4'>Share this article</h3>
                            <div className='flex space-x-4 text-3xl'>
                                <a
                                    href={facebookShare}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:text-blue-800"
                                >
                                    <CiFacebook />
                                </a>

                                <a
                                    href={linkedinShare}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-500 hover:text-blue-700"
                                >
                                    <FaLinkedin />
                                </a>

                                <a
                                    href={messengerShare}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:text-blue-800"
                                >
                                    <FaFacebookMessenger />
                                </a>
                            </div>
                        </div>
                        
                        {/* Comments Section */}
                        <div className='bg-white rounded-2xl shadow-lg p-6'>
                            <h3 className='text-xl font-semibold text-gray-900 mb-6'>Comments ({comments.length})</h3>
                            
                            {/* কমেন্ট ফর্ম - সবার জন্য */}
                            <form onSubmit={handleAddComment} className='mb-8'>
                                <div className='flex items-start space-x-4'>
                                    <div className='flex-shrink-0'>
                                        {user?.avatar ? (
                                            <Image 
                                                src={user.avatar} 
                                                width={40} 
                                                height={40} 
                                                alt={user.name}
                                                className="w-10 h-10 rounded-full"
                                            />
                                        ) : (
                                            <div className='w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center'>
                                                <span className='text-indigo-800 font-bold'>Y</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className='flex-grow'>
                                        <textarea 
                                            value={newComment}
                                            onChange={(e) => setNewComment(e.target.value)}
                                            placeholder='Add a comment...' 
                                            className='w-full border border-gray-300 rounded-lg p-4 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500'
                                            rows={3}
                                        ></textarea>
                                        <div className='mt-2 flex justify-end'>
                                            <button 
                                                type='submit' 
                                                className='bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-6 rounded-lg transition-colors'
                                            >
                                                Post Comment
                                            </button>
                                        </div>
                                        {!user && (
                                            <p className="text-sm text-gray-500 mt-2">
                                                You need to login to post a comment. Your comment will be saved and posted after login.
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </form>
                            
                            {/* Comments List - Scrollable */}
                            <div className='max-h-[400px] overflow-y-auto pr-2 border border-gray-200 rounded-lg p-4'>
                                <div className='space-y-6'>
                                    {comments.length > 0 ? (
                                        comments.map(comment => (
                                            <div key={comment.id} className='flex items-start space-x-4'>
                                                <div className='flex-shrink-0'>
                                                    <div className='w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center'>
                                                        <span className='text-indigo-800 font-bold'>{comment.name.charAt(0)}</span>
                                                    </div>
                                                </div>
                                                <div className='flex-grow'>
                                                    <div className='flex items-center justify-between mb-1'>
                                                        <div className='flex items-center space-x-2'>
                                                            <h4 className='font-semibold text-gray-900'>{comment.name}</h4>
                                                            {comment.email && (
                                                                <span className='text-xs text-gray-500'>({comment.email})</span>
                                                            )}
                                                            <span className='text-sm text-gray-500'>• {comment.time}</span>
                                                        </div>
                                                        
                                                        {/* এডিট/ডিলিট বাটন - শুধুমাত্র কমেন্টের মালিক বা অ্যাডমিন দেখতে পাবে */}
                                                   
                                                         {/* এডিট/ডিলিট বাটন */}
<div className='flex space-x-2'>
    {/* এডিট বাটন - শুধুমাত্র কমেন্টের মালিক দেখতে পাবে */}
    {canEditComment(comment) && (
        <button 
            onClick={() => startEditComment(comment)}
            className='text-blue-500 hover:text-blue-700'
            title='Edit comment'
        >
            <FaEdit />
        </button>
    )}
    
    {/* ডিলিট বাটন - কমেন্টের মালিক বা অ্যাডমিন দেখতে পাবে */}
    {canDeleteComment(comment) && (
        <button 
            onClick={() => handleDeleteComment(comment.id)}
            className='text-red-500 hover:text-red-700'
            title='Delete comment'
        >
            <FaTrash />
        </button>
    )}
</div>
                                                   
                                                    </div>
                                                    
                                                    {/* এডিট মোড */}
                                                    {editingCommentId === comment.id ? (
                                                        <div className='mt-2'>
                                                            <textarea 
                                                                value={editCommentText}
                                                                onChange={(e) => setEditCommentText(e.target.value)}
                                                                className='w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500'
                                                                rows={3}
                                                            ></textarea>
                                                            <div className='mt-2 flex justify-end space-x-2'>
                                                                <button 
                                                                    onClick={cancelEditComment}
                                                                    className='px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300'
                                                                >
                                                                    Cancel
                                                                </button>
                                                                <button 
                                                                    onClick={handleUpdateComment}
                                                                    className='px-3 py-1 text-sm bg-indigo-600 text-white rounded hover:bg-indigo-700'
                                                                >
                                                                    Save
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <p className='text-gray-700'>{comment.text}</p>
                                                    )}
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-center text-gray-500 py-4">No comments yet. Be the first to comment!</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Sidebar */}
                    <div className='lg:col-span-1'>
                        {/* Author Card */}
                        <div className='bg-white rounded-2xl shadow-lg p-6 mb-8 sticky top-24'>
                            <div className='text-center mb-6'>
                                <Image 
                                    className='mx-auto border-4 border-white rounded-full shadow-md mb-4' 
                                    src={data.authorImg} 
                                    width={100} 
                                    height={100} 
                                    alt=''
                                />
                                <h3 className='text-xl font-bold text-gray-900 mb-1'>{data.author}</h3>
                                <p className='text-gray-600 mb-4'>Content Writer & Blogger</p>
                                <button className='bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-6 rounded-lg transition-colors w-full'>
                                    Follow
                                </button>
                            </div>
                            
                            <div className='border-t border-gray-200 pt-4'>
                                <h4 className='font-semibold text-gray-900 mb-3'>About the Author</h4>
                                <p className='text-gray-600 text-sm mb-4'>
                                    Passionate writer with over 5 years of experience in creating engaging content. 
                                    Specializes in technology, lifestyle, and personal development topics.
                                </p>
                                
                                <div className='flex space-x-3 justify-center'>
                                    <a href="#" className='text-gray-500 hover:text-indigo-600 transition-colors'>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
                                            <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
                                        </svg>
                                    </a>
                                    <a href="#" className='text-gray-500 hover:text-indigo-600 transition-colors'>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                        </svg>
                                    </a>
                                    <a href="#" className='text-gray-500 hover:text-indigo-600 transition-colors'>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                                        </svg>
                                    </a>
                                </div>
                            </div>
                        </div>
                        
                        {/* Related Posts */}
                        <div className='bg-white rounded-2xl shadow-lg p-6'>
                            <h3 className='text-xl font-bold text-gray-900 mb-6'>Related Posts</h3>
                            <div className='space-y-6'>
                                {relatedPosts.map(post => (
                                    <Link key={post._id} href={`/blog/${post._id}`} className='flex group'>
                                        <div className='flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden mr-4'>
                                            <Image 
                                                src={post.image} 
                                                width={80} 
                                                height={80} 
                                                alt='' 
                                                className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-300'
                                            />
                                        </div>
                                        <div>
                                            <h4 className='font-medium text-gray-900 group-hover:text-indigo-600 transition-colors line-clamp-2'>
                                                {post.title}
                                            </h4>
                                            <p className='text-sm text-gray-500 mt-1'>
                                                {new Date(post.createdAt).toLocaleDateString()} • 3 min read
                                            </p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <Footer/>
        </div>
    );
};

export default Page;