import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const Nike = () => {
  const targetRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
  });

  // This transforms the vertical scroll into horizontal movement
  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-60%"]);

  // Opacity for the center tagline
  const textOpacity = useTransform(
    scrollYProgress,
    [0, 0.2, 0.8, 1],
    [0, 1, 1, 0],
  );

  return (
    <section ref={targetRef} className="relative h-[300vh] bg-[#050505] cursor-none">
      <div className="sticky top-0 h-screen flex items-center overflow-hidden ">
        {/* 1. The "Racing" Athlete Background */}
        <motion.div style={{ x }} className="flex gap-8 px-12">
          <div className="shrink-0 w-[70vw] h-[60vh] md:h-[70vh] relative group">
            <img
              src="https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?q=80&w=1000"
              className="w-full h-full object-cover rounded-2xl grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700"
              alt="sprint"
            />
            <span className="absolute bottom-6 left-6 text-white font-black italic text-4xl uppercase opacity-20">
              01. Explosive
            </span>
          </div>

          <div className="shrink-0 w-[70vw] h-[60vh] md:h-[70vh] relative group">
            <img
              src="https://images-static.nykaa.com/uploads/9bb64081-7a35-4900-b107-64ca3f2fe2b4.png?tr=cm-pad_resize,w-750"
              className="w-full h-full object-cover rounded-2xl grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700"
              alt="marathon"
            />
            <span className="absolute bottom-6 left-6 text-white font-black italic text-4xl uppercase opacity-20">
              02. Endurance
            </span>
          </div>

          <div className="shrink-0 w-[70vw] h-[60vh] md:h-[70vh] relative group">
            <img
              src="https://images.unsplash.com/photo-1637666465047-8398e7d8038e?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fE5pa2V8ZW58MHx8MHx8fDA%3D"
              className="w-full h-full object-cover rounded-2xl grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700"
              alt="focus"
            />
            <span className="absolute bottom-6 left-6 text-white font-black italic text-4xl uppercase opacity-20">
              03. Precision
            </span>
          </div>
        </motion.div>

        {/* 2. Floating Masculine Text Overlay */}
        <motion.div
          style={{ opacity: textOpacity }}
          className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"
        >
          <div className="text-center">
            <h2 className="text-7xl md:text-9xl lg:text-[12rem] font-black italic uppercase tracking-tighter leading-none text-white">
              LEAVE THEM <br />
              <span
                className="text-transparent"
                style={{ WebkitTextStroke: "2px #FF3E3E" }}
              >
                BEHIND
              </span>
            </h2>
            <div className="mt-6 flex items-center justify-center gap-4">
              <div className="w-12 h-1 bg-[#FF3E3E]"></div>
              <span className="text-[#FF3E3E] font-black uppercase tracking-[0.5em] text-xs">
                Nike x Marthon
              </span>
              <div className="w-12 h-1 bg-[#FF3E3E]"></div>
            </div>
          </div>
        </motion.div>

        {/* 3. Aesthetic Sidebar Detail */}
        <div className="absolute right-12 top-1/2 -translate-y-1/2 hidden md:flex flex-col gap-8">
          <div className="w-0.5 h-32 bg-white/10 relative">
            <motion.div
              style={{
                height: useTransform(scrollYProgress, [0, 1], ["0%", "100%"]),
              }}
              className="absolute top-0 left-0 w-full bg-[#FF3E3E]"
            />
          </div>
          <span className="text-[10px] font-black vertical-text uppercase tracking-widest text-white/20 rotate-90">
            Velocity_Scroll
          </span>
        </div>
      </div>
    </section>
  );
};

export default Nike;
