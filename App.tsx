import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

// Layouts
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import BottomNavbar from './components/BottomNavbar';
import ProtectedRoute from './components/ProtectedRoute';
import AdminLayout from './components/admin/AdminLayout';

// Pages
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CategoriesPage from './pages/CategoriesPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import PendingApprovalPage from './pages/PendingApprovalPage';
import OrdersPage from './pages/OrdersPage';
import FavoritesPage from './pages/FavoritesPage';
import SettingsPage from './pages/SettingsPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderConfirmationPage from './pages/OrderConfirmationPage';
import PolicyPage from './pages/PolicyPage';

// Admin Pages
import AdminDashboardPage from './pages/AdminDashboardPage'; // This is the user requests page
import DashboardHomePage from './pages/admin/DashboardHomePage';
import AdminProductsPage from './pages/admin/AdminProductsPage';
import AdminOrdersPage from './pages/admin/AdminOrdersPage';
import AdminTradersPage from './pages/admin/AdminTradersPage';
import AdminPayoutsPage from './pages/admin/AdminPayoutsPage';

import { Role } from './types';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="flex flex-col min-h-screen bg-gray-50 font-sans" dir="rtl">
            <Navbar />
            <main className="flex-grow container mx-auto px-4 py-8 mb-20 md:mb-0">
              <Routes>
                {/* Public Routes */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/pending-approval" element={<PendingApprovalPage />} />
                <Route path="/order-confirmation/:orderId" element={<OrderConfirmationPage />} />


                {/* Trader Routes */}
                <Route path="/" element={<ProtectedRoute allowedRoles={[Role.Trader, Role.Admin]}><HomePage /></ProtectedRoute>} />
                <Route path="/products" element={<ProtectedRoute allowedRoles={[Role.Trader, Role.Admin]}><ProductsPage /></ProtectedRoute>} />
                <Route path="/products/:id" element={<ProtectedRoute allowedRoles={[Role.Trader, Role.Admin]}><ProductDetailPage /></ProtectedRoute>} />
                <Route path="/categories" element={<ProtectedRoute allowedRoles={[Role.Trader, Role.Admin]}><CategoriesPage /></ProtectedRoute>} />
                <Route path="/orders" element={<ProtectedRoute allowedRoles={[Role.Trader, Role.Admin]}><OrdersPage /></ProtectedRoute>} />
                <Route path="/favorites" element={<ProtectedRoute allowedRoles={[Role.Trader, Role.Admin]}><FavoritesPage /></ProtectedRoute>} />
                <Route path="/settings" element={<ProtectedRoute allowedRoles={[Role.Trader, Role.Admin]}><SettingsPage /></ProtectedRoute>} />
                <Route path="/cart" element={<ProtectedRoute allowedRoles={[Role.Trader, Role.Admin]}><CartPage /></ProtectedRoute>} />
                <Route path="/checkout" element={<ProtectedRoute allowedRoles={[Role.Trader, Role.Admin]}><CheckoutPage /></ProtectedRoute>} />
                <Route path="/policy/:slug" element={<ProtectedRoute allowedRoles={[Role.Trader, Role.Admin]}><PolicyPage /></ProtectedRoute>} />
                

                {/* Admin Routes */}
                <Route path="/admin" element={
                  <ProtectedRoute allowedRoles={[Role.Admin]}>
                    <AdminLayout />
                  </ProtectedRoute>
                }>
                  <Route index element={<DashboardHomePage />} />
                  <Route path="dashboard" element={<DashboardHomePage />} />
                  <Route path="requests" element={<AdminDashboardPage />} />
                  <Route path="products" element={<AdminProductsPage />} />
                  <Route path="orders" element={<AdminOrdersPage />} />
                  <Route path="traders" element={<AdminTradersPage />} />
                  <Route path="payouts" element={<AdminPayoutsPage />} />
                </Route>
              </Routes>
            </main>
            <Footer />
            <div className="md:hidden">
              <BottomNavbar />
            </div>
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
};

export default App;