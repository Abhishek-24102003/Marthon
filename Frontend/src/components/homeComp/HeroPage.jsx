import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const HeroPage = () => {
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const brandRef = useRef(null);
  
  // 1. Initialize state by checking Session Storage
  const [isFirstVisit, setIsFirstVisit] = useState(() => {
    return !sessionStorage.getItem('heroAnimationPlayed');
  });

  useEffect(() => {
    // 2. Once the component mounts, set the flag so it doesn't run again
    if (isFirstVisit) {
      sessionStorage.setItem('heroAnimationPlayed', 'true');
    }

    // GSAP Scroll Interaction (Keep this as is, it triggers on scroll)
    gsap.to(brandRef.current, {
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
      scale: 1.2,
      filter: "brightness(1.8) drop-shadow(0 0 40px #E0FF22)",
      y: -50,
      opacity: 0.5
    });
  }, [isFirstVisit]);

  // 3. Conditional Variants
  // If it's NOT the first visit, we set the initial state to "visible" immediately
  const entryInitial = isFirstVisit ? "hidden" : "visible";

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.3 }
    }
  };

  const titleVariants = {
    hidden: { scale: 4, opacity: 0, filter: "blur(20px)" },
    visible: { 
      scale: 1, 
      opacity: 1, 
      filter: "blur(0px)",
      transition: { 
        duration: isFirstVisit ? 0.8 : 0, // Remove duration if already played
        ease: [0.16, 1, 0.3, 1] 
      }
    }
  };

  return (
    <div ref={containerRef} className="relative h-[150vh] w-full bg-black cursor-none">
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">
        <video 
          src="/heroCollection/shoeVideo.mp4" 
          autoPlay loop muted playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-90"
        />

        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-blue-900/40 via-transparent to-transparent opacity-60" />
          
          <motion.div 
            // Only flicker if it's the first visit, otherwise keep subtle
            animate={isFirstVisit ? { opacity: [0, 0.2, 0, 0.05, 0.3, 0] } : { opacity: 0.05 }}
            transition={{ repeat: Infinity, duration: 5, times: [0, 0.02, 0.04, 0.06, 0.08, 1] }}
            className="absolute inset-0 bg-white mix-blend-overlay"
          />
        </div>

        <motion.div 
          ref={brandRef}
          variants={containerVariants}
          initial={entryInitial} // Dynamic Initial
          animate="visible"
          className="relative z-20 flex flex-col items-center text-center px-6"
        >
          <motion.h1 
            variants={titleVariants}
            className="text-white text-7xl md:text-[12rem] font-black italic tracking-tighter uppercase leading-none drop-shadow-[0_0_15px_rgba(224,255,34,0.3)]"
          >
            MARTHON
          </motion.h1>

          <motion.div 
            initial={isFirstVisit ? { width: 0, opacity: 0 } : { width: "100%", opacity: 1 }}
            animate={{ width: "100%", opacity: 1 }}
            transition={{ delay: isFirstVisit ? 1 : 0, duration: 0.8 }}
            className="h-1 bg-[#E0FF22] shadow-[0_0_20px_#E0FF22] mt-2"
          />

          <div className="overflow-hidden mt-4">
            <motion.p 
              initial={isFirstVisit ? { y: 50, opacity: 0 } : { y: 0, opacity: 1 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: isFirstVisit ? 1.2 : 0, duration: 0.6 }}
              className="text-[#E0FF22] font-bold tracking-[0.8em] text-sm md:text-2xl uppercase italic"
            >
              Unstoppable Force
            </motion.p>
          </div>

          <motion.button
            initial={isFirstVisit ? { opacity: 0, y: 20 } : { opacity: 1, y: 0 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: isFirstVisit ? 1.6 : 0 }}
            whileHover={{ scale: 1.05, letterSpacing: "0.2em" }}
            onClick={() => navigate("/homelayout/product")}
            className="mt-16 px-12 py-4 bg-transparent border-2 border-[#E0FF22] text-[#E0FF22] font-black uppercase italic hover:bg-[#E0FF22] hover:text-black transition-all duration-300 shadow-[0_0_10px_rgba(224,255,34,0.2)]"
          >
            Explore the Lab
          </motion.button>
        </motion.div>

        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-30"
        >
          <span className="text-[10px] text-white tracking-widest uppercase">Scroll to Charge</span>
          <div className="w-px h-12 bg-linear-to-b from-[#E0FF22] to-transparent" />
        </motion.div>
      </div>
      <div className="h-[50vh] bg-black" />
    </div>
  );
};

export default HeroPage;