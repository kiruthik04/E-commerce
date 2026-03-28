import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { Users, Shield, ShoppingBag } from 'lucide-react';

const roleColor = { ADMIN: 'text-violet-400 bg-violet-500/15', SELLER: 'text-blue-400 bg-blue-500/15', CUSTOMER: 'text-gray-400 bg-gray-700' };
const roleIcon = { ADMIN: Shield, SELLER: ShoppingBag, CUSTOMER: Users };

const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/api/admin/users').then(r => setUsers(r.data)).finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2"><Users className="h-6 w-6 text-violet-400" /> Users</h1>
        <p className="text-gray-500 text-sm mt-0.5">User accounts across the platform (proxied from User service).</p>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-gray-500 text-xs uppercase tracking-wider border-b border-gray-800">
              <th className="text-left px-5 py-3">ID</th>
              <th className="text-left px-5 py-3">Name</th>
              <th className="text-left px-5 py-3">Email</th>
              <th className="text-left px-5 py-3">Role</th>
            </tr>
          </thead>
          <tbody>
            {loading && <tr><td colSpan={4} className="text-center text-gray-600 py-10">Loading…</td></tr>}
            {!loading && users.map(u => {
              const Icon = roleIcon[u.role] || Users;
              return (
                <tr key={u.id} className="border-b border-gray-800/50 hover:bg-gray-800/30 transition">
                  <td className="px-5 py-3 text-gray-500 font-mono text-xs">#{u.id}</td>
                  <td className="px-5 py-3 text-white font-medium">{u.name}</td>
                  <td className="px-5 py-3 text-gray-400">{u.email}</td>
                  <td className="px-5 py-3">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${roleColor[u.role] || 'text-gray-400'}`}>
                      <Icon className="h-3 w-3" /> {u.role}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUsersPage;
