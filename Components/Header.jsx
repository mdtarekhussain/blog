"use client"
import { assets } from '/Asstes/assets';
import Image from 'next/image';
import React, { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from '/lib/AuthContext';
import { useRouter } from 'next/navigation';
import { FiLogOut, FiArrowRight, FiUser } from 'react-icons/fi'; // Import icons from react-icons

const Header = () => {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { user, logout } = useAuth();
    const router = useRouter();

    const onSubmit = async (e) => {
        e.preventDefault();
        
        if (!email || !/\S+@\S+\.\S+/.test(email)) {
            toast.error('Please enter a valid email address');
            return;
        }
        
        setIsLoading(true);
        
        try {
            const response = await axios.post('/api/email', { email });
            
            if (response.data.success) {
                toast.success('Thank you for subscribing! Check your email for confirmation.');
                setEmail('');
            } else {
                toast.error(response.data.message || 'Subscription failed. Please try again.');
            }
        } catch (err) {
            console.error('Subscription error:', err);
            toast.error('Network error. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogout = () => {
        logout();
        toast.success('You have been logged out successfully');
        router.push('/');
    };

    const handleAdminClick = () => {
        router.push('/admin/blogList');
    };

    return (
        <div className='py-6 px-5 md:px-12 lg:px-28 bg-gradient-to-r from-blue-50 to-indigo-100'>
            <div className='flex justify-between items-center'>
                <div className='flex items-center space-x-2'>
                    <Image src={assets.logo} width={180} alt='' className='w-[130px] sm:w-auto'/>
                </div>
        
                <div className='flex m;-2 items-center space-x-4'>
                    {user && user.role === 'ADMIN' && (
                        <button 
                            onClick={handleAdminClick}
                            className='flex items-center gap-2 font-medium py-2 px-4 sm:py-3 sm:px-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all shadow-lg hover:shadow-purple-200'
                        >
                            <FiUser className="w-4 h-4" /> Admin
                        </button>
                    )}
                    
                    {user ? (
                        <button 
                            onClick={handleLogout}
                            className='flex items-center gap-2 font-medium py-2 px-4 sm:py-3 sm:px-6 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all shadow-lg hover:shadow-red-200'
                        >
                            <FiLogOut className="w-4 h-4" /> Logout
                        </button>
                    ) : (
                        <button 
                            onClick={() => router.push('/login')}
                            className='flex items-center gap-2 font-medium py-2 px-4 sm:py-3 sm:px-6 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all shadow-lg hover:shadow-indigo-200'
                        >
                            Get Started <FiArrowRight className="w-4 h-4" />
                        </button>
                    )}
                </div>
            </div>
            
            <div className='text-center my-12 max-w-4xl mx-auto'>
                <h1 className='text-4xl sm:text-6xl font-bold text-gray-800 mb-6'>Discover Amazing Stories</h1>
                <p className='mt-6 text-lg text-gray-600 max-w-2xl mx-auto'>
                    Explore our curated collection of insightful articles, thought-provoking essays, and inspiring stories from writers around the world.
                </p>
                
                <div className='mt-10 flex flex-col sm:flex-row justify-center gap-4'>
                    <div className='relative flex-1 max-w-md mx-auto'>
                        <form onSubmit={onSubmit} className='flex items-center bg-white rounded-full shadow-lg overflow-hidden'>
                            <input 
                                onChange={(e) => setEmail(e.target.value)} 
                                value={email}
                                type="email" 
                                placeholder='Enter your email' 
                                className='flex-1 py-4 px-6 outline-none text-gray-700'
                                disabled={isLoading}
                            />
                            <button 
                                type='submit' 
                                className='bg-indigo-600 text-white py-4 px-6 hover:bg-indigo-700 transition-colors font-medium disabled:opacity-70'
                                disabled={isLoading}
                            >
                                {isLoading ? 'Subscribing...' : 'Subscribe'}
                            </button>
                        </form>
                        <div className='absolute -top-2 -right-2 bg-yellow-400 text-gray-900 text-xs font-bold py-1 px-3 rounded-full animate-pulse'>
                            NEW
                        </div>
                    </div>
                </div>
            </div>
            
            <ToastContainer 
                position="top-right"
                theme="dark"
            />
        </div>
    );
};

export default Header;