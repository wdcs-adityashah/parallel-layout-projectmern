"use client"
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Card from '@/components/card';
import FormComponent from '@/components/FormComponent';
import DynamicList from '@/components/DynamicList';
import { Item } from '@/types';

interface Notification extends Item {
  _id: string;
  title: string; 
}

export default function Notifications() {
  const [notificatonproductdata, setNotificatonProductData] = useState({
    title: '',
    description: '',
    brand:''
  });
  const [notifications, setNotifications] = useState<Item[]>([]);
  const [editFormData, setEditFormData] = useState<{ title: string }>({
    title: '',
  });
  const [editingNotificationId, setEditingNotificationId] = useState<string | null>(null);
  const [responseMessage, setResponseMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [notificationcount, setNotificationCount] = useState<number | null>(null); // Track the post count

  const lastUserRef = useRef<HTMLLIElement | null>(null);

  // Function to fetch notifications
  const fetchNotifications = async () => {
    try {
      const response = await axios.get('http://localhost:3010/notification');
      setNotifications(response.data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);
  const fetchNotificationCount = async () => {
    try {
      const response = await axios.get('http://localhost:3010/notificationcount');
      setNotificationCount(response.data.count);
    } catch (error) {
      console.error('Error fetching notifications count:', error);
      setNotificationCount(null); 
    }
   }
   fetchNotificationCount();

  // Function to handle form submission for adding new notifications
  const handleNotifications = async (data: { title: string; description: string; brand:string;}) => {
    try {
      setErrorMessage('');
      const response = await axios.post('http://localhost:3010/notification',data);
      if(response?.data){
        const {title,description,brand} = response.data;
       setNotificatonProductData({
          title: '',
          description: '',
          brand:''
        });
        fetchNotifications()
      }
      
    } catch (error: any) {
      console.log('Error:', error);
      
      if (error.response?.status === 400 && error.response?.data?.message) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage('An error occurred while registering the user.');
      }
    }
    if(responseMessage!=''){
      setResponseMessage('')
    }
    setTimeout(() => {
      if (lastUserRef.current) {
        lastUserRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  
  };
  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditFormData({
      ...editFormData,
      [e.target.name]: e.target.value,
    });
  };

  const handleDelete = async (notificationId: string) => {
    try {
      const isConfirmed = window.confirm('Are you sure you want to delete this notification?');
      if (isConfirmed) {
        await axios.delete(`http://localhost:3010/notification/${notificationId}`);
        fetchNotifications();
      }
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const handleUpdate = async (notificationId: string) => {
    try {
      await axios.patch(`http://localhost:3010/notification/${notificationId}`, editFormData);
      fetchNotifications();
      setEditingNotificationId(null);
    } catch (error) {
      console.error('Error updating notification:', error);
    }
  };

  const startEditing = (notification: Item | null) => {
    setEditingNotificationId(notification?._id || null);
    setEditFormData({
      title: notification ? notification.title : '',
    });
  };

  return (
    <Card>
      <div className="p-6 flex max-w-[900px] w-full gap-16 h-full">
        <div className="form_data sticky h-[435px] top-0 border-solid border border-[#000] p-5">
        {notificationcount !== null && (
        <p className='mb-2'>Notification Count: {notificationcount}</p>
      )}
          {/* FormComponent for adding notifications */}
          <FormComponent formType="notification" onSubmit={handleNotifications} />
        </div>
        <div className="flex-1 border-solid border border-[#000]">
        <div className="list_users overflow-auto p-5 h-full">

          <h3 className="text-xl font-semibold mb-4">Registered Notifications</h3>
          <DynamicList<Notification>
            items={notifications}
            editingItemId={editingNotificationId}
            editFormData={editFormData}
            handleEditChange={handleEditChange}
            handleUpdate={handleUpdate}
            handleDelete={handleDelete}
            startEditing={startEditing}
            lastUserRef={lastUserRef}
            placeholder="Enter title"
            type="notification"
          />
        </div>
        </div>
      </div>
    </Card>
  );
}
