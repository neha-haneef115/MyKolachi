"use client";
import React from "react";
import { TypingAnimation } from "@/components/ui/typing-animation";
import { TextAnimate } from "@/components/ui/text-animate";
import { FaVolumeUp, FaVolumeMute } from "react-icons/fa";
import { HiChevronDoubleDown } from "react-icons/hi";

interface HeroProps {
  isPlaying: boolean;
  onToggleAudio: () => void;
}

const Hero: React.FC<HeroProps> = ({ isPlaying, onToggleAudio }) => {

  return (
<section id="home" className="noisebg"> 
    <header className="flex flex-col">
      {/* Navbar */}
      <nav className="flex items-center py-6 justify-between px-6 md:px-10 py-1">
        <a href="#home" className="no-underline">
          <h1 className="logo">
            MyKolachi
          </h1>
        </a>
<ul className="hidden md:flex items-center justify-center gap-6 border-[2px] border-[rgb(236,234,234)] bg-[var(--color-brown)]/90 rounded-full px-4 py-3 mr-10">
  {[
    
    { name: "Geography", href: "#geography" },
    { name: "Origins", href: "#origins" },
    { name: "Culture", href: "#culture" },
    { name: "Then vs Now", href: "#then-now" },
    { name: "Tribute", href: "#tribute" },
  ].map((item) => (
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


        <button 
          onClick={onToggleAudio}
          className="text-[var(--color-red)] text-2xl cursor-pointer p-2 rounded-full hover:bg-gray-100/10 transition-colors"
          aria-label={isPlaying ? "Mute audio" : "Unmute audio"}
        >
          {isPlaying ? <FaVolumeUp /> : <FaVolumeMute />}
        </button>
      </nav>

      {/* Hero Section */}
      <div className="relative flex items-center justify-center px-6 md:px-10">
        {/* Video Container */}
        <div className="relative w-full mx-auto">
          {/* Background Video */}
          <video
            autoPlay
            loop
            muted
            playsInline
            className="rounded-[12px] border-[12px] border-[var(--color-brown)]/50 object-cover w-full h-[600px] mx-auto"
            src="https://res.cloudinary.com/dja1ghysx/video/upload/v1762159440/Hero_xm9rwg.mp4"
          ></video>

          {/* Dark overlay */}
          <div className="absolute top-0 left-0 w-full h-full bg-black/30  rounded-[12px]" />

          {/* Text Content (Left aligned) */}
          <div className="absolute top-[13%] left-10 md:left-16 z-10 text-white max-w-[750px] text-left">
            <h2
              className="text-[2rem] sm:text-[2.5rem] lg:text-[3.5rem] xl:text-[66px]
               font-bold uppercase tracking-wide drop-shadow-lg leading-[1.1]"
            >
              <TypingAnimation loop={false}>
                The Karachi That Lives In Our Hearts :
              </TypingAnimation>
            </h2>

            <div
              className="mt-4 text-[28px] w-[85%]
              font-light leading-[1.2] drop-shadow-md" 
            >
              <TextAnimate animation="slideUp" by="word" duration={1}>
                A journey through the city&apos;s origins, culture, and the grace
                it once held.
              </TextAnimate>
            </div>
          </div>

          {/* Button (Horizontally centered, vertically ~70%) */}
          <div className="absolute tex-white left-1/2 top-[68%] transform -translate-x-1/2 z-10 flex flex-col items-center gap-4">
            <button  onClick={() => {
    document.getElementById("geography")?.scrollIntoView({ behavior: "smooth" });
  }}
              className="px-8 py-3 bg-[var(--color-brown)] text-[18px] sm:text-[20px] text-white
              font-semibold rounded-full button"
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
