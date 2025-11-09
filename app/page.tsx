"use client";
import { useState, useEffect, useRef } from 'react';
import Herosec from "@/components/sections/Herosec";
import Geography from "@/components/sections/Geography";
import Origins from "@/components/sections/Origins";
import Culture from "@/components/sections/Culture";
import { Tribute } from "@/components/sections/Tribute";
import Footer from "@/components/sections/footer";
export default function Home() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Initialize audio when component mounts
    audioRef.current = new Audio('https://res.cloudinary.com/dja1ghysx/video/upload/v1762159836/Dohar_sdu0o1.mp3');
    audioRef.current.loop = true;

    // Cleanup on unmount
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const toggleAudio = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.error("Audio playback failed:", error);
        });
      }
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="relative">
      <Herosec isPlaying={isPlaying} onToggleAudio={toggleAudio} />
      <Geography />
      <Origins />
      <Culture />
      <Tribute/>
      <Footer/>
    </div>
  );
}
