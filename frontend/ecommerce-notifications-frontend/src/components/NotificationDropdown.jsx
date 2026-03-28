import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import NotificationItem from './NotificationItem';
import { ExternalLink } from 'lucide-react';

const NotificationDropdown = ({ notifications, isOpen, onClose, onMarkRead, onDelete }) => {
  const dropdownRef = useRef(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      ref={dropdownRef}
      className="absolute top-12 right-0 w-80 sm:w-96 bg-white rounded-xl shadow-2xl border border-gray-100/80 z-50 overflow-hidden origin-top-right animate-fade-in"
    >
      <div className="bg-gray-50 px-4 py-3 border-b border-gray-100 flex justify-between items-center">
        <h3 className="font-semibold text-gray-900 text-sm">Recent Notifications</h3>
        <Link 
           to="/"
           onClick={onClose}
           className="text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center"
        >
          View All <ExternalLink className="w-3 h-3 ml-1" />
        </Link>
      </div>
      
      <div className="max-h-[360px] overflow-y-auto no-scrollbar">
        {notifications.length === 0 ? (
           <div className="p-8 text-center text-sm text-gray-500">
             You're all caught up! No recent notifications.
           </div>
        ) : (
           notifications.slice(0, 5).map(node => (
              <NotificationItem 
                 key={node.id} 
                 notification={node}
                 onMarkRead={onMarkRead}
                 onDelete={onDelete}
              />
           ))
        )}
      </div>
      
    </div>
  );
};

export default NotificationDropdown;
