// Sidebar কম্পোনেন্ট - AuthContext ব্যবহার করে
"use client"
import { assets } from '/Asstes/assets';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { CiHome } from 'react-icons/ci';
import { FaBlog, FaUserCircle, FaChartBar } from 'react-icons/fa';
import { IoIosAddCircle, IoIosMail } from 'react-icons/io';
import { useAuth } from "/lib/AuthContext";

const Sidebar = ({ isMobileMenuOpen, toggleMobileMenu, isExpanded, setIsExpanded }) => {
    const [subscribers, setSubscribers] = useState([]);
    const [loading, setLoading] = useState(true);
    const pathname = usePathname();
    // isExpanded স্টেট এখন props থেকে আসছে
    const [stats, setStats] = useState({
        totalBlogs: 0,
        subscribers: 0,
        comments: 0
    });
    
    // AuthContext থেকে ইউজার ডাটা নিন
    const { user, loading: authLoading } = useAuth();
    
    // কাস্টম কালার কোড
    const customColors = {
        primary: '#4ED7F1',    // Cyan Blue
        secondary: '#180161',  // Deep Purple
        accent: '#3674B5',     // Royal Blue
        primaryLight: '#4ED7F1',
        secondaryDark: '#180161', 
        accentMedium: '#3674B5'
    };

    const menuItems = [
        { 
            href: '/', 
            icon: CiHome, 
            label: 'Home',
            description: 'Dashboard overview',
            isReactIcon: true,
            color: customColors.primary
        },
        { 
            href: '/admin/addProjact', 
            icon: IoIosAddCircle, 
            label: 'Add Blog',
            description: 'Create new blog posts',
            isReactIcon: true,
            color: customColors.accent
        },
        { 
            href: '/admin/blogList', 
            icon: FaBlog, 
            label: 'Blog Lists',
            description: 'Manage all blogs',
            isReactIcon: true,
            color: customColors.primary
        },
        { 
            href: '/admin/subscription', 
            icon: IoIosMail, 
            label: 'Subscription',
            description: 'View subscribers',
            isReactIcon: true,
            color: customColors.accent
        }
    ];

    // সাবস্ক্রাইবার ডাটা পাওয়ার জন্য
    useEffect(() => {
        fetch("/api/email")
          .then((res) => res.json())
          .then((data) => {
            if (data.success) {
                setSubscribers(data.data);
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
                const blogsResponse = await axios.get('/api/blog');
                const totalBlogs = blogsResponse.data.success ? blogsResponse.data.blogs.length : 0;
                
                setStats(prevStats => ({
                    ...prevStats,
                    totalBlogs: totalBlogs || 0
                }));
                
            } catch (error) {
                console.error('Error fetching stats:', error);
                toast.error("Failed to fetch statistics.");
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

    const safeStats = stats || {
        totalBlogs: 0,
        subscribers: 0,
        comments: 0
    };

    const handleMenuItemClick = () => {
        if (window.innerWidth < 768) {
            toggleMobileMenu();
        }
    };

    // ইউজার ডাটা ডিসপ্লে ফাংশন
    const getUserDisplayName = () => {
        if (authLoading) return 'Loading...';
        return user?.name || 'Admin User';
    };

    const getUserDisplayEmail = () => {
        if (authLoading) return 'Loading...';
        return user?.email || 'admin@blog.com';
    };

    const getUserDisplayRole = () => {
        if (authLoading) return '';
        return user?.role ? `(${user.role})` : '';
    };

    return (
        <>
            {/* মোবাইল মাস্ক - কাস্টম কালার */}
            {isMobileMenuOpen && (
                <div 
                    className="fixed inset-0 mt-10 bg-[#180161]/30 backdrop-blur-sm z-40 md:hidden"
                    onClick={toggleMobileMenu}
                ></div>
            )}
            
            {/* সাইডবার - কাস্টম কালার ডিজাইন */}
            <div 
                className={`fixed top-0 left-0 h-screen flex flex-col text-white transition-all duration-500 shadow-2xl z-50 ${
                    isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
                } md:translate-x-0 ${isExpanded ? 'md:w-72' : 'md:w-20'} overflow-hidden`}
                style={{
                    background: `linear-gradient(135deg, ${customColors.secondary}, ${customColors.accent})`
                }}
            >
                
                {/* লোগো সেকশন */}
                <div 
                    className='flex items-center justify-between p-6 border-b'
                    style={{ borderColor: `${customColors.primary}30` }}
                >
                    {isExpanded && (
                        <div className='flex items-center space-x-3'>
                            <div 
                                className='p-2 rounded-xl shadow-lg'
                                style={{ 
                                    background: `linear-gradient(135deg, ${customColors.primary}, ${customColors.accent})`
                                }}
                            >
                                <FaChartBar className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <span className='text-xl font-bold text-white'>Admin Panel</span>
                                <div className='text-xs' style={{ color: `${customColors.primary}CC` }}>
                                    {getUserDisplayRole() || 'Control Center'}
                                </div>
                            </div>
                        </div>
                    )}
                    <button 
                        onClick={() => setIsExpanded(!isExpanded)} // এখন props থেকে আসা ফাংশন ব্যবহার করা হচ্ছে
                        className='p-2 rounded-xl transition-all duration-300 border'
                        style={{ 
                            backgroundColor: `${customColors.primary}20`,
                            borderColor: `${customColors.primary}30`
                        }}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" style={{ color: customColors.primary }} viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                    </button>
                </div>
                
                {/* নেভিগেশন মেনু */}
                <div className='flex-1 overflow-y-auto py-6 custom-scrollbar'>
                    <div className='space-y-2 px-4'>
                        {menuItems.map((item, index) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link 
                                    key={index}
                                    href={item.href}
                                    onClick={handleMenuItemClick}
                                    className={`flex items-center p-3 rounded-2xl transition-all duration-300 group relative overflow-hidden ${
                                        isActive ? 'shadow-lg scale-105' : 'hover:scale-102'
                                    }`}
                                    style={{
                                        background: isActive 
                                            ? `linear-gradient(135deg, ${item.color}, ${customColors.accent})`
                                            : `rgba(255, 255, 255, 0.05)`,
                                        border: `1px solid ${isActive ? item.color + '40' : customColors.primary + '20'}`
                                    }}
                                >
                                    <div 
                                        className={`flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-300 z-10 ${
                                            isActive ? 'bg-white/20 backdrop-blur-sm shadow-lg' : 'bg-white/5 group-hover:bg-white/10'
                                        }`}
                                        style={{
                                            border: `1px solid ${isActive ? 'rgba(255,255,255,0.3)' : customColors.primary + '20'}`
                                        }}
                                    >
                                        {item.isReactIcon ? (
                                            <item.icon className="w-6 h-6 text-white" />
                                        ) : (
                                            <Image src={item.icon} alt={item.label} width={24} className='brightness-0 invert' />
                                        )}
                                    </div>
                                    
                                    {isExpanded && (
                                        <div className='ml-4 overflow-hidden z-10'>
                                            <div className='font-semibold text-white'>
                                                {item.label}
                                            </div>
                                            <div className='text-xs' style={{ color: `${customColors.primary}CC` }}>
                                                {item.description}
                                            </div>
                                        </div>
                                    )}

                                    {/* একটিভ ইন্ডিকেটর */}
                                    {isActive && (
                                        <div 
                                            className="absolute right-3 w-2 h-2 bg-white rounded-full animate-ping"
                                            style={{ backgroundColor: customColors.primary }}
                                        ></div>
                                    )}
                                </Link>
                            );
                        })}
                    </div>
                    
                    {/* স্ট্যাটিস্টিক্স সেকশন */}
                    {isExpanded && (
                        <div className='mt-8 px-4'>
                            <h3 
                                className='text-xs uppercase font-bold mb-4 px-2 tracking-wider'
                                style={{ color: customColors.primary }}
                            >
                                Dashboard Stats
                            </h3>
                            <div 
                                className='backdrop-blur-sm rounded-2xl p-5 space-y-5 border'
                                style={{ 
                                    backgroundColor: 'rgba(24, 1, 97, 0.3)',
                                    borderColor: `${customColors.primary}30`
                                }}
                            >
                                {loading ? (
                                    <div className="flex justify-center py-4">
                                        <div 
                                            className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2"
                                            style={{ borderColor: customColors.primary }}
                                        ></div>
                                    </div>
                                ) : (
                                    <>
                                        <div className="space-y-3">
                                            <div className='flex justify-between items-center'>
                                                <span className='text-sm flex items-center gap-2' style={{ color: `${customColors.primary}CC` }}>
                                                    <div 
                                                        className="w-2 h-2 rounded-full"
                                                        style={{ backgroundColor: customColors.primary }}
                                                    ></div>
                                                    Total Blogs
                                                </span>
                                                <span 
                                                    className='font-bold text-white text-lg px-2 py-1 rounded-lg'
                                                    style={{ backgroundColor: `${customColors.primary}40` }}
                                                >
                                                    {safeStats.totalBlogs}
                                                </span>
                                            </div>
                                            <div 
                                                className='w-full h-3 rounded-full overflow-hidden'
                                                style={{ backgroundColor: `${customColors.primary}20` }}
                                            >
                                                <div 
                                                    className='h-3 rounded-full transition-all duration-1000 ease-out shadow-lg'
                                                    style={{ 
                                                        backgroundColor: customColors.primary,
                                                        width: `${Math.min(100, (safeStats.totalBlogs / 50) * 100)}%`
                                                    }}
                                                ></div>
                                            </div>
                                        </div>
                                        
                                        <div className="space-y-3">
                                            <div className='flex justify-between items-center'>
                                                <span className='text-sm flex items-center gap-2' style={{ color: `${customColors.primary}CC` }}>
                                                    <div 
                                                        className="w-2 h-2 rounded-full"
                                                        style={{ backgroundColor: customColors.accent }}
                                                    ></div>
                                                    Subscribers
                                                </span>
                                                <span 
                                                    className='font-bold text-white text-lg px-2 py-1 rounded-lg'
                                                    style={{ backgroundColor: `${customColors.accent}40` }}
                                                >
                                                    {safeStats.subscribers}
                                                </span>
                                            </div>
                                            <div 
                                                className='w-full h-3 rounded-full overflow-hidden'
                                                style={{ backgroundColor: `${customColors.accent}20` }}
                                            >
                                                <div 
                                                    className='h-3 rounded-full transition-all duration-1000 ease-out shadow-lg'
                                                    style={{ 
                                                        backgroundColor: customColors.accent,
                                                        width: `${Math.min(100, (safeStats.subscribers / 100) * 100)}%`
                                                    }}
                                                ></div>
                                            </div>
                                        </div>

                                        {/* প্রোগ্রেস বার লেবেল */}
                                        <div className="flex justify-between text-xs" style={{ color: `${customColors.primary}99` }}>
                                            <span>Low</span>
                                            <span>Growing</span>
                                            <span>Excellent</span>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    )}
                </div>
                
                {/* ইউজার প্রোফাইল */}
                <div 
                    className={`p-5 border-t ${isExpanded ? '' : 'flex justify-center'}`}
                    style={{ borderColor: `${customColors.primary}30` }}
                >
                    {isExpanded ? (
                        <div 
                            className='flex items-center space-x-3 p-3 backdrop-blur-sm rounded-2xl border w-full group hover:scale-105 transition-all duration-300'
                            style={{ 
                                backgroundColor: 'rgba(24, 1, 97, 0.3)',
                                borderColor: `${customColors.primary}30`
                            }}
                        >
                            <div className='relative'>
                                <div 
                                    className='p-1 rounded-2xl shadow-lg'
                                    style={{
                                        background: `linear-gradient(135deg, ${customColors.primary}, ${customColors.accent})`
                                    }}
                                >
                                    <FaUserCircle className="w-10 h-10 text-white" />
                                </div>
                                <div 
                                    className='absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 shadow-lg'
                                    style={{ 
                                        backgroundColor: '#10B981',
                                        borderColor: customColors.secondary
                                    }}
                                ></div>
                            </div>
                            <div className='flex flex-col gap-2  min-w-0'>
                                <div className='font-semibold text-white truncate'>
                                     {user?.role && (
                                    <div className='text-xs  font-bold' style={{ color: `${customColors.primary}99` }}>
                                        {user.role}
                                    </div>
                                )} 
                                </div>
                                <div className='text-xs truncate ' style={{ color: `${customColors.primary}CC` }}>
                                  {getUserDisplayName()}
                                </div>
                             
                            </div>
                        
                        </div>
                    ) : (
                        <div className='relative group'>
                            <div 
                                className='p-1 rounded-2xl shadow-lg'
                                style={{
                                    background: `linear-gradient(135deg, ${customColors.primary}, ${customColors.accent})`
                                }}
                            >
                                <FaUserCircle className="w-10 h-10 text-white" />
                            </div>
                            <div 
                                className='absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 shadow-lg'
                                style={{ 
                                    backgroundColor: '#10B981',
                                    borderColor: customColors.secondary
                                }}
                            ></div>
                            
                            {/* টুলটিপ */}
                            <div 
                                className="absolute left-full ml-2 px-2 py-1 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap border"
                                style={{ 
                                    backgroundColor: customColors.secondary,
                                    color: 'white',
                                    borderColor: customColors.primary
                                }}
                            >
                                <div>{getUserDisplayName()}</div>
                                <div style={{ fontSize: '10px', opacity: 0.8 }}>
                                    {user?.role || 'ADMIN'}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* কাস্টম CSS for scrollbar */}
            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: rgba(78, 215, 241, 0.1);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: linear-gradient(to bottom, #4ED7F1, #3674B5);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: linear-gradient(to bottom, #3BC9DB, #2C5B9A);
                }
            `}</style>
        </>
    );
};

export default Sidebar;