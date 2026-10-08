import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, BookOpen, Play } from 'lucide-react';
import { RcButton, bodyText, container, leadHeading } from './ui';

const tileBase = 'group relative block overflow-hidden rounded-[16px] transition-transform duration-300 hover:-translate-y-1';
const tileLabel = 'absolute inset-x-0 bottom-0 p-4 text-sm font-semibold leading-snug md:p-5 md:text-base';

export function Resources() {
  return (
    <div className="bg-rc-mist py-[clamp(80px,8.333vw,120px)]">
      <div className={`${container} grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-20`}>
        <div>
          <h2 className={leadHeading}>
            Comprehensive resources for <span className="text-rc-teal">your treatment journey</span>
          </h2>
          <p className={`${bodyText} mt-5 max-w-lg`}>
            Explore short videos and articles on rheumatic diseases, diagnosis, treatment and lifestyle — to better
            understand your condition or that of a loved one.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <RcButton href="/videos" icon={<ArrowRight className="h-4 w-4" />}>
              Explore content
            </RcButton>
            <RcButton href="/blogs" variant="outlineDark">
              Read blogs
            </RcButton>
          </div>
        </div>

        <div className="grid h-[440px] grid-cols-2 grid-rows-[1fr_1fr_1fr] gap-4 [grid-template-areas:'one_two''three_two''three_four'] md:h-[480px]">
          <Link href="/videos" className={`${tileBase} bg-rc-teal text-rc-offwhite [grid-area:one]`}>
            <Play className="absolute right-4 top-4 h-9 w-9 rounded-full bg-rc-lemon p-2.5 text-rc-ink" />
            <span className={tileLabel}>Understanding rheumatoid arthritis</span>
          </Link>
          <Link href="/blogs" className={`${tileBase} [grid-area:two]`}>
            <Image src="/images/hero-mobility.jpg" alt="" fill sizes="(min-width: 1024px) 25vw, 50vw" className="object-cover object-[50%_30%]" />
            <span className="absolute inset-0 bg-gradient-to-t from-rc-ink/80 via-rc-ink/10 to-transparent" />
            <span className={`${tileLabel} text-rc-offwhite`}>Staying active with joint pain</span>
          </Link>
          <Link href="/videos" className={`${tileBase} bg-white [grid-area:three]`}>
            <Image src="/images/doctor-cutout.png" alt="" fill sizes="(min-width: 1024px) 25vw, 50vw" className="object-contain object-bottom pt-6" />
            <span className="absolute inset-0 bg-gradient-to-t from-rc-ink/80 via-transparent to-transparent" />
            <Play className="absolute right-4 top-4 h-9 w-9 rounded-full bg-rc-teal p-2.5 text-rc-offwhite" />
            <span className={`${tileLabel} text-rc-offwhite`}>What to expect at your first visit</span>
          </Link>
          <Link href="/blogs" className={`${tileBase} bg-rc-lemon text-rc-ink [grid-area:four]`}>
            <BookOpen className="absolute right-4 top-4 h-6 w-6" />
            <span className={tileLabel}>Patient guides & articles</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
