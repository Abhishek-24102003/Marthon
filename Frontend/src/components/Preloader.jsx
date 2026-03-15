// components/Preloader
import React from 'react';

const Preloader = () => {
  return (
    <div className="fixed inset-0 z-999 bg-[#050505] flex flex-col items-center justify-center overflow-hidden">
      {/* Background Glow */}
      <div className="absolute w-full h-10 bg-[#E0FF22] opacity-5 blur-[120px] rounded-full animate-pulse" />
      
      <div className="relative text-center">
        <h1 className="text-6xl sm:text-8xl font-black italic tracking-tighter text-white uppercase leading-none">
          MAR<span className="text-[#E0FF22]">THON</span>
        </h1>
        
        {/* Animated Loading Bar */}
        <div className="mt-8 w-48 h-0.5 bg-white/10 rounded-full overflow-hidden mx-auto">
          <div className="animate-loading h-full bg-[#E0FF22]" 
               style={{ width: '100%', transformOrigin: 'left' }} 
          />
        </div>
        
        <p className="mt-6 text-[10px] font-bold text-gray-500 uppercase tracking-[0.4em]">
          Endurance / Performance / Power
        </p>
      </div>
    </div>
  );
};

export default Preloader;