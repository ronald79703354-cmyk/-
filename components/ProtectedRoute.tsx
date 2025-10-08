import React, { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Role } from '../types';
import Spinner from './Spinner';

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles: Role[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  // إذا كانت حالة المصادقة لا تزال قيد التحديد، اعرض مؤشر تحميل بملء الشاشة.
  // هذا يمنع وميض الصفحة أثناء جلب بيانات المستخدم.
  if (loading) {
    return (
      <div className="fixed inset-0 bg-white flex justify-center items-center z-50">
        <Spinner />
      </div>
    );
  }

  // بعد التحميل، إذا لم يكن هناك مستخدم، أعد التوجيه إلى صفحة تسجيل الدخول.
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // إذا لم يكن دور المستخدم ضمن الأدوار المسموح بها، أعد توجيهه إلى الصفحة الرئيسية.
  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  // إذا تمت مصادقة المستخدم وكان لديه الدور الصحيح، فقم بعرض المكون المطلوب.
  return <>{children}</>;
};

export default ProtectedRoute;