'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showCredentials, setShowCredentials] = useState(false);
  const router = useRouter();
  const { login, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username || !password) {
      setError('Please enter both username and password');
      return;
    }

    const success = login(username, password);
    if (success) {
      router.push('/');
    } else {
      setError('Invalid username or password');
      setPassword('');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-100 via-pink-100 to-purple-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl sm:text-6xl font-bold text-purple-600 mb-3">
            🎮 SkillSprout
          </h1>
          <p className="text-xl sm:text-2xl text-gray-700">
            Welcome Back!
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-2xl">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 text-center">
            Login to Continue
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username */}
            <div>
              <label htmlFor="username" className="block text-lg font-semibold text-gray-700 mb-2">
                Username
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-xl focus:outline-none focus:border-purple-500 transition-colors"
                placeholder="Enter your username"
                autoComplete="username"
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-lg font-semibold text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-xl focus:outline-none focus:border-purple-500 transition-colors"
                placeholder="Enter your password"
                autoComplete="current-password"
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-100 border-2 border-red-400 text-red-700 px-4 py-3 rounded-xl text-center">
                {error}
              </div>
            )}

            {/* Login Button */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold text-xl py-4 rounded-xl hover:shadow-lg transform hover:scale-105 active:scale-95 transition-all"
            >
              Login 🚀
            </button>
          </form>

          {/* Demo Credentials Toggle */}
          <div className="mt-6">
            <button
              onClick={() => setShowCredentials(!showCredentials)}
              className="w-full text-purple-600 font-semibold text-sm hover:text-purple-800 transition-colors"
            >
              {showCredentials ? '🔒 Hide' : '🔑 Show'} Demo Credentials
            </button>

            {showCredentials && (
              <div className="mt-4 bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-xl border-2 border-purple-200">
                <p className="font-bold text-gray-800 mb-3 text-center">Sample Login Credentials:</p>
                <div className="space-y-2 text-sm">
                  <div className="bg-white p-3 rounded-lg">
                    <p className="font-semibold text-purple-600">👑 Admin</p>
                    <p><span className="font-medium">Username:</span> admin</p>
                    <p><span className="font-medium">Password:</span> admin123</p>
                  </div>
                  <div className="bg-white p-3 rounded-lg">
                    <p className="font-semibold text-blue-600">👨‍🏫 Teacher</p>
                    <p><span className="font-medium">Username:</span> teacher</p>
                    <p><span className="font-medium">Password:</span> teacher123</p>
                  </div>
                  <div className="bg-white p-3 rounded-lg">
                    <p className="font-semibold text-green-600">👨‍👩‍👧 Parent</p>
                    <p><span className="font-medium">Username:</span> parent</p>
                    <p><span className="font-medium">Password:</span> parent123</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6 text-gray-600">
          <p className="text-sm">
            Educational puzzle games for kids aged 3-6
          </p>
        </div>
      </div>
    </div>
  );
}
