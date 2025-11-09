"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface Testimonial {
  quote: string;
  name: string;
  title: string;
}

const testimonials: Testimonial[] = [
  {
    quote: "Karachi is the city of lights, where dreams come alive and the heart of Pakistan beats the strongest.",
    name: "Ahmed Khan",
    title: "Lifelong Resident"
  },
  {
    quote: "The food, the culture, the people - everything about Karachi is vibrant and full of life.",
    name: "Sara Ahmed",
    title: "Food Blogger"
  },
  {
    quote: "From the beaches to the bazaars, Karachi offers a unique blend of tradition and modernity.",
    name: "Ali Raza",
    title: "Travel Enthusiast"
  },
  {
    quote: "The city that never sleeps, where every street has a story to tell.",
    name: "Fatima Malik",
    title: "Local Historian"
  },
  {
    quote: "Karachi's diversity is its strength - a true melting pot of cultures and traditions.",
    name: "Omar Shah",
    title: "Cultural Expert"
  }
];

interface InfiniteMovingCardsProps {
  items: Testimonial[];
  speed?: "slow" | "normal" | "fast";
}

const InfiniteMovingCards: React.FC<InfiniteMovingCardsProps> = ({ items, speed = "slow" }) => {
  const [position, setPosition] = useState<number>(0);
  const speedMap: Record<string, number> = { slow: 30, normal: 20, fast: 10 };
  const duration: number = speedMap[speed];

  useEffect(() => {
    const interval = setInterval(() => {
      setPosition((prev) => prev - 1);
    }, duration);
    return () => clearInterval(interval);
  }, [duration]);

  const duplicatedItems: Testimonial[] = [...items, ...items, ...items];

  return (
    <div className="overflow-hidden relative">
      <div
        className="flex gap-6"
        style={{
          transform: `translateX(${position}px)`,
          width: "fit-content"
        }}
        onTransitionEnd={() => {
          if (Math.abs(position) >= (items.length * 400)) {
            setPosition(0);
          }
        }}
      >
        {duplicatedItems.map((item: Testimonial, idx: number) => (
          <div
            key={idx}
            className="w-[380px] flex-shrink-0 bg-gradient-to-br from-white to-[#fef5ed] rounded-2xl p-8 shadow-xl border border-[#943204]/10 hover:shadow-2xl hover:scale-105 transition-all duration-300 backdrop-blur-sm"
          >
            <div className="mb-6">
              <svg className="w-12 h-12 text-[#943204]/20" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
              </svg>
            </div>
            <p className="text-[#943204] text-lg leading-relaxed mb-6 font-medium">
              "{item.quote}"
            </p>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#943204] to-[#c14818] flex items-center justify-center text-white font-bold text-lg shadow-lg">
                {item.name.charAt(0)}
              </div>
              <div>
                <p className="font-bold text-[#943204] text-lg">{item.name}</p>
                <p className="text-[#943204]/60 text-sm">{item.title}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

interface Stat {
  number: string;
  label: string;
}

export const Tribute: React.FC = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: [0.6, 0.0, 0.1, 0.9] as [number, number, number, number],
        staggerChildren: 0.2,
        when: "beforeChildren"
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.6, 0.0, 0.1, 0.9] as [number, number, number, number]
      }
    }
  };

  const stats: Stat[] = [
    { number: "16M+", label: "Population" },
    { number: "3,780", label: "Area (km²)" },
    { number: "1729", label: "Year Founded" },
    { number: "#1", label: "Largest City" }
  ];

  return (
    <section className="relative py-24 bg-gradient-to-br from-[#e6c5ac] via-[#f0d4bc] to-[#e6c5ac] overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-10 w-72 h-72 bg-[#943204]/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#943204]/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#94320405_1px,transparent_1px),linear-gradient(to_bottom,#94320405_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative z-10">
        <motion.div 
          className="text-center mb-20"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
        >
          <motion.div variants={itemVariants} className="inline-block mb-4">
            <span className="px-6 py-2 bg-white/50 backdrop-blur-sm rounded-full text-[#943204] font-semibold text-sm border border-[#943204]/20 shadow-lg">
               Testimonials
            </span>
          </motion.div>
          
          <motion.h2 
            variants={itemVariants}
            className="text-5xl md:text-7xl font-bold text-[#943204] mb-6 bg-clip-text text-transparent bg-gradient-to-r from-[#943204] to-[#c14818]"
          >
            Voices of Karachi
          </motion.h2>
          
          <motion.p 
            variants={itemVariants}
            className="text-xl text-[#943204]/80 max-w-2xl mx-auto leading-relaxed"
          >
            Hear what people say about the city that never sleeps
          </motion.p>

          {/* Decorative Line */}
          <motion.div 
            variants={itemVariants}
            className="flex items-center justify-center gap-4 mt-8"
          >
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-[#943204]/30"></div>
            <div className="w-2 h-2 rounded-full bg-[#943204]"></div>
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-[#943204]/30"></div>
          </motion.div>
        </motion.div>
        
        <motion.div 
          className="relative"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* Gradient Overlays for Fade Effect */}
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#e6c5ac] to-transparent z-10 pointer-events-none"></div>
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#e6c5ac] to-transparent z-10 pointer-events-none"></div>
          
          <div className="relative py-8">
            <InfiniteMovingCards
              items={testimonials}
              speed="slow"
            />
          </div>
        </motion.div>

        {/* Stats Section */}
        <motion.div 
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
        >
          {stats.map((stat: Stat, idx: number) => (
            <motion.div
              key={idx}
              variants={itemVariants}
              className="text-center p-6 bg-white/40 backdrop-blur-sm rounded-2xl border border-[#943204]/10 hover:bg-white/60 transition-all duration-300 hover:scale-105 shadow-lg"
            >
              <p className="text-4xl md:text-5xl font-bold text-[#943204] mb-2">{stat.number}</p>
              <p className="text-[#943204]/70 font-medium">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}