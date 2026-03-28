import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Mail, Smartphone, BellRing, Check, Trash2 } from 'lucide-react';

const NotificationItem = ({ notification, onMarkRead, onDelete }) => {

  const getIcon = () => {
    switch(notification.type) {
      case 'EMAIL': return <Mail className="w-5 h-5 text-blue-500" />;
      case 'SMS': return <Smartphone className="w-5 h-5 text-emerald-500" />;
      default: return <BellRing className="w-5 h-5 text-amber-500" />;
    }
  };

  return (
    <div className={`flex items-start p-4 hover:bg-gray-50 transition border-b border-gray-100 last:border-0 ${notification.isRead ? 'opacity-70' : 'bg-blue-50/30'}`}>
      <div className="flex-shrink-0 pt-1">
        {getIcon()}
      </div>
      <div className="ml-3 flex-1">
        <div className="flex justify-between items-start">
           <h4 className={`text-sm ${notification.isRead ? 'font-medium text-gray-700' : 'font-bold text-gray-900'}`}>
             {notification.subject}
           </h4>
           <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
             {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
           </span>
        </div>
        <p className="mt-1 text-sm text-gray-600 line-clamp-2">
          {notification.message}
        </p>
        <div className="mt-2 flex items-center space-x-3 text-xs text-gray-500">
          <span className="flex items-center">
             Via: <strong className="ml-1 uppercase">{notification.type}</strong>
          </span>
          <span>•</span>
          <span className="flex items-center">
             Status: <span className={`ml-1 font-semibold ${notification.status === 'SENT' ? 'text-green-600' : notification.status === 'FAILED' ? 'text-red-500' : 'text-amber-500'}`}>{notification.status}</span>
          </span>
        </div>
      </div>
      <div className="ml-4 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition sm:opacity-100">
        {!notification.isRead && (
          <button 
             onClick={() => onMarkRead(notification.id)}
             className="text-gray-400 hover:text-blue-600 transition"
             title="Mark as read"
          >
             <Check className="w-4 h-4" />
          </button>
        )}
        <button 
           onClick={() => onDelete(notification.id)}
           className="text-gray-400 hover:text-red-600 transition"
           title="Delete"
        >
           <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default NotificationItem;
