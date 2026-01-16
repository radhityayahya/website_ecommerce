import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import AuthLayout from "../layouts/AuthLayout";
import AdminLayout from "../layouts/AdminLayout";
import UserLayout from "../layouts/UserLayout";
import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";
import DashboardPage from "../pages/admin/DashboardPage";
import ProductManagementPage from "../pages/admin/ProductManagementPage";
import PurchaseHistoryPage from "../pages/admin/PurchaseHistoryPage";
import SalesHistoryPage from "../pages/admin/SalesHistoryPage";
import InvoicesPage from "../pages/admin/InvoicesPage";
import HomePage from "../pages/user/HomePage";
import BookstorePage from "../pages/user/BookstorePage";
import BookDetailPage from "../pages/user/BookDetailPage";
import CartPage from "../pages/user/CartPage";
import CheckoutPage from "../pages/user/CheckoutPage";
import PaymentQRISPage from "../pages/user/PaymentQRISPage";
import OrderSuccessPage from "../pages/user/OrderSuccessPage";
import UserInvoicesPage from "../pages/user/UserInvoicesPage";
import InvoiceDetail from "../pages/user/InvoiceDetail";
import UserDataPage from "../pages/user/UserDataPage";
import WishlistPage from "../pages/user/WishlistPage";
import ShippingPage from "../pages/user/ShippingPage";
import OrderDetailPage from "../pages/user/OrderDetailPage";
const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<UserLayout />}>
        <Route index element={<HomePage />} />
        <Route path="bookstore" element={<BookstorePage />} />
        <Route path="book/:id" element={<BookDetailPage />} />
        <Route path="checkout" element={<CheckoutPage />} />
        <Route path="payment/qris/:orderId" element={<PaymentQRISPage />} />
        <Route path="order/success/:orderId" element={<OrderSuccessPage />} />
        <Route path="shipping" element={<ShippingPage />} />
      </Route>
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>
      <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="products" element={<ProductManagementPage />} />
          <Route path="purchases" element={<PurchaseHistoryPage />} />
          <Route path="sales" element={<SalesHistoryPage />} />
          <Route path="invoices" element={<InvoicesPage />} />
        </Route>
      </Route>
      <Route element={<ProtectedRoute allowedRoles={["user"]} />}>
        <Route element={<UserLayout />}>
          <Route path="cart" element={<CartPage />} />
          <Route path="invoice" element={<UserInvoicesPage />} />
          <Route path="invoice/:id" element={<InvoiceDetail />} />
          <Route path="profile" element={<UserDataPage />} />
          <Route path="order/:id" element={<OrderDetailPage />} />
          <Route path="wishlist" element={<WishlistPage />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
export default AppRoutes;
