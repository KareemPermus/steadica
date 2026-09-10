import React from 'react';
import { IconType } from 'react-icons';

interface KpiCardProps {
  label: string;
  value: string | number;
  icon: IconType;
  iconColor?: string;
  iconBg?: string;
}

const KpiCard: React.FC<KpiCardProps> = ({ label, value, icon: Icon, iconColor = 'text-emerald-600', iconBg = 'bg-emerald-50' }) => (
  <div className="bg-white rounded-xl border border-stone-200 p-4">
    <div className="flex items-center gap-2 text-stone-400 text-xs font-medium">
      <div className={`w-6 h-6 rounded-md ${iconBg} ${iconColor} flex items-center justify-center`}>
        <Icon className="w-3.5 h-3.5" />
      </div>
      {label}
    </div>
    <div className="text-2xl font-bold mt-2">{value}</div>
  </div>
);

export default KpiCard;