'use client';
import { useState,useEffect, useRef } from 'react';
import Card from '@/components/card';
import axios from 'axios';
import { useRouter } from 'next/navigation'
import { FaTrashAlt } from 'react-icons/fa';
import { FaRegPenToSquare } from "react-icons/fa6";

export default function Notifications() {
  const [notificatonproductdata, setNotificatonProductData] = useState({
    title: '',
    description: '',
    brand:''
  });
  const [editFormData, setEditFormData] = useState({
    title: '',
  });
  const [editingNotificationId, setEditingNotificationId] = useState<string | null>(null);
  const [responseMessage, setResponseMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [notificationcount, setNotificationCount] = useState<number | null>(null); // Track the post count
  const router = useRouter();
  const lastUserRef = useRef<HTMLLIElement | null>(null);  // Ref for the last user

  const [notifications,setNotifications] =  useState([]);
  const fetchNotifications = async () => {
    try {
      const response = await axios.get('http://localhost:3010/notification');
      setNotifications(response.data);
    } catch (error) {
      console.error('Error fetching notifications:',error);
    }
  }
  useEffect(() => {
    const fetchData = async () => {
      await fetchNotifications();
    };
    
    fetchData();
  }, []);  const fetchNotificationCount = async () => {
    try {
      const response = await axios.get('http://localhost:3010/notificationcount');
      setNotificationCount(response.data.count);
    } catch (error) {
      console.error('Error fetching notifications count:', error);
      setNotificationCount(null); 
    }
   }
   fetchNotificationCount();

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setNotificatonProductData({
      ...notificatonproductdata,
      [e.target.name]: e.target.value
    });
  };
  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditFormData({
      ...editFormData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle form submission
  const handlePost = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setErrorMessage('');
      const response = await axios.post('http://localhost:3010/notification',notificatonproductdata);
      if(response?.data){
        const {title,description,brand} = response.data;
        setResponseMessage(`Title:${title} registered successfully`)
        setNotificatonProductData({
          title: '',
          description: '',
          brand:''
        });
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
    }, 1);
  
  };

  const navigateToNotifications = (section: "post" | "users" | "notifications" | "products") => {
    router.push(`/dashboard/${section}`);
  }
 const handleDelete = async(notificationId:string) => {
    try {
      const isConfirmed = window.confirm('Are you sure you want to delete the notifications?');
      if(isConfirmed){
        await axios.delete(`http://localhost:3010/notification/${notificationId}`)
        fetchNotifications();
      }
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
 }
 const handleUpdate = async(notificationId:string) => {
      try{
         await axios.patch(`http://localhost:3010/notification/${notificationId}`,editFormData);
         fetchNotifications();
         setEditingNotificationId(null);
      }catch(error){
        console.error('Error updating notification:', error);
      }
 }
 const startEditing = (notification:any) => {
  setEditingNotificationId(notification._id);
  setEditFormData({
    title:notification.title
  })
 }
  return (
    <Card>
      <div className="p-6 flex max-w-[900px] w-full gap-16 h-full">
        {/* Notification Button */}
        {/* <NotificationButton /> */}
        <div className="form_data sticky h-[435px] top-0 border-solid border border-[#000] p-5">

        {notificationcount !== null && (
        <p className='mb-2'>Notification Count: {notificationcount}</p>
      )}
        <form onSubmit={handlePost} className="space-y-3">
          {/* Title Label and Input */}
          <div>
            <label htmlFor="title" className="text-gray-600 font-medium mb-1">
              Title
            </label>
            <textarea
              id="title"
              name="title"
              rows={2}
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Enter the title"
              value={notificatonproductdata.title}
              onChange={handleChange} // Handle input change
            />
          </div>
          <div>
            <label htmlFor="body" className="text-gray-600 font-medium mb-1">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows={4}
              className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Enter the body content"
              value={notificatonproductdata.description}
              onChange={handleChange} // Handle input change
            />
          </div>
          <div>
            <label htmlFor="title" className="text-gray-600 font-medium mb-1">
              Brand
            </label>
            <input
              type="text"
              name="brand"
              id="brand"
              placeholder="Enter your brand"
              className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={notificatonproductdata.brand}
              onChange={handleChange}
            />
            </div>
          {/* Body Label and Input */}
        
        
          {/* Submit Button */}
          <div className="flex justify-start">
          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-semibold p-3 rounded-md shadow-md hover:bg-blue-700 transition duration-200"
            onClick={()=>navigateToNotifications('notifications')} >
            Register
          </button>
          </div>
        </form>
          

        {/* Show error message */}
        {errorMessage && (
          <p className="mt-4 text-center text-lg font-medium text-red-500">{errorMessage}</p>
        )}
      </div>
      <div className='flex-1 border-solid border border-[#000]'>
      <div className="list_users overflow-auto p-5 h-full">
      <h3 className="text-xl font-semibold mb-4">Registered Notifications</h3>
          <ul className="space-y-3">
            {notifications.length > 0 ? (
              notifications.map((notification: any,index:number) => (
                <li ref={index === notifications.length - 1 ? lastUserRef : null} key={notification._id} className="border p-3 flex justify-between items-center rounded-md">
                  {editingNotificationId === notification._id?
                  <div>
                    <input
                    type='text'
                     name='title'
                     value={editFormData.title}
                     onChange={handleEditChange}
                     placeholder='Enter title'
                    />
                    <br/>
                    <br/>
                    <button
                    className='text-blue-500 mr-3'
                    onClick={()=>handleUpdate(notification._id)}
                    >
                      Save
                    </button>
                    <button
                    className="text-red-500"
                    onClick={()=>setEditingNotificationId(null)}
                    >
                      Cancel
                    </button>
                  </div>
                  :<p>{notification.title}</p>

                  }
                  <div className="flex items-center gap-7">
                      <FaRegPenToSquare
                        className="text-red-500 cursor-pointer hover:text-red-700"
                        onClick={()=>startEditing(notification)}
                      />
                      <FaTrashAlt
                        className="text-red-500 cursor-pointer hover:text-red-700"
                        onClick={() => handleDelete(notification._id)}
                      />
                    </div>             
                       </li>
              ))
            ) : (
              <p>No Notifications found.</p>
            )}
          </ul>
      </div>
      </div>
      </div>
    </Card>
  );
}
