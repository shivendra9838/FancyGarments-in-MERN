import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { backendUrl } from '../App';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await axios.get(`${backendUrl}/api/user/all`);
        if (res.data.success) {
          setUsers(res.data.users);
        } else {
          setError(res.data.message || 'Failed to fetch users');
        }
      } catch (err) {
        setError('Error fetching users');
      }
      setLoading(false);
    };
    fetchUsers();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-5">👤 All Users (Email & Password)</h2>
      {loading ? (
        <div>Loading users...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200">
            <thead>
              <tr className="bg-indigo-100 text-indigo-800">
                <th className="px-4 py-2 border">Email</th>
                <th className="px-4 py-2 border">Password (hashed)</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr><td colSpan={2} className="text-center py-4">No users found.</td></tr>
              ) : (
                users.map((user, idx) => (
                  <tr key={user._id || idx} className="border-b">
                    <td className="px-4 py-2 border">{user.email}</td>
                    <td className="px-4 py-2 border">{user.password}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Users; 