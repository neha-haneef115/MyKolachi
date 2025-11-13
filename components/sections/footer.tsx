import React from "react";

export default function Footer() {
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
        <div className="text-base sm:text-lg md:text-xl lg:text-2xl font-sans font-bold text-center">
          © 2025 MyKolachi — Built with <span className="whitespace-nowrap">🤎 by Neha Haneef</span>
        </div>
      </div>
    </footer>
  );
}
