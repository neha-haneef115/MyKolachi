"use client";
import DomeGallery from "@/components/ui/DomeGallery";
import FuzzyText from '@/components/FuzzyText';

const Dome = () => {
 return (
    <div 
       className="relative bg-black w-full h-[500px] md:h-screen"
    >
      <div 
        className="w-full h-full"
     
      >
        <DomeGallery 
          minRadius={500}
          maxRadius={2000}
          fit={0.8}
        />
      </div>
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <FuzzyText 
          baseIntensity={0.1} 
          hoverIntensity={0.5} 
          enableHover={true}
        >
          CULTURE
        </FuzzyText>
      </div>
      
   
    </div>
  );
};

export default Dome;