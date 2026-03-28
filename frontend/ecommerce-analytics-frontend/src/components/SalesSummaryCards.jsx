import React from 'react';
import { TrendingUp, ShoppingBag, Package, Users } from 'lucide-react';

const fmt = (val) => val != null ? Number(val).toLocaleString('en-IN') : '—';
const fmtCur = (val) => val != null ? `₹${Number(val).toLocaleString('en-IN', { minimumFractionDigits: 0 })}` : '—';

const cards = [
  { key: 'totalRevenue', label: 'Total Revenue', format: fmtCur, icon: TrendingUp, color: 'text-violet-400', bg: 'bg-violet-500/10' },
  { key: 'totalOrders',  label: 'Total Orders',   format: fmt,    icon: ShoppingBag, color: 'text-blue-400',   bg: 'bg-blue-500/10' },
  { key: 'avgOrderValue',label: 'Avg Order Value', format: fmtCur, icon: Package,     color: 'text-emerald-400',bg: 'bg-emerald-500/10' },
  { key: 'newUsers',     label: 'New Users',        format: fmt,    icon: Users,       color: 'text-amber-400',  bg: 'bg-amber-500/10' },
];

const SalesSummaryCards = ({ summary }) => (
  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
    {cards.map(({ key, label, format, icon: Icon, color, bg }) => (
      <div key={key} className="glass rounded-2xl p-5 flex flex-col gap-3">
        <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center`}>
          <Icon className={`h-5 w-5 ${color}`} />
        </div>
        <div>
          <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">{label}</p>
          <p className={`text-2xl font-bold mt-1 ${color}`}>{summary ? format(summary[key]) : '—'}</p>
        </div>
      </div>
    ))}
  </div>
);

export default SalesSummaryCards;
