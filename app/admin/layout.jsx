import { assets } from "@/Asstes/assets";
import Sidebar from "@/Components/AdminCom/sidebar";
import Image from "next/image";
import Link from "next/link";
  import { ToastContainer } from 'react-toastify';
export default function Layout({ children }) {
    return (
        <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <ToastContainer theme="dark"/>
            <Sidebar />
            
            <div className="flex flex-col flex-1">
                {/* Top Navigation Bar */}
                <div className="bg-white shadow-md rounded-b-xl border-b border-gray-200">
                    <div className="flex items-center justify-between w-full py-4 px-8">
                        <div className="flex items-center space-x-3">
                            <div className="h-8 w-1 bg-indigo-600 rounded-full"></div>
                            <h3 className="text-xl font-bold text-gray-800 tracking-tight">Admin Panel</h3>
                        </div>
                        
                        <div className="flex items-center space-x-4">
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                                <input 
                                    type="text" 
                                    placeholder="Search..." 
                                    className="pl-10 pr-4 py-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all w-64"
                                />
                            </div>
                            
                            <div className="flex items-center space-x-2">
                                <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                    </svg>
                                </button>
                                
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
                
                {/* Main Content Area */}
                <div className="flex-1 overflow-auto p-6">
                    {children}
                </div>
                
                {/* Footer */}
                <div className="bg-white border-t border-gray-200 py-3 px-8">
                    <div className="flex justify-between items-center text-sm text-gray-600">
                        <div>© {new Date().getFullYear()} Blog Admin Panel. All rights reserved.</div>
                        <div className="flex space-x-4">
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