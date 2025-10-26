'use client';

import { useState } from 'react';
import Dashboard from './dashboard.screen';

export default function LoginScreen() {
  const [credentials, setCredentials] = useState({ id: '', password: '' });
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (credentials.id && credentials.password) {
      setIsLoggedIn(true); 
    } else {
      alert('Please enter credentials');
    }
  };

  if (isLoggedIn) {
    return <Dashboard />; 
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-md">
        <h2 className="text-center text-3xl font-extrabold text-gray-900">Service Center Login</h2>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <input
              id="id"
              name="id"
              type="text"
              required
              placeholder="Enter your ID"
              className="appearance-none rounded-md w-full px-3 py-2 border border-gray-300 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              value={credentials.id}
              onChange={(e) => setCredentials({ ...credentials, id: e.target.value })}
            />
            <input
              id="password"
              name="password"
              type="password"
              required
              placeholder="Enter your password"
              className="appearance-none rounded-md w-full px-3 py-2 border border-gray-300 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              value={credentials.password}
              onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Sign in
          </button>
        </form>
      </div>
    </div>
  );
}
