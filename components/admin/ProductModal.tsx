import React, { useState, useEffect } from 'react';
import type { Product, Category } from '../../types';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Partial<Product> | null;
  categories: Category[];
  onSave: (product: Partial<Product>) => void;
}

const ProductModal: React.FC<ProductModalProps> = ({ isOpen, onClose, product, categories, onSave }) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && product?.imageUrl) {
      setImagePreview(product.imageUrl);
    } else if (!isOpen) {
      // Reset preview when modal is closed
      setImagePreview(null);
    }
  }, [isOpen, product]);

  if (!isOpen || !product) return null;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);

    const price = parseFloat(formData.get('price') as string);
    const stock = parseInt(formData.get('stock') as string, 10);
    const categoryId = parseInt(formData.get('categoryId') as string, 10);

    if (isNaN(price) || isNaN(stock) || price < 0 || stock < 0) {
        alert("الرجاء إدخال قيم صحيحة وموجبة للسعر والمخزون.");
        return;
    }
    
    const updatedProduct = {
        ...product,
        name: formData.get('name') as string,
        description: formData.get('description') as string,
        price,
        stock,
        categoryId,
        imageUrl: imagePreview || product.imageUrl,
    };
    onSave(updatedProduct);
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-6">{product.id ? 'تعديل منتج' : 'إضافة منتج'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block mb-1 font-semibold text-gray-700">صورة المنتج</label>
              <div className="flex items-center space-x-4 space-x-reverse">
                {imagePreview && <img src={imagePreview} alt="Preview" className="w-24 h-24 object-cover rounded-md border" />}
                <input 
                  type="file" 
                  name="image" 
                  onChange={handleImageChange} 
                  accept="image/*" 
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" 
                />
              </div>
            </div>
            <div>
              <label className="block mb-1 font-semibold text-gray-700">اسم المنتج</label>
              <input name="name" defaultValue={product.name} className="w-full p-2 border rounded" required />
            </div>
            <div>
                <label className="block mb-1 font-semibold text-gray-700">الوصف</label>
                <textarea name="description" defaultValue={product.description} rows={3} className="w-full p-2 border rounded" required />
            </div>
             <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1 font-semibold text-gray-700">السعر (التكلفة)</label>
                  <input name="price" type="number" step="any" min="0" defaultValue={product.price} className="w-full p-2 border rounded" required />
                </div>
                 <div>
                  <label className="block mb-1 font-semibold text-gray-700">المخزون</label>
                  <input name="stock" type="number" min="0" defaultValue={product.stock} className="w-full p-2 border rounded" required />
                </div>
            </div>
            <div>
                <label className="block mb-1 font-semibold text-gray-700">القسم</label>
                <select name="categoryId" defaultValue={product.categoryId} className="w-full p-2 border rounded bg-white" required>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
            </div>
          </div>
          <div className="mt-6 flex justify-end space-x-3 space-x-reverse">
            <button type="button" onClick={onClose} className="bg-gray-200 px-4 py-2 rounded">إلغاء</button>
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">حفظ</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductModal;
