import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { backendUrl } from '../App';
import { Dialog } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';

const Profile = () => {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [openAccordion, setOpenAccordion] = useState(null);

  useEffect(() => {
    const fetchProfiles = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await axios.get(`${backendUrl}/api/user/all-profiles`);
        if (res.data.success) {
          setProfiles(res.data.profiles);
        } else {
          setError(res.data.message || 'Failed to fetch profiles');
        }
      } catch (err) {
        setError('Error fetching profiles');
      }
      setLoading(false);
    };
    fetchProfiles();
  }, []);

  const handleDelete = async (profileId) => {
    if (window.confirm('Are you sure you want to delete this profile?')) {
      try {
        await axios.delete(`${backendUrl}/api/user/profile/${profileId}`);
        setProfiles(profiles.filter(p => p._id !== profileId));
      } catch (error) {
        setError('Failed to delete profile.');
      }
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">User Profiles</h1>
          <p className="text-sm text-gray-500 mt-1">Manage all user profiles and their activities.</p>
        </header>

        {loading ? (
          <div className="text-center py-10">
            <p className="text-gray-500">Loading profiles...</p>
          </div>
        ) : error ? (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md" role="alert">
            <p className="font-bold">Error</p>
            <p>{error}</p>
          </div>
        ) : (
          <div className="bg-white shadow-lg rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stats</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {profiles.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="text-center py-10 text-gray-500">
                        No profiles found.
                      </td>
                    </tr>
                  ) : (
                    profiles.map((profile) => (
                      <tr key={profile._id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-12 w-12">
                              <img className="h-12 w-12 rounded-full object-cover" src={profile.profileImg ? `${backendUrl}${profile.profileImg}` : 'https://placehold.co/48x48?text=N/A'} alt="" />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{profile.name}</div>
                              <div className="text-xs text-gray-500">{profile.gender || 'N/A'}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div>{profile.email}</div>
                          <div>{profile.mobile || 'No mobile'}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div>Orders: <span className="font-semibold text-gray-800">{profile.totalOrders}</span></div>
                          <div>Spent: <span className="font-semibold text-gray-800">₹{profile.totalSpent.toFixed(2)}</span></div>
                          <div>Wishlist: <span className="font-semibold text-gray-800">{profile.wishlistItems}</span></div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center gap-2">
                            <button onClick={() => setSelectedProfile(profile)} className="text-indigo-600 hover:text-indigo-900 font-semibold">View</button>
                            <button onClick={() => handleDelete(profile._id)} className="text-red-600 hover:text-red-900 font-semibold">Delete</button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {selectedProfile && (
        <Dialog open={!!selectedProfile} onClose={() => {setSelectedProfile(null); setOpenAccordion(null);}} className="relative z-50">
          <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Dialog.Panel className="w-full max-w-3xl rounded-2xl bg-white p-6 shadow-2xl">
              <Dialog.Title className="text-xl font-bold mb-4 flex justify-between items-center">
                {selectedProfile.name}'s Details
                <button onClick={() => {setSelectedProfile(null); setOpenAccordion(null);}} className="text-gray-400 hover:text-gray-600">
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </Dialog.Title>
              <div className="space-y-2 max-h-[70vh] overflow-y-auto">
                <div className="border rounded-lg">
                  <h3 className="text-lg font-semibold p-4 cursor-pointer flex justify-between" onClick={() => setOpenAccordion(openAccordion === 'orders' ? null : 'orders')}>
                    Recent Orders
                    <span>{openAccordion === 'orders' ? '−' : '+'}</span>
                  </h3>
                  {openAccordion === 'orders' && (
                    <div className="p-4 border-t">
                      <div className="space-y-4">
                        {selectedProfile.orders.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 3).map(order => (
                          <div key={order._id} className="border p-4 rounded-lg">
                            <div className="flex justify-between">
                              <p><strong>Order ID:</strong> {order._id}</p>
                              <p><strong>Amount:</strong> ₹{order.amount.toFixed(2)}</p>
                            </div>
                            <p><strong>Status:</strong> {order.status}</p>
                            <div className="mt-2">
                              <h4 className="font-semibold">Items:</h4>
                              {order.items.map(item => (
                                <div key={item._id} className="flex items-center gap-4 mt-2">
                                  <img src={`${backendUrl}/uploads/${item.image}`} alt={item.name} className="w-12 h-12 object-cover rounded" />
                                  <div>
                                    <p>{item.name}</p>
                                    <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <div className="border rounded-lg">
                  <h3 className="text-lg font-semibold p-4 cursor-pointer flex justify-between" onClick={() => setOpenAccordion(openAccordion === 'address' ? null : 'address')}>
                    Address Book
                    <span>{openAccordion === 'address' ? '−' : '+'}</span>
                  </h3>
                  {openAccordion === 'address' && (
                    <div className="p-4 border-t">
                      <div className="space-y-2">
                        {selectedProfile.orders.map(order => order.address).filter((address, index, self) =>
                          index === self.findIndex((t) => (
                            t.street === address.street && t.city === address.city
                          ))
                        ).map((address, index) => (
                          <div key={index} className="border p-4 rounded-lg">
                            <p>{address.firstName} {address.lastName}</p>
                            <p>{address.street}, {address.city}, {address.state}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <div className="border rounded-lg">
                  <h3 className="text-lg font-semibold p-4 cursor-pointer flex justify-between" onClick={() => setOpenAccordion(openAccordion === 'wishlist' ? null : 'wishlist')}>
                    Wishlist
                    <span>{openAccordion === 'wishlist' ? '−' : '+'}</span>
                  </h3>
                  {openAccordion === 'wishlist' && (
                    <div className="p-4 border-t">
                      <div className="space-y-2">
                        {selectedProfile.wishlist.map(item => (
                          <div key={item.productId} className="flex items-center gap-4 border p-4 rounded-lg">
                            <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded" />
                            <div>
                              <p>{item.name}</p>
                              <p className="text-sm text-gray-500">₹{item.price}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </Dialog.Panel>
          </div>
        </Dialog>
      )}
    </div>
  );
};

export default Profile; 