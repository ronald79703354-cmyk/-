
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService, RegistrationData } from '../services/apiService';

const iraqGovernorates = [
  'بغداد', 'البصرة', 'نينوى', 'أربيل', 'الأنبار', 'بابل', 'ذي قار', 'ديالى', 'دهوك',
  'كربلاء', 'كركوك', 'ميسان', 'المثنى', 'النجف', 'القادسية', 'صلاح الدين', 'السليمانية', 'واسط', 'حلبجة'
];


const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<RegistrationData>({
    fullName: '',
    email: '',
    password: '',
    phone: '',
    governorate: iraqGovernorates[0],
    age: 18,
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'age' ? parseInt(value) : value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await apiService.registerUser(formData);
      navigate('/pending-approval');
    } catch (err: any) {
      setError(err.message || 'حدث خطأ غير متوقع.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10">
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold text-center mb-6">إنشاء حساب جديد</h2>
        {error && <div className="bg-red-100 text-red-700 p-3 rounded-md mb-4">{error}</div>}
        
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="fullName" className="block text-gray-700 mb-1">الاسم الكامل</label>
              <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} required className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label htmlFor="email" className="block text-gray-700 mb-1">البريد الإلكتروني</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label htmlFor="password" className="block text-gray-700 mb-1">كلمة المرور</label>
              <input type="password" name="password" value={formData.password} onChange={handleChange} required className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label htmlFor="phone" className="block text-gray-700 mb-1">رقم الهاتف (اختياري)</label>
              <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
                <label htmlFor="governorate" className="block text-gray-700 mb-1">المحافظة</label>
                <select
                    name="governorate"
                    id="governorate"
                    value={formData.governorate}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                    {iraqGovernorates.map(gov => <option key={gov} value={gov}>{gov}</option>)}
                </select>
            </div>
            <div>
              <label htmlFor="age" className="block text-gray-700 mb-1">العمر</label>
              <input type="number" name="age" value={formData.age} onChange={handleChange} required min="16" className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-300"
            >
              {isLoading ? 'جاري التسجيل...' : 'تسجيل'}
            </button>
          </form>
      </div>
    </div>
  );
};

export default RegisterPage;
