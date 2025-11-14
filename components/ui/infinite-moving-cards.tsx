"use client";

import { cn } from "@/lib/utils";
import React, { useEffect, useState } from "react";
import { motion, useDragControls } from "framer-motion";
import styles from "./scrollbar.module.css";

export const InfiniteMovingCards = ({
  items,
  direction = "left",
  speed = "fast",
  pauseOnHover = true,
  className,
  onItemClick,
}: {
  items: {
    quote: string;
    name: string;
    title: string;
  }[];
  onItemClick?: (item: { quote: string; name: string; title: string }) => void;
  direction?: "left" | "right";
  speed?: "fast" | "normal" | "slow";
  pauseOnHover?: boolean;
  className?: string;
}) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const scrollerRef = React.useRef<HTMLUListElement>(null);
  const dragControls = useDragControls();
  const [isDragging, setIsDragging] = useState(false);
  const [start, setStart] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [dragStartX, setDragStartX] = useState(0);
  const [scrollLeftStart, setScrollLeftStart] = useState(0);
  const [isShiftPressed, setIsShiftPressed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isTouching, setIsTouching] = useState(false);

  // Detect mobile device
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  useEffect(() => {
    addAnimation();

    const handleTouchStart = () => {
      if (isMobile) {
        setIsTouching(true);
      }
    };

    const handleTouchEnd = () => {
      if (isMobile) {
        // Small delay before re-enabling auto-scroll to prevent jank
        const timer = setTimeout(() => {
          setIsTouching(false);
        }, 300);
        return () => clearTimeout(timer);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Shift') {
        setIsShiftPressed(true);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'Shift') {
        setIsShiftPressed(false);
      }
    };

    const handleWheel = (e: WheelEvent) => {
      if (isShiftPressed && scrollerRef.current) {
        e.preventDefault();
        scrollerRef.current.scrollLeft += e.deltaY;
      }
    };

    const scroller = scrollerRef.current;
    if (scroller) {
      scroller.addEventListener('wheel', handleWheel, { passive: false });
    }

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    // Add touch event listeners for mobile
    if (scroller) {
      scroller.addEventListener('touchstart', handleTouchStart, { passive: true });
      scroller.addEventListener('touchend', handleTouchEnd, { passive: true });
    }

    return () => {
      if (scroller) {
        scroller.removeEventListener('wheel', handleWheel);
        scroller.removeEventListener('touchstart', handleTouchStart);
        scroller.removeEventListener('touchend', handleTouchEnd);
      }
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [isShiftPressed, isMobile]);
  function addAnimation() {
    if (containerRef.current && scrollerRef.current) {
      const scrollerContent = Array.from(scrollerRef.current.children);

      scrollerContent.forEach((item) => {
        const duplicatedItem = item.cloneNode(true);
        if (scrollerRef.current) {
          scrollerRef.current.appendChild(duplicatedItem);
        }
      });

      getDirection();
      getSpeed();
      setStart(true);
    }
  }
  const getDirection = () => {
    if (containerRef.current) {
      if (direction === "left") {
        containerRef.current.style.setProperty(
          "--animation-direction",
          "forwards",
        );
      } else {
        containerRef.current.style.setProperty(
          "--animation-direction",
          "reverse",
        );
      }
    }
  };
  const getSpeed = () => {
    if (containerRef.current) {
      if (speed === "fast") {
        containerRef.current.style.setProperty("--animation-duration", "20s");
      } else if (speed === "normal") {
        containerRef.current.style.setProperty("--animation-duration", "40s");
      } else {
        containerRef.current.style.setProperty("--animation-duration", "80s");
      }
    }
  };
  return (
    <div
      ref={containerRef}
      className={cn(
        "scroller relative z-20 w-full overflow-hidden select-none",
        className,
      )}
    >
      <motion.ul
        ref={scrollerRef}
        drag="x"
        dragControls={dragControls}
        dragConstraints={containerRef}
        dragElastic={0.1}
        onDragStart={(e, info) => {
          setIsDragging(true);
          setHoveredCard(null);
          if (isMobile) {
            setIsTouching(true);
          }
          setDragStartX(info.point.x);
          if (scrollerRef.current) {
            setScrollLeftStart(scrollerRef.current.scrollLeft);
          }
        }}
        onDragEnd={() => {
          setIsDragging(false);
          if (isMobile) {
            const timer = setTimeout(() => {
              setIsTouching(false);
            }, 300);
            return () => clearTimeout(timer);
          }
        }}
        className={cn(
          "flex w-max min-w-full shrink-0 flex-nowrap gap-4 py-4 cursor-grab active:cursor-grabbing",
          start && !isDragging && !isTouching && "animate-scroll",
          (pauseOnHover || isTouching) && "hover:[animation-play-state:paused]",
          isShiftPressed && "cursor-ew-resize"
        )}
        style={{
          userSelect: 'none',
          WebkitUserSelect: 'none',
          WebkitTouchCallout: 'none',
        }}
      >
        {items.map((item, idx) => (
          <motion.li
            className="w-[380px] h-[305px] flex-shrink-0 rounded-2xl p-8 shadow-2xl border border-white/15 backdrop-blur-md bg-white/10 flex flex-col cursor-pointer"
            key={item.name}
            onHoverStart={() => !isDragging && setHoveredCard(item.name)}
            onHoverEnd={() => setHoveredCard(null)}
            onClick={() => onItemClick && onItemClick(item)}
            whileTap={{ scale: 0.98 }}
            animate={{
              y: hoveredCard === item.name && !isDragging ? -3 : 0,
              boxShadow: hoveredCard === item.name && !isDragging 
                ? '0 25px 50px -12px rgba(0, 0, 0, 0.25)' 
                : '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              borderColor: hoveredCard === item.name && !isDragging 
                ? 'rgba(255, 255, 255, 0.3)' 
                : 'rgba(255, 255, 255, 0.15)',
              transition: { 
                type: "spring", 
                stiffness: 300,
                damping: 20
              }
            }}
          >
            <div className="mb-6">
              <svg
                className="w-10 h-10 text-[#943204] opacity-80"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
              </svg>
            </div>
            <div className={`flex-1 overflow-y-auto pr-2 mb-6 ${styles.customScrollbar}`}>
              <p className="text-white text-lg leading-relaxed font-medium">
                "{item.quote}"
              </p>
            </div>
            <div className="mt-auto pt-4 border-t border-white/10">
              <p className="font-bold text-[#943204] text-lg truncate">{item.name}</p>
              <p className="text-gray-400 text-sm truncate">{item.title}</p>
            </div>
          </motion.li>
        ))}
      </motion.ul>
    </div>
  );
};
