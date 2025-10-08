
import React from 'react';
import { Link } from 'react-router-dom';

const PendingApprovalPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16">
      <svg className="w-24 h-24 text-blue-500 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
      <h1 className="text-4xl font-bold text-gray-800 mb-4">شكراً لتسجيلك!</h1>
      <p className="text-xl text-gray-600 mb-8 max-w-lg">
        طلبك الآن قيد المراجعة من قبل فريقنا. سيتم إعلامك عبر البريد الإلكتروني عند الموافقة على حسابك لتصبح تاجراً معنا.
      </p>
      <div className="bg-white p-6 rounded-lg shadow-md border w-full max-w-md">
        <h2 className="text-lg font-semibold mb-4 text-gray-700">تحتاج إلى مساعدة؟</h2>
        <p className="text-gray-500 mb-4">يمكنك التواصل مع فريق الدعم مباشرة عبر:</p>
        <div className="flex justify-center space-x-4 space-x-reverse">
          <a href="https://wa.me/YOUR_WHATSAPP_NUMBER" target="_blank" rel="noopener noreferrer" className="bg-green-500 text-white px-6 py-2 rounded-md hover:bg-green-600 transition-colors">
            واتساب
          </a>
          <a href="https://t.me/YOUR_TELEGRAM_USERNAME" target="_blank" rel="noopener noreferrer" className="bg-sky-500 text-white px-6 py-2 rounded-md hover:bg-sky-600 transition-colors">
            تليجرام
          </a>
        </div>
      </div>
       <Link to="/" className="mt-8 text-blue-600 hover:underline">
        العودة إلى الصفحة الرئيسية
      </Link>
    </div>
  );
};

export default PendingApprovalPage;
