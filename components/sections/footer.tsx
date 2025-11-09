import React from "react";

export default function Footer() {
  return (
    <footer 
      className="text-center text-sm relative h-[100px] flex items-center justify-center"
      style={{
        backgroundImage: 'url(https://www.shutterstock.com/image-illustration/sindhi-ajrak-pattern-design-2049-260nw-2409212179.jpg)',
        backgroundSize: 'auto 111.11%', /* 100/90 = 1.1111 to compensate for the 10% crop */
        backgroundPosition: 'center top',
        backgroundRepeat: 'repeat-x',
        color: '#ffffff',
        opacity: 0.95,
        textShadow: '0 1px 3px rgba(0,0,0,0.8), 0 1px 2px rgba(0,0,0,0.6)'
      }}
    >
      <div className="text-2xl font-sans font-bold mx-auto px-4">
        © 2025 MyKolachi — Built with 🤎 by Neha Haneef
      </div>
    </footer>

  );
}
