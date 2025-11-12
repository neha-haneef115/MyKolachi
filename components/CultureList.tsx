'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion, useMotionValue, useTransform } from 'motion/react';

gsap.registerPlugin(ScrollTrigger);

interface CardRotateProps {
  children: React.ReactNode;
  onSendToBack: () => void;
  sensitivity: number;
}

function CardRotate({ children, onSendToBack, sensitivity }: CardRotateProps) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-100, 100], [60, -60]);
  const rotateY = useTransform(x, [-100, 100], [-60, 60]);

  function handleDragEnd(_: never, info: { offset: { x: number; y: number } }) {
    if (Math.abs(info.offset.x) > sensitivity || Math.abs(info.offset.y) > sensitivity) {
      onSendToBack();
    } else {
      x.set(0);
      y.set(0);
    }
  }

  return (
    <motion.div
      className="absolute cursor-grab"
      style={{ x, y, rotateX, rotateY }}
      drag
      dragConstraints={{ top: 0, right: 0, bottom: 0, left: 0 }}
      dragElastic={0.6}
      whileTap={{ cursor: 'grabbing' }}
      onDragEnd={handleDragEnd}
    >
      {children}
    </motion.div>
  );
}

interface StackProps {
  randomRotation?: boolean;
  sensitivity?: number;
  cardDimensions?: { width: number; height: number };
  sendToBackOnClick?: boolean;
  cardsData?: { id: number; img: string }[];
  animationConfig?: { stiffness: number; damping: number };
}

