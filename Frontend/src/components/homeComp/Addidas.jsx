import React, { useEffect, useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const Addidas = () => {
  const containerRef = useRef(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Smooth parallax for the image columns
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -250]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 250]);
  
  // Masculine Scaling Effect for the center text
  const scale = useTransform(scrollYProgress, [0, 0.5], [0.8, 1.2]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.6], [0, 1, 0]);
  const smoothScale = useSpring(scale, { stiffness: 100, damping: 30 });

  return (
    <section 
      ref={containerRef} 
      className="relative min-h-screen w-full bg-black overflow-hidden cursor-none"
    >
      {/* 1. Dynamic Background Image Grid (The "Hard Work" Layer) */}
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <div className="absolute inset-0 z-0 grid grid-cols-3 gap-4 opacity-40 grayscale pointer-events-none p-4">
          <motion.div style={{ y: y1 }} className="space-y-4">
            <img src="https://images.unsplash.com/photo-1511886929837-354d827aae26?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDE1fHx8ZW58MHx8fHx8" className="w-full h-150 object-cover rounded-xl" alt="bodybuilding" />
            <img src="https://images.unsplash.com/photo-1502904550040-7534597429ae?q=80&w=1000" className="w-full h-100 object-cover rounded-xl" alt="running" />
          </motion.div>
          <motion.div style={{ y: y2 }} className="space-y-4 pt-40">
            <img src="https://images.unsplash.com/photo-1554344728-77cf90d9ed26?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fGhlYXZ5JTIwbGlmdGluZ3xlbnwwfHwwfHx8MA%3D%3D" className="w-full h-125 object-cover rounded-xl" alt="heavy lifting" />
            <img src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=1000" className="w-full h-150 object-cover rounded-xl" alt="gym session" />
          </motion.div>
          <motion.div style={{ y: y1 }} className="space-y-4">
            <img src="https://images.unsplash.com/photo-1461896836934-ffe607ba8211?q=80&w=1000" className="w-full h-175 object-cover rounded-xl" alt="sprinting" />
            <img src="https://images.unsplash.com/photo-1552674605-db6ffd4facb5?q=80&w=1000" className="w-full h-100 object-cover rounded-xl" alt="focus" />
          </motion.div>
        </div>

        {/* 2. The Masculine Tagline Overlay */}
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center px-6">
          <motion.div 
            style={{ scale: smoothScale, opacity: opacity }}
            className="flex flex-col items-center"
          >
            <span className="text-[#E0FF22] font-black uppercase tracking-[0.5em] text-xs md:text-sm mb-4">
              Marthon x Addidas
            </span>
            <h2 className="text-6xl md:text-8xl lg:text-[10rem] font-black italic uppercase tracking-tighter leading-[0.8] text-white">
              BEYOND <br /> 
              <span className="text-transparent" style={{ WebkitTextStroke: '2px #E0FF22' }}>
                LIMITS
              </span>
            </h2>
            <p className="mt-8 text-gray-400 max-w-lg font-bold uppercase tracking-widest text-[10px] md:text-xs leading-loose">
              Forged in the gym. Tested on the track. <br /> 
              The ultimate gear for those who refuse to settle.
            </p>
          </motion.div>
        </div>

     
      </div>

    </section>
  );
};

export default Addidas;