import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import ProfileEditForm from '../components/ProfileEditForm';
import { UserCircle, Mail, Phone, ShieldCheck, Calendar, Edit2 } from 'lucide-react';

export default function ProfilePage() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  
  if (!user || !user.user) return null;

  const profile = user.user;
  const createdDate = new Date(profile.createdAt).toLocaleDateString();

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <div className="bg-white shadow overflow-hidden sm:rounded-lg border border-gray-200">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center bg-gray-50 border-b border-gray-200">
          <div>
            <h3 className="text-xl leading-6 font-bold text-gray-900">User Profile</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Personal details and account settings.
            </p>
          </div>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="inline-flex items-center px-3 py-2 border border-blue-600 rounded-md shadow-sm text-sm font-medium text-blue-600 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              <Edit2 className="w-4 h-4 mr-2" />
              Edit Profile
            </button>
          )}
        </div>
        
        <div className="border-t border-gray-200">
          <dl>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 hover:bg-gray-50 transition-colors">
              <dt className="text-sm font-medium text-gray-500 flex items-center">
                <UserCircle className="w-5 h-5 mr-2 text-gray-400" />
                Full name
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 font-semibold">
                {profile.name}
              </dd>
            </div>
            
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 hover:bg-gray-100 transition-colors">
              <dt className="text-sm font-medium text-gray-500 flex items-center">
                <Mail className="w-5 h-5 mr-2 text-gray-400" />
                Email address
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {profile.email}
                {profile.isVerified && (
                  <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Verified
                  </span>
                )}
              </dd>
            </div>
            
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 hover:bg-gray-50 transition-colors">
              <dt className="text-sm font-medium text-gray-500 flex items-center">
                <Phone className="w-5 h-5 mr-2 text-gray-400" />
                Phone number
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {profile.phone || <span className="text-gray-400 italic">Not provided</span>}
              </dd>
            </div>
            
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 hover:bg-gray-100 transition-colors">
              <dt className="text-sm font-medium text-gray-500 flex items-center">
                <ShieldCheck className="w-5 h-5 mr-2 text-gray-400" />
                Role
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium ${
                  profile.role === 'ROLE_ADMIN' ? 'bg-purple-100 text-purple-800' :
                  profile.role === 'ROLE_SELLER' ? 'bg-orange-100 text-orange-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {profile.role.replace('ROLE_', '')}
                </span>
              </dd>
            </div>
            
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 hover:bg-gray-50 transition-colors">
              <dt className="text-sm font-medium text-gray-500 flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-gray-400" />
                Member since
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {createdDate}
              </dd>
            </div>
          </dl>
        </div>
      </div>
      
      {isEditing && (
        <ProfileEditForm onCancel={() => setIsEditing(false)} />
      )}
    </div>
  );
}
