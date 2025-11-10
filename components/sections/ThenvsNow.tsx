"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";



type Section = {
  title: string;
  subtitle: string;
  image: string;
  reverse?: boolean;
};

const sections: Section[] = [
  {
    title: "Once Upon a Time",
    subtitle:
      "Karachi was calm and beautiful.\nThe sea sang softly, and people smiled with peace.",
    image: "https://images.pexels.com/photos/301301/pexels-photo-301301.jpeg",
    reverse: false,
  },
  {
    title: "City by the Sea",
    subtitle: "Cool wind touched every street.\nFamilies walked together, happy and free.",
    image: "https://images.pexels.com/photos/163032/pexels-photo-163032.jpeg",
    reverse: true,
  },
  {
    title: "City of Lights",
    subtitle: "Nights were bright and full of life.\nMusic, art, and dreams filled the air.",
    image: "https://images.pexels.com/photos/1236701/pexels-photo-1236701.jpeg",
    reverse: false,
  },
  {
    title: "When Time Changed",
    subtitle: "Slowly, peace turned into noise.\nThe beauty began to fade away.",
    image: "https://images.pexels.com/photos/219164/pexels-photo-219164.jpeg",
    reverse: true,
  },
  {
    title: "The Lost Charm",
    subtitle:
      "Old buildings broke, and streets grew heavy.\nThe city looked tired, yet still tried to shine.",
    image: "https://images.pexels.com/photos/460621/pexels-photo-460621.jpeg",
    reverse: false,
  },
  {
    title: "Hearts That Stayed",
    subtitle: "People didn't give up.\nThey cared, they helped, they rebuilt.",
    image: "https://images.pexels.com/photos/326055/pexels-photo-326055.jpeg",
    reverse: true,
  },
  {
    title: "A New Hope",
    subtitle: "The sun still rises over My Kolachi.\nThe spirit of the city is still alive.",
    image: "https://images.pexels.com/photos/132037/pexels-photo-132037.jpeg",
    reverse: false,
  },
];

