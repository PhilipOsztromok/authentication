import React from 'react';
import { Loader2 } from 'lucide-react';

const Button = ({ children, loading, variant = 'primary', ...props }) => {
  const baseClasses = 'w-full py-2 px-4 rounded-lg font-medium transition flex items-center justify-center gap-2';
  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-400',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
  };

  return (
    <button
      className={`${baseClasses} ${variants[variant]} disabled:cursor-not-allowed`}
      disabled={loading}
      {...props}
    >
      {loading && <Loader2 className="w-5 h-5 animate-spin" />}
      {children}
    </button>
  );
};

export default Button;
