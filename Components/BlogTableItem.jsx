import { assets } from '@/Asstes/assets';
import Image from 'next/image';
import React from 'react';

const BlogTableItem = ({authorImg,title,data,author}) => {
    return (
        <tr className=' bg-white border-b'>
            <th scope='row' className='items-center gap-3 hidden sm:flex px-4 py-5 text-gray-300'>
                <Image width={40} height={40} alt='' src={authorImg?authorImg:assets.profile_icon}></Image>
                <p>{author?author:"no author"}</p>
            </th>
            <td className='px-6 pr-4'>
                {title?title:"no title"} 

            </td>
            <td className='px-6 pr-4'>
                {data} 

            </td>
        </tr >
    );
};

export default BlogTableItem;