'use client';

import { useState } from 'react';
import { Calendar, Clock, User, ArrowLeft, Tag, BookOpen } from 'lucide-react';

interface Blog {
  id: string;
  title: string;
  excerpt: string;
  content: string[];
  author: string;
  date: string;
  readTime: string;
  category: string;
}

const AUTHOR = 'Dr. Srinivasa C Clinic';

const blogs: Blog[] = [
  {
    id: '1',
    title: 'Rheumatoid Arthritis: Early Signs You Should Not Ignore',
    excerpt: 'Morning stiffness, swollen finger joints and tiredness can be early signs of rheumatoid arthritis. Early treatment protects your joints.',
    content: [
      'Rheumatoid arthritis (RA) is an autoimmune disease in which the body\'s immune system attacks the lining of the joints. It most often affects the small joints of the hands and feet, usually on both sides of the body.',
      'Common early signs include joint pain and swelling, stiffness in the morning that lasts more than 30 minutes, difficulty making a fist, and general tiredness or low-grade fever.',
      'Early diagnosis matters. Modern medicines can control inflammation and prevent permanent joint damage when started early. If you have joint swelling or morning stiffness lasting several weeks, consult a rheumatologist.',
    ],
    author: AUTHOR,
    date: '2026-09-20',
    readTime: '4 min read',
    category: 'Arthritis',
  },
  {
    id: '2',
    title: 'Gout and Uric Acid: What Causes Sudden Joint Attacks',
    excerpt: 'Gout causes sudden, severe pain and swelling, often in the big toe. Learn what triggers attacks and how uric acid can be controlled.',
    content: [
      'Gout happens when uric acid builds up in the blood and forms crystals in a joint. The result is a sudden attack of intense pain, redness and swelling, very often in the big toe, ankle or knee.',
      'Attacks can be triggered by alcohol, sugary drinks, large meals rich in red meat or seafood, dehydration, and some medicines.',
      'A high uric acid level alone does not always need treatment, but repeated gout attacks usually do. With the right medicines and lifestyle changes, most people can prevent further attacks and joint damage. Do not stop or start uric acid medicines without medical advice.',
    ],
    author: AUTHOR,
    date: '2026-09-12',
    readTime: '4 min read',
    category: 'Gout',
  },
  {
    id: '3',
    title: 'Lupus and Other Autoimmune Diseases: A Simple Guide',
    excerpt: 'Autoimmune diseases like lupus can affect the joints, skin, kidneys and more. Here is what patients and families should know.',
    content: [
      'In autoimmune diseases, the immune system mistakenly attacks the body\'s own tissues. Systemic lupus erythematosus (SLE), Sjögren\'s syndrome, scleroderma and myositis are some examples.',
      'Symptoms vary widely and may include joint pain, skin rashes (especially after sun exposure), mouth ulcers, hair loss, dry eyes or mouth, fatigue and unexplained fevers.',
      'These conditions are long-term, but with regular follow-up and appropriate treatment most patients lead active lives. Blood tests and regular monitoring help detect organ involvement early.',
    ],
    author: AUTHOR,
    date: '2026-09-05',
    readTime: '5 min read',
    category: 'Autoimmune',
  },
  {
    id: '4',
    title: 'Osteoporosis: Protecting Your Bones After 40',
    excerpt: 'Osteoporosis weakens bones silently until a fracture happens. Simple checks and habits can keep your bones strong.',
    content: [
      'Osteoporosis is a condition in which bones become thin and fragile, making fractures of the hip, spine and wrist more likely. It often causes no symptoms until a bone breaks.',
      'Risk is higher in women after menopause, older adults, people on long-term steroid medicines, and those with low body weight, smoking or a family history of fractures.',
      'A bone density (DEXA) scan helps diagnose osteoporosis. Adequate calcium and vitamin D, regular weight-bearing exercise and, when needed, medicines can reduce fracture risk.',
    ],
    author: AUTHOR,
    date: '2026-08-28',
    readTime: '4 min read',
    category: 'Bone Health',
  },
  {
    id: '5',
    title: 'Back Pain in Young Adults: Could It Be Spondyloarthritis?',
    excerpt: 'Back pain that is worse in the morning and improves with activity may be inflammatory. Learn the signs of ankylosing spondylitis.',
    content: [
      'Most back pain is mechanical and improves with rest. Inflammatory back pain is different: it usually starts before age 40, comes on gradually, is worse in the morning or after rest, and improves with movement.',
      'Ankylosing spondylitis and related conditions (spondyloarthritis) can also cause heel pain, eye inflammation and swelling of other joints.',
      'Early diagnosis with a rheumatologist, along with regular exercise and appropriate medicines, helps control pain and keeps the spine flexible.',
    ],
    author: AUTHOR,
    date: '2026-08-20',
    readTime: '4 min read',
    category: 'Arthritis',
  },
  {
    id: '6',
    title: 'Preparing for Your First Rheumatology Visit',
    excerpt: 'A little preparation helps you get the most out of your consultation. Here is what to bring and what to expect.',
    content: [
      'Bring all previous medical reports, blood test results, X-rays or scans, and a list of the medicines you currently take, including supplements.',
      'Note down your symptoms: which joints are affected, when the pain started, how long morning stiffness lasts, and anything that makes it better or worse.',
      'The doctor will take a detailed history, examine your joints and may advise blood tests or imaging. Please arrive 15 minutes before your appointment time.',
    ],
    author: AUTHOR,
    date: '2026-08-12',
    readTime: '3 min read',
    category: 'Patient Guide',
  },
];

