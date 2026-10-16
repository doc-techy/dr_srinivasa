'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Play, Calendar, ArrowRight, FileText, BookOpen, X } from 'lucide-react';
import Image from 'next/image';
import { blogs as blogPosts } from '@/data/blogs';

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
    title: 'Pain, Swelling & When to Seek Help',
    description:
      'Have you ever experienced pain or swelling in your joints? Learn when these symptoms matter and when to see a rheumatologist.',
    thumbnail: '/images/videos/rheumatology-education.jpg',
    duration: '2:35',
    date: '2026-10-16',
    category: 'Education',
    views: 0,
    videoUrl: '/videos/rheumatology-education.mp4',
  },
];

const sampleBlogs: Blog[] = blogPosts.map(blog => ({
  id: blog.id,
  title: blog.title,
  description: blog.excerpt,
  thumbnail: blog.thumbnail ?? '',
  readTime: blog.readTime,
  date: blog.date,
  category: blog.category,
  views: 0,
  blogUrl: `/blogs?slug=${blog.slug}`,
}));

const formatDate = (dateString: string) =>
  new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

export function VideoSection() {
  const router = useRouter();
  const [contentType, setContentType] = useState<'videos' | 'blogs'>('videos');
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [videoAspectRatio, setVideoAspectRatio] = useState<number | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!selectedVideo) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedVideo(null);
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [selectedVideo]);

  const handleVideoLoadedMetadata = () => {
    if (!videoRef.current) return;
    const { videoWidth, videoHeight } = videoRef.current;
    if (videoWidth && videoHeight) setVideoAspectRatio(videoWidth / videoHeight);
  };

  const items = contentType === 'videos' ? sampleVideos : sampleBlogs;

  return (
    <section className="relative overflow-hidden py-12 md:py-16">
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white via-[#f4fbf8] to-white"
        aria-hidden
      />

      <div className="container-custom relative">
        <div className="text-center mb-8">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900">
            Educational{' '}
            <span className="bg-gradient-to-r from-[#1C7E4E] to-[#047BCA] bg-clip-text text-transparent">
              Videos and Blogs
            </span>
          </h2>
          <p className="mt-3 text-base text-gray-600 max-w-xl mx-auto">
            Short, practical explainers on joint pain, autoimmune conditions, and bone health.
          </p>

          <div className="mt-6 flex justify-center px-4">
            <div className="inline-flex w-full max-w-[320px] rounded-2xl border border-gray-200/70 bg-white p-1 shadow-md">
              <button
                type="button"
                onClick={() => setContentType('videos')}
                className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-200 ${
                  contentType === 'videos'
                    ? 'bg-gradient-to-r from-[#1C7E4E] to-[#047BCA] text-white shadow-lg'
                    : 'text-gray-600 hover:text-[#047BCA]'
                }`}
              >
                <Play className="h-4 w-4" />
                Videos
              </button>
              <button
                type="button"
                onClick={() => setContentType('blogs')}
                className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-200 ${
                  contentType === 'blogs'
                    ? 'bg-gradient-to-r from-[#1C7E4E] to-[#047BCA] text-white shadow-lg'
                    : 'text-gray-600 hover:text-[#047BCA]'
                }`}
              >
                <BookOpen className="h-4 w-4" />
                Blogs
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5">
          {items.map(item => {
            const isVideo = contentType === 'videos';
            const meta = isVideo ? (item as Video).duration : (item as Blog).readTime;

            return (
              <article
                key={`${contentType}-${item.id}`}
                onClick={() => {
                  if (isVideo) {
                    setSelectedVideo(item as Video);
                    setVideoAspectRatio(null);
                  } else {
                    router.push((item as Blog).blogUrl || '/blogs');
                  }
                }}
                className="group cursor-pointer overflow-hidden rounded-2xl border border-gray-200/70 bg-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-[#047BCA]/40 hover:shadow-2xl"
              >
                <div className="relative aspect-video overflow-hidden bg-gray-100">
                  <Image
                    src={item.thumbnail}
                    alt={item.title}
                    fill
                    sizes="(max-width: 1024px) 50vw, 25vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />

                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#047BCA] shadow-xl transition duration-300 group-hover:scale-110 group-hover:bg-gradient-to-r group-hover:from-[#1C7E4E] group-hover:to-[#047BCA] group-hover:text-white md:h-12 md:w-12">
                      {isVideo ? (
                        <Play className="ml-0.5 h-4 w-4 fill-current md:h-5 md:w-5" />
                      ) : (
                        <FileText className="h-4 w-4 md:h-5 md:w-5" />
                      )}
                    </div>
                  </div>

                  <span className="absolute bottom-2 right-2 rounded-lg bg-black/80 px-2 py-1 text-[10px] font-semibold text-white md:bottom-3 md:right-3 md:text-xs">
                    {meta}
                  </span>
                </div>

                <div className="flex flex-col p-3 md:p-4">
                  <h3 className="text-xs font-bold leading-snug text-gray-900 transition-colors line-clamp-2 md:text-sm group-hover:text-[#047BCA]">
                    {item.title}
                  </h3>
                  <p className="mt-1.5 hidden text-xs leading-relaxed text-gray-600 line-clamp-2 sm:block">
                    {item.description}
                  </p>
                  <div className="mt-2 flex items-center gap-1.5 text-[11px] text-gray-500 md:mt-3 md:text-xs">
                    <Calendar className="h-3 w-3 md:h-3.5 md:w-3.5" />
                    <span>{formatDate(item.date)}</span>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {contentType === 'blogs' && (
          <div className="mt-8 flex justify-center">
            <a
              href="/blogs"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#1C7E4E] to-[#047BCA] px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:from-[#145C38] hover:to-[#0369A1]"
            >
              View all blogs
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        )}
      </div>

      {selectedVideo && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/75 p-4"
          onClick={e => {
            if (e.target === e.currentTarget) setSelectedVideo(null);
          }}
        >
          <div className="w-full max-w-3xl overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-2xl">
            <div className="flex items-center justify-between gap-4 bg-gradient-to-r from-[#1C7E4E] to-[#047BCA] px-5 py-4">
              <h3 className="text-base font-bold text-white sm:text-lg">{selectedVideo.title}</h3>
              <button
                type="button"
                aria-label="Close video"
                onClick={() => setSelectedVideo(null)}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/20 text-white transition hover:bg-white/30"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div
              className="bg-black"
              style={{ aspectRatio: videoAspectRatio ? `${videoAspectRatio}` : '16 / 9' }}
            >
              <video
                ref={videoRef}
                className="h-full w-full object-contain"
                controls
                autoPlay
                playsInline
                preload="metadata"
                poster={selectedVideo.thumbnail}
                onLoadedMetadata={handleVideoLoadedMetadata}
              >
                <source src={selectedVideo.videoUrl} type="video/mp4" />
              </video>
            </div>
            <p className="px-5 py-4 text-sm text-gray-600 sm:text-base">{selectedVideo.description}</p>
          </div>
        </div>
      )}
    </section>
  );
}