export default function ThenVsNowStory() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [lines, setLines] = useState<{path: string, progress: number}[]>([]);
  const [visibleCards, setVisibleCards] = useState<Set<number>>(new Set());
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const svgRef = useRef<SVGSVGElement>(null);

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
    // Wavy line calculation and animation
    const calculateLines = () => {
      if (!containerRef.current) return;

      const texts = containerRef.current.querySelectorAll<HTMLElement>(".story-text");
      const containerRect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const scrollY = window.scrollY;

      const newLines: {path: string, progress: number}[] = [];

      for (let i = 0; i < texts.length - 1; i++) {
        const rect1 = texts[i].getBoundingClientRect();
        const rect2 = texts[i + 1].getBoundingClientRect();

        const x1 = rect1.left + rect1.width / 2 - containerRect.left;
        const y1 = rect1.bottom - containerRect.top;

        const x2 = rect2.left + rect2.width / 2 - containerRect.left;
        const y2 = rect2.top - containerRect.top;

        const cx1 = x1;
        const cy1 = y1 + 80;
        const cx2 = x2;
        const cy2 = y2 - 80;

        const path = `M${x1},${y1} C${cx1},${cy1} ${cx2},${cy2} ${x2},${y2}`;

        // Calculate progress based on scroll position
        const lineStartY = rect1.bottom;
        const lineEndY = rect2.top;
        const lineMidY = (lineStartY + lineEndY) / 2;

        // Calculate how much of the line should be visible
        let progress = 0;
        if (lineMidY < windowHeight + scrollY) {
          const scrollProgress = (windowHeight + scrollY - lineStartY) / (lineEndY - lineStartY);
          progress = Math.min(Math.max(scrollProgress, 0), 1);
        }

        newLines.push({ path, progress });
      }

      setLines(newLines);
    };

    calculateLines();
    window.addEventListener("resize", calculateLines);
    window.addEventListener("scroll", calculateLines);
    
    // Initial calculation after a short delay to ensure layout is ready
    const timer = setTimeout(calculateLines, 100);

    return () => {
      window.removeEventListener("resize", calculateLines);
      window.removeEventListener("scroll", calculateLines);
      clearTimeout(timer);
    };
  }, [visibleCards]);

  return (
    <section
      className="relative py-32 overflow-hidden"
      style={{
        backgroundColor: "#F5F1E8",
        backgroundImage:
          "url('https://www.transparenttextures.com/patterns/old-map.png')",
        backgroundRepeat: "repeat",
      }}
    >
      {/* Vintage corner ornaments */}
      <div className="absolute top-8 left-8 w-32 h-32 opacity-20">
        <svg viewBox="0 0 100 100" className="text-amber-800">
          <path d="M0,0 Q0,50 50,50 Q0,50 0,100" fill="currentColor" />
        </svg>
      </div>
      <div className="absolute top-8 right-8 w-32 h-32 opacity-20 transform rotate-90">
        <svg viewBox="0 0 100 100" className="text-amber-800">
          <path d="M0,0 Q0,50 50,50 Q0,50 0,100" fill="currentColor" />
        </svg>
      </div>

      {/* Main title with vintage styling */}
      <div className="text-center mb-20 relative">
        <div className="inline-block relative">
          <h1 
            className="text-6xl md:text-7xl font-serif text-amber-900 tracking-wider mb-4 relative z-10"
            style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.1)' }}
          >
            My Kolachi
          </h1>
          <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-48 h-1 bg-gradient-to-r from-transparent via-amber-700 to-transparent"></div>
        </div>
        <p className="text-amber-800 text-xl mt-6 font-serif italic">A Tale Through Time</p>
      </div>

      <div ref={containerRef} className="max-w-6xl mx-auto px-6 flex flex-col gap-48 relative">
        {sections.map((sec, index) => (
          <div
            key={index}
            ref={(el) => { cardRefs.current[index] = el; }}
            data-index={index}
            className={`story-card flex flex-col md:flex-row items-center gap-12 transition-all duration-1000 ${
              sec.reverse ? "md:flex-row-reverse" : ""
            } ${
              visibleCards.has(index) 
                ? "opacity-100 translate-y-0" 
                : "opacity-0 translate-y-12"
            }`}
          >
            {/* Text with decorative elements */}
            <div className="md:w-1/2 text-left story-text relative">
              {/* Decorative quote mark */}
              <div className="absolute -left-8 -top-6 text-8xl text-[var(--color-brown)] opacity-60 font-serif">"</div>
              
              <div 
                className="relative z-10 p-8 bg-white/40 backdrop-blur-sm rounded-lg border-2 border-[var(--color-red)]/40 shadow-xl"
                style={{ boxShadow: '8px 8px 0px rgba(180, 83, 9, 0.1)' }}
              >
                <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-[var(--color-brown)]"></div>
                <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-[var(--color-brown)]"></div>
                <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-[var(--color-brown)]"></div>
                <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-[var(--color-brown)]"></div>
                
                <h2 
                  className="text-4xl font-serif font-bold text-amber-900 mb-6 relative"
                  style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.1)' }}
                >
                  {sec.title}
                  <div className="absolute -bottom-2 left-0 w-16 h-0.5 bg-amber-700"></div>
                </h2>
                <p className="text-amber-800 text-lg leading-relaxed font-serif whitespace-pre-line">
                  {sec.subtitle}
                </p>
              </div>
            </div>

            {/* Image with vintage photo styling */}
            <div className="md:w-1/2 relative group">
              {/* Tape effect */}
              <div 
                className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-24 h-8 bg-amber-100 opacity-70 z-20 rotate-2"
                style={{ boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}
              ></div>
              
              <div 
                className="relative transform transition-transform duration-500 hover:scale-105"
                style={{ 
                  transform: sec.reverse ? 'rotate(-2deg)' : 'rotate(2deg)',
                }}
              >
                {/* Photo frame */}
                <div 
                  className="p-4 bg-white rounded-sm shadow-2xl"
                  style={{ 
                    boxShadow: '0 20px 60px rgba(0,0,0,0.3), inset 0 0 20px rgba(0,0,0,0.05)',
                  }}
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={sec.image}
                      alt={sec.title}
                      className="object-cover w-full h-96"
                      style={{
                        filter: 'sepia(60%) contrast(1.1) brightness(0.95) saturate(0.8)',
                      }}
                    />
                    {/* Vintage photo overlay */}
                    <div className="absolute inset-0 bg-gradient-to-b from-amber-50/20 to-transparent mix-blend-overlay"></div>
                    <div className="absolute inset-0 bg-noise opacity-10"></div>
                  </div>
                  
                  {/* Photo caption */}
                  <div className="mt-3 text-center">
                    <p className="text-sm text-amber-800 font-serif italic">Chapter {index + 1}</p>
                  </div>
                </div>

                {/* Corner pins */}
                <div className="absolute -top-2 -left-2 w-4 h-4 bg-[var(--color-brown)] rounded-full shadow-lg z-30"></div>
                <div className="absolute -top-2 -right-2 w-4 h-4 bg-[var(--color-brown)] rounded-full shadow-lg z-30"></div>
              </div>
            </div>
          </div>
        ))}

        {/* Enhanced wavy dotted lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {lines.map((d, i) => (
            <g key={i}>
              <path
                d={d.path}
                stroke="#C2410C"
                strokeWidth="2"
                strokeDasharray="10 10"
                fill="transparent"
                opacity="0.3"
              />
              <path
                d={d.path}
                stroke="#D97706"
                strokeWidth="1"
                strokeDasharray="10 10"
                fill="transparent"
                opacity="0.5"
                strokeDashoffset="5"
              />
            </g>
          ))}
        </svg>
      </div>

      {/* Bottom decorative element */}
      <div className="text-center mt-32">
        <div className="inline-flex items-center gap-4">
          <div className="w-32 h-px bg-gradient-to-r from-transparent to-amber-700"></div>
          <div className="text-amber-800 text-2xl">✦</div>
          <div className="w-32 h-px bg-gradient-to-l from-transparent to-amber-700"></div>
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