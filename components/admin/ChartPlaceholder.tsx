import React from 'react';

interface ChartDataPoint {
  name: string;
  value: number;
}

interface ChartPlaceholderProps {
  title: string;
  data?: ChartDataPoint[];
}

const ChartPlaceholder: React.FC<ChartPlaceholderProps> = ({ title, data }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold text-gray-700 mb-4">{title}</h3>
      <div className="bg-gray-100 h-64 flex items-center justify-center rounded-md text-gray-500">
        {data && data.length > 0 ? (
           <div className="text-center">
             <p className="font-semibold mb-2">بيانات الرسم البياني (محاكاة)</p>
             <div className="text-xs text-left">
               {data.slice(0, 5).map(d => <p key={d.name}>{d.name}: {d.value.toLocaleString('ar-IQ')}</p>)}
               {data.length > 5 && <p>...</p>}
            </div>
           </div>
        ) : (
            <p>لا توجد بيانات لعرضها</p>
        )}
      </div>
    </div>
  );
};

export default ChartPlaceholder;
