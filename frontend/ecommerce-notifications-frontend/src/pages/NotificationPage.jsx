import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import NotificationItem from '../components/NotificationItem';
import { RefreshCcw, Send } from 'lucide-react';

const MOCK_USER_ID = 999;

const NotificationPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/user/${MOCK_USER_ID}`);
      setNotifications(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkRead = async (id) => {
    await api.put(`/${id}/read`);
    fetchNotifications(); 
  };

  const handleDelete = async (id) => {
    await api.delete(`/${id}`);
    fetchNotifications();
  };

  // Mock Trigger Simulator form
  const [triggerEvent, setTriggerEvent] = useState('ORDER_PLACED');
  
  const simulateTrigger = async () => {
     try {
       await api.post('/send', {
          userId: MOCK_USER_ID,
          triggerEvent: triggerEvent,
          referenceId: Math.floor(Math.random() * 10000), // Mock Random ID
          referenceType: triggerEvent.startsWith('ORDER') ? 'ORDER' : 'SYSTEM',
          contactChannel: 'demo.user@example.com'
       });
       fetchNotifications(); // Refresh immediately
     } catch(e) { console.error(e); }
  };

  return (
    <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-8">
      
      {/* Left Column: Notification Feed */}
      <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
           <div>
              <h2 className="text-xl font-bold text-gray-900">Notifications</h2>
              <p className="text-sm text-gray-500">Your recent alerts and messages.</p>
           </div>
           <button 
             onClick={fetchNotifications}
             className="p-2 text-gray-400 hover:text-blue-600 transition bg-white border border-gray-200 rounded-lg shadow-sm"
           >
              <RefreshCcw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
           </button>
        </div>

        <div className="divide-y divide-gray-100">
           {notifications.length === 0 && !loading && (
             <div className="p-12 text-center text-gray-500">
                You have no notifications. Give the simulator a try!
             </div>
           )}
           {notifications.map(item => (
              <NotificationItem 
                 key={item.id}
                 notification={item}
                 onMarkRead={handleMarkRead}
                 onDelete={handleDelete}
              />
           ))}
        </div>
      </div>

      {/* Right Column: Simulator Tools */}
      <div className="w-full md:w-80 flex flex-col space-y-6">
         <div className="bg-gradient-to-br from-blue-900 to-indigo-900 text-white rounded-2xl p-6 shadow-lg">
            <h3 className="font-bold text-lg mb-2">Service Simulator</h3>
            <p className="text-sm text-blue-100 mb-6 font-light">
              Inject mock server-to-server triggers directly. This bypasses the typical message queue layer for demonstration purposes.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-blue-200 mb-2">Select Primary Trigger</label>
                <select 
                  value={triggerEvent}
                  onChange={(e) => setTriggerEvent(e.target.value)}
                  className="mt-1 block w-full pl-3 pr-10 py-2.5 text-base border-0 outline-none focus:ring-2 focus:ring-white sm:text-sm rounded-lg bg-blue-950/50 text-white shadow-inner"
                >
                  <option value="ORDER_PLACED">Order Placed (Email + In-App)</option>
                  <option value="PAYMENT_SUCCESS">Payment Success (Email + In-App)</option>
                  <option value="ORDER_SHIPPED">Order Shipped (SMS + In-App)</option>
                  <option value="ORDER_DELIVERED">Order Delivered (Email + In-App)</option>
                </select>
              </div>

              <button 
                 onClick={simulateTrigger}
                 className="w-full flex items-center justify-center px-4 py-3 border border-transparent text-sm font-bold rounded-lg shadow-sm text-blue-900 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-blue-900 focus:ring-white transition"
              >
                 <Send className="w-4 h-4 mr-2" />
                 Fire Event Trigger
              </button>
            </div>
         </div>
      </div>

    </div>
  );
};

export default NotificationPage;
