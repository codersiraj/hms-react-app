import React, { useState } from 'react';
import { loginUser } from '../api/auth'; // Adjust the path if needed

export default function LoginPage() {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await loginUser({ userId, password });
      console.log('Login Response:', response);

      if (response?.token) {
        localStorage.setItem('token', response.token);
        localStorage.setItem('userId', response.userId?.toString() || '');
        localStorage.setItem('role', response.role || '');

        // Redirect to dashboard
        window.location.href = '/dashboard';
      } else {
        setError('Invalid response from server.');
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-cyan-400 to-teal-300 relative overflow-hidden">
      <div className="absolute w-full h-full bg-[url('background1.jpg')] bg-cover bg-center opacity-10 z-0" />

      <div className="bg-white rounded-xl shadow-xl px-10 py-12 z-10 w-full max-w-md relative">
        <div className="flex flex-col items-center">
          <h2>Sign In</h2>

          <form className="w-full space-y-8" onSubmit={handleLogin}>
            <div className="relative border-b border-gray-300 pb-2">
              <label className="block text-sm text-cyan-700 font-semibold mb-1">User Id</label>
              <input
                type="userId"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                placeholder="example@mail.com"
                className="w-full pl-0 pr-10 py-2 text-sm text-gray-800 bg-transparent focus:outline-none"
                required
              />
            </div>

            <div className="relative border-b border-gray-300 pb-2">
              <label className="block text-sm text-cyan-700 font-semibold mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full pl-0 pr-10 py-2 text-sm text-gray-800 bg-transparent focus:outline-none"
                required
              />
            </div>

            {error && <div className="text-red-600 text-sm text-center font-semibold">{error}</div>}

            <button
              type="submit"
              className="w-full bg-cyan-600 text-white py-3 rounded-md tracking-wider font-semibold hover:bg-cyan-700 transition"
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'SIGN IN'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
