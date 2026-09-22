'use client';

import { useState } from 'react';
import { Calendar, Clock, User, ArrowLeft, Eye, Tag } from 'lucide-react';
import Link from 'next/link';

interface Blog {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  readTime: string;
  category: string;
  image: string;
  views: number;
}

const sampleBlogs: Blog[] = [
  {
    id: '1',
    title: 'Understanding Head & Neck Cancer: Early Detection and Prevention',
    excerpt: 'Learn about the early signs of head and neck cancer and how early detection can significantly improve treatment outcomes.',
    content: 'Head and neck cancer is a complex group of cancers that can affect various parts of the head and neck region. Early detection is crucial for successful treatment outcomes. In this comprehensive guide, we explore the early warning signs, risk factors, and prevention strategies that can help save lives...',
    author: 'Dr. Vivek Shetty',
    date: '2024-01-15',
    readTime: '8 min read',
    category: 'Cancer Education',
    image: 'https://picsum.photos/400/250?random=1',
    views: 1250
  },
  {
    id: '2',
    title: 'Advances in Minimally Invasive Head & Neck Surgery',
    excerpt: 'Discover the latest techniques in minimally invasive surgery that are revolutionizing head and neck cancer treatment.',
    content: 'The field of head and neck surgery has seen remarkable advances in minimally invasive techniques. These innovative approaches offer patients faster recovery times, reduced scarring, and improved outcomes. This article explores the cutting-edge technologies and surgical methods...',
    author: 'Dr. Vivek Shetty',
    date: '2024-01-10',
    readTime: '12 min read',
    category: 'Surgical Techniques',
    image: 'https://picsum.photos/400/250?random=2',
    views: 890
  },
  {
    id: '3',
    title: 'Nutrition and Recovery After Head & Neck Surgery',
    excerpt: 'Essential dietary guidelines and nutritional support strategies for patients recovering from head and neck surgery.',
    content: 'Proper nutrition plays a vital role in the recovery process after head and neck surgery. This comprehensive guide covers dietary modifications, nutritional supplements, and practical tips to support healing and maintain quality of life during recovery...',
    author: 'Dr. Vivek Shetty',
    date: '2024-01-05',
    readTime: '10 min read',
    category: 'Patient Care',
    image: 'https://picsum.photos/400/250?random=3',
    views: 2100
  },
  {
    id: '4',
    title: 'Reconstructive Surgery: Restoring Function and Appearance',
    excerpt: 'Understanding the role of reconstructive surgery in restoring both function and appearance after cancer treatment.',
    content: 'Reconstructive surgery is a crucial component of comprehensive head and neck cancer care. This article explains the various reconstruction techniques, timing considerations, and how these procedures help patients regain both physical function and confidence...',
    author: 'Dr. Vivek Shetty',
    date: '2023-12-28',
    readTime: '15 min read',
    category: 'Reconstruction',
    image: 'https://picsum.photos/400/250?random=4',
    views: 1560
  },
  {
    id: '5',
    title: 'The Role of Multidisciplinary Care in Cancer Treatment',
    excerpt: 'Learn how a team-based approach improves outcomes for head and neck cancer patients.',
    content: 'Multidisciplinary care brings together specialists from various fields to provide comprehensive cancer treatment. This collaborative approach ensures that patients receive the best possible care with coordinated treatment plans tailored to their specific needs...',
    author: 'Dr. Vivek Shetty',
    date: '2023-12-20',
    readTime: '7 min read',
    category: 'Treatment Approach',
    image: 'https://picsum.photos/400/250?random=5',
    views: 980
  },
  {
    id: '6',
    title: 'Latest Research in Head & Neck Oncology',
    excerpt: 'Stay updated with the most recent research findings and emerging treatments in head and neck oncology.',
    content: 'The field of head and neck oncology continues to evolve with new research and treatment modalities. This article highlights recent breakthroughs, ongoing clinical trials, and promising developments that are shaping the future of cancer care...',
    author: 'Dr. Vivek Shetty',
    date: '2023-12-15',
    readTime: '11 min read',
    category: 'Research',
    image: 'https://picsum.photos/400/250?random=6',
    views: 1750
  }
];

const categories = ['All', 'Cancer Education', 'Surgical Techniques', 'Patient Care', 'Reconstruction', 'Treatment Approach', 'Research'];

export default function BlogsPage() {
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredBlogs = sampleBlogs.filter(blog => 
    selectedCategory === 'All' || blog.category === selectedCategory
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatViews = (views: number) => {
    if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}K`;
    }
    return `${views}`;
  };

  if (selectedBlog) {
    return (
      <div className="min-h-screen pt-32 pb-16">
        {/* Blog Detail View */}
        <div className="container-custom py-12">
          <div className="max-w-4xl mx-auto">
            {/* Back Button */}
            <button
              onClick={() => setSelectedBlog(null)}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-8 transition-colors duration-200"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back to Blogs</span>
            </button>

            {/* Blog Content */}
            <article className="bg-white rounded-3xl shadow-xl overflow-hidden">
              {/* Blog Image */}
              <div className="relative h-64 md:h-80 bg-gradient-to-br from-blue-100 to-purple-100">
                <img
                  src={selectedBlog.image}
                  alt={selectedBlog.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute top-6 left-6">
                  <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    {selectedBlog.category}
                  </span>
                </div>
              </div>

              {/* Blog Header */}
              <div className="p-8">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
                  {selectedBlog.title}
                </h1>

                {/* Blog Meta */}
                <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600 mb-6">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span>{selectedBlog.author}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(selectedBlog.date)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>{selectedBlog.readTime}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4" />
                    <span>{formatViews(selectedBlog.views)} views</span>
                  </div>
                </div>

                {/* Blog Content */}
                <div className="prose prose-lg max-w-none">
                  <p className="text-gray-700 leading-relaxed mb-6">
                    {selectedBlog.content}
                  </p>
                  <p className="text-gray-700 leading-relaxed mb-6">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                  </p>
                </div>
              </div>
            </article>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-16">
      {/* Page Header */}
      <div className="container-custom py-16">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            <span className="bg-gradient-to-r from-[#1C7E4E] to-[#047BCA] bg-clip-text text-transparent">Blogs</span>
          </h1>
        </div>
      </div>

      {/* Filter Section */}
      <div className="container-custom py-8">
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-3 rounded-full font-medium transition-all duration-200 ${
                selectedCategory === category
                  ? 'bg-gradient-to-r from-[#1C7E4E] to-[#047BCA] text-white shadow-lg scale-105'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 hover:border-gray-300'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Blogs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredBlogs.map((blog) => (
            <article
              key={blog.id}
              onClick={() => setSelectedBlog(blog)}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer group"
            >
              {/* Blog Image */}
              <div className="relative h-48 bg-gradient-to-br from-blue-100 to-purple-100">
                <img
                  src={blog.image}
                  alt={blog.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute top-4 left-4">
                  <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                    {blog.category}
                  </span>
                </div>
              </div>

              {/* Blog Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors duration-200">
                  {blog.title}
                </h3>
                
                <p className="text-gray-600 mb-4 line-clamp-3 text-sm leading-relaxed">
                  {blog.excerpt}
                </p>
                
                {/* Blog Meta */}
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>{formatDate(blog.date)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{blog.readTime}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    <span>{formatViews(blog.views)}</span>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* No Blogs Message */}
        {filteredBlogs.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Tag className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No blogs found</h3>
            <p className="text-gray-600">Try adjusting your filter to see more content.</p>
          </div>
        )}
      </div>
    </div>
  );
}
