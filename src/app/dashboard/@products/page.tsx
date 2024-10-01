'use client';
import { useState,useEffect,useRef } from 'react';
import Card from '@/components/card';
import axios from 'axios';
import { useRouter } from 'next/navigation'
import { FaTrashAlt } from 'react-icons/fa';
import { FaRegPenToSquare } from "react-icons/fa6";
export default function Notifications() {
  const [productdata, setProductData] = useState({
    name: '',
    cuisine: '',
    caloriesPerServing:''
  });
  const [editFormData, setEditFormData] = useState({
    name: '',
  });
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [responseMessage, setResponseMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [productcount, setProductCount] = useState<number | null>(null); // Track the post count
  const [products,setProducts] = useState([]);
  const router = useRouter();
  const lastUserRef = useRef<HTMLLIElement | null>(null);  // Ref for the last user

  const fetchProducts = async () => {
    try{
    const response = await axios.get('http://localhost:3010/product');
    setProducts(response.data);
    }catch(error){
      console.error('Error fetching users:',error);
    }
  }
  useEffect(() => {
    const fetchData = async () => {
      await fetchProducts();
    };
    
    fetchData();
  }, []);
  const fetchProductCount = async () => {
    try {
      const response = await axios.get('http://localhost:3010/productcount');
      setProductCount(response.data.count);
    } catch (error) {
      console.error('Error fetching post count:', error);
      setProductCount(null); 
    }
   }
   fetchProductCount();

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setProductData({
      ...productdata,
      [e.target.name]: e.target.value
    });
  };

  // Handle form submission
  const handlePost = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setErrorMessage('');
      const response = await axios.post('http://localhost:3010/product',productdata);
      if(response?.data){
        const {name,cuisine,caloriesPerServing} = response.data;
        setProductData({
          name: '',
          cuisine: '',
          caloriesPerServing:''
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
  const handleDelete = async(productId:string)=>{
    try{
      const IsConfirmed = window.confirm('Are you sure you want to delete the user?');
      if(IsConfirmed){
        await axios.delete(`http://localhost:3010/product/${productId}`);
        fetchProducts()
      }
  
    }catch(error){
      console.error('Error deleting products:', error);
  
    }
  }
  const handleUpdate = async(productId:string) => {
    try {
      await axios.patch(`http://localhost:3010/product/${productId}`,editFormData);
    fetchProducts()
    setEditingProductId(null)
    } catch (error) {
      console.log(error)
    }
    
  }
  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditFormData({
      ...editFormData,
      [e.target.name]: e.target.value,
    });
  };
  const startEditing = (product:any) =>{
    setEditingProductId(product._id);
    setEditFormData({
      name:product.name
    })
  }
  const navigateToNotifications = (section: "post" | "users" | "notifications" | "products") => {
    router.push(`/dashboard/${section}`);
  }

  return (
    <Card>
      <div className="p-6 flex max-w-[900px] w-full gap-16 h-full">
        {/* Notification Button */}
        {/* <NotificationButton /> */}
        <div className="form_data sticky top-0  border-solid border border-[#000] p-5">
        {productcount !== null && (
        <p className='mb-2'>Product Count: {productcount}</p>
      )}
        <form onSubmit={handlePost} className="space-y-3">
          {/* Title Label and Input */}
          <div className="flex flex-col">
            <label htmlFor="name" className="text-gray-600 font-medium mb-1">
              Name
            </label>
            <input
              type="text"
              name="name"
              id="name"
              placeholder="Enter your Name"
              className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={productdata.name}
              onChange={handleChange}
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="nane" className="text-gray-600 font-medium mb-1">
              Cuisine
            </label>
            <input
              type="text"
              name="cuisine"
              id="cuisine"
              placeholder="Enter your Cuisine"
              className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={productdata.cuisine}
              onChange={handleChange}
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="title" className="text-gray-600 font-medium mb-1">
            caloriesPerServing
            </label>
            <input
              type="number"
              name="caloriesPerServing"
              id="caloriesPerServing"
              placeholder="Enter your caloriesPerServing"
              className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={productdata.caloriesPerServing}
              onChange={handleChange}
            />
            </div>
          {/* Body Label and Input */}
        
        
          {/* Submit Button */}
          <div className="flex justify-start">
          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-semibold p-3 rounded-md shadow-md hover:bg-blue-700 transition duration-200"
            onClick={()=>navigateToNotifications('products')} >
            Register
          </button>
          </div>
        </form>
          {/* Show success response message */}
          

        {/* Show error message */}
        {errorMessage && (
          <p className="mt-4 text-center text-lg font-medium text-red-500">{errorMessage}</p>
        )}
      </div>
      <div className='flex-1 border-solid border border-[#000]'>
      <div className="list_users overflow-auto p-5 h-full">
      <h3 className="text-xl font-semibold mb-4">Registered Products</h3>
      <ul className="space-y-3">
            {products.length > 0 ? (
              products.map((product: any,index: number) => (
                <li ref={index === products.length - 1 ? lastUserRef : null} key={product._id} className="border p-3 flex justify-between items-center rounded-md">
                  {editingProductId === product._id?
                   <div>
                   <input
                     type="text"
                     name="name"
                     value={editFormData.name}
                     onChange={handleEditChange}
                     placeholder="name"
                   />
                   <br/>
                   <br/>
                   <button
                     className="text-blue-500 mr-3"
                     onClick={() => handleUpdate(product._id)}
                   >
                     Save
                   </button>
                   <button
                     className="text-red-500"
                     onClick={() => setEditingProductId(null)}
                   >
                     Cancel
                   </button>
                 </div>
                :  (                  
              <p>{product.name}</p>
                )
                }
                  <div className="flex items-center gap-7">
                      <FaRegPenToSquare
                        className="text-red-500 cursor-pointer hover:text-red-700"
                        onClick={()=>startEditing(product)}
                      />
                      <FaTrashAlt
                        className="text-red-500 cursor-pointer hover:text-red-700"
                        onClick={() => handleDelete(product._id)}
                      />
                    </div>
                </li>
              ))
            ) : (
              <p>No Products found.</p>
            )}
          </ul>
      </div>
      </div>
      </div>
    </Card>
  );
}