function Stack({
  randomRotation = false,
  sensitivity = 200,
  cardDimensions = { width: 208, height: 208 },
  cardsData = [],
  animationConfig = { stiffness: 120, damping: 25 },
  sendToBackOnClick = false
}: StackProps) {
  const [cards, setCards] = useState(cardsData);

  const sendToBack = (id: number) => {
    setCards(prev => {
      const newCards = [...prev];
      const index = newCards.findIndex(card => card.id === id);
      const [card] = newCards.splice(index, 1);
      newCards.unshift(card);
      return newCards;
    });
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCards(prev => {
        if (prev.length === 0) return prev;
        const newCards = [...prev];
        const lastCard = newCards.pop();
        if (lastCard) {
          newCards.unshift(lastCard);
        }
        return newCards;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="relative"
      style={{
        width: cardDimensions.width,
        height: cardDimensions.height,
        perspective: 600
      }}
    >
      {cards.map((card, index) => {
        const randomRotate = randomRotation ? Math.random() * 10 - 5 : 0;

        return (
          <CardRotate key={card.id} onSendToBack={() => sendToBack(card.id)} sensitivity={sensitivity}>
            <motion.div
              className="rounded-2xl overflow-hidden border-6 border-[#F2E9E2] shadow-2xl"
              onClick={() => sendToBackOnClick && sendToBack(card.id)}
              animate={{
                rotateZ: (cards.length - index - 1) * 4 + randomRotate,
                scale: 1 + index * 0.06 - cards.length * 0.06,
                transformOrigin: '90% 90%'
              }}
              initial={false}
              transition={{
                type: 'spring',
                stiffness: animationConfig.stiffness,
                damping: animationConfig.damping
              }}
              style={{
                width: cardDimensions.width,
                height: cardDimensions.height
              }}
            >
              <img src={card.img} alt={`card-${card.id}`} className="w-full h-full object-cover pointer-events-none" />
            </motion.div>
          </CardRotate>
        );
      })}
    </div>
  );
}

interface CultureItem {
  title: string;
  description: string;
  stats: { label: string; value: string }[];
  highlights: string[];
  images: { id: number; img: string }[];
}

// Unique images for each section
const foodImages = [
  { id: 1, img: "https://i.pinimg.com/1200x/38/b5/7e/38b57e590aeb71f3478db74388f48c49.jpg" },
  { id: 2, img: "https://cdn.shopify.com/s/files/1/0570/2113/6986/files/Shahi_Haleem_Tin_-_Chicken_Haleem_Chicken_Haleem_Can_-_Tin_Packed_-_Net_Weight_800_Grams_Canned_-_Ready_To_Eat_-_Tasty_Food.jpg?v=1661855762" },
  { id: 3, img: "https://ticklethosetastebuds.com/wp-content/uploads/2021/07/1-724x1024.png" },
  { id: 4, img: "https://i.pinimg.com/1200x/8c/4f/01/8c4f018f5be2e7fbfb7a71017244d9d6.jpg" }
];

const peopleImages = [
  { id: 1, img: "https://i.pinimg.com/736x/2b/4f/a7/2b4fa79458a9b359937164adfd70ece8.jpg" },
  { id: 2, img: "https://www.arabnews.com/sites/default/files/styles/n_670_395/public/2024/09/27/4528573-869018640.jpg?itok=v_Mt2aBn" },
  { id: 3, img: "https://i.pinimg.com/originals/f3/01/89/f30189a08d3d6d76d0f6339ba3b26238.jpg" },
  { id: 4, img: "https://i.pinimg.com/736x/d1/02/de/d102de8145cdd05f337ebaa40892f767.jpg" }
];

const festivitiesImages = [
  { id: 1, img: "https://i.pinimg.com/736x/1f/e8/14/1fe814d16bb4927a094d034a569f23ed.jpg" },
  { id: 2, img: "https://www.arabnews.pk/sites/default/files/2023/03/08/3714926-1717315363.jpeg" },
  { id: 3, img: "https://i.pinimg.com/1200x/8d/0e/8e/8d0e8e4f589f3613954a331b12d64fa4.jpg" },
  { id: 4, img: "https://i.pinimg.com/736x/1c/59/e1/1c59e1b61ba0967a2b270438fbd7fafa.jpg" }
];

const artImages = [
  { id: 1, img: "https://i.pinimg.com/1200x/66/96/e8/6696e8d2d9cb1e274321b2eeefc20ecb.jpg" },
  { id: 2, img: "https://tripjive.com/wp-content/uploads/2024/11/street-art-in-Karachis-neighborhoods-1024x585.jpg" },
  { id: 3, img: "https://www.researchgate.net/publication/336105883/figure/fig4/AS:807794341060614@1569604587494/Truck-Art-Karachi-Pakistan.png" },
  { id: 4, img: "https://i.dawn.com/primary/2023/09/650f687e556a6.jpg" }
];

const musicImages = [
  { id: 1, img: "https://aifd.edu.pk/wp-content/gallery/qawali-night-2024/qawali-night-24-large-12.jpg" },
  { id: 2, img: "https://i.tribune.com.pk/media/images/19516-CONCERT_ANUSHAYFURQANx-1384942725/19516-CONCERT_ANUSHAYFURQANx-1384942725.jpg" },
  { id: 3, img: "https://propakistani.pk/lens/wp-content/uploads/2025/05/danceday-13.jpg" },
  { id: 4, img: "https://www.artscouncil.org.pk/wp-content/uploads/2019/12/Celebratiing-Historian-Dr.-Mubarak-Ali-at-Arts-Council-Karachi-1-1024x683.jpg" }
];

const cultureData: CultureItem[] = [
  {
    title: 'Traditional Food',
    description: "From spicy biryani to flavorful nihari, Karachi's cuisine reflects a fusion of cultures and generations. Every dish tells a story of migration, heritage, and taste.",
    stats: [
      { label: 'Cuisines', value: '70+' },
      { label: 'Food Streets', value: '100+' }
    ],
    highlights: ['Biryani Capital', 'Street Food Paradise', 'Fusion Flavors'],
    images: foodImages,
  },
  {
    title: 'People of Karachi',
    description: 'Known for their warmth, resilience, and diversity, the people of Karachi bring unmatched energy to every street and community.',
    stats: [
      { label: 'Population', value: '20M+' },
      { label: 'Languages', value: '20+' }
    ],
    highlights: ['Multilingual', 'Entrepreneurial Spirit', 'Cultural Diversity'],
    images: peopleImages,
  },
  {
    title: 'Festivities',
    description: 'Karachi celebrates every occasion with unmatched enthusiasm. From Eid to Christmas, Diwali to Basant, the city unites in color and joy.',
    stats: [
      { label: 'Annual Events', value: '300+' },
      { label: 'Communities', value: '60+' }
    ],
    highlights: ['Eid Celebrations', 'Cultural Shows', 'Music Festivals'],
    images: festivitiesImages,
  },
  {
    title: 'Art & Architecture',
    description: 'The city showcases colonial-era architecture, modern design, and vibrant street and truck art — a reflection of Karachi\'s layered identity.',
    stats: [
      { label: 'Heritage Sites', value: '40+' },
      { label: 'Art Galleries', value: '50+' }
    ],
    highlights: ['Truck Art', 'Colonial Buildings', 'Modern Museums'],
    images: artImages,
  },
  {
    title: 'Music & Dance',
    description: "Karachi's creative pulse beats through its music — from qawwali and classical performances to rock, hip-hop, and indie sounds.",
    stats: [
      { label: 'Music Venues', value: '80+' },
      { label: 'Artists', value: '2000+' }
    ],
    highlights: ['Qawwali Nights', 'Rock Scene', 'Folk Traditions'],
    images: musicImages,
  },
];

// Counting animation component
const AnimatedCounter = ({ value, label }: { value: string; label: string }) => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const numericValue = parseInt(value.replace('+', '').replace('M', '000000').replace('K', '000'));

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  useEffect(() => {
    if (isVisible) {
      let start = 0;
      const duration = 2000;
      const increment = numericValue / (duration / 16);
      
      const timer = setInterval(() => {
        start += increment;
        if (start >= numericValue) {
          setCount(numericValue);
          clearInterval(timer);
        } else {
          setCount(Math.floor(start));
        }
      }, 16);

      return () => clearInterval(timer);
    }
  }, [isVisible, numericValue]);

  const displayValue = value.includes('M') 
    ? `${(count / 1000000).toFixed(0)}M+`
    : value.includes('K')
    ? `${(count / 1000).toFixed(0)}K+`
    : value.includes('+')
    ? `${count}+`
    : count.toString();

  return (
    <div ref={ref} className="stat-item bg-[#F2E9E2] rounded-xl sm:rounded-2xl px-4 sm:px-6 py-3 sm:py-4 shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
      <div className="text-2xl sm:text-3xl font-bold text-[#c1553d] font-serif" style={{ fontFamily: 'Montserrat, serif' }}>
        {isVisible ? displayValue : '0'}
      </div>
      <div className="text-xs sm:text-sm text-[#8a7a6a] font-medium" style={{ fontFamily: 'var(--font-geist-sans), sans-serif' }}>
        {label}
      </div>
    </div>
  );
};

interface LazyLoadImageProps {
  src: string;
  alt: string;
  className?: string;
}

const LazyLoadImage: React.FC<LazyLoadImageProps> = ({ src, alt, className = '' }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  
  return (
    <img
      src={isLoaded ? src : ''}
      alt={alt}
      className={`${className} ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
      loading="lazy"
      onLoad={() => setIsLoaded(true)}
    />
  );
};

export default function CultureSection() {
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [isMobile, setIsMobile] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024;
      if (mobile !== isMobile) {
        setIsMobile(mobile);
      }
    };
    
    checkMobile();
    
    const handleResize = () => {
      checkMobile();
    };
    
    window.addEventListener('resize', handleResize, { passive: true });
    return () => window.removeEventListener('resize', handleResize);
  }, [isMobile]);
  
  useEffect(() => {
    if (!sectionRef.current) return;
    
    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observerRef.current?.disconnect();
        }
      },
      { rootMargin: '200px' }
    );
    
    observerRef.current.observe(sectionRef.current);
    
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    if (!isVisible) return;
    
    const cleanupFns: (() => void)[] = [];
    
    sectionRefs.current.forEach((el, index) => {
      if (!el) return;
      
      // Only animate elements when they come into view
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !isMobile) {
            const image = entry.target.querySelector('.culture-image');
            const text = entry.target.querySelector('.culture-text');
            const stats = entry.target.querySelectorAll('.stat-item');
            const highlights = entry.target.querySelectorAll('.highlight-item');
            
            // Animate image
            if (image) {
              gsap.fromTo(image,
                { y: 100, opacity: 0 },
                {
                  y: 0,
                  opacity: 1,
                  duration: 1.2,
                  ease: 'power3.out'
                }
              );
            }
            
            // Animate text
            if (text) {
              gsap.fromTo(text,
                { y: 60, opacity: 0 },
                {
                  y: 0,
                  opacity: 1,
                  duration: 1,
                  delay: 0.2,
                  ease: 'power3.out'
                }
              );
            }
            
            // Animate stats
            if (stats.length > 0) {
              gsap.fromTo(stats,
                { scale: 0, opacity: 0 },
                {
                  scale: 1,
                  opacity: 1,
                  duration: 0.6,
                  delay: 0.4,
                  stagger: 0.1,
                  ease: 'back.out(1.7)'
                }
              );
            }
            
            // Animate highlights
            if (highlights.length > 0) {
              gsap.fromTo(highlights,
                { x: -30, opacity: 0 },
                {
                  x: 0,
                  opacity: 1,
                  duration: 0.8,
                  delay: 0.6,
                  stagger: 0.15,
                  ease: 'power2.out'
                }
              );
            }
            
            // Unobserve after animation
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1 });
      
      observer.observe(el);
      cleanupFns.push(() => observer.disconnect());
    });
    
    return () => {
      cleanupFns.forEach(cleanup => cleanup());
    };
  }, [isVisible, isMobile]);

  return (
    <section 
      ref={sectionRef}
      className="py-16 sm:py-20 md:py-28 relative overflow-hidden" 
      id="culture"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage: `
              radial-gradient(circle at 20% 20%, #c1553d 3px, transparent 0),
              radial-gradient(circle at 80% 80%, #c1553d 3px, transparent 0)
            `,
            backgroundSize: '80px 80px',
            backgroundPosition: '0 0, 40px 40px',
          }}
        />
        
        <div 
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage: `
              linear-gradient(45deg, transparent 49%, #c1553d 50%, transparent 51%),
              linear-gradient(135deg, transparent 49%, #c1553d 50%, transparent 51%)
            `,
            backgroundSize: '60px 60px',
          }}
        />
        
        <div 
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage: `radial-gradient(#c1553d 1px, transparent 1px)`,
            backgroundSize: '30px 30px',
          }}
        />

         <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Large circle top right */}
        <div 
          className="absolute rounded-full "
          style={{
            width: '600px',
            height: '600px',
            backgroundColor: 'var(--color-red)',
            top: '-250px',
            right: '-400px',
          }}
        />
        
        {/* Medium circle bottom left */}
        <div 
          className="absolute rounded-full "
          style={{
            width: '600px',
            height: '600px',
            backgroundColor: 'var(--color-red)',
            bottom: '-400px',
            left: '-350px',
          }}
        />
        
        {/* Circle on left side */}
        <div 
          className="absolute rounded-full "
          style={{
            width: '400px',
            height: '400px',
            backgroundColor: 'var(--color-red)',
            top: '30%',
            left: '-250px',
          }}
        />

        {/* Circle on right side */}
        <div 
          className="absolute rounded-full"
          style={{
            width: '350px',
            height: '350px',
            backgroundColor: 'var(--color-red)',
            bottom: '20%',
            right: '-250px',
          }}
        />
        
        {/* Center accent */}
        
      </div>
      </div>

      {/* Content Container */}
      <div className="max-w-[1036px] mx-auto px-4 sm:px-6 relative z-10">
        <div className="flex flex-col gap-16 sm:gap-20 md:gap-22">
          {cultureData.map((item, index) => {
            const cardWidth = isMobile ? 280 : 420;
            const cardHeight = isMobile ? 320 : 480;

            return (
              <div
                key={index}
                ref={el => { sectionRefs.current[index] = el }}
                className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-0"
              >
                {/* Image Container */}
                <div className={`culture-image w-full lg:w-[45%] flex justify-center relative ${
                  index % 2 !== 0 ? 'lg:order-2' : 'lg:order-1 lg:mr-2'
                }`}>
                  <Stack
                    randomRotation={false}
                    sensitivity={180}
                    sendToBackOnClick={false}
                    cardDimensions={{ width: cardWidth, height: cardHeight }}
                    cardsData={item.images}
                  />
                  
                  <div className={`absolute -z-10 w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-r from-[#5a3e2b]/20 to-[#c1553d]/20 blur-lg ${
                    index % 2 === 0 ? '-left-4 -bottom-4' : '-right-4 -bottom-4'
                  }`}></div>
                </div>

                {/* Text Container */}
                <div className={`culture-text w-full lg:w-[60%] text-center lg:text-left px-4 sm:px-0 ${
                  index % 2 !== 0 ? 'lg:order-1 lg:mr-22' : 'lg:order-2 lg:ml-32'
                }`}>
                  <div className="relative">
                    <h3 
                      className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-medium text-[#5a3e2b] mb-3 sm:mb-4 leading-tight font-serif"
                      style={{ fontFamily: 'Montserrat, serif', fontWeight: 700 }}
                    >
                      {item.title}
                    </h3>
                    
                    <p 
                      className="text-[#6b5b4b] text-sm sm:text-base md:text-lg leading-relaxed font-semibold tracking-wide mb-4 sm:mb-6"
                      style={{ fontFamily: 'var(--font-geist-sans), sans-serif' }}
                    >
                      {item.description}
                    </p>

                    {/* Stats */}
                    <div className="flex gap-3 sm:gap-4 mb-4 sm:mb-6 justify-center lg:justify-start flex-wrap">
                      {item.stats.map((stat, i) => (
                        <AnimatedCounter key={i} value={stat.value} label={stat.label} />
                      ))}
                    </div>

                    {/* Highlights */}
                    <div className="space-y-2 mb-4 sm:mb-6">
                      {item.highlights.map((highlight, i) => (
                        <div
                          key={i}
                          className="highlight-item flex items-center gap-2 justify-center lg:justify-start group"
                        >
                          <div className="w-1.5 h-1.5 rounded-full bg-[#c1553d] group-hover:scale-150 transition-transform duration-300"></div>
                          <span 
                            className="text-[#6b5b4b] font-semibold text-sm sm:text-base group-hover:text-[#5a3e2b] transition-colors duration-300"
                            style={{ fontFamily: 'var(--font-geist-sans), sans-serif' }}
                          >
                            {highlight}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Decorative Line */}
                    <div className="mt-4 h-1 w-16 sm:w-24 bg-gradient-to-r from-[#5a3e2b] to-[#c1553d] rounded-full mx-auto lg:mx-0"></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}