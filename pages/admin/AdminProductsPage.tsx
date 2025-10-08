
import React, { useState, useEffect, useCallback } from 'react';
import { apiService } from '../../services/apiService';
import type { Product, Category } from '../../types';
import Spinner from '../../components/Spinner';
import ProductModal from '../../components/admin/ProductModal';

const AdminProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Partial<Product> | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [productsData, categoriesData] = await Promise.all([
        apiService.getProducts(),
        apiService.getCategories(),
      ]);
      setProducts(productsData);
      setCategories(categoriesData);
    } catch (error) {
      console.error("Failed to fetch data", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleOpenModal = (product: Partial<Product> | null = null) => {
    setSelectedProduct(product || { name: '', description: '', price: 0, stock: 0, categoryId: categories[0]?.id || 1 });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  const handleSaveProduct = async (product: Partial<Product>) => {
    try {
      await apiService.saveProduct(product);
      handleCloseModal();
      await fetchData(); // Refresh data
    } catch (error) {
      console.error("Failed to save product", error);
      // You might want to show an error to the user here
    }
  };
  
  const handleDeleteProduct = async (productId: number) => {
      if (window.confirm('هل أنت متأكد من حذف هذا المنتج؟')) {
          try {
              await apiService.deleteProduct(productId);
              await fetchData(); // Refresh data
          } catch (error) {
              console.error("Failed to delete product", error);
              // You might want to show an error to the user here
          }
      }
  };

  if (loading) {
    return <div className="flex justify-center p-16"><Spinner /></div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">إدارة المنتجات</h1>
        <button
          onClick={() => handleOpenModal()}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          إضافة منتج جديد
        </button>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md overflow-x-auto">
        {products.length > 0 ? (
          <table className="w-full text-right min-w-[600px]">
            <thead className="border-b">
              <tr>
                <th className="p-2">الصورة</th>
                <th className="p-2">الاسم</th>
                <th className="p-2">السعر</th>
                <th className="p-2">المخزون</th>
                <th className="p-2">إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => (
                <tr key={product.id} className="border-b last:border-b-0 hover:bg-gray-50">
                  <td className="p-2">
                    <img src={product.imageUrl} alt={product.name} className="w-12 h-12 object-cover rounded" />
                  </td>
                  <td className="p-2 font-semibold">{product.name}</td>
                  <td className="p-2">{product.price.toFixed(2)} دينار</td>
                  <td className="p-2">{product.stock}</td>
                  <td className="p-2">
                    <div className="flex space-x-2 space-x-reverse">
                        <button onClick={() => handleOpenModal(product)} className="text-blue-600 hover:text-blue-800 font-medium">تعديل</button>
                        <button onClick={() => handleDeleteProduct(product.id)} className="text-red-600 hover:text-red-800 font-medium">حذف</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-center text-gray-500 py-8">لا توجد منتجات لعرضها.</p>
        )}
      </div>

      {isModalOpen && (
        <ProductModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          product={selectedProduct}
          categories={categories}
          onSave={handleSaveProduct}
        />
      )}
    </div>
  );
};

export default AdminProductsPage;
