import React, { useEffect, useState } from 'react';
import StatCard from '../../components/admin/StatCard';
import ChartPlaceholder from '../../components/admin/ChartPlaceholder';
import Spinner from '../../components/Spinner';
import { apiService } from '../../services/apiService';
import type { DashboardStats } from '../../types';

const DashboardHomePage: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const data = await apiService.getDashboardStats();
        setStats(data);
      } catch (error) {
        console.error("Failed to fetch dashboard stats", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Spinner />
      </div>
    );
  }

  if (!stats) {
    return <div className="text-center text-red-500">فشل في تحميل الإحصائيات.</div>;
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">لوحة التحكم الرئيسية</h1>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="إجمالي التجار" value={stats.totalTraders} icon={<span>👥</span>} />
        <StatCard title="إجمالي المنتجات" value={stats.totalProducts} icon={<span>📦</span>} />
        <StatCard title="الطلبات هذا الشهر" value={stats.monthlyOrders} icon={<span>🛒</span>} />
        <StatCard title="الأرباح هذا الشهر" value={`${stats.monthlyEarnings.toLocaleString('ar-IQ')} دينار`} icon={<span>💰</span>} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartPlaceholder title="نمو التجار" data={stats.traderGrowth} />
        <ChartPlaceholder title="أداء المبيعات" data={stats.salesPerformance} />
      </div>

      {/* Recent Activity */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">آخر النشاطات</h3>
        <p className="text-gray-500">لا توجد نشاطات حديثة.</p>
      </div>
    </div>
  );
};

export default DashboardHomePage;
