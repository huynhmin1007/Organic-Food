import { createBrowserRouter, Navigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import HomePage from "../pages/HomePage";
import NotFoundPage from "../pages/NotFoundPage";
import ProductDetailPage from "../pages/ProductDetailPage";
import ProductListPage from "../pages/ProductListPage";
import { productListLoader } from "./productListLoader";
import { productLoader } from "./productLoader";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import AccountLayout from "../layouts/AccountLayout";
import AccountProfilePage from "../pages/AccountProfilePage";
import AccountAddressesPage from "../pages/AccountAddressesPage";
import AccountOrdersPage from "../pages/AccountOrdersPage";
import CheckoutPage from "../pages/CheckoutPage";
import OrderDetailPage from "../pages/OrderDetailPage";
import { orderLoader } from "./orderLoader";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { index: true, element: <HomePage /> },
      {
        path: "product/:slug",
        element: <ProductDetailPage />,
        loader: productLoader,
      },
      {
        path: "/products",
        element: <ProductListPage />,
        loader: productListLoader,
      },
      {
        path: "/account/login",
        element: <LoginPage />,
      },
      {
        path: "/account/register",
        element: <RegisterPage />,
      },
      {
        path: "/account",
        element: <AccountLayout />,
        children: [
          { index: true, element: <Navigate to="profile" replace /> },
          { path: "profile", element: <AccountProfilePage /> },
          { path: "addresses", element: <AccountAddressesPage /> },
          { path: "orders", element: <AccountOrdersPage /> },
        ],
      },
    ],
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
  {
    path: "/checkout",
    element: <CheckoutPage />,
  },
  { path: "/orders/:code", element: <OrderDetailPage />, loader: orderLoader },
]);
