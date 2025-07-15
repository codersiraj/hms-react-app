import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface User {
  userId?: string;
  fullName: string;
  email: string;
  phone: string;
  role: 'Admin' | 'Staff' | 'Doctor' | 'Lab Assistant';
  isActive: boolean;
  createdBy?: string;
}

// ✅ Read base URL from runtime environment
const API_BASE = (window as any)._env_?.API_BASE_URL || 'http://localhost:5000';
const USERS_API = `${API_BASE}/api/users`;
const DOCTORS_API = `${API_BASE}/api/doctors`;

export default function AdminConsole() {
  const [users, setUsers] = useState<User[]>([]);
  const [formData, setFormData] = useState<User>({
    fullName: '',
    email: '',
    phone: '',
    role: 'Staff',
    isActive: true,
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get<User[]>(USERS_API);
      setUsers(res.data);
    } catch (err) {
      console.error('Error fetching users', err);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const target = e.target;
    const value = target.type === 'checkbox'
      ? (target as HTMLInputElement).checked
      : target.value;

    setFormData(prev => ({
      ...prev,
      [target.name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        role: formData.role,
        isActive: formData.isActive,
        createdBy: 'admin001'
      };

      if (editingId) {
        await axios.put(`${USERS_API}/${editingId}`, payload);
        setMessage('User updated successfully!');
      } else {
        const res = await axios.post(`${USERS_API}/create`, payload);
        const { userId, password } = res.data;

        setMessage(`User created! User ID: ${userId}, Password: ${password}`);

        if (formData.role === 'Doctor') {
          await axios.post(DOCTORS_API, {
            userId,
            specialization: '',
            availability: '',
            qualification: '',
            experienceYears: 0,
            bio: '',
            photoUrl: ''
          });
          setMessage(prev => prev + ' | Doctor profile created.');
        }
      }

      setFormData({ fullName: '', email: '', phone: '', role: 'Staff', isActive: true });
      setEditingId(null);
      fetchUsers();
    } catch (err) {
      console.error('Error saving user', err);
      setMessage('Something went wrong');
    }

    setTimeout(() => setMessage(''), 5000);
  };

  const handleEdit = (user: User) => {
    setFormData(user);
    setEditingId(user.userId || null);
  };

  const handleDelete = async (id?: string) => {
    if (!id || !window.confirm('Are you sure to delete this user?')) return;
    try {
      await axios.delete(`${USERS_API}/${id}`);
      setMessage('User deleted successfully!');
      fetchUsers();
    } catch (err) {
      console.error('Error deleting user', err);
      setMessage('Something went wrong');
    }

    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-r from-cyan-400 to-teal-300 px-4 py-6 overflow-hidden">
      <div className="absolute inset-0 bg-[url('background1.jpg')] bg-cover bg-center opacity-10 z-0" />

      <div className="relative z-10 max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-6">Admin Console – User Management</h1>

        {message && (
          <div className="bg-white shadow p-3 rounded text-center text-sm text-green-700 mb-4">
            {message}
          </div>
        )}

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-xl shadow-md mb-6 grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            placeholder="Full Name"
            required
            className="border border-gray-300 rounded-md p-2 text-sm"
          />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            required
            className="border border-gray-300 rounded-md p-2 text-sm"
          />
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Phone"
            required
            className="border border-gray-300 rounded-md p-2 text-sm"
          />
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="border border-gray-300 rounded-md p-2 text-sm"
          >
            <option value="Admin">Admin</option>
            <option value="Staff">Staff</option>
            <option value="Doctor">Doctor</option>
            <option value="Lab Assistant">Lab Assistant</option>
          </select>
          <label className="flex items-center space-x-2 col-span-2">
            <input
              type="checkbox"
              name="isActive"
              checked={formData.isActive}
              onChange={handleChange}
            />
            <span className="text-sm">Active</span>
          </label>
          <button
            type="submit"
            className="primary-button col-span-2 bg-cyan-700 text-white px-4 py-2 rounded-md hover:bg-cyan-600 text-sm"
          >
            {editingId ? 'Update User' : 'Create User'}
          </button>
        </form>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-md p-4 overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-2">Name</th>
                <th className="p-2">Email</th>
                <th className="p-2">Phone</th>
                <th className="p-2">Role</th>
                <th className="p-2">Active</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.length > 0 ? (
                users.map(user => (
                  <tr key={user.userId} className="border-t hover:bg-gray-50">
                    <td className="p-2">{user.fullName}</td>
                    <td className="p-2">{user.email}</td>
                    <td className="p-2">{user.phone}</td>
                    <td className="p-2">{user.role}</td>
                    <td className="p-2">{user.isActive ? 'Yes' : 'No'}</td>
                    <td className="p-2 space-x-2">
                      <button
                        onClick={() => handleEdit(user)}
                        className="inline-flex items-center px-3 py-1 text-xs font-medium text-blue-600 border border-blue-600 rounded hover:bg-blue-50"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(user.userId)}
                        className="inline-flex items-center px-3 py-1 text-xs font-medium text-red-600 border border-red-600 rounded hover:bg-red-50"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center py-4 text-gray-500">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
