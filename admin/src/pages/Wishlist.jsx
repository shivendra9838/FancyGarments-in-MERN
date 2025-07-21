import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { backendUrl } from '../App';
import { toast } from 'react-toastify';

const Wishlist = () => {
  const [wishlists, setWishlists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchWishlists = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get(`${backendUrl}/api/wishlist/all`);
      if (res.data.success) {
        setWishlists(res.data.wishlists);
      } else {
        setError(res.data.message || 'Failed to fetch wishlists');
      }
    } catch (err) {
      setError('Error fetching wishlists');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchWishlists();
  }, []);

  // Delete wishlist item
  const handleDelete = async (userId, item) => {
    try {
      await axios.post(`${backendUrl}/api/wishlist/admin-remove`, {
        userId,
        productId: item.productId,
        video: item.video
      });
      fetchWishlists();
      toast.success('Deleted successfully');
    } catch (err) {
      toast.error('Failed to delete wishlist item');
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-5">💖 All Wishlists</h2>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200">
            <thead>
              <tr className="bg-pink-100 text-pink-800">
                <th className="px-4 py-2 border">User</th>
                <th className="px-4 py-2 border">Product</th>
                <th className="px-4 py-2 border">Brand</th>
                <th className="px-4 py-2 border">Price</th>
                <th className="px-4 py-2 border">Image/Video</th>
                <th className="px-4 py-2 border">Action</th>
              </tr>
            </thead>
            <tbody>
              {wishlists.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-4">No wishlists found.</td></tr>
              ) : (
                wishlists.flatMap(wl =>
                  wl.items.map((item, idx) => (
                    <tr key={wl.user + '-' + idx} className="border-b">
                      <td className="px-4 py-2 border">{wl.user}</td>
                      <td className="px-4 py-2 border">{item.name || item.productId || item.video}</td>
                      <td className="px-4 py-2 border">{item.brand || '-'}</td>
                      <td className="px-4 py-2 border">₹{item.price || '-'}</td>
                      <td className="px-4 py-2 border">
                        {item.image ? (
                          <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded" />
                        ) : item.video ? (
                          <video src={item.video} className="w-16 h-16 object-cover rounded" controls />
                        ) : (
                          <span>-</span>
                        )}
                      </td>
                      <td className="px-4 py-2 border">
                        <button
                          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                          onClick={() => handleDelete(wl.user, item)}
                        >Delete</button>
                      </td>
                    </tr>
                  ))
                )
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Wishlist; 