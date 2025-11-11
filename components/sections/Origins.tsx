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
  const [isMobile, setIsMobile] = useState(false);
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
      description: 'The capital moved to Islamabad, but Karachi remained the country\'s business center.',
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

  // Check for mobile screen
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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

  // Keep original dimensions for large screens, adjust only for mobile
  const eventWidth = isMobile ? 320 : 360;
  const eventGap = isMobile ? 80 : 100;
  const endPadding = isMobile ? 100 : 5;
  const totalEventWidth = (events.length * (eventWidth + eventGap)) + endPadding;

  useEffect(() => {
    const updateDimensions = () => {
      const viewportWidth = window.innerWidth;
      
      // Large screen: perfect original calculation
      // Mobile: adjusted to show more content on the right
      const startOffset = isMobile ? viewportWidth * 0.08 : viewportWidth / 2 - eventWidth / 2;
      const maxScroll = isMobile 
        ? totalEventWidth - viewportWidth * 0.7  // Show more content on right side
        : totalEventWidth - viewportWidth / 2 - eventWidth / 2 + viewportWidth * 0.1;
      const horizontalOffset = startOffset - (scrollProgress * maxScroll);
      
      setDimensions({
        viewportWidth,
        startOffset,
        maxScroll,
        horizontalOffset,
        totalEventWidth
      });
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, [scrollProgress, totalEventWidth, isMobile]);

  return (
    <section id="origins">
      <div className="min-h-screen" style={{ backgroundColor: '#ddd4c8' }}>
        <div 
          ref={sectionRef}
          className="relative"
          style={{ height: isMobile ? '350vh' : '400vh' }}
        >
          {/* Sticky Container */}
          <div className="sticky top-0 h-screen flex flex-col overflow-hidden">
            {/* Header Section - Large screen perfect, mobile adjusted */}
            <div className="pt-6 lg:pt-10 px-4 lg:px-8 text-left">
              <div className="inline-block text-center">
                <h1 
                  className="text-4xl md:text-5xl lg:text-7xl font-serif mb-2 lg:mb-2"
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
                  className="text-sm md:text-lg lg:text-xl uppercase tracking-widest mb-3 lg:mb-4"
                  style={{ 
                    color: '#c1553d',
                    fontWeight: 500,
                    letterSpacing: '0.15em'
                  }}
                >
                  Timeline History
                </p>

                <div className="flex items-center justify-center gap-3 lg:gap-4">
                  <div style={{ 
                    width: isMobile ? '40px' : '80px', 
                    height: '1.5px', 
                    backgroundColor: '#c1553d' 
                  }}></div>
                  <div 
                    className="text-xs lg:text-sm font-medium"
                    style={{ color: '#8a7a6a', letterSpacing: '0.05em' }}
                  >
                    1729 — Present
                  </div>
                  <div style={{ 
                    width: isMobile ? '40px' : '80px', 
                    height: '1.5px', 
                    backgroundColor: '#c1553d' 
                  }}></div>
                </div>
              </div>
            </div>

            {/* Timeline Container - Large screen perfect, mobile adjusted for content visibility */}
            <div className={`flex-1 pt-4 lg:pt-5 flex items-center w-full overflow-x-visible ${isMobile ? 'px-4' : ''}`} 
                 style={{ paddingRight: isMobile ? '40px' : '200px' }}>
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
                    height: isMobile ? '2px' : '3px',
                    backgroundColor: '#c1553d',
                  }}
                />

                {/* Timeline Events - Large screen layout perfect, mobile content shifted right */}
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
                            width: isMobile ? '12px' : '14px',
                            height: isMobile ? '12px' : '14px',
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
                            height: isMobile ? '45px' : '60px',
                            background: isActive 
                              ? 'repeating-linear-gradient(0deg, #c1553d 0px, #c1553d 6px, transparent 6px, transparent 12px)'
                              : 'repeating-linear-gradient(0deg, #d4c4b0 0px, #d4c4b0 6px, transparent 6px, transparent 12px)',
                            top: event.position === 'top' 
                              ? `calc(50% - ${isMobile ? '45px' : '60px'})` 
                              : '50%',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            opacity: opacity,
                            zIndex: 5
                          }}
                        />

                        {/* Event Content Container - Mobile: content shifted right for better visibility */}
                        <div 
                          className="absolute transition-all duration-700 flex items-center gap-3 lg:gap-4"
                          style={{
                            top: event.position === 'top' 
                              ? `calc(50% - ${isMobile ? '150px' : '195px'})` 
                              : `calc(50% + ${isMobile ? '40px' : '50px'})`,
                            left: isMobile ? '60%' : '50%', // Mobile: shift content right
                            transform: `translateX(${isMobile ? '-10%' : '-50%'}) translateY(${(1 - eventProgress) * 15}px) scale(${scale})`,
                            width: isMobile ? '280px' : '340px',
                            opacity: opacity
                          }}
                        >
                          {/* Text Content - Left Side */}
                          <div className="flex-1 space-y-1 text-left">
                            <div 
                              className={`font-bold ${isMobile ? 'text-xl' : 'text-2xl'}`}
                              style={{ 
                                color: isActive ? '#c1553d' : '#9a8a7a',
                                letterSpacing: '-0.01em',
                                lineHeight: '1.1'
                              }}
                            >
                              {event.year}
                            </div>
                            <div 
                              className={`font-semibold ${isMobile ? 'text-xs' : 'text-sm'}`}
                              style={{ 
                                color: isActive ? '#5a3e2b' : '#8a7a6a',
                                letterSpacing: '0.01em',
                                lineHeight: '1.3'
                              }}
                            >
                              {event.title}
                            </div>
                            <div 
                              className={isMobile ? 'text-xs' : 'text-xs'}
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
                                width: isMobile ? '85px' : '110px',
                                height: isMobile ? '85px' : '110px',
                                backgroundColor: 'var(--color-red)',
                                opacity: isActive ? 1 : 0.3,
                                top: isMobile ? '20px' : '25px',
                                right: isMobile ? '-20px' : '-25px',
                                zIndex: 0
                              }}
                            />
                            
                            {/* Main Image Circle */}
                            <div 
                              className="relative rounded-full overflow-hidden"
                              style={{
                                width: isMobile ? '130px' : '160px',
                                height: isMobile ? '130px' : '160px',
                                backgroundColor: '#8a7a6a',
                                border: isMobile ? '3px solid #fff' : '4px solid #fff',
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
      </div>
    </section>
  );
};

export default KarachiTimeline;