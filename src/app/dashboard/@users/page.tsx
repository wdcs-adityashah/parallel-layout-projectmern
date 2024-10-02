'use client';

import { useState,useRef,useEffect } from 'react';
import Card from '@/components/card';
import axios from 'axios';
import { useRouter } from 'next/navigation'
import DynamicList from '@/components/DynamicList'; // Import DynamicList component
import { Item } from '@/types';
import FormComponent from '@/components/FormComponent';
interface User extends Item {
  firstname: string;
  email: string;
  lastname: string;
}
export default function Users() {
  const [formData, setFormData] = useState({
    firstname: '',
    email: '',
    lastname: '',
  });
  const [editFormData, setEditFormData] = useState({
    firstname: '',
  });
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [responseMessage, setResponseMessage] = useState('');
  const [users, setUsers] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [userCount, setUserCount] = useState<number | null>(null);
  const router = useRouter();
  const lastUserRef = useRef<HTMLLIElement | null>(null);  // Ref for the last user



  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:3010/users');
      setUsers(response.data);
      
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      await fetchUsers();
    };
    
    fetchData();
  }, []); // Emp
  const fetchUserCount = async () => {
    try {
      const response = await axios.get('http://localhost:3010/userCount');
      console.log(response.data.count)
      setUserCount(response.data.count);
    } catch (error) {
      console.error('Error fetching post count:', error);
      setUserCount(null);
    }
  };
  fetchUserCount()
  
  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditFormData({
      ...editFormData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (data: { firstname: string; lastname: string; email:string;}) => {
    try {
      setErrorMessage('');
      const response = await axios.post('http://localhost:3010/users', data);

      if (response?.data) {
        const { firstname, lastname, email } = response.data;
       

        setFormData({
          firstname: '',
          email: '',
          lastname: '',
        });
      fetchUsers()
      }
    } catch (error: any) {
      console.log('Error:', error);

      if (error.response?.status === 400 && error.response?.data?.message) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage('An error occurred while registering the user.');
      }
    }
    if (responseMessage != '') {
      setResponseMessage('');
    }
    setTimeout(() => {
      if (lastUserRef.current) {
        lastUserRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };
  const handleUpdate = async (userId: string) => {
    try {
      // Make sure you're passing the correct fields
      await axios.patch(`http://localhost:3010/users/${userId}`, editFormData);
      fetchUsers();  // Refresh users list after update
      setEditingUserId(null);  // Exit editing mode
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const startEditing = (user: any) => {
    setEditingUserId(user._id);
    setEditFormData({
      firstname: user.firstname
    });
  };

  const handleDelete = async (userId: string) => {

    try {
      const isConfirmed = window.confirm('Are you sure you want to delete the user?');
      if (isConfirmed) {
        await axios.delete(`http://localhost:3010/users/${userId}`);
        fetchUsers();  // Refresh the list after deletion
      }
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };
  const navigateToNotifications = (section: "post" | "users" | "notifications" | "products") => {
    router.push(`/dashboard/${section}`);
  }
  return (
    <Card>
      <div className="p-6 flex max-w-[900px] w-full gap-16 h-full">
        {/* Sticky Form */}
        <div className="form_data sticky top-0  border-solid border border-[#000] p-5">
          {userCount && userCount !== null && <p className="mb-2">User Count: {userCount}</p>}
          <FormComponent formType="user" onSubmit={handleSubmit} />
          {errorMessage && <p className="mt-2 text-center text-lg font-medium text-red-500">{errorMessage}</p>}
        </div>

        {/* Users List */}
        <div className="flex-1 border-solid border border-[#000]">
          <div className="list_users overflow-auto p-5 h-full">
            <h3 className="text-xl font-semibold mb-4">Registered Users</h3>
            <DynamicList<User>
             items={users}
             editingItemId={editingUserId}
             editFormData={editFormData}
             handleEditChange={handleEditChange}
             handleUpdate={handleUpdate}
             handleDelete={handleDelete}
             startEditing={startEditing}
             lastUserRef={lastUserRef}
             placeholder="Enter name"
             type="user"
            />
          </div>
        </div>
      </div>
    </Card>
  );
}
