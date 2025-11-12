'use client';
import { useEffect, useRef } from 'react';

export default function VideoPlayer({ 
  src, 
  poster, 
  className = '',
  ...props 
}: {
  src: string;
  poster: string;
  className?: string;
  [key: string]: any;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            videoRef.current?.load();
            observer.disconnect();
          }
        },
        { threshold: 0.1 }
      );
      
      observer.observe(videoRef.current);
      return () => observer.disconnect();
    }
  }, []);

  return (
    <video
      ref={videoRef}
      autoPlay
      loop
      muted
      playsInline
      preload="none"
      poster={poster}
      className={className}
      {...props}
    >
      <source src={src} type="video/mp4" />
    </video>
  );
}
