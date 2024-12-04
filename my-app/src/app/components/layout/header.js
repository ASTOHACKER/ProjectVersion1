'use client'

import Link from 'next/link'

export default function Header() {

  const session = useSession();
  console.log(session);
  return (
    <header className="bg-white dark:bg-gray-900 shadow-md py-4">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center px-4">
        <h1 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mb-4 sm:mb-0">FOOD NEXT</h1>
        <nav className="space-y-4 sm:space-y-0 sm:space-x-6 sm:flex sm:items-center">
          <Link href="/" className="text-gray-600 dark:text-gray-300 hover:text-[#1E88E5] dark:hover:text-[#42A5F5] transition duration-200">หน้าแรก</Link>
          <Link href="/menu" className="text-gray-600 dark:text-gray-300 hover:text-[#1E88E5] dark:hover:text-[#42A5F5] transition duration-200">เมนู</Link>
          <Link href="/about" className="text-gray-600 dark:text-gray-300 hover:text-[#1E88E5] dark:hover:text-[#42A5F5] transition duration-200">เกี่ยวกับเรา</Link>
          <Link href="/contact" className="text-gray-600 dark:text-gray-300 hover:text-[#1E88E5] dark:hover:text-[#42A5F5] transition duration-200">ติดต่อ</Link>
        </nav>
        <div className='flex items-center gap-8'>
          <nav className='flex items-center gap-4'>
            <Link href="/login" className="text-white hover:text-[#42A5F5] transition duration-200 bg-logincolor rounded-full px-4 py-2">Login</Link>
            <Link href="/register" className="text-white hover:text-[#42A5F5] transition duration-200 bg-logincolor rounded-full px-4 py-2">Register</Link>
          </nav>

          <nav className='flex items-center gap-4'>
            
          </nav>
        </div>
      </div>
    </header>
  )
}
