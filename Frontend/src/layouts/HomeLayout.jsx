import React, { useEffect } from "react";
import { Outlet } from "react-router";
import Navbar from "../components/Navbar";
import { useDispatch } from "react-redux";
import { setAllproducts } from "../features/authSlice";
import { axiosInstance } from "../Instances/axiosInstance";
import Footer from "../components/Footer";

const HomeLayout = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchMarthonProducts = async () => {
      try {
        const { data } = await axiosInstance.get("/product");
        if (data) {
          dispatch(setAllproducts(data.products)); //
        }
      } catch (error) {
        console.error("Failed to fetch products:", error);
      }
    };

    fetchMarthonProducts();
  }, [dispatch]); // Runs once when HomeLayout mounts after login
 
  return (
    <div className="h-screen relative">
      <div className="h-[7vh] flex justify-center gap-2 items-center  bg-black text-white py-2 fixed w-full opacity-100 z-999"><Navbar className="h-full" /></div>
      <div className="absolute top-[7vh] w-full bg-black"> <Outlet /><Footer/></div>
     
    </div>
  );
};

export default HomeLayout;
