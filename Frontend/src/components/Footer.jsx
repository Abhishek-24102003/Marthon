import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Footer = () => {
  const footerRef = useRef(null);
  const bigTextRef = useRef(null);

  useEffect(() => {
    // Parallax effect for the massive background text
    gsap.to(bigTextRef.current, {
      x: -200,
      scrollTrigger: {
        trigger: footerRef.current,
        start: "top bottom",
        end: "bottom top",
        scrub: 1,
      }
    });
  }, []);

  const footerLinks = [
    { title: "Products", links: ["New Arrivals", "Best Sellers", "Release Dates", "Sale"] },
    { title: "Support", links: ["Order Status", "Shipping", "Returns", "Contact Us"] },
    { title: "Company", links: ["About Marthon", "Sustainability", "Careers", "Investors"] },
  ];

  return (
    <footer 
      ref={footerRef}
      className="relative w-full bg-[#050505] pt-20 pb-10 overflow-hidden border-t border-white/5"
    >
      {/* 1. Massive Background Text (The Identity) */}
      <div className="absolute top-0 left-0 w-full h-full flex items-center overflow-hidden pointer-events-none select-none">
        <h2 
          ref={bigTextRef}
          className="text-[25vw] font-black italic uppercase leading-none text-white/2 whitespace-nowrap"
        >
          MARTHON PERFORMANCE MARTHON
        </h2>
      </div>

      <div className="relative z-10 max-w-350 mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
          
          {/* Logo & Newsletter */}
          <div className="col-span-1 md:col-span-1">
            <h3 className="text-[#E0FF22] font-black italic text-3xl mb-6 tracking-tighter">MARTHON</h3>
            <p className="text-gray-500 text-xs font-bold uppercase tracking-widest leading-loose mb-8">
              Pushing the boundaries of speed and evolution since 2026.
            </p>
            <div className="relative group">
              <input 
                type="text" 
                placeholder="JOIN THE ELITE (EMAIL)" 
                className="w-full bg-transparent border-b border-white/20 py-2 text-xs font-black uppercase text-white outline-none focus:border-[#E0FF22] transition-colors placeholder:text-white/20"
              />
              <button className="absolute right-0 bottom-2 text-[#E0FF22] text-xs font-black uppercase tracking-tighter hover:text-white transition-colors">
                SIGN UP
              </button>
            </div>
          </div>

          {/* Link Columns */}
          {footerLinks.map((section, idx) => (
            <div key={idx} className="flex flex-col gap-4">
              <h4 className="text-white text-[10px] font-black uppercase tracking-[0.3em] mb-4">{section.title}</h4>
              {section.links.map((link, i) => (
                <motion.a 
                  key={i}
                  href="#"
                  whileHover={{ x: 10, color: "#E0FF22" }}
                  className="text-gray-500 text-sm font-bold transition-all w-fit"
                >
                  {link}
                </motion.a>
              ))}
            </div>
          ))}
        </div>

        {/* 2. Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-10 border-t border-white/5 gap-6">
          <div className="flex gap-8">
            <span className="text-[10px] text-white/20 font-black uppercase tracking-widest">© 2026 MARTHON INC.</span>
            <span className="text-[10px] text-white/20 font-black uppercase tracking-widest hover:text-white cursor-pointer transition-colors">Privacy Policy</span>
            <span className="text-[10px] text-white/20 font-black uppercase tracking-widest hover:text-white cursor-pointer transition-colors">Terms of Service</span>
          </div>

          {/* Social Icons (Minimalist) */}
          <div className="flex gap-6">
            {['INSTAGRAM', 'TWITTER', 'YOUTUBE'].map((social) => (
              <a 
                key={social} 
                href="#" 
                className="text-[10px] font-black text-white hover:text-[#E0FF22] transition-colors tracking-widest"
              >
                {social}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Aesthetic Thunderbolt Accent */}
      <div className="absolute bottom-0 right-0 w-1/3 h-1 bg-linear-to-l from-[#E0FF22] to-transparent" />
    </footer>
  );
};

export default Footer;