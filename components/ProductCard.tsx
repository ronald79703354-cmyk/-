import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { Product } from '../types';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/products/${product.id}`);
  };

  return (
    <div 
      className="bg-white rounded-lg shadow-md overflow-hidden transform hover:-translate-y-1 transition-transform duration-300 flex flex-col cursor-pointer"
      onClick={handleCardClick}
    >
      <img src={product.imageUrl} alt={product.name} className="w-full h-48 object-cover" />
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-lg font-bold mb-2 flex-grow">{product.name}</h3>
        <p className="text-gray-500 text-sm mb-3">متوفر: {product.stock} قطعة</p>
        <div className="mt-auto">
          <p className="text-xs text-gray-500">سعر التكلفة</p>
          <div className="text-lg font-bold text-blue-600">{product.price.toFixed(2)} دينار</div>
        </div>
      </div>
       <div className="bg-gray-50 p-3 text-center text-sm text-blue-700 font-semibold">
          عرض التفاصيل
       </div>
    </div>
  );
};

export default ProductCard;
