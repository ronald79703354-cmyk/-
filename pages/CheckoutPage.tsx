import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import type { CustomerInfo, PaymentMethod } from '../types';
import Spinner from '../components/Spinner';

const iraqGovernorates = [
  'بغداد', 'البصرة', 'نينوى', 'أربيل', 'الأنبار', 'بابل', 'ذي قار', 'ديالى', 'دهوك',
  'كربلاء', 'كركوك', 'ميسان', 'المثنى', 'النجف', 'القادسية', 'صلاح الدين', 'السليمانية', 'واسط', 'حلبجة'
];

const CheckoutPage: React.FC = () => {
  const [step, setStep] = useState(1);
  const { cart, totalRevenue, netProfit, checkout, loading } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect if cart is empty after initial load check is complete
    if (!loading && cart.length === 0) {
      navigate('/cart', { replace: true });
    }
  }, [cart, loading, navigate]);

  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    name: '',
    phone: '',
    governorate: iraqGovernorates[0],
    address: '',
    notes: ''
  });
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('CASH_ON_DELIVERY');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setCustomerInfo({ ...customerInfo, [e.target.name]: e.target.value });
  };
  
  const handlePaymentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setPaymentMethod(e.target.value as PaymentMethod);
  }

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);
  
  const handleCheckout = async () => {
      try {
          const order = await checkout(customerInfo, paymentMethod);
          navigate(`/order-confirmation/${order.id}`);
      } catch (error) {
          console.error("Checkout failed", error);
          // show an error message to the user
      }
  }
  
  const paymentMethodLabels: Record<PaymentMethod, string> = {
      CASH_ON_DELIVERY: 'الدفع عند الاستلام',
      CREDIT_CARD: 'بطاقة ائتمان',
      BANK_TRANSFER: 'تحويل بنكي'
  }
  
  const paymentIcons: Record<PaymentMethod, React.ReactNode> = {
    CASH_ON_DELIVERY: (
      <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
    ),
    CREDIT_CARD: (
      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
    ),
    BANK_TRANSFER: (
      <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
    )
  };

  // Show a spinner while checking for cart or redirecting
  if (loading || cart.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner />
      </div>
    );
  }

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">1. معلومات الزبون</h2>
            <div>
              <label htmlFor="name" className="block text-gray-700 mb-1">اسم الزبون الكامل</label>
              <input type="text" name="name" value={customerInfo.name} onChange={handleChange} required className="w-full p-2 border rounded" />
            </div>
            <div>
              <label htmlFor="phone" className="block text-gray-700 mb-1">رقم هاتف الزبون</label>
              <input type="tel" name="phone" value={customerInfo.phone} onChange={handleChange} required className="w-full p-2 border rounded" />
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">2. عنوان الزبون</h2>
            <div>
                <label htmlFor="governorate" className="block text-gray-700 mb-1">المحافظة</label>
                <select name="governorate" value={customerInfo.governorate} onChange={handleChange} required className="w-full p-2 border rounded bg-white">
                    {iraqGovernorates.map(g => <option key={g} value={g}>{g}</option>)}
                </select>
            </div>
            <div>
              <label htmlFor="address" className="block text-gray-700 mb-1">العنوان التفصيلي (المنطقة، الشارع، أقرب نقطة دالة)</label>
              <textarea name="address" value={customerInfo.address} onChange={handleChange} required rows={3} className="w-full p-2 border rounded" />
            </div>
            <div>
              <label htmlFor="notes" className="block text-gray-700 mb-1">ملاحظات إضافية (اختياري)</label>
              <textarea name="notes" value={customerInfo.notes} onChange={handleChange} rows={2} className="w-full p-2 border rounded" />
            </div>
          </div>
        );
      case 3:
          return (
              <div className="space-y-4">
                  <h2 className="text-2xl font-bold">3. طريقة الدفع</h2>
                  <div className="space-y-3">
                    {(Object.keys(paymentMethodLabels) as PaymentMethod[]).map(method => (
                        <label key={method} className="flex items-center p-4 border rounded-lg has-[:checked]:bg-blue-50 has-[:checked]:border-blue-500 cursor-pointer transition-colors">
                            <input
                                type="radio"
                                name="paymentMethod"
                                value={method}
                                checked={paymentMethod === method}
                                onChange={handlePaymentChange}
                                className="ml-4 h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                            />
                            <div className="flex items-center space-x-3 space-x-reverse">
                                {paymentIcons[method]}
                                <span className="font-semibold text-gray-800">{paymentMethodLabels[method]}</span>
                            </div>
                        </label>
                    ))}
                  </div>

                  {paymentMethod === 'CREDIT_CARD' && (
                      <div className="bg-gray-100 p-4 rounded-lg mt-4 space-y-3 animate-fade-in">
                          <p className="text-sm text-gray-600">هذه الواجهة لأغراض العرض فقط.</p>
                          <input type="text" placeholder="رقم البطاقة" className="w-full p-2 border rounded" />
                          <div className="grid grid-cols-2 gap-3">
                              <input type="text" placeholder="تاريخ الانتهاء (MM/YY)" className="w-full p-2 border rounded" />
                              <input type="text" placeholder="CVC" className="w-full p-2 border rounded" />
                          </div>
                      </div>
                  )}

                  {paymentMethod === 'BANK_TRANSFER' && (
                       <div className="bg-gray-100 p-4 rounded-lg mt-4 text-sm text-gray-700 animate-fade-in">
                           <p className="font-semibold mb-2">يرجى تحويل المبلغ الإجمالي إلى الحساب التالي:</p>
                           <p><strong>اسم البنك:</strong> بنك الرافدين</p>
                           <p><strong>رقم الحساب:</strong> 1234-5678-9012-3456</p>
                           <p><strong>اسم المستفيد:</strong> منصة بداية</p>
                           <p className="mt-2 text-xs text-gray-500">سيتم تأكيد الطلب بعد التحقق من عملية التحويل.</p>
                       </div>
                  )}
              </div>
          );
      case 4:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">4. مراجعة وتأكيد الطلب</h2>
            <div className="bg-gray-100 p-4 rounded-lg space-y-2">
                <p><strong>اسم الزبون:</strong> {customerInfo.name}</p>
                <p><strong>الهاتف:</strong> {customerInfo.phone}</p>
                <p><strong>العنوان:</strong> {customerInfo.governorate}، {customerInfo.address}</p>
                <p><strong>طريقة الدفع:</strong> {paymentMethodLabels[paymentMethod]}</p>
            </div>
            <div>
                <h3 className="font-bold mb-2">المنتجات:</h3>
                <ul className="list-disc pr-5 space-y-1">
                    {cart.map(item => (
                        <li key={item.product.id}>
                           {item.product.name} (الكمية: {item.quantity}) - سعر البيع: {item.sellingPrice.toFixed(2)} دينار
                        </li>
                    ))}
                </ul>
            </div>
            <div className="border-t pt-4 space-y-2">
                 <p className="text-lg flex justify-between">إجمالي الفاتورة للزبون: <span className="font-bold">{totalRevenue.toFixed(2)} دينار</span></p>
                 <p className="text-lg flex justify-between text-green-700">ربحك الصافي من الطلب: <span className="font-bold">{netProfit.toFixed(2)} دينار</span></p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">إتمام الطلب</h1>
        <div className="bg-white p-8 rounded-lg shadow-lg">
            {renderStep()}
            <div className="flex justify-between mt-8 border-t pt-6">
                {step > 1 && <button onClick={prevStep} className="bg-gray-500 text-white px-6 py-2 rounded">السابق</button>}
                {step < 4 && <button onClick={nextStep} className="bg-blue-600 text-white px-6 py-2 rounded ml-auto">التالي</button>}
                {step === 4 && <button onClick={handleCheckout} disabled={loading} className="bg-green-600 text-white px-6 py-2 rounded ml-auto disabled:bg-green-300">{loading ? 'جاري التأكيد...' : 'تأكيد الطلب'}</button>}
            </div>
        </div>
    </div>
  );
};

export default CheckoutPage;
