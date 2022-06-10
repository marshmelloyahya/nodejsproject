import React, { useEffect, useState } from 'react';

import Link from 'next/link';

const Header = () => {
  const [isAuthenticated, setIsAuthenticated] = useState('');
  const [role, setRole] = useState('');
  useEffect(() => {
    setIsAuthenticated(localStorage.getItem('token'));
    setRole(localStorage.getItem('role'));
  }, []);
  const logout = (e) => {
    e.preventDefault();
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('email');
    setIsAuthenticated('');
    window.location.reload();
  };
  return (
    <div className="container mx-auto px-10 mb-8">
      <div className="border-b w-full inline-block border-blue-400 py-8">
        <div className="md:float-left block">
          <Link href="/">
            <span className="cursor-pointer font-bold text-4xl text-white">The Blog</span>
          </Link>
        </div>
        {!isAuthenticated && (
        <div className="hidden md:float-left md:contents">
          <Link href="/auth/login"><span className="md:float-right mt-2 align-middle text-white ml-4 font-semibold cursor-pointer">Login</span></Link>
          <Link href="/auth/register"><span className="md:float-right mt-2 align-middle text-white ml-4 font-semibold cursor-pointer">Register</span></Link>
        </div>
        )}
        {isAuthenticated && (
        // new post
        <div className="hidden md:float-left md:contents">
          <a href="/" onClick={logout}><span className="md:float-right mt-2 align-middle text-white ml-4 font-semibold cursor-pointer">Logout</span></a>
          <Link href="/newpost"><span className="md:float-right mt-2 align-middle text-white ml-4 font-semibold cursor-pointer">New Post</span></Link>
          {role === 'ADMIN' && (<Link href="/addcategory"><span className="md:float-right mt-2 align-middle text-white ml-4 font-semibold cursor-pointer">New Category</span></Link>)}
        </div>
        )}
      </div>
    </div>
  );
};

export default Header;
