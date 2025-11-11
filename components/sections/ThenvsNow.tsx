"use client";

import { useEffect, useRef, useState } from "react";

type Section = {
  title: string;
  subtitle: string;
  image: string;
  imageDescription: string;
  reverse?: boolean;
};

const sections: Section[] = [
  {
    title: "Once Upon a Time",
    subtitle: "Green gardens swayed along the streets,\nHouses stood proud, calm, and sweet.",
    image: "/images/1.jpg",
    imageDescription: "1940s Karachi",
    reverse: false,
  },
  {
    title: "City by the Sea",
    subtitle: "Wide streets stretched under open skies,\nPalm trees and buildings stood wise.",
    image: "/images/2.jpg",
    imageDescription: "Victoria Road (Abdullah Haroon Rd), Saddar - 1950s",
    reverse: true,
  },
  {
    title: "City Streets",
    subtitle: "Wide roads lined with old buildings tall,\nCars and people moved along them all.",
    image: "/images/3.jpg",
    imageDescription: "II Chundrigar Road - 1962",
    reverse: false,
  },
  {
    title: "Bustling Markets",
    subtitle: "Streets alive with people and cheer,\nGreen trees, bright shops, and vehicles near.",
    image: "/images/4.jpg",
    imageDescription: "Saddar area - 1965",
    reverse: true,
  },
  {
    title: "The Old Charm",
    subtitle: "Buildings stood proud, tall and bright,\nStreets whispered stories in morning light.",
    image: "/images/5.jpg",
    imageDescription: "Mereweather Tower - 1970s",
    reverse: false,
  },
  {
    title: "Hearts That Stayed",
    subtitle: "Wide, clean roads and greenery all around,\nThe city stood peaceful, calm without a sound.",
    image: "/images/6.jpg",
    imageDescription: "Teen Talwar - 1974",
    reverse: true,
  },
  {
    title: "A New Hope",
    subtitle: "Streets are crowded, noisy, and worn,\nTrash and chaos mark the city's morn.\n\nYet the sun rises, bringing a chance to mend,\nThe heart of Karachi will endure and transcend.",
    image: "/images/7.jpg",
    imageDescription: "A visual story of Karachi today",
    reverse: false,
  },
];

