'use client';

import { useState } from 'react';
import { signUpUser } from '@/features/auth/actions/manual-auth';

export function ManualSignupForm() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [gender, setGender] = useState('other');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    const formData = new FormData();
    formData.append('email', email);
    formData.append('username', username);
    formData.append('password', password);
    formData.append('gender', gender);

    const result = await signUpUser(formData);

    if (result.error) {
      setError(result.error);
      setLoading(false);
    } else if (result.success) {
      setSuccessMessage(result.message || 'Success! Please verify your email.');
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-8 w-full max-w-4xl mx-auto p-4">
      {/* Dynamic Visual Card (Left Side) */}
      <div className="flex-1 bg-gray-100 p-6 rounded-xl border border-gray-300 flex flex-col items-center justify-center min-h-[300px]">
        <h3 className="text-xl font-bold mb-4 text-gray-700">Profile Preview</h3>
        
        <div className="w-24 h-24 bg-gray-300 rounded-full mb-4 overflow-hidden border-4 border-white shadow-md flex items-center justify-center text-xs text-gray-500">
          {/* Unstyled placeholder for the selected premade avatar */}
          [Avatar: {gender}]
        </div>
        
        <h2 className="text-2xl font-bold text-gray-800 break-all text-center">
          {username || 'Your Username'}
        </h2>
        <p className="text-gray-500 mt-2 break-all text-center">
          {email || 'your.email@example.com'}
        </p>
        <div className="mt-4 bg-gray-200 px-4 py-1 rounded-full text-sm text-gray-600 font-semibold">
          Level 1 Student
        </div>
      </div>

      {/* Signup Form (Right Side) */}
      <div className="flex-1">
        <h2 className="text-2xl font-bold mb-6">Create your Account</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {error && <div className="bg-red-100 text-red-600 p-3 rounded">{error}</div>}
          {successMessage && <div className="bg-green-100 text-green-700 p-4 rounded border border-green-300 font-medium">{successMessage}</div>}

          {!successMessage && (
            <>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border border-gray-300 p-2 rounded"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full border border-gray-300 p-2 rounded"
              placeholder="Choose a username"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Gender (For Initial Avatar)</label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="w-full border border-gray-300 p-2 rounded"
            >
              <option value="other">Prefer not to say (Neutral Avatar)</option>
              <option value="male">Male (Male Avatar)</option>
              <option value="female">Female (Female Avatar)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full border border-gray-300 p-2 rounded"
              placeholder="Create a password"
            />
          </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-4 bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? 'Signing up...' : 'Sign Up'}
              </button>
            </>
          )}
        </form>
      </div>
    </div>
  );
}
