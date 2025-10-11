import { assets } from '@/Asstes/assets';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

const BlogItem = ({title,description,category,image,id}) => {
    return (
        <div className='group max-w-[350px] bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100'>
            <Link href={`/blog/${id}`}>
                <div className='relative overflow-hidden h-48'>
                    <Image 
                        src={image} 
                        alt='' 
                        width={400} 
                        height={400} 
                        className='w-full h-full object-cover transition-transform duration-500 group-hover:scale-110'
                    />
                    <div className='absolute top-4 right-4 bg-white bg-opacity-90 rounded-full p-2 shadow-md'>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <div className='absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4'>
                        <p className='text-white text-sm font-medium'>{category}</p>
                    </div>
                </div>
                
                <div className="p-5">
                    <div className='flex items-center mb-3'>
                        <div className='flex items-center'>
                            <div className='w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center mr-2'>
                                <span className='text-indigo-800 font-bold text-sm'>A</span>
                            </div>
                            <span className='text-sm text-gray-600'>Alex Johnson</span>
                        </div>
                        <span className='mx-2 text-gray-300'>•</span>
                        <span className='text-sm text-gray-500'>May 12, 2023</span>
                    </div>
                    
                    <h3 className='mb-3 text-xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors line-clamp-2'>
                        {title}
                    </h3>
                    
                    <p className='mb-4 text-gray-600 line-clamp-3'>
                        {description}
                    </p>
                    
                    <div className='flex justify-between items-center'>
                        <div className='flex items-center text-sm text-gray-500'>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            1.2K
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                            24
                        </div>
                        
                        <button className='flex items-center text-indigo-600 font-medium group-hover:text-indigo-800 transition-colors'>
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