'use client';

import { useEffect } from 'react';

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

type PerformanceEventTiming = PerformanceEntry & {
  processingStart: number;
  duration: number;
  entryType: string;
  startTime: number;
};

export function PerformanceMetrics() {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') return;

    const logMetric = (name: string, value: number) => {
      console.log(`[Performance] ${name}:`, value.toFixed(2) + 'ms');
      
      // Send to analytics in production
      if (typeof window.gtag === 'function') {
        window.gtag('event', 'performance_metric', {
          event_category: 'Performance Metrics',
          value: Math.round(value),
          metric_name: name,
        });
      }
    };

    // Log LCP (Largest Contentful Paint)
    const lcpObserver = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      const lastEntry = entries[entries.length - 1];
      if (lastEntry) {
        logMetric('LCP', lastEntry.startTime);
      }
    });
    lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });

    // Log INP (Interaction to Next Paint)
    const interactionObserver = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries() as PerformanceEventTiming[];
      for (const entry of entries) {
        if (entry.entryType === 'first-input' || entry.entryType === 'event') {
          const delay = entry.processingStart - entry.startTime;
          const duration = entry.duration;
          const total = delay + duration;
          logMetric('INP', total);
        }
      }
    });
    
    // Use type assertion to bypass TypeScript error for experimental API
    (interactionObserver as any).observe({
      type: 'event',
      buffered: true,
      durationThreshold: 0
    } as any);

    // Log CLS (Cumulative Layout Shift)
    let cls = 0;
    const clsObserver = new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries() as any[]) {
        if (!('hadRecentInput' in entry) || !entry.hadRecentInput) {
          cls += entry.value;
          logMetric('CLS', cls);
        }
      }
    });
    clsObserver.observe({ type: 'layout-shift', buffered: true });

    // Log FCP (First Contentful Paint)
    const fcpObserver = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntriesByName('first-contentful-paint');
      for (const entry of entries) {
        logMetric('FCP', entry.startTime);
      }
    });
    fcpObserver.observe({ type: 'paint', buffered: true });

    // Cleanup
    return () => {
      lcpObserver.disconnect();
      interactionObserver.disconnect();
      clsObserver.disconnect();
      fcpObserver.disconnect();
    };
  }, []);

  return null;
}
