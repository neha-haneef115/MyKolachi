import React, { useState, useEffect, useRef } from 'react';

interface TimelineEvent {
  year: string;
  title: string;
  description: string;
  position: 'top' | 'bottom';
  image: string;
}

const KarachiTimeline = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isMounted, setIsMounted] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const previousVisibility = useRef(false);

 const events: TimelineEvent[] = [
  {
    year: '1729',
    title: 'Kolachi Village',
    description: 'A small fishing settlement founded by Baloch families along the Arabian coast.',
    position: 'top',
    image: '/images/timeline/1.jfif'
  },
  {
    year: '1795',
    title: 'Under Talpur Rule',
    description: 'Karachi grew into a modest trading port during the Talpur era.',
    position: 'bottom',
    image: '/images/timeline/2.jpg'
  },
  {
    year: '1839',
    title: 'British Arrival',
    description: 'British troops took control of Karachi, marking the start of colonial development.',
    position: 'top',
    image: '/images/timeline/3.jpg'
  },
  {
    year: '1869',
    title: 'Trade Expansion',
    description: 'The opening of the Suez Canal turned Karachi into an important seaport for Asia.',
    position: 'bottom',
    image: '/images/timeline/4.png'
  },
  {
    year: '1947',
    title: 'Independence',
    description: 'Karachi became the first capital of Pakistan after independence.',
    position: 'top',
    image: '/images/timeline/5.jpg'
  },
  {
    year: '1960',
    title: 'New Capital Established',
    description: 'The capital moved to Islamabad, but Karachi remained the country’s business center.',
    position: 'bottom',
    image: '/images/timeline/6.jpg'
  },
  {
    year: 'Today',
    title: 'Modern Karachi',
    description: 'A diverse and dynamic city known for its culture, industry, and resilience.',
    position: 'top',
    image: '/images/timeline/7.jpg'
  }
];


  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;

      const rect = sectionRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      
      const currentlyVisible = rect.top <= 0 && rect.bottom > viewportHeight;
      
      if (currentlyVisible && !previousVisibility.current) {
        setScrollProgress(0);
      }
      
      previousVisibility.current = currentlyVisible;

      if (rect.top <= 0 && rect.bottom > viewportHeight) {
        const sectionHeight = rect.height - viewportHeight;
        const scrolled = Math.abs(rect.top);
        const progress = Math.max(0, Math.min(1, scrolled / sectionHeight));
        setScrollProgress(progress);
      } else if (rect.top > 0) {
        setScrollProgress(0);
      } else if (rect.bottom <= viewportHeight) {
        setScrollProgress(1);
      }
    };

    setIsMounted(true);
    
    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const [dimensions, setDimensions] = useState({
    viewportWidth: 1200,
    startOffset: 0,
    maxScroll: 0,
    horizontalOffset: 0,
    totalEventWidth: 0
  });

  const eventWidth = 350;
  const eventGap = 100;
  const totalEventWidth = events.length * (eventWidth + eventGap);

  useEffect(() => {
    // This effect runs only on the client side
    const updateDimensions = () => {
      const viewportWidth = window.innerWidth;
      const startOffset = viewportWidth / 2 - eventWidth / 2;
      const maxScroll = totalEventWidth - viewportWidth / 2 - eventWidth / 2;
      const horizontalOffset = startOffset - (scrollProgress * maxScroll);
      
      setDimensions({
        viewportWidth,
        startOffset,
        maxScroll,
        horizontalOffset,
        totalEventWidth
      });
    };

    // Initial calculation
    updateDimensions();

    // Update on window resize
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, [scrollProgress, totalEventWidth]);

  return (
  <section id="origins">
    <div className="min-h-screen" style={{ backgroundColor: '#ddd4c8' }}>
      <div 
        ref={sectionRef}
        className="relative"
        style={{ height: '400vh' }}
      >
        {/* Sticky Container */}
        <div className="sticky top-0 h-screen flex flex-col overflow-hidden">
          {/* Header Section */}
          <div className="pt-10 px-8 text-left">
  <div className="inline-block text-center">
    <h1 
      className="text-7xl md:text-6xl lg:text-7xl font-serif mb-2"
      style={{ 
        color: '#5a3e2b',
        fontWeight: 600,
        fontFamily: 'Montserrat, serif',
        letterSpacing: '-0.02em',
        lineHeight: '1.1'
      }}
    >
      Origin of Karachi
    </h1>

    <p 
      className="text-lg md:text-xl uppercase tracking-widest mb-4"
      style={{ 
        color: '#c1553d',
        fontWeight: 500,
        letterSpacing: '0.15em'
      }}
    >
      Timeline History
    </p>

    <div className="flex items-center justify-center gap-4">
      <div style={{ width: '80px', height: '1.5px', backgroundColor: '#c1553d' }}></div>
      <div 
        className="text-sm font-medium"
        style={{ color: '#8a7a6a', letterSpacing: '0.05em' }}
      >
        1729 — Present
      </div>
      <div style={{ width: '80px', height: '1.5px', backgroundColor: '#c1553d' }}></div>
    </div>
  </div>
</div>


          {/* Timeline Container - Centered */}
          <div className="flex-1 pt-5 flex items-center w-full overflow-hidden">
            <div 
              className="relative w-full transition-transform duration-500 ease-out"
              style={{
                transform: `translateX(${dimensions.horizontalOffset}px)`,
                visibility: isMounted ? 'visible' : 'hidden',
                willChange: 'transform'
              }}
            >
              {/* Main Horizontal Red Line */}
              <div 
                className="absolute left-0"
                style={{
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: `${dimensions.totalEventWidth + dimensions.viewportWidth}px`,
                  height: '3px',
                  backgroundColor: '#c1553d',
                }}
              />

              {/* Timeline Events */}
              <div className="flex relative" style={{ gap: `${eventGap}px` }}>
                {events.map((event, index) => {
                  const eventStartProgress = index / events.length;
                  const eventEndProgress = (index + 1) / events.length;
                  const eventProgress = Math.max(0, Math.min(1, 
                    (scrollProgress - eventStartProgress) / (eventEndProgress - eventStartProgress)
                  ));
                  const isActive = scrollProgress >= eventStartProgress;
                  const opacity = Math.min(1, eventProgress * 2.5);
                  const scale = 0.92 + (eventProgress * 0.08);

                  return (
                    <div 
                      key={index}
                      className="flex-shrink-0 relative"
                      style={{
                        width: `${eventWidth}px`,
                      }}
                    >
                      {/* Circle Node on Timeline */}
                      <div 
                        className="absolute rounded-full transition-all duration-700"
                        style={{
                          width: '14px',
                          height: '14px',
                          backgroundColor: isActive ? '#c1553d' : '#b8a89a',
                          top: '50%',
                          left: '50%',
                          transform: `translate(-50%, -50%) scale(${0.85 + eventProgress * 0.15})`,
                          zIndex: 10,
                          boxShadow: isActive ? '0 2px 8px rgba(193, 85, 61, 0.4)' : '0 1px 4px rgba(184, 168, 154, 0.3)',
                        }}
                      />

                      {/* Vertical Dashed Line from node to content */}
                      <div 
                        className="absolute transition-all duration-700"
                        style={{
                          width: '2px',
                          height: '60px',
                          background: isActive 
                            ? 'repeating-linear-gradient(0deg, #c1553d 0px, #c1553d 6px, transparent 6px, transparent 12px)'
                            : 'repeating-linear-gradient(0deg, #d4c4b0 0px, #d4c4b0 6px, transparent 6px, transparent 12px)',
                          top: event.position === 'top' ? 'calc(50% - 60px)' : '50%',
                          left: '50%',
                          transform: 'translateX(-50%)',
                          opacity: opacity,
                          zIndex: 5
                        }}
                      />

                      {/* Event Content Container - Horizontal Row */}
                      <div 
                        className="absolute transition-all duration-700 flex items-center gap-4"
                        style={{
                          top: event.position === 'top' ? 'calc(50% - 195px)' : 'calc(50% + 50px)',
                          left: '50%',
                          transform: `translateX(-13%) translateY(${(1 - eventProgress) * 15}px) scale(${scale})`,
                          width: '340px',
                          opacity: opacity
                        }}
                      >
                        {/* Text Content - Left Side */}
                        <div className="flex-1 space-y-1 text-left">
                          <div 
                            className="text-2xl font- font-bold"
                            style={{ 
                              color: isActive ? '#c1553d' : '#9a8a7a',
                              letterSpacing: '-0.01em',
                              lineHeight: '1.1'
                            }}
                          >
                            {event.year}
                          </div>
                          <div 
                            className="text-sm font-semibold"
                            style={{ 
                              color: isActive ? '#5a3e2b' : '#8a7a6a',
                              letterSpacing: '0.01em',
                              lineHeight: '1.3'
                            }}
                          >
                            {event.title}
                          </div>
                          <div 
                            className="text-xs"
                            style={{ 
                              color: isActive ? '#6b5b4b' : '#9a8a7a',
                              lineHeight: '1.4'
                            }}
                          >
                            {event.description}
                          </div>
                        </div>

                        {/* Image Circle - Right Side */}
                        <div className="relative flex-shrink-0">
                          {/* Red Accent Circle Behind */}
                          <div 
                            className="absolute rounded-full transition-all duration-700"
                            style={{
                              width: '110px',
                              height: '110px',
                              backgroundColor: 'var(--color-red)',
                              opacity: isActive ? 1 : 0.3,
                              top: '25px',
                              right: '-25px',
                              zIndex: 0
                            }}
                          />
                          
                          {/* Main Image Circle */}
                          <div 
                            className="relative rounded-full overflow-hidden"
                            style={{
                              width: '160px',
                              height: '160px',
                              backgroundColor: '#8a7a6a',
                              border: '4px solid #fff',
                              boxShadow: '0 6px 16px rgba(0,0,0,0.15)',
                              zIndex: 1,
                            }}
                          >
                            <img 
                              src={event.image} 
                              alt={event.title}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.onerror = null;
                                target.src = '/images/placeholder.jpg';
                              }}
                            />
                          </div>

                        
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

         
        </div>
      </div>

      {/* Next Section */}
    
    </div>
    </section>
  );
};

export default KarachiTimeline;