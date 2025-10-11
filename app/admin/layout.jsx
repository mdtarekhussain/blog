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