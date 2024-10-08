// app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header'; // Adjust the path if needed

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Calculator frontendmentor',
  description: 'Calculator frontendmentor duplication from mario-alxndr',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className='light'>
      <body className={inter.className}>
        <Header /> {/* Constant header for all pages */}
        <main className="pt-[60px]">{children}</main> {/* Add padding to account for the fixed header */}
      </body>
    </html>
  );
}
