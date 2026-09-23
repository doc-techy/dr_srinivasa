'use client';

import { useState, useEffect, useRef } from 'react';
import { Play, Clock, Calendar, Eye, ArrowRight, ArrowUp, FileText, BookOpen, X } from 'lucide-react';
import Image from 'next/image';

interface Video {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  duration: string;
  date: string;
  category: string;
  views: number;
  videoUrl: string;
}

interface Blog {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  readTime: string;
  date: string;
  category: string;
  views: number;
  blogUrl: string;
}

const sampleVideos: Video[] = [
  {
    id: '1',
    title: 'Understanding Rheumatoid Arthritis',
    description: 'A simple overview of rheumatoid arthritis — common symptoms, why joints become inflamed, and when to see a rheumatologist.',
    thumbnail: 'https://picsum.photos/400/225?random=31',
    duration: '4:20',
    date: '2026-09-01',
    category: 'Education',
    views: 840,
    videoUrl: ''
  },
  {
    id: '2',
    title: 'Joint Pain: When Is It More Than Wear and Tear?',
    description: 'How inflammatory joint pain differs from degenerative arthritis, and what signs suggest autoimmune disease.',
    thumbnail: 'https://picsum.photos/400/225?random=32',
    duration: '3:45',
    date: '2026-08-20',
    category: 'Education',
    views: 720,
    videoUrl: ''
  },
  {
    id: '3',
    title: 'Living with Autoimmune Disease',
    description: 'Practical tips on follow-up, medicines, rest, and daily habits that support long-term control.',
    thumbnail: 'https://picsum.photos/400/225?random=33',
    duration: '5:10',
    date: '2026-08-05',
    category: 'Patient Care',
    views: 910,
    videoUrl: ''
  },
  {
    id: '4',
    title: 'Osteoporosis: Protecting Bone Strength',
    description: 'Why bone density matters, who is at risk, and how diet, activity, and treatment help prevent fractures.',
    thumbnail: 'https://picsum.photos/400/225?random=34',
    duration: '3:55',
    date: '2026-07-22',
    category: 'Education',
    views: 650,
    videoUrl: ''
  },
  {
    id: '5',
    title: 'What to Expect at a Rheumatology Visit',
    description: 'A walk-through of history, examination, common tests, and how a care plan is built with the patient.',
    thumbnail: 'https://picsum.photos/400/225?random=35',
    duration: '2:40',
    date: '2026-07-10',
    category: 'Introduction',
    views: 580,
    videoUrl: ''
  },
  {
    id: '6',
    title: 'Joint Injections Explained',
    description: 'When intra-articular injections are used, what happens during the procedure, and recovery tips.',
    thumbnail: 'https://picsum.photos/400/225?random=36',
    duration: '3:15',
    date: '2026-06-28',
    category: 'Treatment',
    views: 770,
    videoUrl: ''
  },
];

const sampleBlogs: Blog[] = [
  {
    id: '1',
    title: 'Early Signs of Inflammatory Arthritis',
    description: 'Morning stiffness, swelling, and fatigue — symptoms that should prompt a rheumatology consult.',
    thumbnail: 'https://picsum.photos/400/225?random=41',
    readTime: '5 min read',
    date: '2026-09-10',
    category: 'Education',
    views: 1120,
    blogUrl: '#'
  },
  {
    id: '2',
    title: 'Lupus Myths vs Facts',
    description: 'Clear answers to common questions about lupus, flares, and long-term monitoring.',
    thumbnail: 'https://picsum.photos/400/225?random=42',
    readTime: '7 min read',
    date: '2026-08-28',
    category: 'Education',
    views: 980,
    blogUrl: '#'
  },
  {
    id: '3',
    title: 'Managing Joint Pain at Home',
    description: 'Safe activity, heat/cold, rest balance, and when home care is not enough.',
    thumbnail: 'https://picsum.photos/400/225?random=43',
    readTime: '6 min read',
    date: '2026-08-14',
    category: 'Lifestyle',
    views: 1340,
    blogUrl: '#'
  },
  {
    id: '4',
    title: 'Understanding Your Lab Reports',
    description: 'ESR, CRP, RF, ANA and more — what these tests mean in rheumatology care.',
    thumbnail: 'https://picsum.photos/400/225?random=44',
    readTime: '8 min read',
    date: '2026-07-30',
    category: 'Education',
    views: 1560,
    blogUrl: '#'
  },
  {
    id: '5',
    title: 'Bone Health After 40',
    description: 'Diet, vitamin D, exercise, and screening for osteoporosis in everyday practice.',
    thumbnail: 'https://picsum.photos/400/225?random=45',
    readTime: '5 min read',
    date: '2026-07-12',
    category: 'Lifestyle',
    views: 890,
    blogUrl: '#'
  },
  {
    id: '6',
    title: 'Preparing for Your First Rheumatology Appointment',
    description: 'What to bring, questions to ask, and how to describe symptoms clearly.',
    thumbnail: 'https://picsum.photos/400/225?random=46',
    readTime: '4 min read',
    date: '2026-06-25',
    category: 'Patient Care',
    views: 760,
    blogUrl: '#'
  },
];

