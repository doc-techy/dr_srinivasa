import { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/site';

export default function sitemap(): MetadataRoute.Sitemap {
  const pages: { path: string; changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency']; priority: number }[] = [
    { path: '', changeFrequency: 'monthly', priority: 1 },
    { path: '/about', changeFrequency: 'monthly', priority: 0.8 },
    { path: '/services', changeFrequency: 'monthly', priority: 0.8 },
    { path: '/appointment', changeFrequency: 'monthly', priority: 0.9 },
    { path: '/contact', changeFrequency: 'yearly', priority: 0.6 },
    { path: '/videos', changeFrequency: 'weekly', priority: 0.6 },
    { path: '/blogs', changeFrequency: 'weekly', priority: 0.6 },
  ];

  return pages.map(({ path, changeFrequency, priority }) => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency,
    priority,
  }));
}
