"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { TextAnimate } from "../ui/text-animate";
import { TypingAnimation } from "../ui/typing-animation";
interface HeroProps {
  isPlaying: boolean;
  onToggleAudio: () => void;
}

const Hero: React.FC<HeroProps> = ({ isPlaying, onToggleAudio }) => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [videoLoaded, setVideoLoaded] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
    
    const checkIfMobile = (): void => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  const menuItems = [
    { name: "Geography", href: "#geography" },
    { name: "Origins", href: "#origins" },
    { name: "Culture", href: "#culture" },
    { name: "Then vs Now", href: "#then-now" },
    { name: "Tribute", href: "#tribute" },
  ] as const;

  const handleScrollToSection = (id: string): void => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  if (!mounted) {
    return null;
  }

  return (
    <section id="home" className="noisebg"> 
      <header className="flex flex-col h-auto">
        {/* Navbar */}
        <nav className="flex items-center pt-4 sm:pt-6 justify-between px-4 sm:px-8">
          <a href="#home" className="no-underline">
            <h1 className="logo text-[24px] sm:text-[30px] md:text-[35px] lg:text-[40px] xl:text-[45px]">
              MyKolachi
            </h1>
          </a>

          {/* Desktop Navigation */}
          <ul className="hidden lg:flex items-center justify-center gap-6 border-[2px] border-[rgb(236,234,234)] bg-[var(--color-brown)]/90 rounded-full px-4 py-3 mr-10">
            {menuItems.map((item) => (
              <li key={item.name}>
                <a
                  href={item.href}
                  className="px-4 py-2 text-[15px] tracking-wide text-[#F2E9E2] relative overflow-hidden group"
                >
                  <span className="relative z-10 transition-colors duration-300 group-hover:text-[var(--color-brown)]">
                    {item.name}
                  </span>
                  <div className="absolute inset-0 bg-white scale-y-0 origin-bottom transition-transform duration-500 ease-out group-hover:scale-y-100 rounded-full" />
                </a>
              </li>
            ))}
          </ul>

          {/* Mobile Menu & Audio Toggle */}
          <div className="flex items-center gap-2 sm:gap-4">
            <button 
              onClick={onToggleAudio}
              className="text-[var(--color-red)] text-xl sm:text-2xl cursor-pointer p-2 rounded-full hover:bg-gray-100/10 transition-colors"
              aria-label={isPlaying ? "Mute audio" : "Unmute audio"}
              type="button"
            >
              {isPlaying ? (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
                </svg>
              )}
            </button>

            {/* Hamburger Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden text-[var(--color-red)] text-2xl p-2 rounded-full hover:bg-gray-100/10 transition-colors"
              aria-label="Toggle menu"
              type="button"
            >
              {isMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </nav>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="lg:hidden absolute top-[70px] right-4 z-50 bg-[var(--color-brown)]/95 backdrop-blur-sm rounded-2xl border-2 border-[rgb(236,234,234)] shadow-2xl">
            <ul className="flex flex-col py-4">
              {menuItems.map((item) => (
                <li key={item.name}>
                  <a
                    href={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className="block px-6 py-3 text-[15px] tracking-wide text-[#F2E9E2] hover:bg-white/10 transition-colors"
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Hero Section - Fixed height to prevent layout shifts */}
        <div className="relative w-full h-[800px] sm:h-[550px] lg:h-[630px] flex items-center justify-center">
          {/* Media Container */}
          <div className="absolute inset-4 sm:inset-7">
            {/* Static Image - Priority loading with Next.js Image */}
            <div 
              className={`absolute inset-0 w-full h-full transition-opacity duration-700 ${
                !isMobile && videoLoaded ? 'opacity-0 pointer-events-none' : 'opacity-100'
              } z-10`}
            >
              <Image
                src="https://res.cloudinary.com/dja1ghysx/image/upload/v1762964945/4_jxvmje.jpg"
                alt="Karachi skyline"
                fill
                priority
                quality={90}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 95vw, 90vw"
                className="rounded-[12px] border-[12px] border-[var(--color-brown)]/50 object-cover"
              />
            </div>
            
            {/* Video Element - Desktop only, loads after image */}
            {!isMobile && (
              <div className="absolute inset-0 w-full h-full z-0">
                <video
                  ref={videoRef}
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="metadata"
                  onLoadedData={() => {
                    setVideoLoaded(true);
                  }}
                  onError={(e) => {
                    console.error('Video loading error:', e);
                  }}
                  className="w-full h-full rounded-[12px] border-[12px] border-[var(--color-brown)]/50 object-cover"
                >
                  <source 
                    src="https://res.cloudinary.com/dja1ghysx/video/upload/v1762159440/Hero_xm9rwg.mp4" 
                    type="video/mp4" 
                  />
                  Your browser does not support the video tag.
                </video>
              </div>
            )}
            
            {/* Dark overlay */}
            <div className="absolute inset-0 w-full h-full bg-black/30 rounded-[12px] z-20" />
            
            {/* Content wrapper */}
            <div className="relative w-full max-w-[1800px] mx-auto h-full z-30">
              {/* Text Content */}
              <div className="absolute top-[14%] sm:top-[10%] md:top-[13%] left-6 md:left-10 lg:left-16 z-10 text-white max-w-[85%] md:max-w-[80%] text-left">
                {/* Mobile - Static Text (no animation) */}
                
                {/* Desktop - Animated Text */}
               
                  <h2 className="text-[2.1rem] lg:text-[56px] xl:text-[70px] font-bold uppercase tracking-wide drop-shadow-lg leading-[1.1]">
                    <TypingAnimation loop={false}>
                      The Karachi That Lives In Our Hearts :
                    </TypingAnimation>
                  </h2>

                  <div className="mt-3 md:mt-4 text-[22px] lg:text-[28px] w-[95%] sm:w-[90%] md:w-[85%] font-light leading-[1.2] drop-shadow-md">
                    <TextAnimate animation="slideUp" by="word" duration={1}>
                      A journey through the city's origins, culture, and the grace
                      it once held.
                    </TextAnimate>
                  </div>
           
              </div>

              {/* CTA Button */}
              <div className="absolute left-1/2 top-[65%] sm:top-[68%] transform -translate-x-1/2 flex flex-col items-center gap-2 sm:gap-4">
               <button
                onClick={() => {
                  document.getElementById("geography")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="w-[225px] lg:w-[255px] py-3 bg-[var(--color-brown)] text-[20px] lg:text-[24px] text-white font-semibold rounded-full button"
              >
                Explore Karachi
              </button>
                <svg 
                  className="w-8 h-8 text-white animate-bounce mt-2" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 13l-7 7-7-7m14-8l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </header>
    </section>
  );
};

export default Hero; 