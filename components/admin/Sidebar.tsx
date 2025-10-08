
import React from 'react';
import { NavLink } from 'react-router-dom';

const adminLinks = [
  { path: '/admin/dashboard', label: 'الرئيسية' },
  { path: '/admin/requests', label: 'طلبات التسجيل' },
  { path: '/admin/traders', label: 'التجار' },
  { path: '/admin/products', label: 'المنتجات' },
  { path: '/admin/orders', label: 'الطلبات' },
  { path: '/admin/payouts', label: 'المدفوعات' },
];

const Sidebar: React.FC = () => {
  const linkClasses = "block py-2.5 px-4 rounded transition duration-200 hover:bg-blue-700 hover:text-white";
  const activeLinkClasses = "bg-blue-700 text-white";

  return (
    <aside className="w-64 bg-gray-800 text-gray-100 min-h-screen p-4">
      <h2 className="text-2xl font-semibold text-white mb-6">لوحة التحكم</h2>
      <nav>
        <ul>
          {adminLinks.map(link => (
            <li key={link.path}>
              <NavLink
                to={link.path}
                className={({ isActive }) =>
                  `${linkClasses} ${isActive ? activeLinkClasses : ''}`
                }
              >
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
