"use client"
import BlogTableItem from '@/Components/BlogTableItem';
import Image from 'next/image';
import React from 'react';
import { assets } from '@/Asstes/assets'

const page = ({authorImg, title, data, author}) => {
    return (
        <div className='flex-1 pt-5 sm:pt12 sm:pl-12 px-5'>
            <h1>All Blog</h1>
            <div className='overflow-x-auto'> {/* Optional wrapper for table scroll */}
                <table>
                    <thead>
                        <tr>
                            <th scope='col' className='hidden sm:block px-6 py-3'>
                                Author
                            </th>
                            <th scope='col' className='px-6 py-3'>
                                Blog title
                            </th>
                            <th scope='col' className='px-6 py-3'>
                                Date
                            </th>
                            <th scope='col' className='px-6 py-3'>
                                Action
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className='bg-white border-b'>
                            <th scope='row' className='items-center gap-3 hidden sm:flex px-4 py-5 text-gray-300'>
                                <Image width={40} height={40} alt='' src={authorImg || assets.profile_icon} />
                                <p>{author || "no author"}</p>
                            </th>
                            <td className='px-6 pr-4'>
                                {title || "no title"}
                            </td>
                            <td className='px-6 pr-4'>
                                {"12 / 34 / 4"}
                            </td>
                            <td className='px-6 pr-4'>
                                {/* Add actions like Edit/Delete here */}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default page;
