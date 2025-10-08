import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import Spinner from '../components/Spinner';

const CartPage: React.FC = () => {
  const { cart, updateQuantity, removeFromCart, loading, itemCount, totalCost, totalRevenue, netProfit } = useCart();
  const navigate = useNavigate();

  if (loading && cart.length === 0) {
    return <div className="flex justify-center items-center h-64"><Spinner /></div>;
  }

  if (itemCount === 0) {
    return (
      <div className="text-center py-16">
        <div className="flex justify-center mb-6">
            <svg className="w-24 h-24 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
        </div>
        <h1 className="text-4xl font-bold mb-4">سلة التسوق فارغة</h1>
        <p className="text-gray-600 mb-8">لم تقم بإضافة أي منتجات إلى السلة بعد.</p>
        <button onClick={() => navigate('/')} className="bg-blue-600 text-white px-8 py-3 rounded-md text-lg font-semibold hover:bg-blue-700 transition-colors">
          تصفح المنتجات
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold">سلة التسوق</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cart.map(item => (
            <div key={item.product.id} className="bg-white p-4 rounded-lg shadow-md flex items-center space-x-4 space-x-reverse">
              <img src={item.product.imageUrl} alt={item.product.name} className="w-24 h-24 object-cover rounded-md" />
              <div className="flex-grow">
                <h2 className="font-bold text-lg">{item.product.name}</h2>
                <p className="text-sm text-gray-500">سعر البيع: {item.sellingPrice.toFixed(2)} دينار</p>
                <p className="text-sm text-gray-500">الربح: {(item.sellingPrice - item.product.price).toFixed(2)} دينار</p>
              </div>
              <div className="flex items-center space-x-3 space-x-reverse">
                 <input 
                    type="number"
                    value={item.quantity}
                    onChange={(e) => updateQuantity(item.product.id, parseInt(e.target.value) || 1)}
                    min="1"
                    max={item.product.stock}
                    className="w-16 p-2 border rounded-md text-center"
                 />
                 <button onClick={() => removeFromCart(item.product.id)} className="text-red-500 hover:text-red-700 transition-colors">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                 </button>
              </div>
            </div>
          ))}
        </div>

        {/* Cart Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-lg shadow-md sticky top-8 space-y-4">
            <h2 className="text-2xl font-bold border-b pb-3">ملخص السلة</h2>
            <div className="flex justify-between">
              <span>إجمالي التكلفة:</span>
              <span className="font-semibold">{totalCost.toFixed(2)} دينار</span>
            </div>
            <div className="flex justify-between">
              <span>إجمالي الإيرادات:</span>
              <span className="font-semibold">{totalRevenue.toFixed(2)} دينار</span>
            </div>
            <div className="bg-green-100 text-green-800 p-3 rounded-md flex justify-between text-lg">
              <span className="font-bold">الربح الصافي:</span>
              <span className="font-bold">{netProfit.toFixed(2)} دينار</span>
            </div>
            <button 
              onClick={() => navigate('/checkout')}
              className="w-full bg-blue-600 text-white py-3 rounded-md text-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              المتابعة لإتمام الطلب
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
