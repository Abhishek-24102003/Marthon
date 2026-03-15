import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { axiosInstance } from "../Instances/axiosInstance";

// 1. Define the available sizes outside the component
const availableSizes = [6, 7, 8, 9, 10, 11, 12];

const CreateProduct = () => {
  const [images, setImages] = useState(null);
  const [loading, setLoading] = useState(false); // Added loading state

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      heroProduct: false, // Ensures the checkbox starts as false
    },
  });

  const onSubmit = async (data) => {
    setLoading(true); // Start loader
    const formData = new FormData();

    // Append Images
    if (images) {
      Array.from(images).forEach((file) => {
        formData.append("images", file);
      });
    }

    // 2. Updated Size Logic: Loop through the array of selected sizes
    if (data.size && Array.isArray(data.size)) {
      data.size.forEach((s) => {
        formData.append("size", s);
      });
    }

    // New Hero Product Boolean Logic
    formData.append("heroProduct", data.heroProduct);

    formData.append("company", data.company);
    formData.append("productModel", data.productModel);
    formData.append("gender", data.gender);
    formData.append("amount", data.amount);
    formData.append("productType", data.productType);
    formData.append("description", data.description);

    try {
      await axiosInstance.post("/product/createProduct", formData);
      alert("Product Created Successfully!");
      reset();
      setImages(null);
    } catch (error) {
      console.error("Error creating product", error);
    } finally {
      setLoading(false); // Stop loader regardless of success or error
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen  bg-[#050505] p-4 sm:p-10 font-sans">
      <div className="w-full max-w-4xl bg-[#121212] border border-white/10 rounded-[2.5rem] p-8 sm:p-12 shadow-2xl">
        <div className="mb-10">
          <h2 className="text-4xl font-black tracking-tighter text-white uppercase italic leading-none">
            New <span className="text-[#E0FF22]">Product</span>
          </h2>
          <p className="text-gray-500 text-[10px] font-bold tracking-[0.2em] uppercase mt-2">
            Inventory Management
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          {/* Image Section */}
          <div className="space-y-4">
            <label className="text-[10px] font-bold tracking-widest text-gray-500 uppercase ml-1">
              Product Visual
            </label>
            <div className="relative group aspect-square rounded-3xl bg-black border border-white/5 flex items-center justify-center overflow-hidden transition-all hover:border-[#E0FF22]/30">
              {images ? (
                <img
                  src={URL.createObjectURL(images[0])}
                  alt="preview"
                  className="w-full h-full object-contain p-4"
                />
              ) : (
                <div className="text-center p-6">
                  <p className="text-gray-600 text-xs font-bold uppercase tracking-widest group-hover:text-gray-400 transition-colors">
                    Drop Image Here
                  </p>
                </div>
              )}
              <input
                type="file"
                multiple
                onChange={(e) => setImages(e.target.files)}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold tracking-widest text-gray-500 uppercase ml-1">
                Company
              </label>
              <input
                type="text"
                {...register("company", { required: true })}
                className="w-full px-5 py-4 bg-white/5 border border-white/5 rounded-2xl text-white focus:outline-none focus:border-[#E0FF22]"
                placeholder="e.g. Adidas"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold tracking-widest text-gray-500 uppercase ml-1">
                Product Model
              </label>
              <input
                type="text"
                {...register("productModel", { required: true })}
                className="w-full px-5 py-4 bg-white/5 border border-white/5 rounded-2xl text-white focus:outline-none focus:border-[#E0FF22]"
                placeholder="e.g. Pomazor"
              />
            </div>

            {/* Responsive Size Grid */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold tracking-widest text-gray-500 uppercase ml-1">
                Available Sizes
              </label>
              <div className="grid grid-cols-4 gap-2">
                {availableSizes.map((size) => (
                  <label key={size} className="cursor-pointer group">
                    <input
                      type="checkbox"
                      value={size}
                      {...register("size")}
                      className="hidden peer"
                    />
                    <div className="flex items-center justify-center p-3 bg-white/5 border border-white/5 rounded-xl text-white text-xs font-bold transition-all peer-checked:bg-[#E0FF22] peer-checked:text-black peer-checked:border-[#E0FF22]">
                      {size}
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold tracking-widest text-gray-500 uppercase ml-1">
                Gender
              </label>
              <select
                {...register("gender", { required: true })}
                className="w-full px-5 py-4 bg-white/5 border border-white/5 rounded-2xl text-white focus:outline-none focus:border-[#E0FF22] appearance-none"
              >
                <option value="men" className="bg-[#121212]">
                  Men
                </option>
                <option value="women" className="bg-[#121212]">
                  Women
                </option>
                <option value="unisex" className="bg-[#121212]">
                  Unisex
                </option>
              </select>
            </div>
          </div>

          <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold tracking-widest text-gray-500 uppercase ml-1">
                Amount
              </label>
              <input
                type="number"
                placeholder="12999"
                {...register("amount", { required: true })}
                className="w-full px-5 py-4 bg-white/5 border border-white/5 rounded-2xl text-white focus:outline-none focus:border-[#E0FF22] font-mono"
              />
            </div>
            <div className="md:col-span-2 space-y-2">
              <label className="text-[10px] font-bold tracking-widest text-gray-500 uppercase ml-1">
                Product Type
              </label>
              <input
                type="text"
                placeholder="sports/casual/running"
                {...register("productType", { required: true })}
                className="w-full px-5 py-4 bg-white/5 border border-white/5 rounded-2xl text-white focus:outline-none focus:border-[#E0FF22]"
              />
            </div>

            {/* HERO PRODUCT CHECKBOX SECTION */}
            <div className="md:col-span-3 flex items-center justify-between p-5 bg-white/5 border border-white/5 rounded-2xl transition-all hover:border-[#E0FF22]/20">
              <div className="flex flex-col">
                <span className="text-[10px] font-bold tracking-widest text-white uppercase">
                  Hero Product
                </span>
                <span className="text-[9px] text-gray-500 uppercase tracking-tighter">
                  Feature this item on the homepage showcase
                </span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  {...register("heroProduct")}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#E0FF22]"></div>
              </label>
            </div>

            <div className="md:col-span-3 space-y-2">
              <label className="text-[10px] font-bold tracking-widest text-gray-500 uppercase ml-1">
                Description
              </label>
              <textarea
                rows="3"
                placeholder="about the product.."
                {...register("description", { required: true })}
                className="w-full px-5 py-4 bg-white/5 border border-white/5 rounded-2xl text-white focus:outline-none focus:border-[#E0FF22] resize-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading} // Disable button while loading
            className={`md:col-span-2 w-full py-5 mt-4 font-black tracking-[0.2em] text-black uppercase transition-all duration-300 rounded-2xl flex items-center justify-center 
              ${loading ? "bg-gray-500 cursor-not-allowed opacity-70" : "bg-[#E0FF22] hover:shadow-[0_0_40px_rgba(224,255,34,0.3)]"}`}
          >
            {loading ? (
              <div className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </div>
            ) : (
              "Add Product to Store"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateProduct;