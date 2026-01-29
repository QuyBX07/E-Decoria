import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";

/* Pages */
import HomePage from "@pages/Home/HomePage";
import ProductPage from "@pages/Products/ProductPage";
import ProductDetailPage from "@pages/Products/ProductDetailPage";
import LoginPage from "@pages/auth/LoginPage";
import RegisterPage from "@pages/auth/RegisterPage";
import ProfilePage from "@/pages/Profile/ProfilePage";
import CartPage from "@/pages/Cart/CartPage";
import CheckoutPage from "@/pages/Checkout/CheckoutPage";
import OrderSuccessPage from "@/pages/Checkout/OrderSuccessPage";
import OrderDetailPage from "@/pages/Orders/OrderDetailPage";
import ReviewPageWrapper from "@/pages/reviews/ReviewPageWrapper";
import VoucherPage from "@/pages/Voucher/VoucherPage";

/* Admin */
import AdminLayout from "@/components/admin/AdminLayout";
import DashboardPage from "@/pages/admin/DashboardPage";
import CategoriesPage from "@/pages/admin/CategoriesPage";
import ManageProducts from "@/pages/admin/ManageProducts";
import ManagerOrders from "@/pages/admin/ManageOrders";
import ManageModels from "@/pages/admin/ManageModels";
import ImportsPage from "@/pages/admin/ImportsPage";
import ManageVoucherPage from "@/pages/admin/ManageVoucherPage";
import ManageNotifications from "@/pages/admin/ManageNotifications";
import ManageUsers from "@/pages/admin/ManageUsers";

/* Chat */
import ChatWidget from "@/components/chatbox/ChatWidget";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";

/* ================= APP ROUTES ================= */
const AppRoutes: React.FC = () => {
  const location = useLocation();

  /** ❌ Những route không hiện chat */
  const HIDE_CHAT_PREFIX = ["/admin", "/login", "/register"];
  const hideChat = HIDE_CHAT_PREFIX.some((path) =>
    location.pathname.startsWith(path)
  );

  return (
    <>
      <Routes>
        {/* Public */}
        <Route path="/" element={<HomePage />} />
        <Route path="/products" element={<ProductPage />} />
        <Route path="/products/:id" element={<ProductDetailPage />} />
        <Route path="/vouchers" element={<VoucherPage />} />
        <Route path="/reviews/:productId" element={<ReviewPageWrapper />} />

        {/* Auth */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* User */}
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/order/:id" element={<OrderDetailPage />} />
        <Route path="/order-success/:id" element={<OrderSuccessPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />

        {/* Admin */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="categories" element={<CategoriesPage />} />
          <Route path="products" element={<ManageProducts />} />
          <Route path="orders" element={<ManagerOrders />} />
          <Route path="model" element={<ManageModels />} />
          <Route path="imports" element={<ImportsPage />} />
          <Route path="vouchers" element={<ManageVoucherPage />} />
          <Route path="notifications" element={<ManageNotifications />} />
          <Route path="users" element={<ManageUsers />} />
        </Route>
      </Routes>

      {/* 🤖 Chat widget */}
      {!hideChat && <ChatWidget />}
    </>
  );
};

/* ================= ROOT APP ================= */
const App: React.FC = () => {
  return (
    <Router>
      <AppRoutes />
      <Toaster position="top-right" />
    </Router>
  );
};

export default App;
