
import React, { useEffect, useState } from 'react';
import { apiService } from '../services/apiService';
import type { Category } from '../types';
import Spinner from '../components/Spinner';
import CategoryChip from '../components/CategoryChip';

const CategoriesPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await apiService.getCategories();
        setCategories(data);
      } catch (error) {
        console.error("Failed to fetch categories", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-4xl font-bold mb-8 text-center">أقسام المنتجات</h1>
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Spinner />
        </div>
      ) : (
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <div className="flex flex-wrap justify-center items-center gap-4">
                {categories.map(category => (
                    <CategoryChip key={category.id} category={category} />
                ))}
            </div>
        </div>
      )}
    </div>
  );
};

export default CategoriesPage;
