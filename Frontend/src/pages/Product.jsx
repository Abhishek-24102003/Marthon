import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, Outlet, useNavigate } from "react-router";
import { axiosInstance } from "../Instances/axiosInstance";
import { addcartRedux } from "../features/cartSlice";
const Product = () => {
  const brands = [
    { name: "All", logo: "" },
    {
      name: "Adidas",
      logo: "https://upload.wikimedia.org/wikipedia/commons/2/20/Adidas_Logo.svg",
    },
    {
      name: "Nike",
      logo: "https://upload.wikimedia.org/wikipedia/commons/a/a6/Logo_NIKE.svg",
    },
    {
      name: "Puma",
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ae/Puma-logo-%28text%29.svg/640px-Puma-logo-%28text%29.svg.png",
    },
    {
      name: "Campus",
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Campus_Fahrr%C3%A4der_Logo.svg/640px-Campus_Fahrr%C3%A4der_Logo.svg.png",
    },
  ];
  const dispatch = useDispatch();
  // reloads-->
  useEffect(() => {
    const syncCart = async () => {
      try {
        const res = await axiosInstance.get("/cart");
        if (res.data?.cart?.items) {
          dispatch(addcartRedux(res.data.cart.items));
        }
      } catch (error) {
        console.error("Error syncing cart on mount:", error);
      }
    };

    syncCart();
  }, [dispatch]);
  const { allProducts } = useSelector((state) => state.auth);
  const [activeBrand, setActiveBrand] = useState("All");
  const filteredProducts =
    activeBrand === "All"
      ? allProducts
      : allProducts.filter((p) => p.company === activeBrand);
  const { CartProduct } = useSelector((state) => state.cart);
  const navigate = useNavigate();

  const handleAddtoCart = async (product) => {
    try {
      let res = await axiosInstance.post(`/cart/addToCart/${product._id}/7`);
      if (res) {
        dispatch(addcartRedux(res.data.cart.items));
        return;
      }
    } catch (error) {
      alert("failed to add in cart",);
    }
  };
  return (
    <div className="bg-[#050505] min-h-screen text-white font-sans selection:bg-[#E0FF22] selection:text-black p-6 md:p-12">
      {/* --- Section Header --- */}
      <div className="mb-12">
        <h2 className="text-4xl md:text-5xl font-black tracking-tighter uppercase italic leading-none">
          Browse <span className="text-[#E0FF22]">Collections.</span>
        </h2>
        <p className="text-gray-500 text-[10px] font-bold tracking-[0.2em] uppercase mt-2">
          Filter by Elite Brands
        </p>
      </div>

      {/* --- Brand Logo Row --- */}
      <div className="flex flex-wrap justify-start sm:justify-center gap-4 md:gap-8 mb-16 border-b border-white/5 pb-10">
        {brands.map((brand) => (
          <div
            key={brand.name}
            onClick={() => setActiveBrand(brand.name)}
            className={`group cursor-pointer transition-all duration-300 px-6 py-4 rounded-2xl border-2 flex flex-col items-center gap-2 ${
              activeBrand === brand.name
                ? "border-[#E0FF22] bg-[#E0FF22]/5 scale-105"
                : "border-white/5 bg-[#121212] opacity-60 hover:opacity-100 hover:border-white/20"
            }`}
          >
            {brand.name === "All" ? (
              <span className="text-[#E0FF22] text-sm font-bold ">
                Mar<span className="text-white">thon</span>
              </span>
            ) : (
              <img
                src={brand.logo}
                alt={brand.name}
                className={`h-8 w-8 md:h-10 md:w-10 object-contain transition-all ${
                  activeBrand === brand.name
                    ? "brightness-100"
                    : "brightness-0 invert"
                }`}
              />
            )}
            <p
              className={`text-[10px] font-black uppercase tracking-widest ${
                activeBrand === brand.name ? "text-[#E0FF22]" : "text-gray-500"
              }`}
            >
              {brand.name}
            </p>
          </div>
        ))}
      </div>

      {/* --- Product Grid --- */}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {filteredProducts.map((product) => (
          <div
            key={product._id}
            className="group relative bg-[#121212] border border-white/5 rounded-3xl overflow-hidden transition-all duration-500 hover:border-[#E0FF22]/30 hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)]"
           onClick={() => navigate(`/homelayout/product/${product._id}`)}
          >
            {/* Product Image Container */}
            <div className="relative aspect-4/5 flex items-center justify-center p-8 overflow-hidden">
              <div className="absolute inset-0 bg-linear-to-b from-white/2 to-transparent pointer-events-none" />
              <img
                src={product.images?.[0]}
                alt={product.productModel}
                className=" w-full h-full object-contain transition-transform duration-700 group-hover:scale-110 group-hover:rotate-[-5deg]"
              />

              {/* Floating Badge */}
              <span className="absolute top-4 left-4 text-[10px] font-black bg-white/5 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 uppercase tracking-widest">
                {product.company}
              </span>
            </div>

            {/* Product Info */}
            <div className="p-6 pt-0">
              <h3 className="font-black text-xl uppercase italic tracking-tighter leading-tight group-hover:text-[#E0FF22] transition-colors">
                {product.productModel}
              </h3>

              <div className="flex justify-between items-end mt-4">
                <p>
                  {product.price.currency} {product.price.amount}
                </p>
                {/* Cart btn */}

                {CartProduct.find((elem) => elem.productId === product._id) ? (
                  <button
                    onClick={() => {
                      navigate("/homelayout/cart");
                    }}
                    className="border-solid border-gray-500 active:scale-92 border text-sm px-3 py-1 rounded hover:border-[#E0FF22]"
                  >
                    Checkout
                  </button>
                ) : (
                  <button
                    onClick={() => handleAddtoCart(product)}
                    className="bg-white text-black p-3 rounded-full hover:bg-[#E0FF22] transition-all active:scale-90 shadow-xl"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Product;
