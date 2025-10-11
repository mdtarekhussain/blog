'use client'

import { assets, blog_data } from '@/Asstes/assets';
import Footer from '@/Components/Footer';
import Image from 'next/image';
import Link from 'next/link';
import React, { use, useEffect, useState } from 'react';

const Page = ({ params }) => {
    const { id } = use(params); 

    const [data, setData] = useState(null);
    const [relatedPosts, setRelatedPosts] = useState([]);
    const [comments, setComments] = useState([
        { id: 1, name: "Alex Johnson", text: "Great article! Really helped me understand the topic better.", time: "2 hours ago" },
        { id: 2, name: "Sarah Williams", text: "I've been looking for this information everywhere. Thank you for sharing!", time: "1 day ago" },
        { id: 3, name: "Michael Chen", text: "The step-by-step approach makes it so easy to follow. Excellent work!", time: "3 days ago" }
    ]);
    const [newComment, setNewComment] = useState("");

    useEffect(() => {
        // Find the current blog post
        for (let i = 0; i < blog_data.length; i++) {
            if (Number(id) === blog_data[i].id) {
                setData(blog_data[i]);
                break;
            }
        }
        
        // Find related posts (excluding current post)
        const related = blog_data.filter(post => post.id !== Number(id)).slice(0, 3);
        setRelatedPosts(related);
    }, [id]); 

    const handleAddComment = (e) => {
        e.preventDefault();
        if (newComment.trim() === '') return;
        
        const comment = {
            id: comments.length + 1,
            name: "You",
            text: newComment,
            time: "Just now"
        };
        
        setComments([comment, ...comments]);
        setNewComment("");
    };

    return ( data? 
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
            {/* Header */}
            <div className="bg-white shadow-sm py-5 px-5 md:px-12 lg:px-28 sticky top-0 z-10">
                <div className='flex justify-between items-center'>
                    <Link href={'/'} className="flex items-center space-x-2">
                        <Image src={assets.logo} width={180} alt='' className='w-[130px] sm:w-auto'/>
                        
                    </Link>
                    <button className='flex items-center gap-2 font-medium py-2 px-4 sm:py-3 sm:px-6 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all shadow-lg hover:shadow-indigo-200'>
                        Get Started 
                        <Image src={assets.arrow} alt='' className='w-4 h-4'/>
                    </button>
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
                    
                    <div className='flex flex-col sm:flex-row items-center justify-center gap-4 mb-8'>
                        <div className='flex items-center space-x-3'>
                            <Image 
                                className='border-2 border-white rounded-full shadow-md' 
                                src={data.author_img} 
                                width={60} 
                                height={60} 
                                alt=''
                            />
                            <div className="text-left">
                                <p className='font-semibold text-gray-900'>{data.author}</p>
                                <p className='text-sm text-gray-600'>Published on {new Date().toLocaleDateString()}</p>
                            </div>
                        </div>
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <div className="flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                5 min read
                            </div>
                            <div className="flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                                1.2K views
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
                                <h1 className='text-2xl font-bold text-gray-900 mb-6 pb-2 border-b border-gray-200'>Introduction</h1>
                                <p className='text-gray-700 mb-6 leading-relaxed'>{data.description}</p>
                                
                                <h2 className='text-xl font-semibold text-gray-900 mt-8 mb-4'>Step 1: Self-Reflection and Goal Setting</h2>
                                <p className='text-gray-700 mb-4 leading-relaxed'>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Deleniti laborum rem reprehenderit modi architecto est nulla, cumque e</p>
                                <p className='text-gray-700 mb-6 leading-relaxed'>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Deleniti laborum rem reprehenderit modi architecto est nulla, cumque e</p>
                                
                                <h2 className='text-xl font-semibold text-gray-900 mt-8 mb-4'>Step 2: Implementation and Execution</h2>
                                <p className='text-gray-700 mb-4 leading-relaxed'>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Deleniti laborum rem reprehenderit modi architecto est nulla, cumque e</p>
                                <p className='text-gray-700 mb-6 leading-relaxed'>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Deleniti laborum rem reprehenderit modi architecto est nulla, cumque e</p>
                                
                                <h2 className='text-xl font-semibold text-gray-900 mt-8 mb-4'>Conclusion</h2>
                                <p className='text-gray-700 mb-6 leading-relaxed'>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Deleniti laborum rem reprehenderit modi architecto est nulla, cumque e</p>
                            </div>
                        </div>
                        
                        {/* Social Sharing */}
                        <div className='bg-white rounded-2xl shadow-lg p-6 mb-8'>
                            <h3 className='text-lg font-semibold text-gray-900 mb-4'>Share this article</h3>
                            <div className='flex space-x-4'>
                                <a href="#" className='bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full transition-colors'>
                                    <Image src={assets.facebook_icon} width={24} alt='' className='brightness-0 invert'/>
                                </a>
                                <a href="#" className='bg-blue-400 hover:bg-blue-500 text-white p-3 rounded-full transition-colors'>
                                    <Image src={assets.twitter_icon} width={24} alt='' className='brightness-0 invert'/>
                                </a>
                                <a href="#" className='bg-red-600 hover:bg-red-700 text-white p-3 rounded-full transition-colors'>
                                    <Image src={assets.googleplus_icon} width={24} alt='' className='brightness-0 invert'/>
                                </a>
                                <a href="#" className='bg-gray-800 hover:bg-gray-900 text-white p-3 rounded-full transition-colors'>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                                    </svg>
                                </a>
                            </div>
                        </div>
                        
                        {/* Comments Section */}
                        <div className='bg-white rounded-2xl shadow-lg p-6'>
                            <h3 className='text-xl font-semibold text-gray-900 mb-6'>Comments ({comments.length})</h3>
                            
                            {/* Comment Form */}
                            <form onSubmit={handleAddComment} className='mb-8'>
                                <div className='flex items-start space-x-4'>
                                    <div className='flex-shrink-0'>
                                        <div className='w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center'>
                                            <span className='text-indigo-800 font-bold'>Y</span>
                                        </div>
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
                                    </div>
                                </div>
                            </form>
                            
                            {/* Comments List */}
                            <div className='space-y-6'>
                                {comments.map(comment => (
                                    <div key={comment.id} className='flex items-start space-x-4'>
                                        <div className='flex-shrink-0'>
                                            <div className='w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center'>
                                                <span className='text-indigo-800 font-bold'>{comment.name.charAt(0)}</span>
                                            </div>
                                        </div>
                                        <div className='flex-grow'>
                                            <div className='flex items-center space-x-2 mb-1'>
                                                <h4 className='font-semibold text-gray-900'>{comment.name}</h4>
                                                <span className='text-sm text-gray-500'>{comment.time}</span>
                                            </div>
                                            <p className='text-gray-700'>{comment.text}</p>
                                        </div>
                                    </div>
                                ))}
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
                                    src={data.author_img} 
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
                                    <Link key={post.id} href={`/blog/${post.id}`} className='flex group'>
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
                                                {new Date().toLocaleDateString()} • 3 min read
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
    : <></>);
};

export default Page;