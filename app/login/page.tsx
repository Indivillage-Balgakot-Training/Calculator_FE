'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import cn from 'classnames';
import { Button } from '@/components/ui/button';

const AuthPage = () => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isRegistering, setIsRegistering] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const router = useRouter();

  const validatePassword = (password: string): boolean => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    return passwordRegex.test(password);
  };

  const handleAuth = async () => {
    if (!validatePassword(password)) {
      setError('Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.');
      return;
    }

    try {
      const url = `http://127.0.0.1:5000/api/${isRegistering ? 'register' : 'login'}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        if (isRegistering) {
          setIsRegistering(false);
          setError('Registration successful! Please log in.');
        } else {
          setIsAuthenticated(true);
          localStorage.setItem('isAuthenticated', 'true');
          router.push('/calculator');
        }
      } else {
        setError(data.error || 'An error occurred');
      }
    } catch (err) {
      setError('Failed to connect to the server.');
    }
  };

  return (
    <main className={cn("min-h-screen flex items-center justify-center bg-purple-300 bg-cover bg-center", "bg-[url('/img3.jpg')]")}>
      <div className="block max-w-sm w-full p-8 border border-gray-200 rounded-lg shadow-lg bg-white bg-opacity-90">
        <h1 className="text-2xl font-bold mb-4">{isAuthenticated ? 'Welcome!' : (isRegistering ? 'Register' : 'Login')}</h1>
        {error && <p className="text-red-500">{error}</p>}
        {!isAuthenticated ? (
          <>
            <div className="mb-4">
              <label className="block text-sm font-bold mb-2">Username</label>
              <input 
                type="text" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)} 
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-bold mb-2">Password</label>
              <input 
                type={showPassword ? 'text' : 'password'} 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
              <button 
                type="button" 
                className="text-blue-600 mt-1"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? 'Hide' : 'Show'} Password
              </button>
            </div>
            <Button variant="outline" size="lg" className="bg-blue-500 hover:bg-blue-900 text-white w-full mt-4" onClick={handleAuth}>
              {isRegistering ? 'Register' : 'Login'}
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="bg-blue-500 hover:bg-blue-900 text-white w-full mt-4" 
              onClick={() => setIsRegistering(!isRegistering)}
            >
              {isRegistering ? 'Already have an account? Login' : 'Create an account'}
            </Button>
          </>
        ) : (
          <div className="mt-4 text-green-500">
            <p>Username: {username}</p>
            <p>Password: {password}</p>
          </div>
        )}
      </div>
    </main>
  );
};

export default AuthPage;
