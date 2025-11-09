"use client";
import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { InfiniteMovingCards } from "@/components/ui/infinite-moving-cards";
import { testimonials1, testimonials2 } from "@/data/testimonials";
export const Tribute: React.FC = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      ref={ref}
      className="relative py-24 overflow-hidden bg-black"
    >
       <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundSize: '40px 40px',
          backgroundImage: 'linear-gradient(to right, #cdb8a3 1px, transparent 1px), linear-gradient(to bottom, #cdb8a3 1px, transparent 1px)'
        }}
      />


      {/* Title */}
      <div className="relative z-10 mb-14 flex justify-center">
        <ShimmerButton className="px-10 py-4 shadow-xl">
          <span className="text-center text-5xl font-semibold tracking-tight text-white">
            Voices of Karachi
          </span>
        </ShimmerButton>
      </div>

      {/* Two Rows of Testimonials Moving in Opposite Directions */}
      <div className="relative z-10 space-y-0">
        {/* First Row - Moving Left */}
        <div className="h-[20rem] rounded-md flex flex-col antialiased   items-center justify-center relative overflow-hidden">
      <InfiniteMovingCards
        items={testimonials1}
        direction="right"
        speed="slow"
      />
    </div>
     <div className="h-[20rem] rounded-md flex flex-col antialiased  items-center justify-center relative overflow-hidden">
      <InfiniteMovingCards
        items={testimonials2}
        direction="left"
        speed="slow"
      />
    </div>
      </div>
    </section>
  );
};
