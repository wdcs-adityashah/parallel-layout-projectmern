import React from 'react';
import { FaTrashAlt, FaPenSquare } from 'react-icons/fa';
import { Item } from '../types'; // Ensure to import the Item type

interface DynamicListProps<T extends Item> {
  items: T[];
  editingItemId: string | null;
  editFormData: { [key: string]: any };
  handleEditChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleUpdate: (id: string) => void;
  handleDelete: (id: string) => void;
  startEditing: (item: T) => void;
  lastUserRef: React.RefObject<HTMLLIElement>;
  placeholder: string;
  type: 'user' | 'post' | 'notification' | 'product'; // New prop for type
}

const DynamicList = <T extends Item>({
  items,
  editingItemId,
  editFormData,
  handleEditChange,
  handleUpdate,
  handleDelete,
  startEditing,
  lastUserRef,
  placeholder,
  type, // Using type to switch between the different fields
}: DynamicListProps<T>) => {

  const renderItemFields = (item: T) => {
    switch (type) {
      case 'user':
        return (
          <>
            <p>{item.firstname}</p>
          </>
        );
      case 'post':
        return (
          <>
            <p>{item.title}</p>
          </>
        );
      case 'notification':
        return (
          <>
            <p>{item.title}</p>
          </>
        );
      case 'product':
        return (
          <>
            <p>{item.name}</p>
          </>
        );
      default:
        return <p>No fields to display.</p>;
    }
  };

  const renderEditFields = () => {
    switch (type) {
      case 'user':
        return (
          <>
            <input
              type="text"
              name="firstname"
              value={editFormData.firstname || ''}
              onChange={handleEditChange}
              placeholder="First Name"
            />
          
          </>
        );
      case 'post':
        return (
          <>
            <input
              type="text"
              name="title"
              value={editFormData.title || ''}
              onChange={handleEditChange}
              placeholder="Title"
            />
          
          </>
        );
      case 'notification':
        return (
          <>
            <input
              type="text"
              name="title"
              value={editFormData.title || ''}
              onChange={handleEditChange}
              placeholder="Title"
            />
           
          </>
        );
      case 'product':
        return (
          <>
            <input
              type="text"
              name="Name"
              value={editFormData.Name || ''}
              onChange={handleEditChange}
              placeholder="Product Name"
            />
           
          </>
        );
      default:
        return <p>No edit fields available.</p>;
    }
  };

  return (
    <ul className="space-y-3">
      {items.length > 0 ? (
        items.map((item, index) => (
          <li
            ref={index === items.length - 1 ? lastUserRef : undefined}
            key={item._id}
            className="border p-3 flex justify-between items-center rounded-md"
          >
            {editingItemId === item._id ? (
              <div>
                {renderEditFields()}
                <br />
                <br />
                <button
                  className="text-blue-500 mr-3"
                  onClick={() => handleUpdate(item._id)}
                >
                  Save
                </button>
                <button
                  className="text-red-500"
                  onClick={() => startEditing(null)}
                >
                  Cancel
                </button>
              </div>
            ) : (
              renderItemFields(item)
            )}
            <div className="flex items-center gap-7">
              <FaPenSquare
                className="text-red-500 cursor-pointer hover:text-red-700"
                onClick={() => startEditing(item)}
              />
              <FaTrashAlt
                className="text-red-500 cursor-pointer hover:text-red-700"
                onClick={() => handleDelete(item._id)}
              />
            </div>
          </li>
        ))
      ) : (
        <p>No items found.</p>
      )}
    </ul>
  );
};

export default DynamicList;
