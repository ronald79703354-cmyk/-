import React, { useEffect, useState } from 'react';
import { apiService } from '../services/apiService';
import type { Order } from '../types';
import { OrderStatus } from '../types';
import OrderSkeleton from '../components/OrderSkeleton';

const getStatusChipClass = (status: OrderStatus) => {
  switch (status) {
    case OrderStatus.Delivered: return 'bg-green-100 text-green-800';
    case OrderStatus.Shipped: return 'bg-blue-100 text-blue-800';
    case OrderStatus.Processing: return 'bg-yellow-100 text-yellow-800';
    case OrderStatus.Cancelled: return 'bg-red-100 text-red-800';
    case OrderStatus.Pending:
    default: return 'bg-gray-100 text-gray-800';
  }
};

const getStatusText = (status: OrderStatus) => {
    const map: Record<OrderStatus, string> = {
        [OrderStatus.Pending]: 'قيد الانتظار',
        [OrderStatus.Processing]: 'قيد المعالجة',
        [OrderStatus.Shipped]: 'قيد التوصيل',
        [OrderStatus.Delivered]: 'تم التوصيل',
        [OrderStatus.Cancelled]: 'ملغي',
    };
    return map[status];
};

const getStatusDescription = (status: OrderStatus) => {
    switch (status) {
        case OrderStatus.Processing:
            return "في هذه المرحلة، يمكنك إلغاء الطلب مباشرة من التطبيق.";
        case OrderStatus.Shipped:
            return "لا يمكن إلغاء الطلب الآن. يرجى التواصل مع الدعم إذا لزم الأمر.";
        case OrderStatus.Delivered:
            return "وصل الطلب بنجاح وتم إضافة أرباحك للرصيد القابل للسحب.";
        case OrderStatus.Cancelled:
            return "تم إلغاء هذا الطلب.";
        default:
            return null;
    }
};

const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const data = await apiService.getOrders();
        setOrders(data);
      } catch (error) {
        console.error("Failed to fetch orders", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const renderContent = () => {
    if (loading) {
      return (
        <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, index) => <OrderSkeleton key={index} />)}
        </div>
      );
    }

    if (orders.length === 0) {
      return (
        <div className="text-center py-16 text-gray-500">
            <div className="flex justify-center mb-6">
                <svg className="w-24 h-24 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
            </div>
          <h3 className="text-2xl font-semibold">لا يوجد طلبات سابقة.</h3>
          <p>عندما تقوم بإنشاء طلب جديد، سيظهر هنا.</p>
        </div>
      );
    }
    
    return (
        <div className="space-y-4">
            {orders.map(order => {
                const description = getStatusDescription(order.status);
                return (
                    <div key={order.id} className="border-b last:border-b-0 pb-4 mb-4">
                        <div className="flex flex-col sm:flex-row justify-between sm:items-start">
                            <div className="flex-grow">
                                <p className="font-bold text-lg text-blue-600">{order.id}</p>
                                <p className="text-sm text-gray-500">{new Date(order.date).toLocaleDateString('ar-IQ')}</p>
                                <p className="text-sm text-gray-600">الزبون: {order.customer.name}</p>
                            </div>
                            <div className="mt-4 sm:mt-0 text-right space-y-2 flex-shrink-0">
                                <p className="font-semibold">إجمالي الربح: <span className="text-green-600 font-bold">{order.netProfit.toFixed(2)} دينار</span></p>
                                <span className={`px-3 py-1 text-sm font-semibold rounded-full ${getStatusChipClass(order.status)}`}>
                                    {getStatusText(order.status)}
                                </span>
                                {description && <p className="text-xs text-gray-500 mt-1 max-w-xs text-right ml-auto">{description}</p>}
                            </div>
                        </div>
                    </div>
                )
            })}
        </div>
    );
  };

  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold text-center">سجل الطلبات</h1>
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
        {renderContent()}
      </div>
    </div>
  );
};

export default OrdersPage;
