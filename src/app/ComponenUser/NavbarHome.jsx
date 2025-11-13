'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Menu, X } from 'lucide-react'; // ikon dari lucide-react

export default function NavbarHome() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  const navigateAndClose = (path) => {
    if (path.startsWith("#")) {
      document.querySelector(path)?.scrollIntoView({ behavior: "smooth" });
    } else {
      router.push(path);
    }
    setIsOpen(false);
  };

  return (
    <nav className="bg-blue-300 shadow-md fixed w-full z-50 top-0">
      <div className="container mx-auto h-20 px-4 sm:px-6 flex justify-between items-center">
        {/* LOGO + TEKS */}
        <div className="flex items-center">
          <img
            src="https://res.cloudinary.com/dds2w4rr8/image/upload/v1751098642/Screenshot_2025-06-28_150629-removebg-preview_o9fgmf.png"
            alt="Laundry Logo"
            className="h-full max-h-16 w-auto"
          />
          <span
            className="ml-4 text-xl font-bold text-black hover:text-white cursor-pointer">
            Laundry Mbak Suprih
          </span>
        </div>

        {/* Desktop Menu */}
        <ul className="hidden md:flex space-x-6 text-gray-700 items-center">
          <li
            className="cursor-pointer font-bold text-gray-900 hover:text-white"
            onClick={() => navigateAndClose("")}
          >
            Beranda
          </li>
          <li
            className="cursor-pointer font-bold text-gray-900 hover:text-white"
            onClick={() => navigateAndClose("#about")}
          >
            Tentang
          </li>
          <li
            className="cursor-pointer font-bold text-gray-900 hover:text-white"
            onClick={() => navigateAndClose("#services")}
          >
            Paket Laundry
          </li>
          <li>
            <button
              className="bg-green-500 text-white font-bold px-4 py-2 rounded hover:bg-green-600"
              onClick={() => router.push("/loginAdmin")}
            >
              Login
            </button>
          </li>
        </ul>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button onClick={toggleMenu} className="text-black hover:text-white focus:outline-none">
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {isOpen && (
        <div className="md:hidden bg-blue-200 px-6 py-4 space-y-4 shadow-lg">
          <div
            className="cursor-pointer font-semibold text-gray-900 hover:text-white"
            onClick={() => navigateAndClose("")}
          >
            Beranda
          </div>
          <div
            className="cursor-pointer font-semibold text-gray-900 hover:text-white"
            onClick={() => navigateAndClose("#about")}
          >
            Tentang
          </div>
          <div
            className="cursor-pointer font-semibold text-gray-900 hover:text-white"
            onClick={() => navigateAndClose("#services")}
          >
            Paket Laundry
          </div>
          
        </div>
      )}
    </nav>
  );
}
