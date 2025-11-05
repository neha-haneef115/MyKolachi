import { useEffect, useRef, useState } from 'react';
import GlobeToKarachiMap from '@/components/GlobeToKarachiMap';

export default function GeographySection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const [key, setKey] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          // Update key to force remount when becoming visible
          setKey(prev => prev + 1);
        } else {
          setIsVisible(false);
        }
      },
      {
        threshold: 0.1, // Trigger when 10% of the section is visible
        rootMargin: '0px 0px -50% 0px', // Trigger when the top of the section is in view
      }
    );

    const currentRef = sectionRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  return (
    <section 
      id="geography" 
      ref={sectionRef}
      className="relative w-full h-screen bg-black "
    >
      {isVisible && <GlobeToKarachiMap key={key} />}
     
    </section>
  );
}