export default function ThenVsNowStory() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [lines, setLines] = useState<{path: string, length: number, progress: number}[]>([]);
  const [visibleCards, setVisibleCards] = useState<Set<number>>(new Set());
  const [isMobile, setIsMobile] = useState(false);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const pathRefs = useRef<(SVGPathElement | null)[]>([]);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    // Intersection Observer for fade-in animation
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.getAttribute("data-index") || "0");
            setVisibleCards((prev) => new Set(prev).add(index));
          }
        });
      },
      { threshold: 0.2 }
    );

    cardRefs.current.forEach((card) => {
      if (card) observer.observe(card);
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    // Calculate lines on all screens, but without scroll animation on mobile
    const calculateLines = () => {
      if (!containerRef.current) return;

      const texts = containerRef.current.querySelectorAll<HTMLElement>(".story-text");
      const containerRect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const scrollY = window.scrollY;

      const newLines: {path: string, length: number, progress: number}[] = [];

      for (let i = 0; i < texts.length - 1; i++) {
        const rect1 = texts[i].getBoundingClientRect();
        const rect2 = texts[i + 1].getBoundingClientRect();

        const x1 = rect1.left + rect1.width / 2 - containerRect.left;
        const y1 = rect1.bottom - containerRect.top;

        const x2 = rect2.left + rect2.width / 2 - containerRect.left;
        const y2 = rect2.top - containerRect.top;

        // More aggressive curve for better visibility
        const controlOffset = 150; // Increased for more pronounced curves
        const isEvenIndex = i % 2 === 0; // Use the loop index i instead of undefined index
        const cx1 = x1 + (isEvenIndex ? controlOffset : -controlOffset);
        const cy1 = y1 + 150;
        const cx2 = x2 + (isEvenIndex ? -controlOffset : controlOffset);
        const cy2 = y2 - 150;

        const path = `M${x1},${y1} C${cx1},${cy1} ${cx2},${cy2} ${x2},${y2}`;

        // Get actual path length from the rendered SVG path
        const pathElement = pathRefs.current[i];
        const pathLength = pathElement?.getTotalLength() || 1000;

        // Calculate progress based on scroll position (only on desktop)
        let progress = 1; // Default to fully visible on mobile
        
        if (!isMobile) {
          const lineStartY = rect1.bottom;
          const lineEndY = rect2.top;
          const viewportBottom = scrollY + windowHeight;
          
          if (viewportBottom > lineStartY) {
            const totalLineHeight = lineEndY - lineStartY;
            const scrolledPastStart = viewportBottom - lineStartY;
            progress = Math.min(Math.max(scrolledPastStart / totalLineHeight, 0), 1);
          } else {
            progress = 0;
          }
        }

        newLines.push({ path, length: pathLength, progress });
      }

      setLines(newLines);
    };

    calculateLines();
    window.addEventListener("resize", calculateLines);
    
    if (!isMobile) {
      window.addEventListener("scroll", calculateLines);
    }
    
    // Initial calculation after a short delay to ensure layout is ready
    const timer = setTimeout(calculateLines, 100);

    return () => {
      window.removeEventListener("resize", calculateLines);
      window.removeEventListener("scroll", calculateLines);
      clearTimeout(timer);
    };
  }, [visibleCards, isMobile]);

  return (
    <section
      id="then-now"
      className="relative py-16 sm:py-24 md:py-32 overflow-hidden"
      style={{
        backgroundColor: "#F5F1E8",
        backgroundImage: "url('https://www.transparenttextures.com/patterns/old-map.png')",
        backgroundRepeat: "repeat",
      }}
    >
      {/* Vintage corner ornaments - Hidden on mobile */}
      <div className="hidden md:block absolute top-8 left-8 w-24 lg:w-32 h-24 lg:h-32 opacity-20">
        <svg viewBox="0 0 100 100" className="text-amber-800">
          <path d="M0,0 Q0,50 50,50 Q0,50 0,100" fill="currentColor" />
        </svg>
      </div>
      <div className="hidden md:block absolute top-8 right-8 w-24 lg:w-32 h-24 lg:h-32 opacity-20 transform rotate-90">
        <svg viewBox="0 0 100 100" className="text-amber-800">
          <path d="M0,0 Q0,50 50,50 Q0,50 0,100" fill="currentColor" />
        </svg>
      </div>

      {/* Main title with vintage styling */}
      <div className="text-center mb-12 sm:mb-16 md:mb-20 relative px-4">
        <div className="inline-block relative">
          <h1 
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif text-amber-900 tracking-wider mb-4 relative z-10"
            style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.1)' }}
          >
            Then vs Now
          </h1>
          <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-32 sm:w-40 md:w-48 h-1 bg-gradient-to-r from-transparent via-amber-700 to-transparent"></div>
        </div>
        <p className="text-amber-800 text-base sm:text-lg md:text-xl mt-4 sm:mt-6 font-serif italic">A Tale Through Time</p>
      </div>

      <div ref={containerRef} className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col gap-32 sm:gap-40 md:gap-56 lg:gap-64 relative" style={{ zIndex: 1 }}>
        {sections.map((sec, index) => (
          <div
            key={index}
            ref={(el) => { cardRefs.current[index] = el; }}
            data-index={index}
            className={`story-card flex flex-col md:flex-row items-center gap-8 sm:gap-10 md:gap-12 ${
              sec.reverse ? "md:flex-row-reverse" : ""
            } ${
              isMobile ? "opacity-100 translate-y-0" : (
                visibleCards.has(index) 
                  ? "opacity-100 translate-y-0" 
                  : "opacity-0 translate-y-12"
              )
            } ${isMobile ? "" : "transition-all duration-1000"}`}
          >
            {/* Text with decorative elements */}
            <div className="w-full md:w-1/2 text-left story-text relative">
              {/* Decorative quote mark - Hidden on small mobile */}
              <div className="hidden sm:block absolute -left-4 sm:-left-8 -top-6 sm:-top-10 text-6xl sm:text-8xl text-amber-800 opacity-60 font-serif">"</div>
              
              <div 
                className="relative z-10 p-5 sm:p-6 md:p-8 bg-white/40 backdrop-blur-sm rounded-lg shadow-xl"
                style={{ boxShadow: '8px 8px 0px rgba(180, 83, 9, 0.1)' }}
              >
                {/* Corner decorations */}
                <div className="absolute top-0 left-0 w-4 sm:w-6 h-4 sm:h-6 border-t-2 sm:border-t-4 border-l-2 sm:border-l-4 border-amber-800"></div>
                <div className="absolute top-0 right-0 w-4 sm:w-6 h-4 sm:h-6 border-t-2 sm:border-t-4 border-r-2 sm:border-r-4 border-amber-800"></div>
                <div className="absolute bottom-0 left-0 w-4 sm:w-6 h-4 sm:h-6 border-b-2 sm:border-b-4 border-l-2 sm:border-l-4 border-amber-800"></div>
                <div className="absolute bottom-0 right-0 w-4 sm:w-6 h-4 sm:h-6 border-b-2 sm:border-b-4 border-r-2 sm:border-r-4 border-amber-800"></div>
                
                <h2 
                  className="text-2xl sm:text-3xl md:text-4xl font-bold text-amber-900 mb-4 sm:mb-5 md:mb-6 relative"
                  style={{ 
                    textShadow: '1px 1px 2px rgba(0,0,0,0.1)',
                  }}
                >
                  {sec.title}
                  <div className="absolute -bottom-2 left-0 w-12 sm:w-16 h-0.5 bg-amber-700"></div>
                </h2>
                <p className="text-amber-800 text-base sm:text-lg md:text-lg leading-relaxed font-serif whitespace-pre-line">
                  {sec.subtitle}
                </p>
              </div>
            </div>

            {/* Image with vintage photo styling */}
            <div className="w-full md:w-1/2 relative group">
              {/* Tape effect */}
              <div 
                className="absolute -top-3 sm:-top-4 left-1/2 transform -translate-x-1/2 w-20 sm:w-24 h-6 sm:h-8 bg-amber-100 opacity-70 z-20 rotate-2"
                style={{ boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}
              ></div>
              
              <div 
                className="relative transform transition-transform duration-500 hover:scale-105"
                style={{ 
                  transform: sec.reverse ? 'rotate(-1deg)' : 'rotate(1deg)',
                }}
              >
                {/* Photo frame */}
                <div 
                  className="p-3 sm:p-4 bg-white rounded-sm shadow-2xl"
                  style={{ 
                    boxShadow: '0 20px 60px rgba(0,0,0,0.3), inset 0 0 20px rgba(0,0,0,0.05)',
                  }}
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={sec.image}
                      alt={sec.title}
                      className="object-cover w-full h-64 sm:h-80 md:h-96"
                      style={{
                        filter: 'sepia(60%) contrast(1.1) brightness(0.95) saturate(0.8)',
                      }}
                    />
                    {/* Vintage photo overlay */}
                    <div className="absolute inset-0 bg-gradient-to-b from-amber-50/20 to-transparent mix-blend-overlay"></div>
                    <div className="absolute inset-0 bg-noise opacity-10"></div>
                  </div>
                  
                  {/* Photo caption */}
                  <div className="mt-2 sm:mt-3 text-center">
                    <p className="text-xs sm:text-sm text-amber-800 font-serif italic">{sections[index].imageDescription}</p>
                  </div>
                </div>

                {/* Corner pins */}
                <div className="absolute -top-1.5 sm:-top-2 -left-1.5 sm:-left-2 w-3 sm:w-4 h-3 sm:h-4 bg-amber-800 rounded-full shadow-lg z-30"></div>
                <div className="absolute -top-1.5 sm:-top-2 -right-1.5 sm:-right-2 w-3 sm:w-4 h-3 sm:h-4 bg-amber-800 rounded-full shadow-lg z-30"></div>
              </div>
            </div>
          </div>
        ))}

        {/* Enhanced wavy dotted lines - Behind all content */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible" style={{ zIndex: -1 }}>
          {lines.map((line, i) => {
            const dashOffset = isMobile ? 0 : line.length * (1 - line.progress);

            return (
              <g key={i}>
                {/* Main dotted line */}
                <path
                  ref={(el) => { pathRefs.current[i] = el; }}
                  d={line.path}
                  stroke="#C2410C"
                  strokeWidth="4"
                  strokeDasharray="10 10"
                  strokeDashoffset={dashOffset}
                  fill="transparent"
                  opacity="0.5"
                />
                {/* Secondary dotted line with offset */}
                <path
                  d={line.path}
                  stroke="#D97706"
                  strokeWidth="1"
                  strokeDasharray="10 10"
                  strokeDashoffset={dashOffset - 5}
                  fill="transparent"
                  opacity="0.5"
                  style={{
                    transition: isMobile ? 'none' : 'stroke-dashoffset 0.1s linear'
                  }}
                />
              </g>
            );
          })}
        </svg>
      </div>

      {/* Bottom decorative element */}
      <div className="text-center mt-20 sm:mt-24 md:mt-32 px-4">
        <div className="inline-flex items-center gap-3 sm:gap-4">
          <div className="w-20 sm:w-28 md:w-32 h-px bg-gradient-to-r from-transparent to-amber-700"></div>
          <div className="text-amber-800 text-xl sm:text-2xl">✦</div>
          <div className="w-20 sm:w-28 md:w-32 h-px bg-gradient-to-l from-transparent to-amber-700"></div>
        </div>
      </div>

      <style jsx>{`
        .bg-noise {
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' /%3E%3C/svg%3E");
        }
      `}</style>
    </section>
  );
}