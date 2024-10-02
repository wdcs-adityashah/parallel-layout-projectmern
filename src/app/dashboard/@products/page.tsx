'use client';
import { useState,useEffect,useRef } from 'react';
import Card from '@/components/card';
import axios from 'axios';
import FormComponent from '@/components/FormComponent';
import { Item } from '@/types';
import DynamicList from '@/components/DynamicList';
interface Product extends Item {
  _id: string;
  name: string; 
}
export default function Products() {
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
  const handleProduct = async (data: { name: string; cuisine: string; caloriesPerServing:number;}) => {
    try {
      setErrorMessage('');
      const response = await axios.post('http://localhost:3010/product',data);
      if(response?.data){
        const {name,cuisine,caloriesPerServing} = response.data;
        setProductData({
          name: '',
          cuisine: '',
          caloriesPerServing:''
        });
        fetchProducts()
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
  return (
    <Card>
      <div className="p-6 flex max-w-[900px] w-full gap-16 h-full">
        <div className="form_data sticky top-0  border-solid border border-[#000] p-5">
        {productcount !== null && (
        <p className='mb-2'>Product Count: {productcount}</p>
      )}
      <FormComponent formType="product" onSubmit={handleProduct} />
        {errorMessage && (
          <p className="mt-2 text-center text-lg font-medium text-red-500">{errorMessage}</p>
        )}
      </div>
      <div className='flex-1 border-solid border border-[#000]'>
      <div className="list_users overflow-auto p-5 h-full">
      <h3 className="text-xl font-semibold mb-4">Registered Products</h3>
      <DynamicList<Product>
            items={products}
            editingItemId={editingProductId}
            editFormData={editFormData}
            handleEditChange={handleEditChange}
            handleUpdate={handleUpdate}
            handleDelete={handleDelete}
            startEditing={startEditing}
            lastUserRef={lastUserRef}
            placeholder="Enter name"
            type="product"
          />
      </div>
      </div>
      </div>
    </Card>
  );
}
