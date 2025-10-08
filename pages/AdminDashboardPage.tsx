
import React, { useEffect, useState, useCallback } from 'react';
import { apiService } from '../services/apiService';
import type { User } from '../types';
import Spinner from '../components/Spinner';
import UserManagementCard from '../components/UserManagementCard';

const AdminDashboardPage: React.FC = () => {
  const [pendingUsers, setPendingUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPendingUsers = useCallback(async () => {
    setLoading(true);
    try {
      const users = await apiService.getPendingUsers();
      setPendingUsers(users);
    } catch (err) {
      setError('فشل في جلب المستخدمين قيد المراجعة.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPendingUsers();
  }, [fetchPendingUsers]);

  const handleApprove = async (userId: number) => {
    await apiService.approveUser(userId);
    fetchPendingUsers();
  };

  const handleReject = async (userId: number) => {
    await apiService.rejectUser(userId);
    fetchPendingUsers();
  };
  
  const handleSetNickname = async (userId: number, nickname: string) => {
    await apiService.setAdminNickname(userId, nickname);
    // Optimistically update UI
    setPendingUsers(users => users.map(u => u.id === userId ? {...u, adminNickname: nickname} : u));
  };


  return (
    <div>
      <h1 className="text-4xl font-bold mb-8">لوحة تحكم المسؤول</h1>
      <h2 className="text-2xl font-semibold mb-6 text-gray-700">طلبات التسجيل المعلقة</h2>

      {loading && (
        <div className="flex justify-center items-center h-64">
          <Spinner />
        </div>
      )}

      {error && <div className="bg-red-100 text-red-700 p-4 rounded-md">{error}</div>}

      {!loading && !error && (
        pendingUsers.length > 0 ? (
          <div className="space-y-6">
            {pendingUsers.map(user => (
              <UserManagementCard
                key={user.id}
                user={user}
                onApprove={handleApprove}
                onReject={handleReject}
                onSetNickname={handleSetNickname}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white p-8 rounded-lg shadow-md text-center text-gray-500">
            <p className="text-xl">لا توجد طلبات تسجيل معلقة في الوقت الحالي.</p>
          </div>
        )
      )}
    </div>
  );
};

export default AdminDashboardPage;
