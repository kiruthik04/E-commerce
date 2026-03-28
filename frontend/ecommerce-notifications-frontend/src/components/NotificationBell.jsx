import React, { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import api from '../api/axios';
import NotificationDropdown from './NotificationDropdown';
import { useLocation } from 'react-router-dom';

const MOCK_USER_ID = 999; 

const NotificationBell = () => {
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const location = useLocation();

  const fetchState = async () => {
    try {
      const [countRes, listRes] = await Promise.all([
        api.get(`/user/${MOCK_USER_ID}/unread-count`),
        api.get(`/user/${MOCK_USER_ID}`)
      ]);
      setUnreadCount(countRes.data.count);
      setNotifications(listRes.data);
    } catch (err) {
      console.error("Failed to load generic notification state", err);
    }
  };

  useEffect(() => {
    fetchState();
    const interval = setInterval(fetchState, 10000); // Poll every 10s for new metrics
    return () => clearInterval(interval);
  }, [location.pathname]); // re-fetch if navigation changes

  const handleMarkRead = async (id) => {
    await api.put(`/${id}/read`);
    fetchState(); 
  };

  const handleDelete = async (id) => {
    await api.delete(`/${id}`);
    fetchState();
  };

  return (
    <div className="relative">
      <button 
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="p-2 text-gray-500 hover:text-gray-900 transition relative focus:outline-none"
      >
        <Bell className="w-6 h-6" />
        {unreadCount > 0 && (
           <span className="absolute top-1 right-1 inline-flex items-center justify-center w-4 h-4 text-[10px] font-bold text-white bg-red-500 rounded-full border-2 border-white translate-x-1/4 -translate-y-1/4">
             {unreadCount > 9 ? '9+' : unreadCount}
           </span>
        )}
      </button>

      {/* Render Dropdown only if not on the main / page */}
      {location.pathname !== '/' && (
         <div className="absolute top-full right-0 mt-2">
            <NotificationDropdown 
               isOpen={isDropdownOpen}
               onClose={() => setIsDropdownOpen(false)}
               notifications={notifications}
               onMarkRead={handleMarkRead}
               onDelete={handleDelete}
            />
         </div>
      )}
    </div>
  );
};

export default NotificationBell;
