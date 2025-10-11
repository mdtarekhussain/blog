import { assets } from '@/Asstes/assets';
import Image from 'next/image';
import React from 'react';

const Footer = () => {
    return (
        <footer className='bg-gray-900 text-white pt-16 pb-8'>
            <div className='container mx-auto px-5 md:px-12 lg:px-28'>
                <div className='grid grid-cols-1 md:grid-cols-4 gap-8 mb-12'>
                    <div>
                        <div className='flex items-center space-x-2 mb-4'>
                            <Image src={assets.logo_light} alt='' width={120} className='brightness-0 invert'/>
                            <span className='text-xl font-bold'>BlogVerse</span>
                        </div>
                        <p className='text-gray-400 mb-4'>
                            Discover amazing stories and insights from our community of writers and thinkers.
                        </p>
                        <div className='flex space-x-4'>
                            <a href="#" className='bg-gray-800 p-2 rounded-full hover:bg-indigo-600 transition-colors'>
                                <Image src={assets.facebook_icon} alt='' width={20} height={20} className='brightness-0 invert'/>
                            </a>
                            <a href="#" className='bg-gray-800 p-2 rounded-full hover:bg-blue-400 transition-colors'>
                                <Image src={assets.twitter_icon} alt='' width={20} height={20} className='brightness-0 invert'/>
                            </a>
                            <a href="#" className='bg-gray-800 p-2 rounded-full hover:bg-red-500 transition-colors'>
                                <Image src={assets.googleplus_icon} alt='' width={20} height={20} className='brightness-0 invert'/>
                            </a>
                            <a href="#" className='bg-gray-800 p-2 rounded-full hover:bg-pink-500 transition-colors'>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </a>
                        </div>
                    </div>
                    
                    <div>
                        <h3 className='text-lg font-semibold mb-4'>Quick Links</h3>
                        <ul className='space-y-2'>
                            <li><a href="#" className='text-gray-400 hover:text-white transition-colors'>Home</a></li>
                            <li><a href="#" className='text-gray-400 hover:text-white transition-colors'>About Us</a></li>
                            <li><a href="#" className='text-gray-400 hover:text-white transition-colors'>Categories</a></li>
                            <li><a href="#" className='text-gray-400 hover:text-white transition-colors'>Contact</a></li>
                        </ul>
                    </div>
                    
                    <div>
                        <h3 className='text-lg font-semibold mb-4'>Categories</h3>
                        <ul className='space-y-2'>
                            <li><a href="#" className='text-gray-400 hover:text-white transition-colors'>Technology</a></li>
                            <li><a href="#" className='text-gray-400 hover:text-white transition-colors'>Lifestyle</a></li>
                            <li><a href="#" className='text-gray-400 hover:text-white transition-colors'>Travel</a></li>
                            <li><a href="#" className='text-gray-400 hover:text-white transition-colors'>Food</a></li>
                        </ul>
                    </div>
                    
                    <div>
                        <h3 className='text-lg font-semibold mb-4'>Newsletter</h3>
                        <p className='text-gray-400 mb-4'>Subscribe to our newsletter for the latest updates.</p>
                        <form className='flex'>
                            <input 
                                type="email" 
                                placeholder='Your email' 
                                className='px-4 py-2 bg-gray-800 text-white rounded-l-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full'
                            />
                            <button 
                                type='submit' 
                                className='bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-r-lg transition-colors'
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </button>
                        </form>
                    </div>
                </div>
                
                <div className='border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center'>
                    <p className='text-gray-400 text-sm mb-4 md:mb-0'>
                        © {new Date().getFullYear()} BlogVerse. All rights reserved.
                    </p>
                    <div className='flex space-x-6 text-sm'>
                        <a href="#" className='text-gray-400 hover:text-white transition-colors'>Privacy Policy</a>
                        <a href="#" className='text-gray-400 hover:text-white transition-colors'>Terms of Service</a>
                        <a href="#" className='text-gray-400 hover:text-white transition-colors'>Cookie Policy</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;