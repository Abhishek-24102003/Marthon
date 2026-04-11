import { createBrowserRouter, RouterProvider } from "react-router";
import Authlayout from "../layouts/Authlayout";
import Home from "../pages/Home";
import HomeLayout from "../layouts/HomeLayout";
import Product from "../pages/Product";
import Cart from "../pages/Cart";
import CreateProduct from "../pages/CreateProduct";
import ForgotPassword from "../components/ForgotPassword";
import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";
import ProductView from "../components/ProductView";
import { axiosInstance } from "../Instances/axiosInstance";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { addUser } from "../features/authSlice";

const AppRouter = () => {
  const dispatch = useDispatch()
 useEffect(() => {
  const fetchUser = async () => {
    try {
      const res = await axiosInstance.get("/auth/current-user", {
        withCredentials: true,
      });

      dispatch(addUser(res.data.user));
      localStorage.setItem("User", JSON.stringify(res.data.user));
    } catch (err) {
      console.log("Not logged in");
    }
  };

  fetchUser();
}, []);
  const router = createBrowserRouter([
    {
      path: "/",
      element: <PublicRoute />,
      children: [
        {
          path: "",
          element: <Authlayout />,
        },
        {
          path: "/forgotPassword",
          element:<ForgotPassword/>
        }
      ],
    },
    {
      path: "/homelayout",
      element: <ProtectedRoute />,
      children: [
        {
          path: "",
          element: <HomeLayout />,
          children: [
            {
              index: true,
              element: <Home />,
            },
            {
              path: "product",
              element: <Product />,
            },
            {
            path: "product/:id",   // ✅ NEW PAGE
            element: <ProductView />,
          },
            {
              path: "cart",
              element: <Cart />,
            },
            {
              path: "createProduct",
              element:<CreateProduct/>
            }
          ],
          },
          
      ],
    },
  ]);
  return <RouterProvider router={router} />;
};

export default AppRouter;
