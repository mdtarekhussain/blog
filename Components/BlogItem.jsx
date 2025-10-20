"use client";

import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';
import axios from 'axios';

const BlogItem = ({ title, description, category, image, id, views, authorImg, author, createdAt }) => {

  // ✅ তারিখ সুন্দরভাবে ফরম্যাট করার ফাংশন
  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const [isUpdating, setIsUpdating] = useState(false);

  // ✅ ভিউ কাউন্ট বাড়ানোর ফাংশন
  const handleViewIncrement = async () => {
    if (isUpdating) return;
    setIsUpdating(true);
    try {
      await axios.patch(`/api/blog/${id}`, { incrementView: true });
    } catch (error) {
      console.error("Error updating view count:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className='group bg-white rounded-xl px-3 overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 h-[450px] flex flex-col'>
      <Link 
        href={`/blog/${id}`} 
        onClick={handleViewIncrement} 
        className="flex flex-col flex-grow cursor-pointer"
      >
        {/* 🖼️ ইমেজ সেকশন */}
        <div className='relative overflow-hidden h-48 flex-shrink-0'>
          <Image 
            src={image} 
            alt={title || 'Blog image'}
            width={400} 
            height={400} 
            className='w-full h-full object-cover transition-transform duration-500 group-hover:scale-110'
          />
          <div className='absolute top-4 right-4 bg-white bg-opacity-90 rounded-full p-2 shadow-md'>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
            </svg>
          </div>
          <div className='absolute bottom-0 left-0 right-0 p-4'>
            <p className='text-white text-sm font-medium'>
              <span className="bg-black/50 px-3 py-1 rounded-full">{category}</span>
            </p>
          </div>
        </div>
        
        {/* 📝 কন্টেন্ট সেকশন */}
        <div className="p-5 flex flex-col flex-grow">
          {/* 🧑 Author + Date */}
          <div className='flex items-center justify-between mb-3 flex-shrink-0'>
            <div className='flex items-center'>
              <div className='w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center mr-2'>
                <Image src={authorImg} alt='' width={50} height={50} className='rounded-full' />
              </div>
              <span className='text-sm text-gray-600'>{author}</span>
            </div>
            <span className='text-sm text-gray-500'>{formatDate(createdAt)}</span>
          </div>
          
          {/* 🏷️ টাইটেল */}
          <h3 className='mb-2 text-xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors line-clamp-2 flex-shrink-0'>
            {title}
          </h3>
          
          {/* 📄 ডেসক্রিপশন */}
          <p 
            className='text-gray-600 line-clamp-3 overflow-hidden flex-grow' 
            dangerouslySetInnerHTML={{
              __html: description.slice(0, 120) + (description.length > 120 ? '...' : '')
            }}
          ></p>
          
          {/* 👣 Footer Section (Views + Comments + Button) */}
          <div className='flex justify-between items-center mt-auto pt-2 border-t border-gray-100'>
            <div className='flex items-center text-sm text-gray-500'>
              {/* 👁 Views */}
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              {views || '0'} views

              {/* 💬 Comments */}
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              24
            </div>
            
            <button 
              className='flex items-center text-indigo-600 font-medium group-hover:text-indigo-800 transition-colors'
              disabled={isUpdating}
            >
              Read More
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default BlogItem;
