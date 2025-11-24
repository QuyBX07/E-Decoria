import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "@pages/Home/HomePage";
import ProductPage from "@pages/Products/ProductPage";
import ProductDetailPage from "@pages/Products/ProductDetailPage";
import LoginPage from "@pages/auth/LoginPage";
import RegisterPage from "@pages/auth/RegisterPage";
import ProfilePage from "@/pages/Profile/ProfilePage";
import CartPage from "@/pages/Cart/CartPage";
import CheckoutPage from "./pages/Checkout/CheckoutPage";
import OrderSuccessPage from "./pages/Checkout/OrderSuccessPage";
import OrderDetailPage from "./pages/Orders/OrderDetailPage";
import AdminLayout from "@/components/admin/AdminLayout";
import DashboardPage from "./pages/admin/DashboardPage";
import CategoriesPage from "./pages/admin/CategoriesPage";
import ManageProducts from "./pages/admin/ManageProducts";
import ManagerOrders from "./pages/admin/ManageOrders";
import ManageModels from "./pages/admin/ManageModels";
import ImportsPage from "./pages/admin/ImportsPage";
import ReviewPageWrapper from "@/pages/reviews/ReviewPageWrapper";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/products" element={<ProductPage />} />
        <Route path="/products/:id" element={<ProductDetailPage />} />{" "}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/order-success/:id" element={<OrderSuccessPage />} />
        <Route path="/order/:id" element={<OrderDetailPage />} />
        <Route path="/reviews/:productId" element={<ReviewPageWrapper />} />
        {/* Admin routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="categories" element={<CategoriesPage />} />
          <Route path="products" element={<ManageProducts />} />
          <Route path="orders" element={<ManagerOrders />} />
          <Route path="model" element={<ManageModels />} />
          <Route path="imports" element={<ImportsPage />} />
        </Route>
        {/* 👈 router chi tiết */}
      </Routes>
    </Router>
  );
};

export default App;