const categories = ['All', ...Array.from(new Set(blogs.map(blog => blog.category)))];

const formatDate = (dateString: string) =>
  new Date(dateString).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' });

export default function BlogsPage() {
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredBlogs = blogs.filter(blog => selectedCategory === 'All' || blog.category === selectedCategory);

  if (selectedBlog) {
    return (
      <div className="min-h-screen pt-32 pb-16">
        <div className="container-custom py-12">
          <div className="max-w-4xl mx-auto">
            <button
              onClick={() => setSelectedBlog(null)}
              className="flex items-center gap-2 text-[#047BCA] hover:text-[#0369A1] mb-8 transition-colors duration-200"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back to Blogs</span>
            </button>

            <article className="bg-white rounded-3xl shadow-xl overflow-hidden">
              <div className="relative h-40 md:h-56 bg-gradient-to-br from-[#1C7E4E] to-[#047BCA] flex items-center justify-center">
                <BookOpen className="w-16 h-16 text-white/80" />
                <div className="absolute top-6 left-6">
                  <span className="bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-semibold">
                    {selectedBlog.category}
                  </span>
                </div>
              </div>

              <div className="p-8">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
                  {selectedBlog.title}
                </h1>

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
                </div>

                <div className="max-w-none space-y-5">
                  {selectedBlog.content.map((paragraph, index) => (
                    <p key={index} className="text-gray-700 text-lg leading-relaxed">{paragraph}</p>
                  ))}
                  <p className="text-sm text-gray-500 italic border-t border-gray-100 pt-5">
                    This article is for general information only and is not a substitute for a medical consultation.
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
      <div className="container-custom py-16">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            <span className="bg-gradient-to-r from-[#1C7E4E] to-[#047BCA] bg-clip-text text-transparent">Blogs</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Patient education on arthritis, autoimmune diseases, gout and bone health.
          </p>
        </div>
      </div>

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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredBlogs.map((blog) => (
            <article
              key={blog.id}
              onClick={() => setSelectedBlog(blog)}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer group"
            >
              <div className="relative h-32 bg-gradient-to-br from-[#1C7E4E] to-[#047BCA] flex items-center justify-center">
                <BookOpen className="w-10 h-10 text-white/80 group-hover:scale-110 transition-transform duration-300" />
                <div className="absolute top-4 left-4">
                  <span className="bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-semibold">
                    {blog.category}
                  </span>
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-[#047BCA] transition-colors duration-200">
                  {blog.title}
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-3 text-sm leading-relaxed">
                  {blog.excerpt}
                </p>
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>{formatDate(blog.date)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{blog.readTime}</span>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

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
