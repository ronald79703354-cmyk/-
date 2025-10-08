import React from 'react';
import { Link } from 'react-router-dom';

const FavoritesPage: React.FC = () => {
  // Assuming favorites list is empty for this demonstration
  const favorites: any[] = [];

  if (favorites.length === 0) {
      return (
        <div className="text-center py-16">
            <div className="flex justify-center mb-6">
                 <svg className="w-24 h-24 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.5l1.318-1.182a4.5 4.5 0 116.364 6.364L12 21l-7.682-7.682a4.5 4.5 0 010-6.364z" />
                </svg>
            </div>
            <h1 className="text-4xl font-bold mb-4">قائمة المفضلة فارغة</h1>
            <p className="text-gray-600 mb-8">أضف المنتجات التي تعجبك لتعود إليها لاحقاً.</p>
            <Link to="/products" className="bg-blue-600 text-white px-8 py-3 rounded-md text-lg font-semibold hover:bg-blue-700 transition-colors">
                تصفح المنتجات
            </Link>
        </div>
      );
  }

  return (
    <div className="text-center py-10">
      <h1 className="text-4xl font-bold mb-4">المفضلة</h1>
      {/* This part would render the list of favorite products */}
    </div>
  );
};

export default FavoritesPage;
