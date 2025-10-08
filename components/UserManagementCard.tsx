
import React, { useState } from 'react';
import type { User } from '../types';

interface UserManagementCardProps {
  user: User;
  onApprove: (userId: number) => Promise<void>;
  onReject: (userId: number) => Promise<void>;
  onSetNickname: (userId: number, nickname: string) => Promise<void>;
}

const UserManagementCard: React.FC<UserManagementCardProps> = ({ user, onApprove, onReject, onSetNickname }) => {
  const [nickname, setNickname] = useState(user.adminNickname || '');
  const [isSaving, setIsSaving] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSetNickname = async () => {
    if (!nickname) return;
    setIsSaving(true);
    await onSetNickname(user.id, nickname);
    setIsSaving(false);
  };

  const handleApprove = async () => {
    setIsProcessing(true);
    await onApprove(user.id);
    setIsProcessing(false);
  };

  const handleReject = async () => {
    setIsProcessing(true);
    await onReject(user.id);
    setIsProcessing(false);
  };


  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
      <div className="flex flex-col md:flex-row md:justify-between md:items-start">
        <div>
          <h3 className="text-xl font-bold text-gray-800">{user.fullName}</h3>
          <p className="text-gray-600">{user.email}</p>
          <p className="text-gray-500 text-sm mt-1">{user.phone}</p>
        </div>
        <div className="mt-4 md:mt-0 text-right">
          <p className="text-gray-600">المحافظة: <span className="font-semibold">{user.governorate}</span></p>
          <p className="text-gray-600">العمر: <span className="font-semibold">{user.age}</span></p>
        </div>
      </div>
      <div className="mt-6 border-t pt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-2 flex-grow">
          <input
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="أضف لقب للمسؤول"
            className="border rounded-md px-3 py-2 w-full sm:w-auto flex-grow"
          />
          <button
            onClick={handleSetNickname}
            disabled={isSaving}
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 disabled:opacity-50"
          >
            {isSaving ? 'جاري الحفظ...' : 'حفظ'}
          </button>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleApprove}
            disabled={isProcessing}
            className="bg-green-500 text-white px-5 py-2 rounded-md hover:bg-green-600 transition-colors disabled:bg-green-300"
          >
            موافقة
          </button>
          <button
            onClick={handleReject}
            disabled={isProcessing}
            className="bg-red-500 text-white px-5 py-2 rounded-md hover:bg-red-600 transition-colors disabled:bg-red-300"
          >
            رفض
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserManagementCard;