export function VideoSection() {
  const [videosToShow, setVideosToShow] = useState(4); // Start with 4 videos (2x2 grid)
  const [contentType, setContentType] = useState<'videos' | 'blogs'>('videos');
  const [isMobile, setIsMobile] = useState(false);
  const [gridColumns, setGridColumns] = useState(4); // Track current grid columns
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [videoAspectRatio, setVideoAspectRatio] = useState<number | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Check screen size on mount and resize
  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      
      // Determine grid columns based on screen size
      let columns = 2; // Default for mobile
      if (width >= 768) columns = 4; // Desktop: 4 columns
      else columns = 2; // Mobile: 2 columns
      
      setGridColumns(columns);
      
      // Set videos to show: Always 2 rows (2 * columns)
      setVideosToShow(columns * 2); // 2 rows for both mobile and desktop
    };
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const currentData = contentType === 'videos' ? sampleVideos : sampleBlogs;

  const displayedItems = currentData.slice(0, videosToShow);
  const initialVideos = gridColumns * 2; // Initial 2 rows
  const hasMoreItems = videosToShow < currentData.length;

  const loadMore = () => {
    const increment = gridColumns * 2; // Load 2 rows worth
    setVideosToShow(prev => Math.min(prev + increment, currentData.length));
  };

  const showLess = () => {
    const minVideos = gridColumns * 2; // Minimum 2 rows
    const decrement = gridColumns * 2; // Decrease by 2 rows
    setVideosToShow(prev => Math.max(prev - decrement, minVideos));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatViews = (views: number) => {
    if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}K`;
    }
    return `${views}`;
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
      .trim();
  };

  const handleBlogClick = (blog: Blog) => {
    const slug = generateSlug(blog.title);
    const blogUrl = `/blogs/${slug}`;
    window.open(blogUrl, '_blank');
  };

  const handleVideoClick = (video: Video) => {
    setSelectedVideo(video);
    setIsVideoOpen(true);
    setVideoAspectRatio(null); // Reset aspect ratio when opening new video
  };

  const handleVideoLoadedMetadata = () => {
    if (videoRef.current) {
      const video = videoRef.current;
      const aspectRatio = video.videoWidth / video.videoHeight;
      setVideoAspectRatio(aspectRatio);
    }
  };

  return (
    <>
    <div className="container-custom pt-4 md:pt-8 pb-8 md:pb-16">
      {/* Header */}
      <div className="text-center mb-4 relative">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 md:mb-6">
          Educational <span className="bg-gradient-to-r from-[#1C7E4E] to-[#047BCA] bg-clip-text text-transparent">Videos and Blogs</span>
        </h2>
        
        {/* Content Type Toggle Switch */}
        <div className="flex justify-center items-center gap-3 mb-6 md:mb-8 px-4">
          {/* Toggle Switch */}
          <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-1 flex border border-gray-200/50 shadow-md backdrop-blur-sm w-full max-w-[320px] md:min-w-[320px]">
            <button
              onClick={() => setContentType('videos')}
              className={`flex items-center gap-1 md:gap-2 px-2 md:px-6 py-1.5 md:py-3 rounded-lg text-xs md:text-sm font-semibold transition-all duration-700 ease-in-out transform relative overflow-hidden ${
                contentType === 'videos'
                  ? 'bg-gradient-to-r from-[#1C7E4E] to-[#047BCA] text-white shadow-lg scale-105'
                  : 'text-gray-700 hover:text-[#047BCA] hover:bg-green-50/70 hover:scale-102 active:scale-98'
              }`}
              style={{
                flex: '1',
                position: 'relative',
              }}
            >
              <div className={`absolute inset-0 bg-gradient-to-r from-white/20 to-transparent transition-all duration-700 ${
                contentType === 'videos' ? 'opacity-100' : 'opacity-0'
              }`}></div>
              <Play className={`w-3 h-3 md:w-4 md:h-4 transition-all duration-700 ease-in-out relative z-10 ${
                contentType === 'videos' ? 'rotate-12 scale-110' : 'rotate-0 scale-100'
              }`} />
              <span className="relative z-10">Videos</span>
            </button>
            <button
              onClick={() => setContentType('blogs')}
              className={`flex items-center gap-1 md:gap-2 px-2 md:px-6 py-1.5 md:py-3 rounded-lg text-xs md:text-sm font-semibold transition-all duration-700 ease-in-out transform relative overflow-hidden ${
                contentType === 'blogs'
                  ? 'bg-gradient-to-r from-[#1C7E4E] to-[#047BCA] text-white shadow-lg scale-105'
                  : 'text-gray-700 hover:text-[#047BCA] hover:bg-green-50/70 hover:scale-102 active:scale-98'
              }`}
              style={{
                flex: '1',
                position: 'relative',
              }}
            >
              <div className={`absolute inset-0 bg-gradient-to-r from-white/20 to-transparent transition-all duration-700 ${
                contentType === 'blogs' ? 'opacity-100' : 'opacity-0'
              }`}></div>
              <BookOpen className={`w-3 h-3 md:w-4 md:h-4 transition-all duration-700 ease-in-out relative z-10 ${
                contentType === 'blogs' ? 'rotate-12 scale-110' : 'rotate-0 scale-100'
              }`} />
              <span className="relative z-10">Blogs</span>
            </button>
          </div>
        </div>
      </div>


      {/* Content Layout */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-5">
        {displayedItems.map((item) => (
          <div key={item.id} className="group h-full">
            <div 
              className={`bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300 border border-gray-200/50 group-hover:border-[#047BCA]/50 h-full min-h-[200px] md:min-h-[240px] flex flex-col ${
                contentType === 'blogs' || contentType === 'videos' ? 'cursor-pointer' : ''
              }`}
              style={{
                willChange: 'transform, box-shadow',
                transform: 'translateZ(0)',
              }}
              onClick={contentType === 'blogs' ? () => handleBlogClick(item as Blog) : contentType === 'videos' ? () => handleVideoClick(item as Video) : undefined}
            >
              {/* Thumbnail */}
              <div className="relative w-full aspect-video bg-gradient-to-br from-green-50 to-blue-50 overflow-hidden p-1 md:p-1.5">
                <div className="relative w-full h-full rounded-lg overflow-hidden flex items-center justify-center">
                  <Image 
                    src={item.thumbnail} 
                    alt={item.title} 
                    fill 
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className="object-contain group-hover:scale-105 transition-transform duration-300" 
                    unoptimized
                    style={{
                      willChange: 'transform',
                    }}
                    onError={(e) => {
                      // Fallback to default thumbnail if specific thumbnail fails to load
                      const target = e.currentTarget as HTMLImageElement;
                      if (target.src && !target.src.includes('thumbnail.jpg')) {
                        target.src = '/images/thumbnail.jpg';
                      } else {
                        target.style.display = 'none';
                      }
                    }}
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                
                {/* Play Button for Videos / Read Icon for Blogs */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-6 h-6 md:w-7 md:h-7 bg-white/95 rounded-full flex items-center justify-center shadow-lg transition-transform duration-300 group-hover:bg-white group-hover:shadow-xl"
                    style={{
                      willChange: 'transform',
                      transform: 'translateZ(0)',
                    }}
                  >
                    {contentType === 'videos' ? (
                      <Play className="w-3 h-3 md:w-4 md:h-4 text-[#047BCA] ml-0.5" />
                    ) : (
                      <FileText className="w-3 h-3 md:w-4 md:h-4 text-[#047BCA]" />
                    )}
                  </div>
                </div>
                
                {/* Duration/Read Time Badge */}
                <div className="absolute bottom-1 right-1 bg-black/90 text-white px-2 py-1 rounded-lg text-xs font-semibold shadow-lg">
                  {contentType === 'videos' ? (item as Video).duration : (item as Blog).readTime}
                </div>
              </div>

              {/* Content */}
              <div className="p-2 md:p-3 flex-1 flex flex-col bg-gradient-to-b from-white to-gray-50/50">
                <h3 className={`text-xs font-bold text-gray-900 mb-1 line-clamp-2 transition-colors duration-200 min-h-[1.5rem] ${
                  contentType === 'videos' ? 'group-hover:text-[#047BCA]' : 'group-hover:text-[#047BCA]'
                }`}>
                  {item.title}
                </h3>
                
                <p className="text-xs text-gray-600 mb-1 line-clamp-2 flex-1 min-h-[2rem]">
                  {item.description}
                </p>
                
                {/* Metadata */}
                <div className="flex items-center justify-start text-xs text-gray-500 mt-auto">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-2.5 h-2.5" />
                    <span className="text-xs">{formatDate(item.date)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Action Buttons at Bottom */}
      <div className="flex flex-col sm:flex-row justify-center gap-3 md:gap-4">
        {hasMoreItems && (
          <button 
            onClick={loadMore}
            className="flex items-center justify-center gap-2 px-6 md:px-8 py-3 md:py-4 bg-gradient-to-r from-[#1C7E4E] to-[#047BCA] text-white rounded-xl font-semibold hover:from-[#145C38] hover:to-[#0369A1] transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl text-sm md:text-base"
          >
            <span>Load More {contentType === 'videos' ? 'Videos' : 'Blogs'}</span>
            <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
          </button>
        )}
        
        {videosToShow > initialVideos && (
          <button 
            onClick={showLess}
            className="flex items-center justify-center gap-2 px-6 md:px-8 py-3 md:py-4 bg-gray-600 text-white rounded-xl font-semibold hover:bg-gray-700 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl text-sm md:text-base"
          >
            <span>Show Less</span>
            <ArrowUp className="w-4 h-4 md:w-5 md:h-5" />
          </button>
        )}
      </div>


      {/* Video Modal */}
      {isVideoOpen && selectedVideo && (
        <div 
          className="fixed bg-black/80 z-[9999]"
          style={{
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            width: '100vw',
            height: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
            overflowY: 'auto',
            boxSizing: 'border-box',
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setIsVideoOpen(false);
              setSelectedVideo(null);
            }
          }}
        >
          <div 
            className="bg-white rounded-3xl p-4 md:p-6 lg:p-8 shadow-2xl border border-gray-200"
            style={{
              width: '100%',
              maxWidth: '56rem',
              margin: '0',
              position: 'relative',
              flexShrink: 0,
              boxSizing: 'border-box',
              alignSelf: 'center',
            }}
          >
            <div className="flex justify-between items-center mb-4 md:mb-6">
              <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-gray-900">{selectedVideo.title}</h3>
              <button
                onClick={() => {
                  setIsVideoOpen(false);
                  setSelectedVideo(null);
                }}
                className="w-8 h-8 md:w-10 md:h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors duration-200"
              >
                <X className="w-5 h-5 md:w-6 md:h-6 text-gray-600" />
              </button>
            </div>
            <div 
              className="bg-black rounded-2xl overflow-hidden"
              style={{
                aspectRatio: videoAspectRatio ? `${videoAspectRatio}` : '16/9',
                maxHeight: '80vh',
                width: '100%',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {selectedVideo.videoUrl ? (
                <video
                  ref={videoRef}
                  className="w-full h-full object-contain"
                  controls
                  preload="metadata"
                  poster={selectedVideo.thumbnail}
                  autoPlay
                  playsInline
                  onLoadedMetadata={handleVideoLoadedMetadata}
                  style={{
                    display: 'block',
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                  }}
                >
                  <source src={selectedVideo.videoUrl} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              ) : (
                <div className="flex flex-col items-center justify-center text-center px-6 py-16 bg-gradient-to-br from-[#1C7E4E] to-[#047BCA] w-full h-full min-h-[220px]">
                  <Play className="w-12 h-12 text-white/90 mb-4" />
                  <p className="text-white text-lg font-semibold">Video coming soon</p>
                  <p className="text-white/80 text-sm mt-2 max-w-md">{selectedVideo.description}</p>
                </div>
              )}
            </div>
            <div className="mt-4">
              <p className="text-gray-600 text-sm md:text-base">{selectedVideo.description}</p>
            </div>
          </div>
        </div>
      )}
    </div>
    </>
  );
}