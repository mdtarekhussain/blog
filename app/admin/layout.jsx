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
    const [isSidebarExpanded, setIsSidebarExpanded] = useState(true); // নতুন স্টেট যোগ করা হয়েছে

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    // মোবাইল মেনু বন্ধ করার ফাংশন
    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false);
    };

    // সাইডবার এক্সপান্ড/কম্প্যাক্ট টগল ফাংশন
    const toggleSidebarExpand = () => {
        setIsSidebarExpanded(!isSidebarExpanded);
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
            <Sidebar 
                isMobileMenuOpen={isMobileMenuOpen} 
                toggleMobileMenu={toggleMobileMenu}
                isExpanded={isSidebarExpanded} // নতুন প্রপস পাঠানো হয়েছে
                setIsExpanded={setIsSidebarExpanded} // নতুন প্রপস পাঠানো হয়েছে
            />

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
            <div className={`flex flex-col flex-1 transition-all duration-300 ${
                isMobileMenuOpen ? 'ml-0' : 
                isSidebarExpanded ? 'ml-0 md:ml-72' : 'ml-0 md:ml-20' // কন্ডিশনাল মার্জিন
            }`}>
               
                {/* মূল কনটেন্ট এরিয়া */}
                <div className="flex-1 overflow-auto p-2 md:p-6">
                    {children}
                </div>
                
              
            </div>
        </div>
    );
}