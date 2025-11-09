"use client";

import { cn } from "@/lib/utils";
import React, { useEffect, useState } from "react";
import { motion, useDragControls } from "framer-motion";

export const InfiniteMovingCards = ({
  items,
  direction = "left",
  speed = "fast",
  pauseOnHover = true,
  className,
}: {
  items: {
    quote: string;
    name: string;
    title: string;
  }[];
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

  useEffect(() => {
    addAnimation();
  }, []);
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
        "scroller relative z-20 max-w-7xl overflow-hidden select-none",
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
          setDragStartX(info.point.x);
          if (scrollerRef.current) {
            setScrollLeftStart(scrollerRef.current.scrollLeft);
          }
        }}
        onDragEnd={() => {
          setIsDragging(false);
        }}
        className={cn(
          "flex w-max min-w-full shrink-0 flex-nowrap gap-4 py-4 cursor-grab active:cursor-grabbing",
          start && !isDragging && "animate-scroll",
          pauseOnHover && "hover:[animation-play-state:paused]",
        )}
        style={{
          userSelect: 'none',
          WebkitUserSelect: 'none',
          WebkitTouchCallout: 'none',
        }}
      >
        {items.map((item, idx) => (
          <motion.li
            className="w-[380px] flex-shrink-0 rounded-2xl p-8 shadow-2xl border border-[rgba(148,50,4,0.2)] backdrop-blur-md bg-white/10"
            key={item.name}
            onHoverStart={() => !isDragging && setHoveredCard(item.name)}
            onHoverEnd={() => setHoveredCard(null)}
            animate={{
              scale: hoveredCard === item.name && !isDragging ? 1.05 : 1,
              y: hoveredCard === item.name && !isDragging ? -5 : 0,
              transition: { type: "spring", stiffness: 250 }
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
            <p className="text-white text-lg leading-relaxed mb-6 font-medium">
              "{item.quote}"
            </p>
            <div>
              <p className="font-bold text-[#943204] text-lg">{item.name}</p>
              <p className="text-gray-400 text-sm">{item.title}</p>
            </div>
          </motion.li>
        ))}
      </motion.ul>
    </div>
  );
};
