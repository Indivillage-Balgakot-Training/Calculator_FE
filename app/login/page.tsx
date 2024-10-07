'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import cn from 'classnames';
import { Button } from '@/components/ui/button';

const AuthPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const router = useRouter();

  const handleAuth = async () => {
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
          setIsRegistering(false); // Switch back to login
          setError('Registration successful! Please log in.');
        } else {
          setIsAuthenticated(true);
          localStorage.setItem('isAuthenticated', 'true');
          router.push('/'); // Redirect to home page
        }
      } else {
        setError(data.error || 'An error occurred');
      }
    } catch (err) {
      setError('Failed to connect to the server.');
    }
  };

  return (
    <main className={cn("min-h-screen flex items-center justify-center bg-gray-100")}>
      <div className="block max-w-sm w-full p-8 border border-gray-200 rounded-lg shadow-lg bg-white">
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
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-bold mb-2">Password</label>
              <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <Button variant="outline" size="lg" className="w-full" onClick={handleAuth}>
              {isRegistering ? 'Register' : 'Login'}
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="w-full mt-4" 
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
