import React, { useState, useEffect, useCallback } from 'react';
import { apiService } from '../../services/apiService';
import type { User } from '../../types';
import Spinner from '../../components/Spinner';
import UserManagementCard from '../../components/UserManagementCard';
import TraderCard from '../../components/admin/TraderCard';

type ActiveTab = 'pending' | 'approved' | 'banned';

const AdminTradersPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('pending');
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      let data;
      if (activeTab === 'pending') {
        data = await apiService.getPendingUsers();
      } else if (activeTab === 'approved') {
        data = await apiService.getApprovedTraders();
      } else { // 'banned'
        data = await apiService.getBannedUsers();
      }
      setUsers(data);
    } catch (error) {
      console.error("Failed to fetch users", error);
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Action Handlers
  const handleAction = async (action: Promise<any>) => {
    await action;
    await fetchData();
  };

  const handleSetNickname = async (userId: number, nickname: string) => {
    await apiService.setAdminNickname(userId, nickname);
    setUsers(currentUsers =>
      currentUsers.map(u => (u.id === userId ? { ...u, adminNickname: nickname } : u))
    );
  };

  const TabButton: React.FC<{ tabName: ActiveTab; label: string }> = ({ tabName, label }) => {
    const isActive = activeTab === tabName;
    return (
      <button
        onClick={() => setActiveTab(tabName)}
        className={`px-4 py-2 text-sm font-semibold rounded-t-lg transition-colors ${
          isActive
            ? 'bg-white border-b-0 border-t border-r border-l text-blue-600'
            : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
        }`}
      >
        {label}
      </button>
    );
  };

  const renderContent = () => {
    if (loading) {
      return <div className="flex justify-center p-16"><Spinner /></div>;
    }
    if (users.length === 0) {
      return <p className="text-center text-gray-500 p-8">لا يوجد تجار لعرضهم في هذا القسم.</p>;
    }

    if (activeTab === 'pending') {
      return (
        <div className="space-y-4">
          {users.map(user => (
            <UserManagementCard
              key={user.id}
              user={user}
              onApprove={(userId) => handleAction(apiService.approveUser(userId))}
              onReject={(userId) => handleAction(apiService.rejectUser(userId))}
              onSetNickname={handleSetNickname}
            />
          ))}
        </div>
      );
    }
    
    return (
      <div className="space-y-4">
        {users.map(user => (
          <TraderCard
            key={user.id}
            user={user}
            onBan={(userId) => handleAction(apiService.banUser(userId))}
            onUnban={(userId) => handleAction(apiService.unbanUser(userId))}
            onPromote={(userId) => handleAction(apiService.promoteUser(userId))}
          />
        ))}
      </div>
    );
  };
  
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">إدارة التجار</h1>
      <div className="flex space-x-2 space-x-reverse border-b -mb-px">
        <TabButton tabName="pending" label="طلبات معلقة" />
        <TabButton tabName="approved" label="التجار المعتمدون" />
        <TabButton tabName="banned" label="المحظورون" />
      </div>
      <div className="bg-white p-4 sm:p-6 rounded-b-lg rounded-tl-lg shadow-md">
        {renderContent()}
      </div>
    </div>
  );
};

export default AdminTradersPage;
