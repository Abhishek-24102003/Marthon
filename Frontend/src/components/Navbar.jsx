import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { axiosInstance } from "../Instances/axiosInstance";
import { removerUser } from "../features/authSlice";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await axiosInstance.post("/auth/logout");
      dispatch(removerUser());
      localStorage.removeItem("User");
      navigate("/");
    } catch (error) {
      alert("failed to logout");
    }
  };

  const navLinks = [
    { name: "Home", path: "/homelayout" },
    { name: "Products", path: "product" },
    { name: "Cart", path: "cart" },
    { name: "Create", path: "createProduct" },
  ];

  return (
    <nav className="fixed top-0 left-0 w-full z-100 px-6 py-4 transition-all duration-300">
      <div className="flex items-center justify-between border-b border-white/5 pb-4">
        
        {/* Left: Clean Marthon Logo */}
        <div 
          onClick={() => navigate("/homelayout")} 
          className="cursor-pointer group"
        >
          <span className="text-white font-black uppercase italic tracking-tighter text-2xl group-hover:text-[#E0FF22] transition-colors">
            Mar<span className="text-[#E0FF22] group-hover:text-white">thon</span>
          </span>
        </div>

        {/* Right: Profile & Menu Button */}
        <div className="flex items-center gap-6">
          
          {/* Profile Section */}
          <div className="relative">
            <button
              onClick={() => {
                setIsProfileOpen(!isProfileOpen);
                setIsMenuOpen(false);
              }}
              className="flex items-center gap-3 group focus:outline-none"
            >
              <div className="text-right hidden sm:block">
                <p className="text-[10px] font-black uppercase tracking-widest text-white/40 group-hover:text-[#E0FF22]">Profile</p>
                <p className="text-xs font-bold text-white truncate max-w-25">{user?.userName?.split(' ')[0]}</p>
              </div>
              <div className="w-10 h-10 rounded-full border border-white/10 overflow-hidden group-hover:border-[#E0FF22] transition-all p-0.5">
                <img 
                  src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.userName}&background=E0FF22&color=000`} 
                  alt="avatar" 
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
            </button>

            {/* Profile Dropdown */}
            <AnimatePresence>
              {isProfileOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 mt-4 w-56 bg-black/90 backdrop-blur-2xl border border-white/10 rounded-2xl p-5 shadow-2xl"
                >
                  <div className="space-y-4">
                    <button className="w-full text-left text-[10px] font-black uppercase tracking-[0.2em] text-white/60 hover:text-[#E0FF22]">Edit Account</button>
                    <button className="w-full text-left text-[10px] font-black uppercase tracking-[0.2em] text-white/60 hover:text-[#E0FF22]">My Orders</button>
                    <div className="h-px bg-white/5 my-2"></div>
                    <button 
                      onClick={handleLogout}
                      className="w-full text-left text-[10px] font-black uppercase tracking-[0.2em] text-red-500"
                    >
                      Logout
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Styled Menu Button */}
          <button 
            onClick={() => {
              setIsMenuOpen(!isMenuOpen);
              setIsProfileOpen(false);
            }}
            className="flex flex-col gap-1.5 group focus:outline-none z-120"
          >
            <div className={`h-0.5 bg-white transition-all duration-300 ${isMenuOpen ? 'w-8 rotate-45 translate-y-2 bg-[#E0FF22]' : 'w-8'}`} />
            <div className={`h-0.5 bg-white transition-all duration-300 ${isMenuOpen ? 'opacity-0' : 'w-5'}`} />
            <div className={`h-0.5 bg-white transition-all duration-300 ${isMenuOpen ? 'w-8 -rotate-45 -translate-y-2 bg-[#E0FF22]' : 'w-8'}`} />
          </button>
        </div>
      </div>

      {/* Full Screen Slide Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 bg-[#050505]/95 backdrop-blur-3xl z-110 flex flex-col items-center justify-center"
          >
            <div className="flex flex-col gap-8 text-center">
              {navLinks.map((link, idx) => (
                <motion.div
                  key={link.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <NavLink
                    to={link.path}
                    onClick={() => setIsMenuOpen(false)}
                    className={({ isActive }) =>
                      `text-5xl md:text-7xl font-black uppercase italic tracking-tighter transition-all hover:italic hover:tracking-normal ${
                        isActive ? "text-[#E0FF22]" : "text-white/20 hover:text-white"
                      }`
                    }
                  >
                    {link.name}
                  </NavLink>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;