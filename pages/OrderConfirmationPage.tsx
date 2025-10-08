import React from 'react';
import { useParams, Link } from 'react-router-dom';

const OrderConfirmationPage: React.FC = () => {
    const { orderId } = useParams<{ orderId: string }>();

    return (
        <div className="flex flex-col items-center justify-center text-center py-16">
            <svg className="w-24 h-24 text-green-500 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <h1 className="text-4xl font-bold text-gray-800 mb-4">تم استلام طلبك بنجاح!</h1>
            <p className="text-xl text-gray-600 mb-8 max-w-lg">
                شكرًا لك. طلبك قيد المعالجة الآن. رقم الطلب هو: <span className="font-mono bg-gray-200 px-2 py-1 rounded">{orderId}</span>
            </p>
            <div className="flex space-x-4 space-x-reverse">
                <Link
                    to="/"
                    className="bg-blue-600 text-white px-8 py-3 rounded-md text-lg font-semibold hover:bg-blue-700"
                >
                    متابعة التسوق
                </Link>
                <Link
                    to="/orders"
                    className="bg-white text-blue-600 border border-blue-600 px-8 py-3 rounded-md text-lg font-semibold hover:bg-blue-50"
                >
                    عرض سجل الطلبات
                </Link>
            </div>
        </div>
    );
};

export default OrderConfirmationPage;
