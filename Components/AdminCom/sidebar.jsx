// Sidebar কম্পোনেন্ট সংশোধিত কোড
"use client"
import { assets } from '/Asstes/assets';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const Sidebar = ({ isMobileMenuOpen, toggleMobileMenu }) => {
    const [subscribers, setSubscribers] = useState([]);
    const [loading, setLoading] = useState(true);
    const pathname = usePathname();
    const [isExpanded, setIsExpanded] = useState(true);
    const [stats, setStats] = useState({
        totalBlogs: 0,
        subscribers: 0,
        comments: 0
    });
    
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

    // সাবস্ক্রাইবার ডাটা পাওয়ার জন্য
    useEffect(() => {
        fetch("/api/email")
          .then((res) => res.json())
          .then((data) => {
            if (data.success) {
                setSubscribers(data.data);
                // stats এ সাবস্ক্রাইবার সংখ্যা আপডেট
                setStats(prevStats => ({
                    ...prevStats,
                    subscribers: data.data.length || 0
                }));
            } else {
                toast.error("Failed to fetch subscribers.");
            }
          })
          .catch(() => {
            toast.error("An error occurred while fetching data.");
          })
          .finally(() => {
            setLoading(false);
          });
    }, []);

    // স্ট্যাটিস্টিক্স ডাটা পাওয়ার জন্য
    useEffect(() => {
        const fetchStats = async () => {
            try {
                setLoading(true);
                
                // ব্লগের সংখ্যা পাওয়া
                const blogsResponse = await axios.get('/api/blog');
                const totalBlogs = blogsResponse.data.success ? blogsResponse.data.blogs.length : 0;
                
                // স্ট্যাটিস্টিক্স আপডেট
                setStats(prevStats => ({
                    ...prevStats,
                    totalBlogs: totalBlogs || 0
                }));
                
            } catch (error) {
                console.error('Error fetching stats:', error);
                toast.error("Failed to fetch statistics.");
                // এরর হলে ডিফল্ট ভ্যালু সেট
                setStats({
                    totalBlogs: 0,
                    subscribers: 0,
                    comments: 0
                });
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    // stats অবজেক্ট ভ্যালিড আছে কিনা নিশ্চিত করুন
    const safeStats = stats || {
        totalBlogs: 0,
        subscribers: 0,
        comments: 0
    };

    // মোবাইল ডিভাইসে মেনু আইটেমে ক্লিক করলে সাইডবার বন্ধ করার জন্য
    const handleMenuItemClick = () => {
        if (window.innerWidth < 768) {
            toggleMobileMenu();
        }
    };

    return (
        <>
            {/* মোবাইল ডিভাইসের জন্য মাস্ক - সংশোধিত */}
            {isMobileMenuOpen && (
                <div 
                    className="fixed inset-0 mt-10 bg-opacity-50 z-40 md:hidden"
                    onClick={toggleMobileMenu}
                ></div>
            )}
            
            {/* সাইডবার - সংশোধিত */}
            <div className={`fixed top-0 left-0 h-screen flex flex-col bg-gradient-to-br from-slate-900 to-slate-800 text-white transition-all duration-300 shadow-xl z-50 ${
                isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
            } md:translate-x-0 ${isExpanded ? 'md:w-64' : 'md:w-20'} overflow-hidden`}>
                {/* লোগো সেকশন */}
                <div className='flex items-center justify-between p-5 border-b border-slate-700/50'>
                    {isExpanded && (
                        <div className='flex items-center space-x-3'>
                            <div className='p-2 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-lg'>
                                <Image src={assets.logo} width={28} alt='Blog Admin' className='brightness-0 invert' />
                            </div>
                            <span className='text-xl  sm:ml-10 font-bold tracking-tight'>Admin Panel</span>
                        </div>
                    )}
                    <button 
                        onClick={() => setIsExpanded(!isExpanded)}
                        className='p-2 rounded-lg hover:bg-slate-700/50 transition-colors'
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                        </svg>
                    </button>
                </div>
                
                {/* নেভিগেশন মেনু */}
                <div className='flex-1 overflow-y-auto py-6'>
                    <div className='space-y-1 mt-10 px-3'>
                        {menuItems.map((item, index) => (
                            <Link 
                                key={index}
                                href={item.href}
                                onClick={handleMenuItemClick}
                                className={`flex items-center mt-10 p-3 rounded-xl transition-all duration-200 group ${
                                    pathname === item.href 
                                        ? 'bg-gradient-to-r from-indigo-400 to-purple-400 shadow-lg shadow-indigo-400/20' 
                                        : 'hover:bg-slate-600/50'
                                }`}
                            >
                                <div className={`flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-300 ${
                                    pathname === item.href 
                                        ? 'bg-gradient-to-r from-indigo-300 to-purple-300' 
                                        : 'bg-slate-600 group-hover:bg-gradient-to-r group-hover:from-indigo-300 group-hover:to-purple-300'
                                }`}>
                                    <Image src={item.icon} alt={item.label} width={20} className='brightness-0 invert' />
                                </div>
                                
                                {isExpanded && (
                                    <div className='ml-4 overflow-hidden'>
                                        <div className={`font-medium ${pathname === item.href ? 'text-white' : 'text-slate-200 group-hover:text-white'}`}>
                                            {item.label}
                                        </div>
                                        <div className='text-xs text-slate-400 truncate'>
                                            {item.description}
                                        </div>
                                    </div>
                                )}
                            </Link>
                        ))}
                    </div>
                    
                    {/* স্ট্যাটিস্টিক্স সেকশন */}
                    {isExpanded && (
                        <div className='mt-8 px-3'>
                            <h3 className='text-xs uppercase text-slate-500 font-semibold mb-3 px-2'>Statistics</h3>
                            <div className='bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 space-y-4 border border-slate-700/50'>
                                {loading ? (
                                    <div className="flex justify-center py-4">
                                        <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-indigo-400"></div>
                                    </div>
                                ) : (
                                    <>
                                        <div>
                                            <div className='flex justify-between text-sm mb-1'>
                                                <span className='text-slate-400'>Total Blogs</span>
                                                <span className='font-medium text-white'>{safeStats.totalBlogs}</span>
                                            </div>
                                            <div className='w-full bg-slate-700 h-2 rounded-full overflow-hidden'>
                                                <div className='bg-gradient-to-r from-indigo-300 to-purple-300 h-2 rounded-full transition-all duration-1000 ease-out' style={{ width: `${Math.min(100, safeStats.totalBlogs)}%` }}></div>
                                            </div>
                                        </div>
                                        <div>
                                            <div className='flex justify-between text-sm mb-1'>
                                                <span className='text-slate-400'>Subscribers</span>
                                                <span className='font-medium text-white'>{safeStats.subscribers}</span>
                                            </div>
                                            <div className='w-full bg-slate-700 h-2 rounded-full overflow-hidden'>
                                                <div className='bg-gradient-to-r from-cyan-300 to-blue-300 h-2 rounded-full transition-all duration-1000 ease-out' style={{ width: `${Math.min(100, safeStats.subscribers / 20 * 100)}%` }}></div>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    )}
                </div>
                
                {/* ইউজার প্রোফাইল সেকশন */}
                <div className={`p-4 border-t border-slate-700/50 ${isExpanded ? '' : 'flex justify-center'}`}>
                    {isExpanded ? (
                        <div className='flex items-center space-x-3 p-2 bg-slate-800/50 rounded-xl border border-slate-700/50 w-full'>
                            <div className='relative'>
                                <div className='p-1 bg-gradient-to-r from-indigo-300 to-purple-300 rounded-full'>
                                    <Image src={assets.profile_icon} width={36} alt='Admin' className='rounded-full' />
                                </div>
                                <div className='absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-slate-800'></div>
                            </div>
                            <div className='flex-1 min-w-0'>
                                <div className='font-medium text-white truncate'>Admin User</div>
                                <div className='text-xs text-slate-400 truncate'>admin@blog.com</div>
                            </div>
                            <button className='p-1.5 rounded-lg hover:bg-slate-700/50 transition-colors'>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-slate-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                            </button>
                        </div>
                    ) : (
                        <div className='relative'>
                            <div className='p-1 bg-gradient-to-r from-indigo-300 to-purple-300 rounded-full'>
                                <Image src={assets.profile_icon} width={36} alt='Admin' className='rounded-full' />
                            </div>
                            <div className='absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-slate-800'></div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default Sidebar;