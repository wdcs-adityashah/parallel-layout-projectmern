'use client';
import { useState, useRef,useEffect } from 'react';
import Card from '@/components/card';
import axios from 'axios';
import { FaTrashAlt } from 'react-icons/fa';
import { FaRegPenToSquare } from 'react-icons/fa6';
import FormComponent from '@/components/FormComponent';
import { Item } from '@/types';
import DynamicList from '@/components/DynamicList';
interface Post extends Item {
  _id: string;
  title: string; 
}
export default function Posts() {
  const [postData, setPostData] = useState({ title: '', body: '' });
  const [editFormData, setEditFormData] = useState({ title: '' });
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [responseMessage, setResponseMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [posts, setPosts] = useState([]);
  const [postCount, setPostCount] = useState<number | null>(null);
  const lastUserRef = useRef<HTMLLIElement | null>(null);  // Ref for the last user


  const fetchPosts = async () => {
    try {
      const response = await axios.get('http://localhost:3010/post');
      setPosts(response.data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

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
  }, []); 
  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
  };

  // Handle form submission for new posts
  const handlePost = async (data: { title: string; body: string; }) => {
    console.log("heyy")
    try {
      setErrorMessage('');
      const response = await axios.post('http://localhost:3010/post', data);
      console.log(response,"response")
      if (response?.data) {
        setPostData({ title: '', body: '' });
        fetchPosts();
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
    }, 100);
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
        fetchPosts(); 
        fetchPostCount();
      }
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };
  return (
    <Card>
      <div className="p-6 flex max-w-[900px] w-full gap-16 h-full">
        <div className="form_data sticky top-0 border-solid border border-[#000] p-5">
          {postCount !== null && <p className="mb-2">Post Count: {postCount}</p>}
          <FormComponent
            formType="post"
            onSubmit={handlePost}
          />

          {errorMessage && <p className="mt-4 text-center text-lg font-medium text-red-500">{errorMessage}</p>}
        </div>

        <div className="flex-1 border-solid border border-[#000]">
          <div className="list_users overflow-auto p-5 h-full">
            <h3 className="text-xl font-semibold mb-4">Registered Posts</h3>
            <DynamicList<Post>
             items={posts}
             editingItemId={editingPostId}
             editFormData={editFormData}
             handleEditChange={handleEditChange}
             handleUpdate={handleUpdate}
             handleDelete={handleDelete}
             startEditing={startEditing}
             lastUserRef={lastUserRef}
             placeholder="Enter title"
             type="post"
            />
          </div>
        </div>
      </div>
    </Card>
  );
}
