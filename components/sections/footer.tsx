"use client";

import React, { useState, useEffect } from "react";
import { FaLinkedin, FaEnvelope, FaWhatsapp } from "react-icons/fa";

export default function Footer() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Define specific hover colors for each icon
  const getIconClasses = (type: 'linkedin' | 'email' | 'whatsapp') => {
    if (!isMounted) return "text-white";
    
    let hoverColor = "hover:text-[#943204]"; // Default color
    
    if (type === 'linkedin') hoverColor = "hover:text-[#0A66C2]"; // LinkedIn blue
    else if (type === 'email') hoverColor = "hover:text-[#EA4335]"; // Gmail red
    else if (type === 'whatsapp') hoverColor = "hover:text-[#25D366]"; // WhatsApp green
    
    return `text-white ${hoverColor} hover:scale-110 transition-all duration-300 ease-in-out`;
  };
  return (
    <footer 
      className="w-full mt-auto py-6 sm:py-4"
      style={{
        backgroundImage: 'url(https://www.shutterstock.com/image-illustration/sindhi-ajrak-pattern-design-2049-260nw-2409212179.jpg)',
        backgroundSize: 'auto 111.11%', // 100/90 = 1.1111 to show only 90% of the image height
        backgroundPosition: 'center 5%', // Position 5% from the top to center the cropped area
        backgroundRepeat: 'repeat-x',
        color: '#ffffff',
        opacity: 0.95,
        textShadow: '0 1px 3px rgba(0,0,0,0.8), 0 1px 2px rgba(0,0,0,0.6)',
        minHeight: '100px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <div className="w-full max-w-7xl mx-auto px-4">
        <div className="relative w-full">
          <div className="text-base sm:text-lg md:text-xl lg:text-2xl font-sans font-bold text-center w-full">
            © 2025 MyKolachi — Built with <span className="whitespace-nowrap">🤎 by Neha Haneef</span>
          </div>
          <div className="flex space-x-4 justify-center lg:absolute lg:right-0 lg:top-1/2 lg:-translate-y-1/2 mt-2 lg:mt-0">
            <a 
              href="https://www.linkedin.com/in/neha-haneef115" 
              target="_blank" 
              rel="noopener noreferrer"
              className={getIconClasses('linkedin')}
              aria-label="LinkedIn"
            >
              <FaLinkedin className="w-6 h-6 sm:w-7 sm:h-7" />
            </a>
            <a 
              href="mailto:neha.haneef115@gmail.com" 
              className={getIconClasses('email')}
              aria-label="Email"
            >
              <FaEnvelope className="w-6 h-6 sm:w-7 sm:h-7" />
            </a>
            <a 
              href="https://wa.me/923142959462?text=Hello%20I%20saw%20your%20website
" 
              target="_blank" 
              rel="noopener noreferrer"
              className={getIconClasses('whatsapp')}
              aria-label="WhatsApp"
            >
              <FaWhatsapp className="w-6 h-6 sm:w-7 sm:h-7" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

