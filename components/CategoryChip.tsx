
import React from 'react';
import type { Category } from '../types';

interface CategoryChipProps {
  category: Category;
}

const CategoryChip: React.FC<CategoryChipProps> = ({ category }) => {
  return (
    <span className="bg-blue-100 text-blue-800 text-sm font-medium mr-2 ml-2 px-3 py-1.5 rounded-full">
      {category.name}
    </span>
  );
};

export default CategoryChip;
