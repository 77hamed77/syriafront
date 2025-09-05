'use client';

import React, { useState, useEffect } from 'react';
import { adminGetAllUsers, adminDeleteUser } from '../../../../services/api';
import toast from 'react-hot-toast';
import { Users, Trash2 } from 'lucide-react';

export default function AdminPageClient({ dictionary }: { dictionary: any }) {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const usersData = await adminGetAllUsers();
      setUsers(usersData);
    } catch (error: any) {
      toast.error(error.message || "Failed to fetch users.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDeleteUser = async (userId: number) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await adminDeleteUser(userId);
        toast.success("User deleted successfully.");
        // إعادة جلب قائمة المستخدمين المحدثة
        fetchUsers();
      } catch (error: any) {
        toast.error(error.message || "Failed to delete user.");
      }
    }
  };

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Users /> Admin Dashboard
        </h1>
        <p className="text-gray-500">User Management</p>
      </header>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="p-4 font-semibold">Email</th>
              <th className="p-4 font-semibold hidden md:table-cell">First Name</th>
              <th className="p-4 font-semibold hidden md:table-cell">Last Name</th>
              <th className="p-4 font-semibold hidden sm:table-cell">Is Staff</th>
              <th className="p-4 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan={5} className="p-4 text-center">Loading...</td></tr>
            ) : (
              users.map((user: any) => (
                <tr key={user.id} className="border-t border-gray-200 dark:border-gray-600">
                  <td className="p-4 font-medium">{user.email}</td>
                  <td className="p-4 hidden md:table-cell">{user.first_name}</td>
                  <td className="p-4 hidden md:table-cell">{user.last_name}</td>
                  <td className="p-4 hidden sm:table-cell">
                    <span className={`px-2 py-1 text-xs rounded-full ${user.is_staff ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      {user.is_staff ? 'Yes' : 'No'}
                    </span>
                  </td>
                  <td className="p-4">
                    <button onClick={() => handleDeleteUser(user.id)} className="text-red-500 hover:text-red-700">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}