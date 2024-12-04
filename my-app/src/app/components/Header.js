'use client'

import Link from 'next/link'
import ThemeSwitch from './ThemeSwitch'
import LogoutButton from './LogoutButton'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'

export default function Header() {
  const { data: session, status } = useSession();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }
  
  return (
    <header className="bg-white dark:bg-gray-900 shadow-md py-4">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center px-4">
        {/* Logo */}
        <h1 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mb-4 sm:mb-0">FOOD NEXT</h1>
        
        {/* Main Navigation */}
        <nav className="space-y-4 sm:space-y-0 sm:space-x-6 sm:flex sm:items-center">
          <Link href="/" className="text-gray-600 dark:text-gray-300 hover:text-[#1E88E5] dark:hover:text-[#42A5F5] transition duration-200">หน้าแรก</Link>
          <Link href="/menu" className="text-gray-600 dark:text-gray-300 hover:text-[#1E88E5] dark:hover:text-[#42A5F5] transition duration-200">เมนู</Link>
          <Link href="/about" className="text-gray-600 dark:text-gray-300 hover:text-[#1E88E5] dark:hover:text-[#42A5F5] transition duration-200">เกี่ยวกับเรา</Link>
          <Link href="/contact" className="text-gray-600 dark:text-gray-300 hover:text-[#1E88E5] dark:hover:text-[#42A5F5] transition duration-200">ติดต่อ</Link>
        </nav>

        {/* User Section */}
        <div className='flex items-center gap-4'>
          {/* Theme Switch */}
          <ThemeSwitch />
          
          {/* User Navigation */}
          <nav className='flex items-center gap-4'>
            {status === 'authenticated' && session?.user ? (
              <div className="flex items-center gap-4">
                {/* Cart */}
                <Link 
                  href="/cart" 
                  className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-[#1E88E5] dark:hover:text-[#42A5F5] transition duration-200 bg-gray-100 dark:bg-gray-800 px-3 py-2 rounded-full"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                  </svg>
                  <span>ตะกร้า</span>
                </Link>

                {/* Profile */}
                <Link 
                  href="/profile" 
                  className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-[#1E88E5] dark:hover:text-[#42A5F5] transition duration-200"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                  </svg>
                  <span>{session.user?.name || session.user?.email}</span>
                </Link>

                {/* Logout Button */}
                <LogoutButton />
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link href="/login" className="text-white hover:text-[#42A5F5] transition duration-200 bg-logincolor rounded-full px-4 py-2">Login</Link>
                <Link href="/register" className="text-white hover:text-[#42A5F5] transition duration-200 bg-logincolor rounded-full px-4 py-2">Register</Link>
              </div>
            )}
          </nav>
        </div>
      </div>
    </header>
  )
}
