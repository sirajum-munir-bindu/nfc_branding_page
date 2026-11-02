'use client';

import React, { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { GoogleAnalytics } from '@next/third-parties/google';

/**
 * GoogleAnalyticsTracker
 * Integrates Google Analytics 4 for public-facing routes.
 * Excludes private Admin Panel routes (/admin/*).
 * Prevents duplicate pageviews during client-side navigation.
 */
function GoogleAnalyticsInner({ gaId }) {
  const pathname = usePathname();
  const isFirstRender = useRef(true);

  useEffect(() => {
    // Skip initial mount because @next/third-parties GoogleAnalytics handles initial page load
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    // Strictly skip admin routes
    if (!pathname || pathname.startsWith('/admin')) {
      return;
    }

    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
      window.gtag('config', gaId, {
        page_path: pathname + (window.location.search || ''),
      });
    }
  }, [pathname, gaId]);

  // Do not load GA4 on admin pages
  if (pathname && pathname.startsWith('/admin')) {
    return null;
  }

  return <GoogleAnalytics gaId={gaId} />;
}

export default function GoogleAnalyticsTracker() {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;

  if (!gaId) {
    return null;
  }

  return <GoogleAnalyticsInner gaId={gaId} />;
}
