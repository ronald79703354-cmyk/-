import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate, Link } from 'react-router-dom';
import { Role } from '../types';

const SettingsPage: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) {
    return null; 
  }
  
  const settingsLinks = [
      { path: '#', label: 'الملف الشخصي', icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg> },
      { path: '#', label: 'الأرباح', icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg> },
      { path: '#', label: 'الإحصائيات', icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" /></svg> },
      { path: '#', label: 'لوحة الصدارة', icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg> },
  ];
  
  const policyLinks = [
      { path: '/policy/delivery', label: 'سياسة التوصيل' },
      { path: '/policy/earnings', label: 'سياسة استلام الأرباح' },
      { path: '/policy/returns', label: 'سياسة الاستبدال والاسترجاع' },
      { path: '/policy/terms', label: 'شروط الخدمة' },
  ];

  const LinkItem: React.FC<{path: string, label: string, icon?: React.ReactNode}> = ({path, label, icon}) => (
    <Link to={path} className="flex items-center justify-between p-4 rounded-lg hover:bg-gray-100 transition-colors duration-200">
        <div className="flex items-center text-gray-700">
            {icon && <span className="ml-4">{icon}</span>}
            <span className="font-semibold">{label}</span>
        </div>
        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
    </Link>
  )

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-4xl font-bold mb-8">الإعدادات</h1>
      <div className="bg-white p-6 rounded-lg shadow-md space-y-6">
        
        <div className="flex items-center space-x-4 space-x-reverse">
            <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                {user.fullName.charAt(0)}
            </div>
            <div>
                <h2 className="text-2xl font-bold">{user.fullName}</h2>
                <p className="text-gray-600">{user.email}</p>
            </div>
        </div>

        <div className="border-t pt-6 space-y-2">
            {settingsLinks.map(link => (
                 <LinkItem key={link.path} path={link.path} label={link.label} icon={link.icon} />
            ))}
        </div>
        
        <div className="border-t pt-6 space-y-2">
            <h3 className="px-4 text-sm font-semibold text-gray-500">السياسات والمعلومات</h3>
            {policyLinks.map(link => (
                 <LinkItem key={link.path} path={link.path} label={link.label} />
            ))}
        </div>

        {user.role === Role.Admin && (
             <div className="border-t pt-6">
                <Link to="/admin" className="block w-full text-center bg-blue-100 text-blue-700 px-4 py-3 rounded-md hover:bg-blue-200 transition-colors font-semibold">
                    الانتقال إلى لوحة تحكم المسؤول
                </Link>
            </div>
        )}

        <div className="border-t pt-6">
            <button
                onClick={handleLogout}
                className="w-full bg-red-100 text-red-700 py-3 rounded-md hover:bg-red-200 transition-colors font-semibold"
            >
                تسجيل الخروج
            </button>
        </div>

      </div>
    </div>
  );
};

export default SettingsPage;