import { createBrowserRouter, RouterProvider } from "react-router";
import Authlayout from "../layouts/Authlayout";
import Home from "../pages/Home";
import { useEffect } from "react";
import { axiosInstance } from "../Instances/axiosInstance";
import { useDispatch, useSelector } from "react-redux";
import { addUser, setAllproducts, setIsloading } from "../features/authSlice";
import HomeLayout from "../layouts/HomeLayout";
import Product from "../pages/Product";
import Cart from "../pages/Cart";
import CreateProduct from "../pages/CreateProduct";
import ForgotPassword from "../components/ForgotPassword";
import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";
import ProductView from "../components/ProductView";

const AppRouter = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  useEffect(() => {
    (async () => {
      try {
        let res = await axiosInstance.get("/auth/currentUser");
        if (res) {
          dispatch(addUser(res.data.user));
        }
      } catch (error) {
        console.log("error in currentuser->", error);
      } finally {
          dispatch(setIsloading());
      }
    })();
  }, [dispatch]);
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
