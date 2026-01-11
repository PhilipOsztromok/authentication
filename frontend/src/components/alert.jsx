import React from 'react';
import { CheckCircle, AlertCircle } from 'lucide-react';

const Alert = ({ type = 'info', message }) => {
  const styles = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800',
  };

  const Icon = type === 'success' ? CheckCircle : AlertCircle;

  return (
    <div className={`p-4 rounded-lg border ${styles[type]} flex items-start gap-3 mb-4`}>
      <Icon className="w-5 h-5 mt-0.5 flex-shrink-0" />
      <p className="text-sm">{message}</p>
    </div>
  );
};

export default Alert;
