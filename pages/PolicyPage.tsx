import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { apiService } from '../services/apiService';
import Spinner from '../components/Spinner';

const PolicyPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [policy, setPolicy] = useState<{ title: string; content: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPolicy = async () => {
      if (!slug) return;
      setLoading(true);
      setError(null);
      try {
        const data = await apiService.getPolicy(slug);
        setPolicy(data);
      } catch (err) {
        setError('تعذر العثور على السياسة المطلوبة.');
      } finally {
        setLoading(false);
      }
    };
    fetchPolicy();
  }, [slug]);

  const renderContent = () => {
    if (loading) {
      return <div className="flex justify-center items-center h-64"><Spinner /></div>;
    }

    if (error || !policy) {
      return (
        <div className="text-center text-red-500 py-10">
            <p>{error || 'حدث خطأ غير متوقع.'}</p>
            <Link to="/settings" className="mt-4 inline-block text-blue-600 hover:underline">
                العودة إلى الإعدادات
            </Link>
        </div>
      );
    }

    return (
        <>
            <h1 className="text-4xl font-bold mb-6 text-gray-800 border-b pb-4">{policy.title}</h1>
            <p className="text-lg text-gray-700 leading-relaxed whitespace-pre-line">
            {policy.content}
            </p>
        </>
    );
  };
  
  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white p-8 rounded-lg shadow-lg">
        {renderContent()}
      </div>
    </div>
  );
};

export default PolicyPage;
