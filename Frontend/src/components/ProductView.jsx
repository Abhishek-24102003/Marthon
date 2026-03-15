import React, { useState, useEffect } from "react";
import { useParams, NavLink } from "react-router";
import { useSelector } from "react-redux";
import { axiosInstance } from "../Instances/axiosInstance";
import toast, { Toaster } from "react-hot-toast";

const ProductView = () => {
  const { id } = useParams();
  const { allProducts } = useSelector((state) => state.auth);

  /* ===================== STATES (ALL AT TOP) ===================== */
  const [selectedSize, setSelectedSize] = useState(null);
  const [isAdded, setIsAdded] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isZooming, setIsZooming] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 });

  /* ===================== DATA ===================== */
  const product = allProducts?.find((p) => p._id === id);

  const similarProducts = allProducts?.filter(
    (p) => p._id !== product?._id && p.company === product?.company
  );

  /* ===================== EFFECT ===================== */
  useEffect(() => {
    setSelectedSize(null);
    setIsAdded(false);
    setSelectedImage(product?.images?.[0] || null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [id, product]);

  /* ===================== HANDLERS ===================== */
  const handleMouseMove = (e) => {
    const { left, top, width, height } =
      e.currentTarget.getBoundingClientRect();

    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;

    setZoomPosition({ x, y });
  };

  const handleAddToCart = async () => {
    if (!selectedSize) {
      toast.error("Please select a size");
      return;
    }
    try {
      await axiosInstance.post(
        `/cart/addToCart/${product._id}/${selectedSize}`
      );
      setIsAdded(true);
      toast.success("Added to Marthon Gear", {
        style: { background: "#E0FF22", color: "#000", fontWeight: "bold" },
      });
    } catch (error) {
      toast.error("Failed to add product");
    }
  };

  /* ===================== SAFE EARLY RETURN ===================== */
  if (!product) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <p className="text-white font-black italic uppercase animate-pulse">
          Product Not Found...
        </p>
      </div>
    );
  }

  /* ===================== JSX ===================== */
  return (
    <div className="bg-[#050505] min-h-screen pt-[5vh] pb-12 text-white">
      <Toaster position="top-center" />

      {/* ================= MAIN PRODUCT ================= */}
      <div className="relative max-w-7xl mx-auto px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        
        {/* IMAGE SECTION */}
        <div className="flex gap-6">
          {/* Thumbnails */}
          <div className="flex flex-col gap-4">
            {product.images?.map((img, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(img)}
                className={`w-20 h-20 rounded-xl overflow-hidden border transition-all
                  ${
                    selectedImage === img
                      ? "border-[#E0FF22] scale-105"
                      : "border-white/10 hover:border-white/40"
                  }`}
              >
                <img
                  src={img}
                  alt={`thumb-${index}`}
                  className="w-full h-[10vh] object-contain bg-white"
                />
              </button>
            ))}
          </div>

          {/* Main Image + Zoom */}
          <div className="flex justify-center items-center h-[50vh] ">
            <div
              className="relative"
              onMouseEnter={() => setIsZooming(true)}
              onMouseLeave={() => setIsZooming(false)}
              onMouseMove={handleMouseMove}
            >
              <img
                src={selectedImage}
                alt={product.productModel}
                className=" cursor-zoom-in"
              />
            </div>
          </div>
        </div>

        {/* INFO */}
              <div className="space-y-8">
                  <h1 className="text-5xl md:text-7xl font-black italic uppercase">
            {product.productModel}
                  </h1>
                  <p>{product.description}</p>
{/* ZOOM OVER INFO */}
{isZooming && (
  <div className="absolute top-[-10vh] translate-y-1/2 z-50 hidden lg:block">
    <div className="w-[40vw] h-[40vh] border border-white/20 rounded-2xl overflow-hidden bg-black shadow-2xl">
      <div
        className="w-full h-full bg-no-repeat bg-cover"
        style={{
          backgroundImage: `url(${selectedImage})`,
          backgroundPosition: `${zoomPosition.x}% ${zoomPosition.y}%`,
          backgroundSize: "140%",
        }}
      />
    </div>
  </div>
)}
          {/* Size */}
          <div className="flex gap-3">
            {product.size?.map((s) => (
              <button
                key={s}
                onClick={() => setSelectedSize(s)}
                className={`w-12 h-12 rounded-xl font-bold
                  ${
                    selectedSize === s
                      ? "bg-[#E0FF22] text-black"
                      : "bg-white/10"
                  }`}
              >
                {s}
              </button>
            ))}
          </div>

          {/* Price */}
          <p className="text-3xl font-bold text-[#E0FF22]">
            {product.price?.currency} {product.price?.amount}
          </p>

          {/* Actions */}
          {isAdded ? (
            <NavLink
              to="/homelayout/cart"
              className="block bg-[#E0FF22] text-black py-4 text-center rounded-xl font-black"
            >
              View in Cart
            </NavLink>
          ) : (
            <button
              onClick={handleAddToCart}
              className="bg-white text-black py-4 rounded-xl font-black w-full"
            >
              Add to Cart
            </button>
          )}
        </div>
      </div>

      {/* ================= SIMILAR PRODUCTS ================= */}
      {similarProducts?.length > 0 && (
        <div className="max-w-7xl mx-auto px-6 mt-32">
          <h2 className="text-4xl font-black italic mb-12">Similar Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {similarProducts.map((item) => (
              <NavLink
                key={item._id}
                to={`/homelayout/product/${item._id}`}
                className="bg-white/5 p-4 rounded-xl"
              >
                <img
                  src={item.images?.[0]}
                  className="h-56 object-contain mx-auto"
                />
                <p className="mt-4 font-bold">{item.productModel}</p>
              </NavLink>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductView;