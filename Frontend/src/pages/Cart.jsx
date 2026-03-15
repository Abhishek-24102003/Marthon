import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { axiosInstance } from "../Instances/axiosInstance";
import { addcartRedux } from "../features/cartSlice";
import { toast } from 'react-toastify';
// --- SUB-COMPONENT: Individual Cart Item ---

// Handles its own local state to prevent "Global change" bugs
const CartItem = ({ item, onUpdate, onDelete }) => {
  const [localSize, setLocalSize] = useState(
    item.cartSize || item.size || null,
  );
  const [localQuantity, setLocalQuantity] = useState(item.cartQuantity || 1);
  const [isModified, setIsModified] = useState(false);

  // Detect if user changed something from the original database values
  useEffect(() => {
    const hasChanged =
      localSize !== item.cartSize || localQuantity !== item.cartQuantity;
    setIsModified(hasChanged);
  }, [localSize, localQuantity, item]);

  const handleUpdate = () => {
    onUpdate(item._id, localQuantity, localSize);
  };

  return (
    <div className="group flex flex-col sm:flex-row items-center gap-6 bg-[#121212] border border-white/5 p-6 rounded-4xl hover:border-[#E0FF22]/20 transition-all">
      {/* Product Image */}
      <div className="w-full sm:w-40 h-40 bg-black rounded-2xl flex items-center justify-center p-4">
        <img
          src={item.images?.[0]}
          alt={item.productModel}
          className="w-full h-full object-contain group-hover:scale-110 group-hover:rotate-[-5deg] transition-transform duration-500"
        />
      </div>

      {/* Product Details */}
      <div className="flex-1 space-y-1 w-full">
        <div className="flex justify-between items-start">
          <div>
            <span className="text-[10px] font-bold text-[#E0FF22] uppercase tracking-widest">
              {item.company}
            </span>
            <h3 className="text-xl font-black uppercase italic tracking-tighter">
              {item.productModel}
            </h3>
          </div>
          <button
            onClick={() => onDelete(item._id)}
            className="text-gray-600 hover:text-red-500 transition-colors p-2"
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
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>

        <p className="text-gray-500 text-xs line-clamp-1 mb-4">
          {item.description}
        </p>

        {/* Controls */}
        <div className="flex flex-wrap items-center gap-6 pt-4">
          {/* Quantity Spinner */}
          <div className="flex items-center border border-white/10 rounded-full px-2 py-1 bg-black/50">
            <button
              onClick={() => setLocalQuantity((q) => Math.max(1, q - 1))}
              className="p-2 hover:text-[#E0FF22] text-xl font-bold"
            >
              {" "}
              -{" "}
            </button>
            <span className="px-4 font-mono font-bold text-sm w-8 text-center">
              {localQuantity}
            </span>
            <button
              onClick={() => setLocalQuantity((q) => q + 1)}
              className="p-2 hover:text-[#E0FF22] text-xl font-bold"
            >
              {" "}
              +{" "}
            </button>
          </div>

          {/* Size Selector */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
              Size:
            </span>
            <div className="flex gap-1">
              {[7, 8, 9, 10, 11].map((s) => (
                <button
                  key={s}
                  onClick={() => setLocalSize(s)}
                  className={`w-9 h-9 rounded-lg flex items-center justify-center text-[10px] font-bold transition-all border 
                    ${
                      localSize === s
                        ? "bg-[#E0FF22] text-black border-[#E0FF22]"
                        : "bg-white/5 text-gray-400 border-white/5 hover:border-white/30"
                    }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Price & Update Action */}
      <div className="flex flex-col items-end gap-4 min-w-30">
        <p className="text-[#E0FF22] font-mono text-xl font-bold">
          {item.price?.currency}{" "}
          {(item.price?.amount * localQuantity).toLocaleString()}
        </p>
        <button
          onClick={handleUpdate}
          disabled={!isModified}
          className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all
            ${
              isModified
                ? "bg-red-600 text-white opacity-100 translate-y-0"
                : "bg-gray-800 text-gray-500 opacity-0 translate-y-2 pointer-events-none"
            }`}
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};

// --- MAIN COMPONENT: Cart Page ---
const Cart = () => {
  const { allProducts } = useSelector((state) => state.auth);
  const [cartItemsData, setCartItemsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false); // Added loader state
  const dispatch = useDispatch();
  const fetchCart = useCallback(async () => {
    try {
      const res = await axiosInstance.get("/cart");
      if (res.data?.cart?.items) {
        setCartItemsData(res.data.cart.items);
        dispatch(addcartRedux(res.data.cart.items));
      }
    } catch (error) {
      console.error("Cart fetch error:", error);
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const handleUpdateProduct = async (productId, quantity, size) => {
    try {
      // Note: Ensure your backend route matches this structure
      await axiosInstance.post(`/cart/update/${productId}/${quantity}/${size}`);
      fetchCart(); // Refresh data from server
    } catch (error) {
      toast.error("Failed to update cart");
    }
  };

  const handleDeleteProduct = async (productId) => {
    try {
      await axiosInstance.post(`/cart/deleteProduct/${productId}`);
      fetchCart();
    } catch (error) {
      toast.error("Could not remove item");
    }
  };

  // Merge "Cart Item" (quantities) with "Full Product Data" (images, names)
  const fullCartItems = cartItemsData
    .map((cartItem) => {
      const productInfo = allProducts.find((p) => p._id === cartItem.productId);
      if (!productInfo) return null;
      return {
        ...productInfo,
        cartQuantity: cartItem.quantity,
        cartSize: cartItem.size,
        cartItemId: cartItem._id,
      };
    })
    .filter(Boolean);

  const subtotal = fullCartItems.reduce(
    (acc, item) => acc + (item.price?.amount || 0) * item.cartQuantity,
    0,
  );

  if (loading)
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-[#E0FF22] font-black uppercase italic">
        Loading Gear...
      </div>
    );
  const handleOrder = async () => {
    setIsPlacingOrder(true); // Start loader
    try {
      let res = await axiosInstance.get("/user/order-placed");
      if (res) {
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error("Failed to place order");
      console.error(error);
    } finally {
      setIsPlacingOrder(false); // Stop loader
    }
  };
  return (
    <div className="bg-[#050505] min-h-screen text-white font-sans p-6 md:p-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase italic leading-none">
            Your <span className="text-[#E0FF22]">Gear.</span>
          </h2>
          <p className="text-gray-500 text-xs font-bold tracking-[0.2em] uppercase mt-4">
            {fullCartItems.length} Items Locked In
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* List Section */}
          <div className="lg:col-span-2 space-y-6">
            {fullCartItems.length > 0 ? (
              fullCartItems.map((item) => (
                <CartItem
                  key={item._id}
                  item={item}
                  onUpdate={handleUpdateProduct}
                  onDelete={handleDeleteProduct}
                />
              ))
            ) : (
              <div className="text-center py-32 border border-dashed border-white/10 rounded-[3rem]">
                <p className="text-gray-600 uppercase font-black tracking-[0.2em]">
                  The vault is empty
                </p>
                <button className="mt-6 text-[#E0FF22] text-xs font-bold uppercase underline decoration-2 underline-offset-4">
                  Browse Collection
                </button>
              </div>
            )}
          </div>

          {/* Sidebar Section */}
          <div className="lg:col-span-1">
            <div className="bg-[#121212] border border-white/5 p-8 rounded-[2.5rem] sticky top-24">
              <h3 className="text-2xl font-black uppercase italic tracking-tighter mb-8">
                Checkout <span className="text-[#E0FF22]">Intel</span>
              </h3>

              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 font-bold uppercase tracking-widest">
                    Subtotal
                  </span>
                  <span className="font-mono font-bold text-white">
                    Rs {subtotal.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 font-bold uppercase tracking-widest">
                    Delivery
                  </span>
                  <span className="text-[#E0FF22] font-black tracking-tighter italic">
                    COMPLIMENTARY
                  </span>
                </div>
                <div className="h-px bg-white/10 my-6"></div>
                <div className="flex justify-between items-end">
                  <span className="text-xl font-black uppercase italic tracking-tighter">
                    Total Due
                  </span>
                  <span className="text-3xl font-mono font-black text-[#E0FF22]">
                    Rs {subtotal.toLocaleString()}
                  </span>
                </div>
              </div>

              <button
                onClick={handleOrder}
                disabled={isPlacingOrder}
                className="w-full bg-[#E0FF22] text-black py-5 rounded-2xl font-black uppercase tracking-widest hover:brightness-110 hover:shadow-[0_0_40px_rgba(224,255,34,0.2)] transition-all active:scale-[0.98] flex items-center justify-center gap-2"
              >
               {isPlacingOrder ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Placing Order...
                  </>
               ) : "Place Order"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;