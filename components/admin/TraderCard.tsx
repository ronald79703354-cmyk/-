import React, { useState } from 'react';
import { Role, type User } from '../../types';

interface TraderCardProps {
  user: User;
  onBan: (userId: number) => Promise<void>;
  onUnban: (userId: number) => Promise<void>;
  onPromote: (userId: number) => Promise<void>;
}

const TraderCard: React.FC<TraderCardProps> = ({ user, onBan, onUnban, onPromote }) => {
    const [isProcessing, setIsProcessing] = useState(false);

    const handleAction = async (action: (id: number) => Promise<void>) => {
        setIsProcessing(true);
        try {
            await action(user.id);
        } catch (error) {
            console.error("Action failed for user:", user.id, error);
        }
        // Don't set isProcessing to false here, as the component might unmount/rerender
    };

    return (
        <div className="bg-white p-4 rounded-lg shadow-md border flex flex-col sm:flex-row justify-between sm:items-center gap-4">
            <div>
                <h3 className="text-lg font-bold">{user.fullName}</h3>
                <p className="text-gray-600 text-sm">{user.email}</p>
                <p className="text-gray-500 text-xs mt-1">المحافظة: {user.governorate}</p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
                {user.status === 'APPROVED' && user.role === Role.Trader && (
                    <>
                        <button onClick={() => handleAction(onBan)} disabled={isProcessing} className="bg-yellow-500 text-white px-3 py-1.5 rounded-md hover:bg-yellow-600 disabled:opacity-50 text-sm transition-colors">
                            {isProcessing ? '...' : 'حظر'}
                        </button>
                        <button onClick={() => handleAction(onPromote)} disabled={isProcessing} className="bg-blue-500 text-white px-3 py-1.5 rounded-md hover:bg-blue-600 disabled:opacity-50 text-sm transition-colors">
                           {isProcessing ? '...' : 'ترقية لمسؤول'}
                        </button>
                    </>
                )}
                {user.status === 'BANNED' && (
                    <button onClick={() => handleAction(onUnban)} disabled={isProcessing} className="bg-green-500 text-white px-3 py-1.5 rounded-md hover:bg-green-600 disabled:opacity-50 text-sm transition-colors">
                        {isProcessing ? '...' : 'إلغاء الحظر'}
                    </button>
                )}
            </div>
        </div>
    );
};

export default TraderCard;