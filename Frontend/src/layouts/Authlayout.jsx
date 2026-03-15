import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Login from "../components/Login";
import Register from "../components/Register";

const Authlayout = () => {
  const [toggle, setToggle] = useState(true);

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-[#050505] overflow-hidden px-4 py-8 sm:p-6">
      
      {/* --- BACKGROUND BRANDING SECTION --- */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none z-0 overflow-hidden">
        {/* Adjusted text sizes: 22vw for mobile, 18vw for desktop to prevent overflow */}
        <h1 className="text-[22vw] lg:text-[18vw] font-black text-[#E0FF22] opacity-40 lg:opacity-70 leading-none italic tracking-tighter transition-opacity duration-700">
          <span className="text-white">MAR</span>THON
        </h1>
      </div>

      {/* --- ANIMATED FORM CONTAINER --- */}
      {/* w-full and max-w-md ensures it doesn't get awkwardly wide on tablets */}
      <div className="relative z-10 w-full max-w-110 flex justify-center mx-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={toggle ? "login" : "register"}
            // Reduced initial Y offset for mobile (30px) so it doesn't fly in from off-screen
            initial={{ opacity: 0, y: 30, filter: "blur(20px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -20, filter: "blur(20px)" }}
            transition={{ duration: 0.4, ease: "backOut" }} // 'backOut' adds a premium snap
            className="w-full"
          >
            {toggle ? (
              <Login setToggle={setToggle} />
            ) : (
              <Register setToggle={setToggle} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* --- TAGLINE --- */}
      {/* hidden on very small screens to avoid clutter, or scale down */}
      <p className="absolute bottom-6 sm:bottom-10 w-[90%] text-center text-[10px] sm:text-xs font-bold text-[#E0FF22] opacity-40 tracking-[0.3em] sm:tracking-[0.5em] uppercase">
        Where Endurance <br className="sm:hidden" /> Meets Relentless Performance
      </p>
    </div>
  );
};

export default Authlayout;