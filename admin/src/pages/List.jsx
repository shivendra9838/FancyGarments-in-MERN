import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { backendUrl, currency } from '../App';
import { toast } from 'react-toastify';
import { Trash2 } from 'lucide-react'; // icon library, can be swapped

const List = ({token}) => {
  const [list, setList] = useState([]);

  const fetchList = async () => {
    try {
      const response = await axios.get(backendUrl + '/api/product/list');
      if (response.data.success) {
        setList(response.data.products);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch product list");
    }
  };


  const removeProduct = async (id)=>{
    try{
      const response = await axios.post(backendUrl + '/api/product/remove',{id},{headers:{token}});
      if(response.data.success){
        toast.success(response.data.message);
        await fetchList();
      }else{
        toast.error(response.data.message);
      }

    }catch(error){
      console.log(error);
      toast.error("Failed to remove product");
    }
  }

  useEffect(() => {
    fetchList();
  }, []);

  return (
    <div className="p-6">
      <h2 className='text-2xl font-bold text-gray-800 mb-5'>🛍️ All Product List</h2>

      <div className='w-full border rounded-lg overflow-hidden shadow-sm'>
        {/* Table Header */}
        <div className='grid grid-cols-[80px_1.5fr_1fr_1fr_80px] bg-pink-100 text-pink-800 font-semibold text-sm px-4 py-3 border-b'>
          <span className="text-center">Image</span>
          <span className="text-left">Name</span>
          <span className="text-center">Category</span>
          <span className="text-center">Price</span>
          <span className="text-center">Action</span>
        </div>

        {/*--------------- Product List---------*/}
        {list.length > 0 ? (
          list.map((item, index) => (
            <div
              key={item._id || index}
              className='grid grid-cols-[80px_1.5fr_1fr_1fr_80px] items-center px-4 py-3 text-sm border-b hover:bg-gray-50 transition'
            >
              <img
                src={
                  Array.isArray(item.images) && item.images.length > 0
                    ? item.images[0]
                    : Array.isArray(item.image) && item.image.length > 0
                    ? item.image[0]
                    : item.image || "https://via.placeholder.com/48x48?text=No+Img"
                }
                alt={item.name}
                className="w-12 h-12 object-cover rounded border"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://via.placeholder.com/48x48?text=No+Img";
                }}
              />
              <span className="truncate">{item.name}</span>
              <span className="text-center">{item.category}</span>
              <span className="text-center">{currency}{item.price}</span>
              <button onClick={() => removeProduct(item._id)}
                className="text-red-500 hover:text-red-600 hover:scale-105 transition mx-auto"
                title="Delete Product"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))
        ) : (
          <div className="text-center py-6 text-gray-500 text-sm">No products found.</div>
        )}
      </div>
    </div>
  );
};

export default List;
