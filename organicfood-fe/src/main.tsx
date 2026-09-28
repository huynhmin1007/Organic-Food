import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import { router } from "./routes/index.tsx";
import { AuthProvider } from "./context/AuthContext.tsx";
import { CartProvider } from "./context/CartContext.tsx";
import { ToastProvider } from "./context/ToastContext.tsx";
import { ModalProvider } from "./context/ModalContext.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ToastProvider>
      <AuthProvider>
        <CartProvider>
          <ModalProvider>
            <RouterProvider router={router} />
          </ModalProvider>
        </CartProvider>
      </AuthProvider>
    </ToastProvider>
  </StrictMode>,
);
