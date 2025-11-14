"use client";
import React, { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { InfiniteMovingCards } from "@/components/ui/infinite-moving-cards";
import { testimonials1, testimonials2 } from "@/data/testimonials";

interface Testimonial {
  quote: string;
  name: string;
  title: string;
}

const TestimonialPopup = ({ testimonial, onClose }: { testimonial: Testimonial | null, onClose: () => void }) => {
  if (!testimonial) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
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
          <p className="text-white text-lg leading-relaxed mb-6 whitespace-pre-line">
            "{testimonial.quote}"
          </p>
          <div className="pt-4 border-t border-white/10">
            <p className="font-bold text-[#943204] text-lg">{testimonial.name}</p>
            <p className="text-gray-400 text-sm">{testimonial.title}</p>
          </div>
          <button 
            onClick={onClose}
            className="mt-6 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
          >
            Close
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
export const Tribute: React.FC = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [selectedTestimonial, setSelectedTestimonial] = useState<Testimonial | null>(null);

  return (
    <>
      <section
        ref={ref} 
        id="tribute"
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
        onItemClick={setSelectedTestimonial}
      />
    </div>
     <div className="h-[20rem] rounded-md flex flex-col antialiased  items-center justify-center relative overflow-hidden">
      <InfiniteMovingCards
        items={testimonials2}
        direction="left"
        speed="slow"
        onItemClick={setSelectedTestimonial}
      />
    </div>
      </div>
      </section>
      <TestimonialPopup 
        testimonial={selectedTestimonial} 
        onClose={() => setSelectedTestimonial(null)} 
      />
    </>
  );
};
