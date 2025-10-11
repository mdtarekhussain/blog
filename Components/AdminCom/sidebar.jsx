"use client"
import { assets } from '@/Asstes/assets';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useState } from 'react';

const Sidebar = () => {
    const pathname = usePathname();
    const [isExpanded, setIsExpanded] = useState(true);
    
    const menuItems = [
        { 
            href: '/admin/addProjact', 
            icon: assets.add_icon, 
            label: 'Add Blog',
            description: 'Create new blog posts'
        },
        { 
            href: '/admin/blogList', 
            icon: assets.blog_icon, 
            label: 'Blog Lists',
            description: 'Manage all blogs'
        },
        { 
            href: '/admin/subscription', 
            icon: assets.email_icon, 
            label: 'Subscription',
            description: 'View subscribers'
        }
    ];

    return (
        <div className={`flex flex-col bg-gradient-to-b from-indigo-900 to-indigo-800 text-white transition-all duration-300 ${isExpanded ? 'w-64' : 'w-20'}`}>
            {/* Logo Section */}
            <div className='flex items-center justify-between p-4 border-b border-indigo-700'>
                {isExpanded && (
                    <div className='flex items-center space-x-2'>
                        <Image src={assets.logo} width={120} alt='Blog Admin' className='brightness-0 invert' />
                    </div>
                )}
                <button 
                    onClick={() => setIsExpanded(!isExpanded)}
                    className='p-2 rounded-lg hover:bg-indigo-700 transition-colors'
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                    </svg>
                </button>
            </div>
            
            {/* Navigation Menu */}
            <div className='flex-1 overflow-y-auto py-6'>
                <div className='space-y-1 px-3'>
                    {menuItems.map((item, index) => (
                        <Link 
                            key={index}
                            href={item.href}
                            className={`flex items-center p-3 rounded-lg transition-all duration-200 group ${
                                pathname === item.href 
                                    ? 'bg-indigo-700 shadow-lg' 
                                    : 'hover:bg-indigo-700/50'
                            }`}
                        >
                            <div className='flex items-center justify-center w-10 h-10 rounded-lg bg-indigo-600 group-hover:bg-indigo-500 transition-colors'>
                                <Image src={item.icon} alt={item.label} width={24} className='brightness-0 invert' />
                            </div>
                            
                            {isExpanded && (
                                <div className='ml-4 overflow-hidden'>
                                    <div className='font-medium'>{item.label}</div>
                                    <div className='text-xs text-indigo-200 truncate'>{item.description}</div>
                                </div>
                            )}
                        </Link>
                    ))}
                </div>
                
                {/* Stats Section */}
                {isExpanded && (
                    <div className='mt-8 px-3'>
                        <h3 className='text-xs uppercase text-indigo-400 font-semibold mb-3'>Statistics</h3>
                        <div className='bg-indigo-800/50 rounded-xl p-4 space-y-3'>
                            <div>
                                <div className='flex justify-between text-sm'>
                                    <span className='text-indigo-300'>Total Blogs</span>
                                    <span className='font-medium'>24</span>
                                </div>
                                <div className='w-full bg-indigo-900 h-1 rounded-full mt-1'>
                                    <div className='bg-indigo-400 h-1 rounded-full' style={{ width: '75%' }}></div>
                                </div>
                            </div>
                            <div>
                                <div className='flex justify-between text-sm'>
                                    <span className='text-indigo-300'>Subscribers</span>
                                    <span className='font-medium'>1,240</span>
                                </div>
                                <div className='w-full bg-indigo-900 h-1 rounded-full mt-1'>
                                    <div className='bg-indigo-400 h-1 rounded-full' style={{ width: '45%' }}></div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            
            {/* User Profile Section */}
            <div className={`p-4 border-t border-indigo-700 ${isExpanded ? '' : 'flex justify-center'}`}>
                {isExpanded ? (
                    <div className='flex items-center space-x-3'>
                        <div className='relative'>
                            <Image src={assets.profile_icon} width={40} alt='Admin' className='rounded-full border-2 border-indigo-500' />
                            <div className='absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-indigo-800'></div>
                        </div>
                        <div>
                            <div className='font-medium'>Admin User</div>
                            <div className='text-xs text-indigo-300'>admin@blog.com</div>
                        </div>
                    </div>
                ) : (
                    <div className='relative'>
                        <Image src={assets.profile_icon} width={40} alt='Admin' className='rounded-full border-2 border-indigo-500' />
                        <div className='absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-indigo-800'></div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Sidebar;