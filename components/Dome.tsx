"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import DomeGallery from "@/components/ui/DomeGallery";
import FuzzyText from '@/components/FuzzyText';
import { useInView } from 'framer-motion';

const Dome = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [externalRotation, setExternalRotation] = useState(0);
  const scrollStartRef = useRef<number | null>(null);
  const [isRotating, setIsRotating] = useState(true);

  // Animation refs
  const lastRotationRef = useRef(0);
  const hasCompletedRotationRef = useRef(false);
  const rafId = useRef<number | null>(null);
  const targetRotation = useRef(0);
  const currentRotation = useRef(0);
  const isAnimating = useRef(false);
  const isInView = useInView(containerRef, { once: false, amount: 0.1 });

  const animateRotation = useCallback(() => {
    if (!isAnimating.current) return;
    
    // Smoothly interpolate towards target rotation
    currentRotation.current += (targetRotation.current - currentRotation.current) * 0.1;
    setExternalRotation(currentRotation.current);
    
    // Continue animation if we're not close enough to target
    if (Math.abs(targetRotation.current - currentRotation.current) > 0.001) {
      rafId.current = requestAnimationFrame(animateRotation);
    } else {
      currentRotation.current = targetRotation.current;
      setExternalRotation(currentRotation.current);
      isAnimating.current = false;
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const isInView = rect.top <= viewportHeight && rect.bottom >= 0;
      
      if (isInView) {
        // Calculate visible height percentage (0 to 1)
        const visibleHeight = Math.min(rect.bottom, viewportHeight) - Math.max(rect.top, 0);
        const visiblePercent = visibleHeight / viewportHeight;
        
        // Only update if a meaningful portion is visible
        if (visiblePercent > 0.1) {
          // Calculate progress based on scroll position within viewport
          const scrollProgress = Math.max(0, -rect.top) / (rect.height - viewportHeight);
          const progress = Math.min(Math.max(scrollProgress, 0), 1);
          
          // Calculate target rotation
          const newTargetRotation = progress * Math.PI * 2;
          
          // Only update if target changed significantly
          if (Math.abs(targetRotation.current - newTargetRotation) > 0.01) {
            targetRotation.current = newTargetRotation;
            lastRotationRef.current = newTargetRotation;
            
            // Start animation if not already running
            if (!isAnimating.current) {
              isAnimating.current = true;
              rafId.current = requestAnimationFrame(animateRotation);
            }
          }
          
          // Update rotation state
          const rotationComplete = progress >= 0.99;
          if (rotationComplete !== hasCompletedRotationRef.current) {
            setIsRotating(!rotationComplete);
            hasCompletedRotationRef.current = rotationComplete;
          }
        }
      }
    };

    // Initial setup
    const handleResize = () => {
      // Force update on resize to handle viewport changes
      handleScroll();
    };

    // Use both scroll and resize events
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });
    
    // Initial check
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
      }
    };
  }, [animateRotation]);

  // Handle viewport enter/exit
  useEffect(() => {
    if (isInView) {
      // When in view, start the animation
      targetRotation.current = 0;
      currentRotation.current = 0;
      isAnimating.current = true;
      rafId.current = requestAnimationFrame(animateRotation);
      
      // Enable interaction after initial animation
      const timer = setTimeout(() => {
        setIsRotating(false);
      }, 1000);
      
      return () => clearTimeout(timer);
    } else {
      // Cleanup when out of view
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
        rafId.current = null;
      }
      isAnimating.current = false;
    }
    
    return () => {
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
      }
    };
  }, [isInView, animateRotation]);

  return (
    <div 
      ref={containerRef}
      className="relative bg-black w-full"
      style={{
        minHeight: '400vh',
        opacity: isInView ? 1 : 0,
        transition: 'opacity 0.5s ease-in-out',
      }}
      data-in-view={isInView}
    >
      <div 
        className="sticky top-0 h-screen w-full overflow-hidden"
        style={{
          transform: 'translateZ(0)', // Force hardware acceleration
          willChange: 'transform',    // Hint to browser for optimization
          opacity: isInView ? 1 : 0,
          transition: 'opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        <DomeGallery 
          minRadius={900}
          maxRadius={2000}
          fit={0.8}
          externalRotation={externalRotation}
          disableDrag={isRotating}
        />
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <FuzzyText 
            baseIntensity={0.1} 
            hoverIntensity={0.5} 
            enableHover={true}
          >
            CULTURE
          </FuzzyText>
        </div>
        
        {/* Progress indicator */}
        {isRotating && (
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white text-sm opacity-50">
            Scroll to rotate: {Math.round((externalRotation / (Math.PI * 2)) * 100)}%
          </div>
        )}
      </div>
    </div>
  );
};

export default Dome;