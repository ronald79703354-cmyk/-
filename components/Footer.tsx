
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t mt-12">
      <div className="container mx-auto px-4 py-6 text-center text-gray-500">
        <p>&copy; {new Date().getFullYear()} منصة بداية. جميع الحقوق محفوظة.</p>
      </div>
    </footer>
  );
};

export default Footer;
