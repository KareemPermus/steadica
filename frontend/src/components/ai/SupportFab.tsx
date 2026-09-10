import React from 'react';
import { FiHelpCircle } from 'react-icons/fi';

const SupportFab: React.FC = () => (
  <button
    className="fixed bottom-6 right-6 w-12 h-12 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg flex items-center justify-center z-40 transition-colors"
    title="Help"
  >
    <FiHelpCircle className="w-5 h-5" />
  </button>
);

export default SupportFab;