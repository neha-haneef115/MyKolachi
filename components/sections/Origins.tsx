import React, { useState, useEffect, useRef } from 'react';

interface TimelineEvent {
  year: string;
  title: string;
  description: string;
  position: 'top' | 'bottom';
}

const KarachiTimeline = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);
  const previousVisibility = useRef(false);

  const events: TimelineEvent[] = [
    {
      year: '1729',
      title: 'Early Settlement',
      description: 'Formation of the colonies',
      position: 'top'
    },
    {
      year: '1730s',
      title: 'Fishing Village',
      description: 'Great Awakening',
      position: 'bottom'
    },
    {
      year: '1795',
      title: 'Talpur Rule',
      description: 'French-Indian War',
      position: 'top'
    },
    {
      year: '1760s',
      title: 'Trade Expansion',
      description: 'Thomas Paine and others',
      position: 'bottom'
    },
    {
      year: '1839',
      title: 'British Era',
      description: 'Boston Massacre',
      position: 'top'
    },
    {
      year: '1869',
      title: 'Suez Canal',
      description: 'Declaration of Independence',
      position: 'bottom'
    },
    {
      year: '1947',
      title: 'Independence',
      description: 'First capital of Pakistan',
      position: 'top'
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

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const eventWidth = 350;
  const eventGap = 100;
  const totalEventWidth = events.length * (eventWidth + eventGap);
  const viewportWidth = typeof window !== 'undefined' ? window.innerWidth : 1200;
  const startOffset = viewportWidth / 2 - eventWidth / 2;
  const maxScroll = totalEventWidth - viewportWidth / 2 - eventWidth / 2;
  const horizontalOffset = startOffset - (scrollProgress * maxScroll);

  return (
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
      className="text-5xl md:text-6xl lg:text-7xl font-serif mb-2"
      style={{ 
        color: '#5a3e2b',
        fontWeight: 500,
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
          <div className="flex-1 flex items-center w-full overflow-hidden">
            <div 
              className="relative w-full transition-transform duration-500 ease-out"
              style={{
                transform: `translateX(${horizontalOffset}px)`,
                willChange: 'transform'
              }}
            >
              {/* Main Horizontal Red Line */}
              <div 
                className="absolute left-0"
                style={{
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: `${totalEventWidth + viewportWidth}px`,
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
                          top: event.position === 'top' ? 'calc(50% - 180px)' : 'calc(50% + 60px)',
                          left: '50%',
                          transform: `translateX(-13%) translateY(${(1 - eventProgress) * 15}px) scale(${scale})`,
                          width: '340px',
                          opacity: opacity
                        }}
                      >
                        {/* Text Content - Left Side */}
                        <div className="flex-1 space-y-1 text-left">
                          <div 
                            className="text-2xl font-serif font-bold"
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
                            <div 
                              className="w-full h-full flex flex-col items-center justify-center text-white font-medium"
                              style={{ 
                                backgroundColor: '#6b5b4b',
                              }}
                            >
                              <div className="text-xs">Historical</div>
                              <div className="text-xs">Image</div>
                            </div>
                          </div>

                          {/* Decorative Icons */}
                          {index % 3 === 0 && (
                            <div 
                              className="absolute transition-all duration-700"
                              style={{
                                right: '-18px',
                                bottom: '-10px',
                                opacity: isActive ? 0.4 : 0.12,
                                zIndex: 2
                              }}
                            >
                              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                <path d="M3 3L17 17M17 3L3 17" stroke="#c1553d" strokeWidth="1.5"/>
                              </svg>
                            </div>
                          )}
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
  );
};

export default KarachiTimeline;