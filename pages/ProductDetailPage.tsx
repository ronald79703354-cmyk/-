import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiService } from '../services/apiService';
import type { Product } from '../types';
import { useCart } from '../hooks/useCart';
import Spinner from '../components/Spinner';

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart, loading: cartLoading } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [sellingPrice, setSellingPrice] = useState(0);
  const [mainImage, setMainImage] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const data = await apiService.getProductById(parseInt(id, 10));
        if (data) {
          setProduct(data);
          setSellingPrice(data.minPrice);
          setMainImage(data.imageUrl);
        } else {
          setError('لم يتم العثور على المنتج.');
        }
      } catch (err) {
        setError('فشل في تحميل بيانات المنتج.');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);
  
  const handleAddToCart = () => {
      if(product) {
          addToCart(product, quantity, sellingPrice);
          // Optionally navigate to cart or show a success message
          navigate('/cart');
      }
  }

  if (loading) {
    return <div className="flex justify-center items-center h-64"><Spinner /></div>;
  }

  if (error) {
    return <div className="text-center text-red-500 text-xl py-10">{error}</div>;
  }

  if (!product) {
    return null;
  }

  const profit = sellingPrice - product.price;

  return (
    <div className="bg-white p-4 sm:p-8 rounded-lg shadow-lg">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Image Gallery */}
        <div>
          <img src={mainImage} alt={product.name} className="w-full h-auto rounded-lg shadow-md mb-4" />
          <div className="flex space-x-2 space-x-reverse">
            {[product.imageUrl, ...product.images].map((img, index) => (
                <img 
                    key={index} 
                    src={img} 
                    alt={`${product.name} view ${index + 1}`} 
                    className={`w-20 h-20 object-cover rounded-md cursor-pointer border-2 ${mainImage === img ? 'border-blue-500' : 'border-transparent'}`}
                    onClick={() => setMainImage(img)}
                />
            ))}
          </div>
        </div>

        {/* Product Details */}
        <div className="space-y-6">
          <h1 className="text-4xl font-bold">{product.name}</h1>
          <p className="text-gray-600 text-lg">{product.description}</p>
          <div className="bg-gray-100 p-4 rounded-lg">
            <div className="flex justify-between items-center text-lg">
              <span className="font-semibold">سعر التكلفة:</span>
              <span className="font-bold">{product.price.toFixed(2)} دينار</span>
            </div>
            <div className="flex justify-between items-center text-lg mt-2">
              <span className="font-semibold">المخزون المتوفر:</span>
              <span className="font-bold text-green-600">{product.stock} قطعة</span>
            </div>
          </div>
          
          {/* Price Slider */}
          <div className="space-y-4">
              <label htmlFor="sellingPrice" className="block font-semibold text-lg">حدد سعر البيع للزبون:</label>
              <input
                  id="sellingPrice"
                  type="range"
                  min={product.minPrice}
                  max={product.maxPrice}
                  value={sellingPrice}
                  onChange={(e) => setSellingPrice(parseFloat(e.target.value))}
                  className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer range-lg accent-blue-600"
              />
              <div className="flex justify-between text-sm text-gray-500">
                  <span>{product.minPrice} دينار</span>
                  <span>{product.maxPrice} دينار</span>
              </div>
              <div className="bg-blue-100 text-blue-800 p-4 rounded-lg text-center">
                  <p className="text-lg">سعر البيع المحدد: <span className="font-bold text-2xl">{sellingPrice.toFixed(2)}</span> دينار</p>
                  <p className="text-md mt-1">ربحك من هذه القطعة: <span className="font-bold text-green-700">{profit.toFixed(2)}</span> دينار</p>
              </div>
          </div>

          {/* Quantity */}
          <div className="flex items-center space-x-4 space-x-reverse">
            <label htmlFor="quantity" className="font-semibold text-lg">الكمية:</label>
            <input
              id="quantity"
              type="number"
              min="1"
              max={product.stock}
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value))}
              className="w-24 px-3 py-2 border rounded-md"
            />
          </div>

          {/* Add to Cart Button */}
          <button 
            onClick={handleAddToCart}
            disabled={cartLoading}
            className="w-full bg-blue-600 text-white py-4 rounded-lg text-xl font-bold hover:bg-blue-700 transition-colors disabled:bg-blue-300">
            {cartLoading ? 'جاري الإضافة...' : 'إضافة إلى السلة'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
