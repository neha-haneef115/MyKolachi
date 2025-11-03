// components/Hero.tsx
import React from 'react';
import { TypingAnimation } from "@/components/ui/typing-animation"
import { TextAnimate } from "@/components/ui/text-animate"
import { MdDarkMode } from "react-icons/md";
const Hero: React.FC = () => {
  return (
    <div>
    <header className="px-10 flex flex-col">

      <nav className="flex items-center justify-between px-8 py-4 bg-beige-100">
        <h1 className="logo">MyKolachi</h1>
       <ul
  className="flex items-center justify-center gap-10 
  bg-[#72433033] backdrop-blur-sm rounded-full "
>
  {[
    "Home",
    "Geography",
    "Origins",
    "Culture",
    "People",
    "Then & Now",
  ].map((item) => (
    <li
      key={item}
      className="px-6 py-2 rounded-full text-[15px] tracking-wide 
      text-[#F2E9E2] hover:bg-[#F2E9E233] 
      transition-all duration-300 cursor-pointer"
    >
      {item}
    </li>
  ))}
</ul>

        <span className="text-orange-500 text-2xl"><MdDarkMode /></span> {/* Sun icon – replace with SVG if needed */}
      </nav>

      {/* Hero Section with Video Background */}
      <div className="relative flex-grow flex items-center justify-center ">
        {/* Video Background */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute top-0 rounded-[12.5px] border-[20.78px] border-[#72433033] w-[1219px] h-[672px] object-cover mx-auto" // Adjust brightness for overlay readability
          src="videos/Hero.mp4" // Example Karachi cityscape video – replace with your HD source
        >
          
        </video>

        {/* Overlay Content */}
        <div className="relative z-10 text-left text-white px-8 max-w-[800px] mx-auto">
          <h2 className="text-[66px] italic font-bold uppercase leading-[1.2] drop-shadow-lg">
          <TypingAnimation loop={true}>The Karachi That Lives In Our Hearts:</TypingAnimation>  
          </h2>
          <div className="text-[35px] mt-90 leading-[1.2]">
          <TextAnimate animation="slideUp" by="word" duration={1}>
     A journey through the city&apos;s origins, culture, and the grace it once held.
    </TextAnimate>  
          </div>
          <button className="mt-8 p-24 bg-[var(--color-red)] text-[23px] font-semibold rounded-full hover:bg-red-600 transition flex items-center justify-center mx-auto">
            Explore Karachi
            
          </button>
        </div>

      
       
      </div>
    </header>
    </div>
  );
};

export default Hero;