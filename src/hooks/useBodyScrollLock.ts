'use client';

import { useEffect, useRef } from 'react';

/**
 * Prevent background scroll while a modal is open without changing
 * body position/overflow (those cause jump-to-top on close).
 */
export function useBodyScrollLock(locked: boolean) {
  const scrollYRef = useRef(0);

  useEffect(() => {
    if (!locked) return;

    scrollYRef.current = window.scrollY || document.documentElement.scrollTop || 0;
    const scrollY = scrollYRef.current;

    const isInsideAllowed = (target: EventTarget | null) => {
      if (!(target instanceof Element)) return false;
      return Boolean(target.closest('[data-scroll-lock-allow]'));
    };

    const blockScroll = (event: Event) => {
      if (isInsideAllowed(event.target)) return;
      event.preventDefault();
    };

    const keepScroll = () => {
      if (window.scrollY !== scrollY) {
        window.scrollTo(0, scrollY);
      }
    };

    document.addEventListener('wheel', blockScroll, { passive: false });
    document.addEventListener('touchmove', blockScroll, { passive: false });
    window.addEventListener('scroll', keepScroll, { passive: true });

    return () => {
      document.removeEventListener('wheel', blockScroll);
      document.removeEventListener('touchmove', blockScroll);
      window.removeEventListener('scroll', keepScroll);

      const active = document.activeElement;
      if (active instanceof HTMLElement) active.blur();

      window.scrollTo(0, scrollYRef.current);
    };
  }, [locked]);
}
