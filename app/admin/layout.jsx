// Layout কম্পোনেন্ট সংশোধিত কোড
"use client"
import { assets } from "/Asstes/assets";
import Sidebar from "/Components/AdminCom/sidebar";
import Image from "next/image";
import Link from "next/link";
import { ToastContainer } from 'react-toastify';
import { useAuth } from "/lib/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Layout({ children }) {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    // মোবাইল মেনু বন্ধ করার ফাংশন
    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false);
    };

    useEffect(() => {
        if (!loading) {
            // যদি ইউজার না থাকে → login এ পাঠাও
            if (!user) {
                router.push("/login");
            }
            // যদি ইউজার থাকে কিন্তু অ্যাডমিন না হয় → home এ পাঠাও
            else if (user.role !== "ADMIN") {
                router.push("/");
            }
        }
    }, [user, loading, router]);

    // উইন্ডো সাইজ পরিবর্তন হলে মোবাইল মেনু বন্ধ করুন
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768) {
                setIsMobileMenuOpen(false);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // রাউট পরিবর্তন হলে মোবাইল মেনু বন্ধ করুন
    useEffect(() => {
        closeMobileMenu();
    }, [router.pathname]);

    if (loading || !user || user.role !== "ADMIN") {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <p className="text-lg font-semibold">Checking admin access...</p>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <ToastContainer theme="dark" />
            <Sidebar isMobileMenuOpen={isMobileMenuOpen} toggleMobileMenu={toggleMobileMenu} />

            {/* মোবাইল ডিভাইসের জন্য মেনু বাটন */}
            <div className="md:hidden fixed top-4 left-4 z-50">
                <button 
                    onClick={toggleMobileMenu}
                    className="p-2 bg-indigo-600 text-white rounded-lg shadow-md"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>
            </div>

            {/* মূল কনটেন্ট এরিয়া */}
            <div className={`flex flex-col flex-1 transition-all duration-300 ${isMobileMenuOpen ? 'ml-0' : 'ml-0 md:ml-64'}`}>
                {/* টপ নেভিগেশন বার */}
                <div className="bg-white shadow-md rounded-b-xl border-b border-gray-200">
                    <div className="flex items-center justify-between w-full py-4 px-4 md:px-8">
                        <div className="flex items-center space-x-3">
                            <div className="h-8 w-1 bg-indigo-600 rounded-full"></div>
                            <h3 className="text-xl font-bold text-gray-800 tracking-tight">Admin Panel</h3>
                        </div>
                        
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2">
                                <div className="relative">
                                    <Image 
                                        src={assets.profile_icon} 
                                        width={40} 
                                        alt='' 
                                        className="rounded-full border-2 border-white shadow-md ring-2 ring-indigo-100"
                                    />
                                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* মূল কনটেন্ট এরিয়া */}
                <div className="flex-1 overflow-auto p-4 md:p-6">
                    {children}
                </div>
                
                {/* ফুটার */}
                <div className="bg-white border-t border-gray-200 py-3 px-4 md:px-8">
                    <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-600">
                        <div>© {new Date().getFullYear()} Blog Admin Panel. All rights reserved.</div>
                        <div className="flex space-x-4 mt-2 md:mt-0">
                            <a href="#" className="text-gray-500 hover:text-indigo-600 transition-colors">Privacy</a>
                            <a href="#" className="text-gray-500 hover:text-indigo-600 transition-colors">Terms</a>
                            <a href="#" className="text-gray-500 hover:text-indigo-600 transition-colors">Help</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}