import React from 'react';

const OrderSkeleton: React.FC = () => {
  return (
    <div className="border-b last:border-b-0 pb-4 mb-4 animate-pulse">
      <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4">
        <div className="flex-grow">
          <div className="h-6 bg-gray-200 rounded w-48 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-40"></div>
        </div>
        <div className="w-full sm:w-auto flex-shrink-0 space-y-2">
            <div className="h-5 bg-gray-200 rounded w-56 ml-auto"></div>
            <div className="h-8 bg-gray-200 rounded-full w-24 ml-auto"></div>
            <div className="h-3 bg-gray-200 rounded w-64 ml-auto"></div>
        </div>
      </div>
    </div>
  );
};

export default OrderSkeleton;
