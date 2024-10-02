'use client';

import { useState,useRef,useEffect } from 'react';
import Card from '@/components/card';
import axios from 'axios';
import { useRouter } from 'next/navigation'
import { FaTrashAlt } from 'react-icons/fa';
import { FaRegPenToSquare } from "react-icons/fa6";

export default function Notifications() {
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
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditFormData({
      ...editFormData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setErrorMessage('');
      const response = await axios.post('http://localhost:3010/users', formData);

      if (response?.data) {
        const { firstname, lastname, email } = response.data;
       

        setFormData({
          firstname: '',
          email: '',
          lastname: '',
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
    if (responseMessage != '') {
      setResponseMessage('');
    }
    setTimeout(() => {
      if (lastUserRef.current) {
        lastUserRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }, 1);
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
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="flex flex-col">
              <label htmlFor="firstname" className="text-gray-600 font-medium mb-1">
                First Name
              </label>
              <input
                type="text"
                name="firstname"
                id="firstname"
                placeholder="Enter your first name"
                className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={formData.firstname}
                onChange={handleChange}
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="email" className="text-gray-600 font-medium mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                id="email"
                placeholder="Enter your email"
                className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="lastname" className="text-gray-600 font-medium mb-1">
                Last Name
              </label>
              <input
                type="text"
                name="lastname"
                id="lastname"
                placeholder="Enter your last name"
                className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={formData.lastname}
                onChange={handleChange}
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white font-semibold p-3 rounded-md shadow-md hover:bg-blue-700 transition duration-200"
              onClick={()=>navigateToNotifications('users')}
            >
              Register
            </button>
          </form>
          {errorMessage && <p className="mt-4 text-center text-lg font-medium text-red-500">{errorMessage}</p>}
        </div>

        {/* Users List */}
        <div className="flex-1 border-solid border border-[#000]">
          <div className="list_users overflow-auto p-5 h-full">
            <h3 className="text-xl font-semibold mb-4">Registered Users</h3>
            <ul className="space-y-3">
              {users.length > 0 ? (
                users.map((user: any,index: number) => (
                  <li ref={index === users.length - 1 ? lastUserRef : null} key={user._id} className="border p-3 flex justify-between items-center rounded-md">
                    {editingUserId === user._id ? (
                      <div>
                        <input
                          type="text"
                          name="firstname"
                          value={editFormData.firstname}
                          onChange={handleEditChange}
                          placeholder="First Name"
                        />
                        <br/>
                        <br/>
                        <button
                          className="text-blue-500 mr-3"
                          onClick={() => handleUpdate(user._id)}
                        >
                          Save
                        </button>
                        <button
                          className="text-red-500"
                          onClick={() => setEditingUserId(null)}
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <p>{user.firstname}</p>
                    )}
                    <div className="flex items-center gap-7">
                      <FaRegPenToSquare
                        className="text-red-500 cursor-pointer hover:text-red-700"
                        onClick={() => startEditing(user)}
                      />
                      <FaTrashAlt
                        className="text-red-500 cursor-pointer hover:text-red-700"
                        onClick={() => handleDelete(user._id)}
                      />
                    </div>
                  </li>
                ))
              ) : (
                <p>No users found.</p>
              )}
            </ul>
          </div>
        </div>
      </div>
    </Card>
  );
}
