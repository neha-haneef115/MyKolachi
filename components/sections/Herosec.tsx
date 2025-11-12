"use client";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { TypingAnimation } from "@/components/ui/typing-animation";
import { TextAnimate } from "@/components/ui/text-animate";
import { FaVolumeUp, FaVolumeMute } from "react-icons/fa";
import { HiChevronDoubleDown } from "react-icons/hi";
import { Menu, X } from "lucide-react";

interface HeroProps {
  isPlaying: boolean;
  onToggleAudio: () => void;
}

const Hero: React.FC<HeroProps> = ({ isPlaying, onToggleAudio }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if the device is mobile
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Set initial value
    checkIfMobile();
    
    // Add event listener for window resize
    window.addEventListener('resize', checkIfMobile);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  const menuItems = [
    { name: "Geography", href: "#geography" },
    { name: "Origins", href: "#origins" },
    { name: "Culture", href: "#culture" },
    { name: "Then vs Now", href: "#then-now" },
    { name: "Tribute", href: "#tribute" },
  ];

  return (
    <section id="home" className="noisebg "> 
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
            >
              {isPlaying ? <FaVolumeUp /> : <FaVolumeMute />}
            </button>

            {/* Hamburger Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden text-[var(--color-red)] text-2xl p-2 rounded-full hover:bg-gray-100/10 transition-colors"
              aria-label="Toggle menu"
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

         {/* Hero Section */}
      <div className="relative flex items-center justify-center px-4 md:px-10 py-5">
        {/* Video Container */}
        <div className="relative w-full mx-auto">
          {/* Background Video */}
          <div className="relative w-full h-full">
            {/* Fallback Image (always present but hidden when video is loaded) */}
            <div className={`absolute inset-0 w-full h-full transition-opacity duration-500 ${videoLoaded ? 'opacity-0' : 'opacity-100'}`}>
              <Image
                src="https://res.cloudinary.com/dja1ghysx/image/upload/v1762964945/4_jxvmje.jpg"
                alt="Karachi skyline"
                fill
                priority
                sizes="100vw"
                className="rounded-[12px] border-[12px] border-[var(--color-brown)]/50 object-cover"
              />
            </div>
            
            {/* Video Element */}
            <video
              ref={videoRef}
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
              onLoadedData={() => setVideoLoaded(true)}
              className={`rounded-[12px] border-[12px] border-[var(--color-brown)]/50 object-cover w-full h-[750px] sm:h-[500px] lg:h-[580px] mx-auto ${videoLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-500`}
              src="https://res.cloudinary.com/dja1ghysx/video/upload/v1762159440/Hero_xm9rwg.mp4"
            />
          </div>

          {/* Dark overlay */}
          <div className="absolute top-0 left-0 w-full h-full bg-black/30  rounded-[12px]" />


            {/* Text Content (Left aligned) */}
            <div className="absolute top-[14%] sm:top-[10%] md:top-[13%] left-6 md:left-10 lg:left-16 z-10 text-white max-w-[85%] md:max-w-[80%] text-left">
              {/* Mobile - Plain Text */}
              <div className="md:hidden">
                <h2 className="text-[2.1rem] font-bold uppercase tracking-wide drop-shadow-lg leading-[1.1]">
                  The Karachi That Lives In Our Hearts :
                </h2>
                <div className="mt-2 text-[22px] w-[95%] font-light leading-[1.2] drop-shadow-md">
                  A journey through the city's origins, culture, and the grace
                  it once held.
                </div>
              </div>

              {/* Desktop - Animated Components */}
              <div className="hidden md:block">
                <h2 className="text-[2.1rem] lg:text-[56px] xl:text-[70px] font-bold uppercase tracking-wide drop-shadow-lg leading-[1.1]">
                  <TypingAnimation loop={false}>
                    The Karachi That Lives In Our Hearts :
                  </TypingAnimation>
                </h2>

                <div className="mt-3 md:mt-4 text-[22px] lg:text-[28px] w-[95%] sm:w-[90%] md:w-[85%] font-light leading-[1.2] drop-shadow-md">
                  <TextAnimate animation="slideUp" by="word" duration={1}>
                    A journey through the city&apos;s origins, culture, and the grace
                    it once held.
                  </TextAnimate>
                </div>
              </div>
            </div>

            {/* Button (Horizontally centered, vertically ~70%) */}
            <div className="absolute left-1/2 top-[65%] sm:top-[68%] transform -translate-x-1/2 z-10 flex flex-col items-center gap-2 sm:gap-4">
              <button
                onClick={() => {
                  document.getElementById("geography")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="w-[225px] lg:w-[255px] py-3 bg-[var(--color-brown)] text-[20px] lg:text-[24px] text-white font-semibold rounded-full button"
              >
                Explore Karachi
              </button>
              <HiChevronDoubleDown className="text-3xl text-white animate-bounce mt-2" />
            </div>
          </div>
        </div>
      </header>
    </section>
  );
};

export default Hero; 