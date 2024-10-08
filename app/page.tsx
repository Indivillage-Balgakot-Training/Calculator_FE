// app/page.tsx
import React from 'react';
import Header from '@/components/Header'; // Adjust the path as necessary

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="pt-[65px] flex flex-col items-center  min-h-screen bg-[url('/img3.jpg')] bg-cover bg-no-repeat bg-center">
        <h1 className="text-4xl font-bold mb-4 text-white ">Welcome to the <span className="roll">Calculator</span> App</h1>
        
      </main>
    </div>
  );
};

export default HomePage;
