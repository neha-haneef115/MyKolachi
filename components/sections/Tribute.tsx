"use client";
import React, { useEffect, useState, useRef } from "react";
import { motion, useInView, easeInOut } from "framer-motion";
import { cn } from "@/lib/utils";
import { ShimmerButton } from "@/components/ui/shimmer-button"

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
  },
  {
    quote: "The energy of Karachi is contagious - it's a city that inspires you to dream bigger.",
    name: "Zainab Ali",
    title: "Entrepreneur"
  },
  {
    quote: "Sunset at Clifton beach is one of the most beautiful sights you'll ever witness.",
    name: "Bilal Ahmed",
    title: "Photographer"
  },
  {
    quote: "Karachi's street food is a culinary adventure you don't want to miss.",
    name: "Hina Shah",
    title: "Food Critic"
  }
];

interface InfiniteMovingCardsProps {
  items: Testimonial[];
  speed?: "slow" | "normal" | "fast";
  direction?: "left" | "right";
  rowIndex?: number;
}

const InfiniteMovingCards: React.FC<InfiniteMovingCardsProps> = ({
  items,
  speed = "slow",
  direction = "left",
  rowIndex = 0
}) => {
  const [position, setPosition] = useState<number>(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const speedMap: Record<string, number> = { slow: 40, normal: 25, fast: 15 };
  const duration: number = speedMap[speed];

  useEffect(() => {
    if (isPaused || isDragging) return;

    const interval = setInterval(() => {
      setPosition((prev) => direction === "left" ? prev - 1 : prev + 1);
    }, duration);
    return () => clearInterval(interval);
  }, [duration, isPaused, isDragging, direction]);

  const duplicatedItems: Testimonial[] = [...items, ...items, ...items];

  // Draggable functionality
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setIsPaused(true);
    setStartX(e.clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;

    const deltaX = e.clientX - startX;
    setPosition(prev => prev + deltaX * 2);
    setStartX(e.clientX);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setTimeout(() => setIsPaused(false), 1000);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setIsPaused(true);
    setStartX(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;

    const deltaX = e.touches[0].clientX - startX;
    setPosition(prev => prev + deltaX * 2);
    setStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    setTimeout(() => setIsPaused(false), 1000);
  };

  return (
    <div
      ref={containerRef}
      className="overflow-hidden relative"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => !isDragging && setIsPaused(false)}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{
        cursor: isDragging ? 'grabbing' : 'grab'
      }}
    >
      <div
        className="flex gap-6"
        style={{
          transform: `translateX(${position}px)`,
          width: "fit-content",
          transition: isDragging ? 'none' : 'transform 0.1s linear'
        }}
        onTransitionEnd={() => {
          if (Math.abs(position) >= (items.length * 400)) {
            setPosition(0);
          }
        }}
      >
        {duplicatedItems.map((item: Testimonial, idx: number) => (
          <motion.div
            key={`${rowIndex}-${idx}`}
            className="w-[380px] flex-shrink-0 bg-white  rounded-2xl p-8 shadow-xl border border-[#943204]/10"
            whileHover={{
              scale: isDragging ? 1 : 1.02,
              y: isDragging ? 0 : -3,
              transition: { type: "spring", stiffness: 300 }
            }}
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
          </motion.div>
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
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [isSharing, setIsSharing] = useState(false);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: [0.6, 0.0, 0.1, 0.9],
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
        ease: [0.6, 0.0, 0.1, 0.9]
      }
    }
  };

  const stats: Stat[] = [
    { number: "16M+", label: "Population" },
    { number: "3,780", label: "Area (km²)" },
    { number: "1729", label: "Year Founded" },
    { number: "#1", label: "Largest City" }
  ];

  const floatingVariants = {
    floating: {
      y: [-10, 10, -10],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut",
        repeatType: "reverse" as const
      }
    }
  } as const;

  // Enhanced WhatsApp Share Function
  const shareOnWhatsApp = async () => {
    setIsSharing(true);

    // Get a random testimonial for sharing
    const randomTestimonial = testimonials[Math.floor(Math.random() * testimonials.length)];

    const message = `🌟 *Voices of Karachi* 🌟

"${randomTestimonial.quote}"

- *${randomTestimonial.name}*, ${randomTestimonial.title}

🏙️ *Karachi at a Glance:*
• Population: 16M+
• Area: 3,780 km²
• Founded: 1729
• Pakistan's Largest City

Share your own Karachi story with us! What makes Karachi special to you? 💫

#VoicesOfKarachi #CityOfLights`;

    const url = `https://wa.me/?text=${encodeURIComponent(message)}`;

    // Add a small delay for better UX
    await new Promise(resolve => setTimeout(resolve, 500));

    window.open(url, '_blank');
    setIsSharing(false);
  };

  return (
    <section ref={ref} className="relative py-24 overflow-hidden bg-white dark:bg-black">
    
      <div
        className={cn(
          "absolute inset-0",
          "[background-size:40px_40px]",
          "[background-image:linear-gradient(to_right,#e4e4e7_1px,transparent_1px),linear-gradient(to_bottom,#e4e4e7_1px,transparent_1px)]",
          "dark:[background-image:linear-gradient(to_right,#262626_1px,transparent_1px),linear-gradient(to_bottom,#262626_1px,transparent_1px)]"
        )}
      />

      {/* Radial gradient overlay */}
 <div className="w-full relative z-10 mb-8">
        <div className="flex justify-center">
          <ShimmerButton className="shadow-xl px-8 py-3 text-6xl">
            <span className="text-center font-sans font-medium tracking-tight text-white">
          Voice Of Karachi
            </span>
          </ShimmerButton>
        </div>
      </div>



     
      
      {/* Dual Row Testimonials */}
      <div className="relative z-10">
        <motion.div
          className="space-y-4"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* Enhanced Gradient Overlays */}


          {/* First Row */}
          <div className="relative py-1">
            <InfiniteMovingCards
              items={testimonials.slice(0, 4)}
              speed="slow"
              direction="left"
              rowIndex={0}
            />
          </div>

          {/* Second Row */}
          <div className="relative py-1">
            <InfiniteMovingCards
              items={testimonials.slice(4)}
              speed="normal"
              direction="right"
              rowIndex={1}
            />
          </div>
        </motion.div>



        {/* Single Enhanced Share Button */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >


         

        
        </motion.div>
      </div>
    </section>
  );
}