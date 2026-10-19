'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { Calendar, Clock, User, ArrowLeft, FileText } from 'lucide-react';
import { blogs, getBlogBySlug, type Blog, type BlogBlock } from '@/data/blogs';

const formatDate = (dateString: string) =>
  new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

function BlogContent({ blocks }: { blocks: BlogBlock[] }) {
  return (
    <div className="space-y-5">
      {blocks.map((block, index) => {
        if (block.type === 'heading') {
          return (
            <h2 key={index} className="pt-2 text-xl font-bold text-gray-900 md:text-2xl">
              {block.text}
            </h2>
          );
        }
        if (block.type === 'list') {
          return (
            <ul key={index} className="list-disc space-y-2 pl-6 text-base leading-relaxed text-gray-700">
              {block.items.map((item, itemIndex) => (
                <li key={itemIndex}>{item}</li>
              ))}
            </ul>
          );
        }
        if (block.type === 'image') {
          return (
            <figure key={index} className="overflow-hidden rounded-xl border border-gray-100 bg-gray-50">
              <Image
                src={block.src}
                alt={block.alt}
                width={1248}
                height={832}
                className="h-auto w-full object-contain"
                sizes="(max-width: 768px) 100vw, 768px"
              />
            </figure>
          );
        }
        return (
          <p key={index} className="text-base leading-relaxed text-gray-700">
            {block.text}
          </p>
        );
      })}
      <p className="border-t border-gray-100 pt-5 text-sm italic text-gray-500">
        This article is for general information only and is not a substitute for a medical consultation.
      </p>
    </div>
  );
}

function BlogsPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const slug = searchParams.get('slug');
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);

  useEffect(() => {
    setSelectedBlog(slug ? getBlogBySlug(slug) ?? null : null);
  }, [slug]);

  const openBlog = (blog: Blog) => {
    router.push(`/blogs?slug=${blog.slug}`);
  };

  if (selectedBlog) {
    return (
      <div className="relative min-h-screen overflow-hidden pt-28 pb-16">
        <div className="container-custom relative py-8 md:py-12">
          <article className="mx-auto max-w-3xl overflow-hidden rounded-2xl border border-gray-200/70 bg-white shadow-lg">
            <div className="flex items-center justify-between gap-4 bg-gradient-to-r from-[#1C7E4E] to-[#047BCA] px-5 py-4">
              <button
                type="button"
                onClick={() => router.push('/blogs')}
                className="inline-flex items-center gap-2 text-sm font-semibold text-white transition hover:text-white/80"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to blogs
              </button>
              <span className="text-xs font-semibold text-white/90">{selectedBlog.readTime}</span>
            </div>

            <div className="p-5 sm:p-8">
              <h1 className="text-2xl font-bold leading-tight text-gray-900 sm:text-3xl">
                {selectedBlog.title}
              </h1>
              <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-gray-500">
                <span className="inline-flex items-center gap-1.5">
                  <User className="h-4 w-4" />
                  {selectedBlog.author}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" />
                  {formatDate(selectedBlog.date)}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="h-4 w-4" />
                  {selectedBlog.readTime}
                </span>
              </div>
              <div className="mt-8">
                <BlogContent blocks={selectedBlog.content} />
              </div>
            </div>
          </article>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden pt-28 pb-16">
      <div className="container-custom relative py-10 md:py-14">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl lg:text-5xl">
            Educational{' '}
            <span className="bg-gradient-to-r from-[#1C7E4E] to-[#047BCA] bg-clip-text text-transparent">
              Blogs
            </span>
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-base text-gray-600">
            Patient education on arthritis, autoimmune conditions, and bone health.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 md:gap-5 lg:grid-cols-4">
          {blogs.map(blog => (
            <article
              key={blog.id}
              onClick={() => openBlog(blog)}
              className="group cursor-pointer overflow-hidden rounded-2xl border border-gray-200/70 bg-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-[#047BCA]/40 hover:shadow-2xl"
            >
              <div className="relative aspect-video overflow-hidden bg-gray-100">
                {blog.thumbnail ? (
                  <Image
                    src={blog.thumbnail}
                    alt={blog.title}
                    fill
                    sizes="(max-width: 1024px) 50vw, 25vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : null}
                <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#047BCA] shadow-xl transition duration-300 group-hover:scale-110 group-hover:bg-gradient-to-r group-hover:from-[#1C7E4E] group-hover:to-[#047BCA] group-hover:text-white md:h-12 md:w-12">
                    <FileText className="h-4 w-4 md:h-5 md:w-5" />
                  </div>
                </div>
                <span className="absolute bottom-2 right-2 rounded-lg bg-black/80 px-2 py-1 text-[10px] font-semibold text-white md:bottom-3 md:right-3 md:text-xs">
                  {blog.readTime}
                </span>
              </div>

              <div className="flex flex-col p-3 md:p-4">
                <h2 className="line-clamp-2 text-xs font-bold leading-snug text-gray-900 transition-colors group-hover:text-[#047BCA] md:text-sm">
                  {blog.title}
                </h2>
                <p className="mt-1.5 hidden text-xs leading-relaxed text-gray-600 line-clamp-2 sm:block">
                  {blog.excerpt}
                </p>
                <div className="mt-2 flex items-center gap-1.5 text-[11px] text-gray-500 md:mt-3 md:text-xs">
                  <Calendar className="h-3 w-3 md:h-3.5 md:w-3.5" />
                  <span>{formatDate(blog.date)}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function BlogsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen pt-28" />}>
      <BlogsPageContent />
    </Suspense>
  );
}
