import { assets } from '@/Asstes/assets';
import Image from 'next/image';
import React from 'react';

const Header = () => {
    return (
        <div className='py-6 px-5 md:px-12 lg:px-28 bg-gradient-to-r from-blue-50 to-indigo-100'>
            <div className='flex justify-between items-center'>
                <div className='flex items-center space-x-2'>
                    <Image src={assets.logo} width={180} alt='' className='w-[130px] sm:w-auto'/>
                 
                </div>
        
                <button className='flex items-center gap-2 font-medium py-2 px-4 sm:py-3 sm:px-6 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all shadow-lg hover:shadow-indigo-200'>
                    Get Started <Image src={assets.arrow} alt='' className='w-4 h-4'/>
                </button>
            </div>
            
            <div className='text-center my-12 max-w-4xl mx-auto'>
                <h1 className='text-4xl sm:text-6xl font-bold text-gray-800 mb-6'>Discover Amazing Stories</h1>
                <p className='mt-6 text-lg text-gray-600 max-w-2xl mx-auto'>
                    Explore our curated collection of insightful articles, thought-provoking essays, and inspiring stories from writers around the world.
                </p>
                
                <div className='mt-10 flex flex-col sm:flex-row justify-center gap-4'>
                    <div className='relative flex-1 max-w-md mx-auto'>
                        <form className='flex items-center bg-white rounded-full shadow-lg overflow-hidden'>
                            <input 
                                type="email" 
                                placeholder='Enter your email' 
                                className='flex-1 py-4 px-6 outline-none text-gray-700'
                            />
                            <button 
                                type='submit' 
                                className='bg-indigo-600 text-white py-4 px-6 hover:bg-indigo-700 transition-colors font-medium'
                            >
                                Subscribe
                            </button>
                        </form>
                        <div className='absolute -top-2 -right-2 bg-yellow-400 text-gray-900 text-xs font-bold py-1 px-3 rounded-full animate-pulse'>
                            NEW
                        </div>
                    </div>
                </div>
                
              
            </div>
        </div>
    );
};

export default Header;