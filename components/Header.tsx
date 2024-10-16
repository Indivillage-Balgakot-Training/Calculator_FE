// components/Header.tsx
import Link from 'next/link';

const Header: React.FC = () => {
  return (
    <header className="fixed top-0 left-0 w-full flex justify-between items-center p-4 bg-zinc-300 text-white z-50">
      <Link href="https://indivillage.com/" target="_blank" rel="noopener noreferrer">
      <img alt="Logo" className="w-20 h-auto object-cover " src="logo.png" /> </Link>
      <nav>
        <ul className="flex space-x-4">
          <li>
            <Link href="/" className="text-black hover:text-gray-400">Home</Link>
          </li>
          <li>
            <Link href="/login" className="text-black hover:text-gray-400">Login</Link>
          </li>

        </ul>
      </nav>
    </header>
  );
};

export default Header;
