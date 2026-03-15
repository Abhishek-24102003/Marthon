import React, { useState, useEffect, useMemo, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import toast, { Toaster } from "react-hot-toast";
import { gsap } from "gsap";
import { motion, AnimatePresence } from "framer-motion";
import { axiosInstance } from "../../Instances/axiosInstance";
import { addcartRedux } from "../../features/cartSlice";

const Hero = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const shoeRef = useRef(null);
  const cursorRef = useRef(null);

  useEffect(() => {
    (async () => {
      try {
        const cart = await axiosInstance.get("/cart");
        dispatch(addcartRedux(cart.data.cart.items));
      } catch (err) {
        console.error("Cart fetch failed", err);
      }
    })();
  }, [dispatch]);

  const { allProducts } = useSelector((state) => state.auth);
  const { CartProduct } = useSelector((state) => state.cart);

  const [activeHero, setActiveHero] = useState(0);
  const [selectedSize, setSelectedSize] = useState(null);
  const [isSyncing, setIsSyncing] = useState(false);

  const heroProducts = useMemo(
    () => allProducts?.filter((p) => p?.heroProduct === true) || [],
    [allProducts],
  );

  const currentProduct = heroProducts[activeHero];

  const isAlreadyInCart = useMemo(() => {
    if (!currentProduct || !CartProduct) return false;
    return CartProduct.some((elem) => {
      const prodIdInCart = elem.productId?._id || elem.productId;
      return String(prodIdInCart) === String(currentProduct._id);
    });
  }, [CartProduct, currentProduct]);

  // Framer Motion Variants
  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const letterContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.03 } },
  };

  const childLetter = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  useEffect(() => {
    if (!currentProduct) return;
    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    gsap.set(shoeRef.current, { rotationZ: 45, transformPerspective: 1200 });

    const handleMouseMove = (e) => {
      if (isMobile || !shoeRef.current) return;
      const { clientX, clientY } = e;
      const xPct = clientX / window.innerWidth - 0.5;
      const yPct = clientY / window.innerHeight - 0.5;

      gsap.to(cursorRef.current, { x: clientX, y: clientY, duration: 0.5 });
      gsap.to(shoeRef.current, {
        rotationY: xPct * 30,
        rotationX: -yPct * 30,
        rotationZ: 45,
        duration: 1.2,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [activeHero, currentProduct]);

  const handleNext = () => {
    gsap.to(shoeRef.current, {
      x: -200,
      opacity: 0,
      rotationZ: 45,
      duration: 0.3,
      onComplete: () => {
        setActiveHero((prev) =>
          prev + 1 === heroProducts.length ? 0 : prev + 1,
        );
        gsap.fromTo(
          shoeRef.current,
          { x: 200, opacity: 0, rotationZ: 45 },
          { x: 0, opacity: 1, rotationZ: 45, duration: 0.5 },
        );
      },
    });
  };

  const handleButtonClick = async () => {
    if (isAlreadyInCart) {
      navigate("/homelayout/cart");
      return;
    }
    if (!selectedSize) {
      toast.error("Please select a size first!");
      return;
    }
    setIsSyncing(true);
    try {
      const res = await axiosInstance.post(
        `/cart/addToCart/${currentProduct._id}/${selectedSize}`,
      );
      if (res.status === 200 || res.status === 201) {
        const updatedCart = await axiosInstance.get("/cart");
        dispatch(addcartRedux(updatedCart?.data.cart.items));
        toast.success("Added to Marathon Gear");
      }
    } catch (error) {
      toast.error("Failed to add to cart");
    } finally {
      setIsSyncing(false);
    }
  };

  if (!currentProduct) return null;

  return (
    <div className="bg-[#050505] h-[80vh] w-full flex flex-col relative text-white font-sans overflow-hidden md:cursor-none">
      <Toaster position="top-center" />

      {/* Mesh Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div
          className="mesh-gradient absolute -inset-[50%] opacity-30 blur-[120px]"
          style={{
            background: `radial-gradient(circle at 50% 50%, #E0FF221a 0%, #050505 40%)`,
          }}
        />
      </div>

      {/* BIG BACKGROUND BRAND TEXT (RESORED) */}
      <div className="absolute  inset-0 flex items-center justify-center pointer-events-none z-0 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.h2
            key={currentProduct.company}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 0.1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 0.3 }}
            className="text-[15vw] font-black italic uppercase tracking-tighter text-[#E0FF22] whitespace-nowrap select-none"
          >
            {currentProduct.company}
          </motion.h2>
        </AnimatePresence>
      </div>

      {/* Custom Cursor */}
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 w-8 h-8 rounded-full border border-white/20 z-100 pointer-events-none hidden md:flex items-center justify-center mix-blend-difference"
      >
        <div className="w-1 h-1 bg-[#E0FF22] rounded-full" />
      </div>

      <main className="relative z-10 flex flex-col w-full px-6 py-8 md:px-12 h-full">
        <div className="h-full flex flex-col md:flex-row items-center justify-between w-full">
          {/* Header with Letter Typing */}
          <div className="absolute top-0 right-0 w-full md:w-1/2 space-y-4 z-30 order-2 md:order-1">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentProduct._id}
                variants={letterContainer}
                initial="hidden"
                animate="visible"
                exit="hidden"
              >
                <h1 className="text-[5vw] font-black tracking-tighter leading-[0.9] uppercase italic flex flex-wrap">
                  {(currentProduct.company + " " + currentProduct.productModel)
                    .split("")
                    .map((char, i) => (
                      <motion.span key={i} variants={childLetter}>
                        {char === " " ? "\u00A0" : char}
                      </motion.span>
                    ))}
                </h1>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="flex items-center gap-3 pt-6"
                >
                  <span className="w-12 h-0.5 bg-[#E0FF22]"></span>
                  <p className="text-gray-400 font-bold uppercase tracking-widest text-sm">
                    {currentProduct.description}
                  </p>
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="relative top-[-7vh]  w-full md:w-[30vw] flex justify-center items-center z-20">
            <img
              ref={shoeRef}
              src={currentProduct.images[2]}
              className={`w-[85vw]${currentProduct.company ==="Campus"?" md:w-[25vw]":" md:w-[40vw]"} drop-shadow-[0_40px_60px_rgba(0,0,0,0.8)]`}
              alt="shoe"
            />
          </div>
        </div>

        {/* Footer with Staggered Entry */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.1 }}
          className="mt-auto flex flex-col md:flex-row justify-between items-center w-full gap-8 pb-10 z-40"
        >
          <motion.button
            variants={fadeInUp}
            disabled={isSyncing}
            onClick={handleButtonClick}
            className={`w-full md:w-64 h-16 rounded-full font-black uppercase text-xs tracking-widest transition-all duration-300 ${
              isAlreadyInCart
                ? "bg-[#E0FF22] text-black shadow-lg"
                : "bg-zinc-900 border border-zinc-800 text-white hover:bg-white hover:text-black"
            }`}
          >
            {isSyncing
              ? "Syncing..."
              : isAlreadyInCart
                ? "Go to Cart"
                : "Add to Cart"}
          </motion.button>

          <motion.div variants={fadeInUp} className="flex items-center gap-10">
            <div className="flex gap-2">
              {currentProduct.size.map((s) => (
                <button
                  key={s}
                  onClick={() => setSelectedSize(s)}
                  className={`w-12 h-12 border rounded-full text-xs font-bold transition-all ${selectedSize === s ? "bg-[#E0FF22] text-black border-[#E0FF22]" : "text-zinc-400 border-zinc-800 hover:border-[#E0FF22]"}`}
                >
                  {s}
                </button>
              ))}
            </div>
            <button
              onClick={handleNext}
              className="group flex items-center gap-4"
            >
              <span className="text-xl font-black uppercase tracking-widest text-zinc-500 group-hover:text-white transition-colors">
                Next
              </span>
              <div className="w-12 h-px bg-zinc-800 relative overflow-hidden">
                <div className="absolute inset-0 bg-[#E0FF22] -translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
              </div>
            </button>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
};

export default Hero;
