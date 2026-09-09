import { Route, Routes } from "react-router-dom";
import "./App.css";
import MainLayout from "./layouts/MainLayout";
import HomePage from "./pages/HomePage";
import ProductDetailPage from "./pages/ProductDetailPage";
import { CategoryProvider } from "./contexts/CategoryContext";
import { ProductListPage } from "./pages/ProductListPage";
import { CartProvider } from "./contexts/CartContext";
import LoginPage from "./pages/LoginPage";
import { AuthProvider } from "./contexts/AuthContext";
import RegisterPage from "./pages/RegisterPage";
import VerifyOtpPage from "./pages/VerifyOtpPage";
import CheckoutPage from "./pages/CheckoutPage";
import OrderSuccessPage from "./pages/OrderSuccessPage";
import InfoPage from "./pages/InfoPage";

function App() {
  return (
    <AuthProvider>
      <CategoryProvider>
        <CartProvider>
          <Routes>
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route
              path="/order/place-order-successful"
              element={<OrderSuccessPage />}
            />

            <Route element={<MainLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route
                path="/:category/:productSlug"
                element={<ProductDetailPage />}
              />
              <Route path="/tim-kiem" element={<ProductListPage />} />
              <Route path="/:category" element={<ProductListPage />} />
              <Route path="/account/login" element={<LoginPage />} />
              <Route path="/account/register" element={<RegisterPage />} />
              <Route path="/account/verify-otp" element={<VerifyOtpPage />} />
              <Route path="/account/info" element={<InfoPage />} />
            </Route>
          </Routes>
        </CartProvider>
      </CategoryProvider>
    </AuthProvider>
  );
}

export default App;
