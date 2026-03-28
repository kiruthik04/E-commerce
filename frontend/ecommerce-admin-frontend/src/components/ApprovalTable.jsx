import React from 'react';
import { CheckCircle, Clock } from 'lucide-react';

const ApprovalTable = ({ sellers, onApprove }) => (
  <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
    <div className="px-5 py-4 border-b border-gray-800 flex items-center justify-between">
      <h3 className="font-semibold text-white text-sm">Sellers Awaiting Approval</h3>
      <span className="text-xs bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded-full font-semibold">
        {sellers.filter(s => !s.isApproved).length} pending
      </span>
    </div>
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-gray-500 text-xs uppercase tracking-wider border-b border-gray-800">
            <th className="text-left px-5 py-3">Store</th>
            <th className="text-left px-5 py-3">GST No</th>
            <th className="text-left px-5 py-3">Applied</th>
            <th className="text-left px-5 py-3">Status</th>
            <th className="text-left px-5 py-3">Action</th>
          </tr>
        </thead>
        <tbody>
          {sellers.length === 0 && (
            <tr><td colSpan={5} className="text-center text-gray-600 py-10">No sellers found</td></tr>
          )}
          {sellers.map(s => (
            <tr key={s.id} className="border-b border-gray-800/50 hover:bg-gray-800/30 transition">
              <td className="px-5 py-3 text-white font-medium">{s.storeName}</td>
              <td className="px-5 py-3 text-gray-400 font-mono text-xs">{s.gstNumber || '—'}</td>
              <td className="px-5 py-3 text-gray-400 text-xs">
                {s.createdAt ? new Date(s.createdAt).toLocaleDateString('en-IN') : '—'}
              </td>
              <td className="px-5 py-3">
                {s.isApproved
                  ? <span className="flex items-center gap-1 text-emerald-400 text-xs font-semibold"><CheckCircle className="h-3.5 w-3.5" /> Approved</span>
                  : <span className="flex items-center gap-1 text-amber-400 text-xs font-semibold"><Clock className="h-3.5 w-3.5" /> Pending</span>
                }
              </td>
              <td className="px-5 py-3">
                {!s.isApproved && (
                  <button onClick={() => onApprove(s.userId)}
                    className="text-xs px-3 py-1.5 bg-violet-600 hover:bg-violet-700 text-white rounded-lg transition font-semibold">
                    Approve
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default ApprovalTable;
