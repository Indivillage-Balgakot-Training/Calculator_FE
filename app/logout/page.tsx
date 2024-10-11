// app/logout/page.tsx
"use client"; // Add this line to mark the component as a client component

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const LogoutPage = () => {
  const router = useRouter();

  useEffect(() => {
    // Redirect to login after 3 seconds
    const timer = setTimeout(() => {
      router.push('/');
    }, 1000);

    return () => clearTimeout(timer); // Clear timeout if component unmounts
  }, [router]);

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-100 bg-[url('/img3.jpg')] bg-no-repeat bg-center bg-cover">
      <h1 className="text-2xl font-bold text-white">You have been logged out.</h1>
      <p className="mt-4 text-white">Redirecting to home page...</p>
    </main>
  );
};

export default LogoutPage;
