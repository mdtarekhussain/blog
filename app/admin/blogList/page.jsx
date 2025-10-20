"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import { assets } from "/Asstes/assets";
import axios from "axios";
import {
  FaEdit,
  FaTrash,
  FaSync,
  FaPlus,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import { useAuth } from "/lib/AuthContext";
import { useRouter } from "next/navigation";

const Page = () => {
  const { user, loadings } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loadings) {
      if (!user) {
        router.push("/login");
      } else if (user.role !== "ADMIN") {
        router.push("/");
      }
    }
  }, [user, loadings, router]);

  if (loadings || !user || user.role !== "ADMIN") {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-lg font-semibold">Checking admin access...</p>
      </div>
    );
  }

  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [blogsPerPage] = useState(5);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/blog");
      setBlogs(response.data.blogs || []);
    } catch (err) {
      setError("Failed to load blogs. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return "No date";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const indexOfLastBlog = currentPage * blogsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
  const currentBlogs = blogs.slice(indexOfFirstBlog, indexOfLastBlog);
  const totalPages = Math.ceil(blogs.length / blogsPerPage);

  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };
  const prevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleEdit = (blogId) => {
    window.location.href = `/edit-blog?id=${blogId}`;
  };

  const handleDelete = async (blogId) => {
    if (window.confirm("Are you sure you want to delete this blog?")) {
      try {
        const response = await axios.delete(`/api/blog/${blogId}`);
        if (response.data.success) {
          setBlogs(blogs.filter((blog) => blog._id !== blogId));
          alert("Blog deleted successfully!");
        }
      } catch {
        alert("An error occurred while deleting the blog");
      }
    }
  };

  const handleStatusChange = async (blogId, newStatus) => {
    try {
      const response = await axios.patch(`/api/blog/${blogId}`, {
        status: newStatus,
      });
      if (response.data.success) {
        setBlogs(
          blogs.map((b) =>
            b._id === blogId ? { ...b, status: newStatus } : b
          )
        );
      }
    } catch {
      alert("Failed to update blog status.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-3 sm:p-4 md:p-6">
      <div className="max-w-full mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Blog Manager</h1>
            <p className="text-gray-600 text-sm">Admin Dashboard</p>
          </div>
          <button
            onClick={fetchData}
            className="mt-3 sm:mt-0 flex items-center bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm"
          >
            <FaSync className="mr-2" /> Refresh
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
          <div className="bg-white shadow-sm rounded-lg p-3 border">
            <h3 className="text-gray-700 text-sm">Total Blogs</h3>
            <p className="text-xl font-bold">{blogs.length}</p>
          </div>
          <div className="bg-white shadow-sm rounded-lg p-3 border">
            <h3 className="text-gray-700 text-sm">Published</h3>
            <p className="text-xl font-bold">
              {blogs.filter((b) => b.status === "published").length}
            </p>
          </div>
          <div className="bg-white shadow-sm rounded-lg p-3 border">
            <h3 className="text-gray-700 text-sm">Drafts</h3>
            <p className="text-xl font-bold">
              {blogs.filter((b) => b.status === "draft").length}
            </p>
          </div>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="flex justify-center items-center py-10">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-indigo-500"></div>
          </div>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : blogs.length === 0 ? (
          <div className="text-center py-10">
            <p>No blogs found.</p>
            <button className="mt-3 bg-indigo-600 text-white px-4 py-2 rounded-lg">
              <FaPlus className="inline mr-2" /> Create New
            </button>
          </div>
        ) : (
          <>
            {/* ✅ Mobile Card View */}
            <div className="md:hidden space-y-4">
              {currentBlogs.map((blog) => (
                <div
                  key={blog._id}
                  className="bg-white shadow-sm rounded-xl border p-4"
                >
                  <div className="flex items-center space-x-3">
                    <Image
                      src={blog.authorImg || assets.profile_icon}
                      alt={blog.author || "Author"}
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                    <div>
                      <p className="font-medium text-gray-800">
                        {blog.author || "Unknown"}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatDate(blog.createdAt)}
                      </p>
                    </div>
                  </div>

                  <div className="mt-3">
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {blog.title}
                    </p>
                    <span
                      className={`mt-2 inline-block px-2 py-1 text-xs rounded-full ${
                        blog.status === "published"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {blog.status}
                    </span>
                  </div>

                  <div className="mt-3 flex justify-between items-center">
                    <select
                      value={blog.status}
                      onChange={(e) =>
                        handleStatusChange(blog._id, e.target.value)
                      }
                      className="border rounded-lg px-2 py-1 text-xs"
                    >
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                    </select>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(blog._id)}
                        className="p-2 rounded-full bg-blue-100 text-blue-600"
                      >
                        <FaEdit size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(blog._id)}
                        className="p-2 rounded-full bg-red-100 text-red-600"
                      >
                        <FaTrash size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* ✅ Desktop Table View */}
            <div className="hidden md:block overflow-x-auto bg-white rounded-xl border">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Author
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Date
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Status
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {currentBlogs.map((blog) => (
                    <tr key={blog._id}>
                      <td className="px-4 py-3 flex items-center space-x-3">
                        <Image
                          src={blog.authorImg || assets.profile_icon}
                          width={35}
                          height={35}
                          alt="Author"
                          className="rounded-full"
                        />
                        <span>{blog.author}</span>
                      </td>
                      <td className="px-4 py-3">{formatDate(blog.createdAt)}</td>
                      <td className="px-4 py-3">
                        <select
                          value={blog.status}
                          onChange={(e) =>
                            handleStatusChange(blog._id, e.target.value)
                          }
                          className="border rounded-lg px-2 py-1 text-sm"
                        >
                          <option value="draft">Draft</option>
                          <option value="published">Published</option>
                        </select>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => handleEdit(blog._id)}
                          className="text-indigo-600 hover:text-indigo-900 mx-1"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(blog._id)}
                          className="text-red-600 hover:text-red-900 mx-1"
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex justify-between items-center mt-4">
              <button
                onClick={prevPage}
                disabled={currentPage === 1}
                className="flex items-center px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
              >
                <FaChevronLeft className="mr-1" /> Prev
              </button>
              <p className="text-sm">
                Page {currentPage} of {totalPages}
              </p>
              <button
                onClick={nextPage}
                disabled={currentPage === totalPages}
                className="flex items-center px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
              >
                Next <FaChevronRight className="ml-1" />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Page;
