"use Client"

import React, { useState, useEffect, useMemo } from 'react';
import BlogItem from './BlogItem';
import axios from 'axios';

const BlogList = () => {
    const [menu, setMenu] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
    const [visibleBlogs, setVisibleBlogs] = useState(6);
    const [loading, setLoading] = useState(true);
    const [blogs, setBlogs] = useState([]);
    
    const fetchBlogs = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/api/blog');
            setBlogs(response.data.blogs);
            console.log("Fetched blogs:", response.data.blogs);
        } catch (error) {
            console.error("Error fetching blogs:", error);
        } finally {
            setLoading(false);
        }
    };
    
    useEffect(() => {
        fetchBlogs();
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
        }, 300);
        
        return () => clearTimeout(timer);
    }, [searchTerm]);

    const filteredBlogs = useMemo(() => {
        if (blogs.length === 0) return [];
        
        // First, filter by status - only show published blogs
        let result = blogs.filter(item => item.status === 'published');
        
        // Then filter by category if menu is not 'All'
        if (menu !== 'All') {
            result = result.filter(item => 
                item.category.toLowerCase() === menu.toLowerCase()
            );
        }
        
        // Then filter by search term
        if (debouncedSearchTerm) {
            const term = debouncedSearchTerm.toLowerCase();
            result = result.filter(item => 
                item.title.toLowerCase().includes(term) || 
                item.description.toLowerCase().includes(term)
            );
        }
        
        return result;
    }, [blogs, menu, debouncedSearchTerm]);

    const loadMoreBlogs = () => {
        setVisibleBlogs(prev => prev + 3);
    };

    useEffect(() => {
        setVisibleBlogs(6);
    }, [menu, debouncedSearchTerm]);

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 px-5 md:px-12 lg:px-28">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Published Articles</h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Discover the latest insights, trends, and stories from our expert writers
                    </p>
                </div>

                <div className="max-w-2xl mx-auto mb-12">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search published articles..."
                            className="w-full py-4 px-6 pr-12 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="flex flex-wrap justify-center gap-3 mb-16">
                    {['All', 'Technology', 'Startup', 'Lifestyle'].map((category) => (
                        <button
                            key={category}
                            onClick={() => setMenu(category)}
                            className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                                menu === category
                                    ? 'bg-indigo-600 text-white shadow-lg'
                                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                            }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>

                <div className="flex justify-between items-center mb-8">
                    <p className="text-gray-600">
                        {filteredBlogs.length > 0 
                            ? `Showing ${Math.min(visibleBlogs, filteredBlogs.length)} of ${filteredBlogs.length} published articles`
                            : 'No published articles found'
                        }
                    </p>
                    <div className="text-sm text-gray-500">
                        {menu !== 'All' && (
                            <span>Category: <span className="font-medium text-indigo-600">{menu}</span></span>
                        )}
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
                    </div>
                ) : (
                    <>
                        {filteredBlogs.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {filteredBlogs.slice(0, visibleBlogs).map((item) => (
                                    <div 
                                        key={item._id}
                                        className="transform transition-all duration-500 hover:-translate-y-2"
                                    >
                                        <BlogItem 
                                            id={item._id} 
                                            image={item.image} 
                                            title={item.title} 
                                            
createdAt={item.
createdAt}
                                            authorImg={item.authorImg}
                                            author={item.author}
                                            description={item.description} 
                                            category={item.category} 
                                            
views={item.
views}
                                        />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-16 bg-white rounded-2xl shadow-sm">
                                <div className="max-w-md mx-auto">
                                    <div className="flex justify-center mb-6">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No published articles found</h3>
                                    <p className="text-gray-600 mb-6">
                                        {searchTerm 
                                            ? `No results for "${searchTerm}". Try a different search term or category.`
                                            : "There are no published articles in this category yet."
                                        }
                                    </p>
                                    <button 
                                        onClick={() => {
                                            setSearchTerm('');
                                            setMenu('All');
                                        }}
                                        className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors"
                                    >
                                        Reset Filters
                                    </button>
                                </div>
                            </div>
                        )}

                        {visibleBlogs < filteredBlogs.length && (
                            <div className="text-center mt-16">
                                <button 
                                    onClick={loadMoreBlogs}
                                    className="px-8 py-4 bg-white text-indigo-600 font-medium rounded-lg border-2 border-indigo-600 hover:bg-indigo-50 transition-colors shadow-sm"
                                >
                                    Load More Articles
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default BlogList;