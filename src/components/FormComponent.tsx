// src/components/FormComponent.tsx
'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from './button';
interface FormComponentProps {
  formType: 'user' | 'post' | 'notification' | 'product';
  onSubmit: (data: any) => void; // The function to handle form submission
}


const FormComponent: React.FC<FormComponentProps> = ({ formType, onSubmit }) => {
  const [formData, setFormData] = useState<any>({});
  const router = useRouter();

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    console.log(e,"eee")
    const { name, value } = e.target;
    console.log(name,value)
    setFormData({ ...formData, [name]: value });
  };
  const navigateToNotifications = (section: "post" | "users" | "notifications" | "products") => {
    router.push(`/dashboard/${section}`);
  }
  // Handle form submission
  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(formData,"foirmdata")
    onSubmit(formData);
    setFormData({}); // Reset form after submission
  };

  const renderFields = () => {
    switch (formType) {
      case 'user':
        return (
          <>
            <div>
              <label htmlFor="firstname" className="text-gray-600 font-medium mb-1">First Name</label>
              <input
                type="text"
                id="firstname"
                name="firstname"
                className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm"
                placeholder="Enter first name"
                value={formData.firstname || ''}
                onChange={(e)=>handleChange(e)}
              />
            </div>
            <div>
              <label htmlFor="lastname" className="text-gray-600 font-medium mb-1">Last Name</label>
              <input
                type="text"
                id="lastname"
                name="lastname"
                className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm"
                placeholder="Enter last name"
                value={formData.lastname || ''}
                onChange={(e)=>handleChange(e)}
              />
            </div>
            <div>
              <label htmlFor="email" className="text-gray-600 font-medium mb-1">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm"
                placeholder="Enter email"
                value={formData.email || ''}
                onChange={(e)=>handleChange(e)}
              />
            </div>
          </>
        );

      case 'post':
        return (
          <>
            <div>
              <label htmlFor="title" className="text-gray-600 font-medium mb-1">Title</label>
              <input
                type="text"
                id="title"
                name="title"
                className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm"
                placeholder="Enter title"
                value={formData.title || ''}
                onChange={(e)=>handleChange(e)}
              />
            </div>
            <div>
              <label htmlFor="body" className="text-gray-600 font-medium mb-1">Body</label>
              <textarea
                id="body"
                name="body"
                rows={4}
                className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm"
                placeholder="Enter body content"
                value={formData.body || ''}
                onChange={(e)=>handleChange(e)}
              />
            </div>
          </>
        );

      case 'notification':
        return (
          <>
            <div>
              <label htmlFor="notificationTitle" className="text-gray-600 font-medium mb-1">Title</label>
              <input
                type="text"
                id="notificationTitle"
                name="title"
                className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm"
                placeholder="Enter notification title"
                value={formData.title || ''}
                onChange={(e)=>handleChange(e)}
              />
            </div>
            <div>
              <label htmlFor="description" className="text-gray-600 font-medium mb-1">Description</label>
              <textarea
                id="description"
                name="description"
                rows={4}
                className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm"
                placeholder="Enter description"
                value={formData.description || ''}
                onChange={(e)=>handleChange(e)}
              />
            </div>
            <div>
              <label htmlFor="brand" className="text-gray-600 font-medium mb-1">Brand</label>
              <input
                type="text"
                id="brand"
                name="brand"
                className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm"
                placeholder="Enter brand"
                value={formData.brand || ''}
                onChange={(e)=>handleChange(e)}
              />
            </div>
          </>
        );

      case 'product':
        return (
          <>
            <div>
              <label htmlFor="name" className="text-gray-600 font-medium mb-1">Name</label>
              <input
                type="text"
                id="productName"
                name="name"
                className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm"
                placeholder="Enter product name"
                value={formData.name || ''}
                onChange={(e)=>handleChange(e)}
              />
            </div>
            <div>
              <label htmlFor="cuisine" className="text-gray-600 font-medium mb-1">Cuisine</label>
              <input
                type="text"
                id="cuisine"
                name="cuisine"
                className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm"
                placeholder="Enter cuisine"
                value={formData.cuisine || ''}
                onChange={(e)=>handleChange(e)}
              />
            </div>
            <div>
              <label htmlFor="caloriesPerServing" className="text-gray-600 font-medium mb-1">Calories Per Serving</label>
              <input
                type="number"
                id="caloriesPerServing"
                name="caloriesPerServing"
                className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm"
                placeholder="Enter calories"
                value={formData.caloriesPerServing || ''}
                onChange={(e)=>handleChange(e)}
              />
            </div>
          </>
        );

      default:
        return null;
    }
  };

  const renderButton = () => {
    switch (formType) {
      case 'user':
        return (
            <Button type='submit' onClick={() => navigateToNotifications('users')}>Register</Button>

        );

      case 'post':
        return (
            <Button type='submit' onClick={() => navigateToNotifications('post')}>Register</Button>

        );

      case 'notification':
        return (
            <Button type='submit' onClick={() => navigateToNotifications('notifications')}>Register</Button>

        );

      case 'product':
        return (
            <Button type='submit' onClick={() => navigateToNotifications('products')}>Register</Button>

        );

      default:
        return null;
    }
  };

  return (
    <form onSubmit={handleFormSubmit} className="space-y-3">
      {renderFields()}
      <div className="flex justify-start">
        {renderButton()}
      </div>
    </form>
  );
};

export default FormComponent;
