
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Role } from '../types';

const Navbar: React.FC = () => {
  const { user, logout, loading } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <header className="bg-white shadow-md">
      <nav className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-blue-600">
          منصة بداية
        </Link>
        <div className="hidden md:flex items-center space-x-6 space-x-reverse">
          <Link to="/" className="text-gray-600 hover:text-blue-500 transition-colors">الرئيسية</Link>
          <Link to="/products" className="text-gray-600 hover:text-blue-500 transition-colors">المنتجات</Link>
          <Link to="/categories" className="text-gray-600 hover:text-blue-500 transition-colors">الأقسام</Link>
          {user && user.role === Role.Admin && (
            <Link to="/admin" className="text-gray-600 hover:text-blue-500 transition-colors">لوحة التحكم</Link>
          )}
        </div>
        <div className="flex items-center space-x-3 space-x-reverse">
          {loading ? (
            <div className="text-gray-500">جاري التحميل...</div>
          ) : user ? (
            <>
              <span className="text-gray-700">أهلاً، {user.fullName.split(' ')[0]}</span>
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors"
              >
                تسجيل الخروج
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-blue-600 px-4 py-2 rounded-md hover:bg-gray-100 transition-colors"
              >
                دخول
              </Link>
              <Link
                to="/register"
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                تسجيل جديد
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;