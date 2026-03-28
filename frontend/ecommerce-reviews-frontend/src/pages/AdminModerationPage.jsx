import React, { useState } from 'react';
import AdminModerationTable from '../components/AdminModerationTable';
import { Shield, Info } from 'lucide-react';

const AdminModerationPage = () => {
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Shield className="h-6 w-6 text-red-500" /> Review Moderation
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          All submitted reviews are held in PENDING status. Approve to publish or reject to discard.
        </p>
      </div>

      <div className="mb-4 bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3 text-sm text-blue-800">
        <Info className="h-4 w-4 mt-0.5 flex-shrink-0" />
        <p>
          <strong>JWT Role Note:</strong> In production, <code className="bg-blue-100 px-1 rounded">/api/admin/**</code> routes require a JWT with role <code className="bg-blue-100 px-1 rounded">ROLE_ADMIN</code>.
          For this demo, the backend's SecurityConfig is configured to enforce this via <code className="bg-blue-100 px-1 rounded">@PreAuthorize</code>.
        </p>
      </div>

      <AdminModerationTable onUpdate={() => setRefreshKey(k => k + 1)} key={refreshKey} />
    </div>
  );
};

export default AdminModerationPage;
