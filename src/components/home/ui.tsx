import Link from 'next/link';
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export const container = 'mx-auto w-full max-w-[1320px] px-4 sm:px-6';

export const heading = 'text-[clamp(1.5rem,2.222vw,2rem)] font-semibold leading-[1.285] tracking-[-0.01em] text-rc-ink';
export const leadHeading = 'text-[clamp(2rem,3.889vw,3.5rem)] font-semibold leading-[1.2] tracking-[-0.01em] text-rc-ink';
export const bodyText = 'text-base leading-relaxed text-rc-muted';

const buttonVariants = {
  lemon: 'bg-rc-lemon text-rc-ink hover:bg-rc-offwhite hover:text-rc-teal hover:shadow-[0_4px_24px_rgba(122,186,178,0.4)]',
  teal: 'bg-rc-teal text-rc-offwhite hover:bg-rc-teal-dark hover:shadow-[0_4px_24px_rgba(122,186,178,0.4)]',
  outlineDark: 'border border-rc-ink text-rc-ink hover:bg-rc-ink hover:text-rc-offwhite',
  outlineLight: 'border border-rc-offwhite/80 text-rc-offwhite hover:bg-white/10',
} as const;

type ButtonProps = {
  href: string;
  variant?: keyof typeof buttonVariants;
  icon?: ReactNode;
  external?: boolean;
  className?: string;
  children: ReactNode;
};

function RollLabel({ icon, children }: { icon?: ReactNode; children: ReactNode }) {
  const row = 'flex items-center justify-center gap-2.5 transition-all duration-700 ease-[cubic-bezier(0.2,1,0.3,1)]';
  return (
    <span className="relative block overflow-hidden">
      <span className={cn(row, 'group-hover:-translate-y-[150%] group-hover:opacity-0')}>
        {children}
        {icon}
      </span>
      <span aria-hidden className={cn(row, 'absolute inset-0 translate-y-[150%] opacity-0 group-hover:translate-y-0 group-hover:opacity-100')}>
        {children}
        {icon}
      </span>
    </span>
  );
}

export function RcButton({ href, variant = 'teal', icon, external, className, children }: ButtonProps) {
  const classes = cn(
    'group inline-flex min-h-[3.375rem] items-center justify-center whitespace-nowrap rounded-full px-8 py-4 text-[15px] font-medium leading-tight transition-[background-color,color,box-shadow] duration-300',
    buttonVariants[variant],
    className,
  );
  const label = <RollLabel icon={icon}>{children}</RollLabel>;

  if (external || !href.startsWith('/')) {
    return (
      <a href={href} className={classes} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
        {label}
      </a>
    );
  }
  return (
    <Link href={href} className={classes}>
      {label}
    </Link>
  );
}

export function Marquee({ items, size = 'small', className }: { items: string[]; size?: 'small' | 'large'; className?: string }) {
  const loop = [...items, ...items];
  return (
    <div className={cn('flex overflow-hidden whitespace-nowrap', size === 'large' ? 'py-5 md:py-[26px]' : 'py-[17px] md:py-[22px]', className)}>
      <ul className="flex w-max animate-marquee motion-reduce:animate-none">
        {loop.map((item, index) => (
          <li key={index} aria-hidden={index >= items.length} className="flex items-center gap-6 pl-6">
            <span className="h-2 w-2 shrink-0 rounded-full bg-rc-teal" />
            <span
              className={
                size === 'large'
                  ? 'text-[clamp(1.2rem,1.667vw,1.5rem)] font-semibold text-rc-ink'
                  : 'text-[clamp(0.9rem,1.111vw,1rem)] text-black'
              }
            >
              {item}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
