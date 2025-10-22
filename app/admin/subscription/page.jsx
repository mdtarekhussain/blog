"use client";
import React, { useEffect, useState } from "react";
import { FaTrash, FaEnvelope, FaUserFriends, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import toast, { Toaster } from 'react-hot-toast';
import { useAuth } from "/lib/AuthContext";
import { useRouter } from "next/navigation";

const SubscribersPage = () => {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, loadings } = useAuth();
  const router = useRouter();
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [subscribersPerPage, setSubscribersPerPage] = useState(10);

  // useEffect(() => {
  //   if (!loadings) {
  //     // যদি ইউজার না থাকে → login এ পাঠাও
  //     if (!user) {
  //       router.push("/login");
  //     }
  //     // যদি ইউজার থাকে কিন্তু অ্যাডমিন না হয় → home এ পাঠাও
  //     else if (user.role !== "ADMIN") {
  //       router.push("/");
  //     }
  //   }
  // }, [user, loadings, router]);

  // if (loadings || !user || user.role !== "ADMIN") {
  //   return (
  //     <div className="flex justify-center items-center min-h-screen">
  //       <p className="text-lg font-semibold">Checking admin access...</p>
  //     </div>
  //   );
  // }

  useEffect(() => {
    fetch("/api/email")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setSubscribers(data.data);
        } else {
          toast.error("Failed to fetch subscribers.");
        }
        setLoading(false);
      })
      .catch(() => {
        toast.error("An error occurred while fetching data.");
        setLoading(false);
      });
  }, []);

  const handleDelete = async (id) => {
    toast((t) => (
      <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200 max-w-md mx-auto">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
              <FaTrash className="text-red-600" />
            </div>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-gray-900">Delete Subscriber</h3>
            <div className="mt-2 text-sm text-gray-500">
              <p>Are you sure you want to delete this subscriber? This action cannot be undone.</p>
            </div>
            <div className="mt-4 flex space-x-3">
              <button
                onClick={() => toast.dismiss(t.id)}
                className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  toast.dismiss(t.id);
                  const loadingToast = toast.loading("Deleting subscriber...");
                  
                  try {
                    const res = await fetch(`/api/email/${id}`, { method: "DELETE" });
                    const data = await res.json();

                    if (data.success) {
                      setSubscribers((prev) => prev.filter((item) => item._id !== id));
                      toast.success("Successfully deleted!", { id: loadingToast });
                      
                      // If current page becomes empty after deletion and it's not the first page, go to previous page
                      const totalPages = Math.ceil((subscribers.length - 1) / subscribersPerPage);
                      if (currentPage > 1 && (subscribers.length - 1) <= (currentPage - 1) * subscribersPerPage) {
                        setCurrentPage(currentPage - 1);
                      }
                    } else {
                      toast.error(data.message || "Failed to delete subscriber.", { id: loadingToast });
                    }
                  } catch (error) {
                    toast.error("An error occurred. Please try again.", { id: loadingToast });
                  }
                }}
                className="px-3 py-1.5 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    ), {
      duration: Infinity,
      position: 'top-center',
    });
  };

  // Pagination functions
  const indexOfLastSubscriber = currentPage * subscribersPerPage;
  const indexOfFirstSubscriber = indexOfLastSubscriber - subscribersPerPage;
  const currentSubscribers = subscribers.slice(indexOfFirstSubscriber, indexOfLastSubscriber);
  const totalPages = Math.ceil(subscribers.length / subscribersPerPage);

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleSubscribersPerPageChange = (e) => {
    const newPerPage = parseInt(e.target.value);
    setSubscribersPerPage(newPerPage);
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-4 sm:p-8">
      <Toaster position="top-right" />
      
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-10 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-100 text-indigo-600 mb-4">
            <FaEnvelope className="text-2xl" />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Email Subscribers</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Manage your email subscriber list and keep your audience engaged
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-8">
          <div className="bg-white rounded-xl shadow-md p-3 py-6 border border-gray-100 transition-all hover:shadow-lg">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-indigo-100 text-indigo-600">
                <FaUserFriends className="text-xl" />
              </div>
              <div className="ml-4 flex flex-col items-center">
                <p className="text-sm font-medium text-gray-600">Total Subscribers</p>
                <p className="text-2xl font-bold text-gray-900">{subscribers.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-3 py-6 border border-gray-100 transition-all hover:shadow-lg">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-green-100 text-green-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4 flex flex-col items-center">
                <p className="text-sm font-medium text-gray-600">Active</p>
                <p className="text-2xl font-bold text-gray-900">{subscribers.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-3 py-6 border border-gray-100 transition-all hover:shadow-lg">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-purple-100 text-purple-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="ml-2 flex flex-col items-center">
                <p className="text-sm font-medium text-gray-600">Latest</p>
                <p className="lg:text-2xl text-[10px] lg:font-bold text-gray-900">
                  {subscribers.length > 0 
                    ? new Date(subscribers[subscribers.length - 1].createdAt).toLocaleDateString() 
                    : 'N/A'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
         
          
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mb-4"></div>
              <p className="text-gray-600 font-medium">Loading subscribers...</p>
            </div>
          ) : subscribers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-4">
              <div className="w-24 h-24 rounded-full bg-indigo-50 flex items-center justify-center mb-6">
                <FaEnvelope className="text-indigo-400 text-4xl" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No subscribers yet</h3>
              <p className="text-gray-600 text-center max-w-md">
                Your subscriber list is currently empty. When users subscribe to your emails, they'll appear here.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
                  <div className="flex justify-end items-center p-4 border-b border-gray-200">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">Show:</span>
                  <select
                    value={subscribersPerPage}
                    onChange={handleSubscribersPerPageChange}
                    className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="5">5</option>
                    <option value="10">10</option>
                    <option value="20">20</option>
                    <option value="30">30</option>
                  </select>
                </div>
              </div>
              {/* Desktop Table */}
              <table className="min-w-full divide-y divide-gray-200 hidden md:table">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email Address
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Subscription Date
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentSubscribers.map((item) => (
                    <tr key={item._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
                          <FaEnvelope />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{item.email}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {new Date(item.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </div>
                        <div className="text-sm text-gray-500">
                          {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleDelete(item._id)}
                          className="text-red-600 hover:text-red-900 p-2 rounded-full hover:bg-red-50 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
                          title="Delete subscriber"
                        >
                          <FaTrash className="h-5 w-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Mobile Card View */}
              <div className="md:hidden space-y-4">
                {currentSubscribers.map((item) => (
                  <div key={item._id} className="bg-white shadow rounded-lg p-4 border border-gray-100">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
                        <FaEnvelope />
                      </div>
                      <div className="text-sm font-medium text-gray-900">{item.email}</div>
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="ml-auto text-red-600 hover:text-red-900 p-2 rounded-full hover:bg-red-50 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
                        title="Delete subscriber"
                      >
                        <FaTrash className="h-5 w-5" />
                      </button>
                    </div>
                    <div className="text-sm text-gray-600">
                      Subscription Date: <br />
                      <span className="font-semibold text-gray-800">
                        {new Date(item.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}{" "}
                        at{" "}
                        {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Desktop Pagination */}
              <div className="hidden md:flex justify-between items-center p-4 border-t border-gray-200">
                <div className="text-sm text-gray-600">
                  Showing {indexOfFirstSubscriber + 1} to {Math.min(indexOfLastSubscriber, subscribers.length)} of {subscribers.length} entries
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={prevPage}
                    disabled={currentPage === 1}
                    className="flex items-center px-3 py-1 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed hover:from-indigo-600 hover:to-purple-600 transition-all duration-300 shadow-sm"
                  >
                    <FaChevronLeft className="mr-1" /> Prev
                  </button>
                  <span className="text-sm text-gray-600 mx-2">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={nextPage}
                    disabled={currentPage === totalPages}
                    className="flex items-center px-3 py-1 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed hover:from-indigo-600 hover:to-purple-600 transition-all duration-300 shadow-sm"
                  >
                    Next <FaChevronRight className="ml-1" />
                  </button>
                </div>
              </div>
              
              {/* Mobile Pagination */}
              <div className="md:hidden flex justify-between items-center mt-6 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                <button
                  onClick={prevPage}
                  disabled={currentPage === 1}
                  className="flex items-center px-3 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed hover:from-indigo-600 hover:to-purple-600 transition-all duration-300 shadow-sm"
                >
                  <FaChevronLeft className="mr-1" /> Prev
                </button>
                <p className="text-sm text-gray-600">
                  Page {currentPage} of {totalPages}
                </p>
                <button
                  onClick={nextPage}
                  disabled={currentPage === totalPages}
                  className="flex items-center px-3 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed hover:from-indigo-600 hover:to-purple-600 transition-all duration-300 shadow-sm"
                >
                  Next <FaChevronRight className="ml-1" />
                </button>
              </div>
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Manage your subscribers efficiently. All data is securely stored.</p>
        </div>
      </div>
       
    </div>
  );
};

export default SubscribersPage;