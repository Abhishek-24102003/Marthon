import React, { useState } from "react";
import { motion } from "framer-motion";
import { NavLink } from "react-router"; // or 'react-router-dom'
import { axiosInstance } from "../Instances/axiosInstance";
import toast, { Toaster } from "react-hot-toast";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
      setLoading(true);
     
    try {
      // Replace with your actual endpoint
      await axiosInstance.post("/auth/forgot-password", { email });
      toast.success("Recovery link sent to your email", {
        style: { background: "#E0FF22", color: "#000", fontWeight: "bold" },
      });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send link");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center px-6 selection:bg-[#E0FF22] selection:text-black">
      <Toaster position="top-center" />
      
      {/* Aesthetic Background Detail */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#E0FF22]/10 blur-[120px] rounded-full" />
        <h1 className="absolute bottom-10 right-10 text-[15vw] font-black italic uppercase opacity-[0.03] leading-none select-none">
          RECOVER
        </h1>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md bg-white/5 backdrop-blur-2xl border border-white/10 p-10 rounded-4xl shadow-2xl"
      >
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white">
            Lost your <span className="text-[#E0FF22]">Access?</span>
          </h2>
          <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mt-2 leading-relaxed">
            Enter your email to reset your Marthon account security.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 ml-1">
              Account Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ATHLETE@MARTHON.COM"
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm font-bold text-white outline-none focus:border-[#E0FF22] transition-all placeholder:text-white/10"
            />
          </div>

          <button
            disabled={loading}
            type="submit"
            className="w-full bg-[#E0FF22] text-black py-5 rounded-2xl font-black uppercase text-[10px] tracking-[0.3em] hover:bg-white transition-all active:scale-95 shadow-[0_10px_30px_rgba(224,255,34,0.2)] disabled:opacity-50"
          >
            {loading ? "Verifying..." : "Send Recovery Link"}
          </button>
        </form>

        <div className="mt-8 pt-8 border-t border-white/5 flex justify-center">
          <NavLink 
            to="/" 
            className="text-[10px] font-black uppercase tracking-widest text-white/30 hover:text-[#E0FF22] transition-colors"
          >
            Back to Login
          </NavLink>
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;