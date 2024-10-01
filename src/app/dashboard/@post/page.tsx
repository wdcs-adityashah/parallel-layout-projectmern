'use client';
import { useState, useRef,useEffect } from 'react';
import Card from '@/components/card';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { FaTrashAlt } from 'react-icons/fa';
import { FaRegPenToSquare } from 'react-icons/fa6';

export default function Notifications() {
  const [postData, setPostData] = useState({ title: '', body: '' });
  const [editFormData, setEditFormData] = useState({ title: '' });
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [responseMessage, setResponseMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [posts, setPosts] = useState([]);
  const [postCount, setPostCount] = useState<number | null>(null);
  const router = useRouter();
  const lastUserRef = useRef<HTMLLIElement | null>(null);  // Ref for the last user


  // Fetch all posts
  const fetchPosts = async () => {
    try {
      const response = await axios.get('http://localhost:3010/post');
      setPosts(response.data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };
  // Fetch post count
  const fetchPostCount = async () => {
    try {
      const response = await axios.get('http://localhost:3010/postcount');
      setPostCount(response.data.count);
    } catch (error) {
      console.error('Error fetching post count:', error);
      setPostCount(null);
    }
  };
  fetchPostCount()
  useEffect(() => {
    const fetchData = async () => {
      await fetchPosts();
    };
    
    fetchData();
  }, []); // Emp
  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPostData({ ...postData, [e.target.name]: e.target.value });
  };

  // Handle changes for editing
  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
  };

  // Handle form submission for new posts
  const handlePost = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setErrorMessage('');
      const response = await axios.post('http://localhost:3010/post', postData);
      if (response?.data) {
        setPostData({ title: '', body: '' });
        console.log('Navigating to: /complex-dashboard/post');
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

  // Update a post
  const handleUpdate = async (postId: string) => {
    try {
      await axios.patch(`http://localhost:3010/post/${postId}`, editFormData);
      fetchPosts(); // Refresh posts after update
      setEditingPostId(null);
    } catch (error) {
      console.error('Error updating post:', error);
    }
  };

  // Start editing a post
  const startEditing = (post: any) => {
    setEditingPostId(post._id);
    setEditFormData({ title: post.title });
  };

  // Delete a post
  const handleDelete = async (postId: string) => {
    try {
      const isConfirmed = window.confirm('Are you sure you want to delete the post?');
      if (isConfirmed) {
        await axios.delete(`http://localhost:3010/post/${postId}`);
        fetchPosts(); // Refresh posts after deletion
        fetchPostCount(); // Update the post count
      }
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };
  const navigateToNotifications = (section: "post" | "users" | "notifications" | "products") => {
    router.push(`/dashboard/${section}`);
  }
  return (
    <Card>
      <div className="p-6 flex max-w-[900px] w-full gap-16 h-full">
        <div className="form_data sticky top-0 border-solid border border-[#000] p-5">
          {postCount !== null && <p className="mb-2">Post Count: {postCount}</p>}
          <form onSubmit={handlePost} className="space-y-3">
            <div>
              <label htmlFor="title" className="text-gray-600 font-medium mb-1">Title</label>
              <textarea
                id="title"
                name="title"
                rows={2}
                className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm"
                placeholder="Enter the title"
                value={postData.title}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="body" className="text-gray-600 font-medium mb-1">Body</label>
              <textarea
                id="body"
                name="body"
                rows={4}
                className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm"
                placeholder="Enter the body content"
                value={postData.body}
                onChange={handleChange}
              />
            </div>
            <div className="flex justify-start">
              <button
                type="submit"
                className="w-full bg-blue-600 text-white font-semibold p-3 rounded-md shadow-md hover:bg-blue-700 transition duration-200"
                onClick={()=>navigateToNotifications('post')}
              >
                Register
              </button> 
            </div>
          </form>
          {errorMessage && <p className="mt-4 text-center text-lg font-medium text-red-500">{errorMessage}</p>}
        </div>

        <div className="flex-1 border-solid border border-[#000]">
          <div className="list_users overflow-auto p-5 h-full">
            <h3 className="text-xl font-semibold mb-4">Registered Posts</h3>
            <ul className="space-y-3">
              {posts.length > 0 ? (
                posts.map((post: any,index: number) => (
                  <li ref={index === posts.length - 1 ? lastUserRef : null} key={post._id} className="border flex items-center justify-between p-3 rounded-md">
                    {editingPostId === post._id ? (
                      <div>
                        <input
                          type="text"
                          name="title"
                          value={editFormData.title}
                          onChange={handleEditChange}
                          placeholder="Enter title"
                        />
                        <br />
                        <br />
                        <button className="text-blue-500 mr-3" onClick={() => handleUpdate(post._id)}>Save</button>
                        <button className="text-red-500" onClick={() => setEditingPostId(null)}>Cancel</button>
                      </div>
                    ) : (
                      <p>{post.title}</p>
                    )}
                    <div className="flex items-center gap-7">
                      <FaRegPenToSquare
                        className="text-red-500 cursor-pointer hover:text-red-700"
                        onClick={() => startEditing(post)}
                      />
                      <FaTrashAlt
                        className="text-red-500 cursor-pointer hover:text-red-700"
                        onClick={() => handleDelete(post._id)}
                      />
                    </div>
                  </li>
                ))
              ) : (
                <p>No Posts found.</p>
              )}
            </ul>
          </div>
        </div>
      </div>
    </Card>
  );
}
