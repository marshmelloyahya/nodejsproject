/* eslint-disable max-len */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import router from 'next/router';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const closeError = () => setError('');
  const HandleSubmit = async (e) => {
    try {
      e.preventDefault();
      const resp = await axios({
        method: 'POST',
        url: process.env.NEXT_PUBLIC_LOGIN_ROUTE,
        data: {
          email,
          password,
        },
      });
      // set token
      localStorage.setItem('token', resp.data.token);
      // set email
      localStorage.setItem('email', resp.data.user.email);
      localStorage.setItem('role', resp.data.user.role);
      router.reload();
      router.push('/');
    } catch (err) {
      setError(err.response.data.message);
    }
  };
  useEffect(() => {
    setIsLoggedIn(localStorage.getItem('token'));
  }, []);
  useEffect(() => {
    if (isLoggedIn) { router.push('/'); }
  }, [isLoggedIn]);
  return (
    <form action="#" onSubmit={HandleSubmit}>
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 flex flex-col">
        {error && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
            role="alert"
          >
            <strong className="font-bold">{error}</strong>
            <span className="absolute top-0 bottom-0 right-0 px-4 py-3" onClick={closeError}>
              <svg
                className="fill-current h-6 w-6 text-red-500"
                role="button"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <title>Close</title>
                <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" />
              </svg>
            </span>
          </div>
        )}
        <div className="mb-4">
          <label
            className="block text-grey-darker text-sm font-bold mb-2"
            htmlFor="email"
          >
            Email
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-grey-darker"
            id="email"
            type="text"
            placeholder="email"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="mb-6">
          <label
            className="block text-grey-darker text-sm font-bold mb-2"
            htmlFor="password"
          >
            Password
          </label>
          <input
            className="shadow appearance-none border border-red rounded w-full py-2 px-3 text-grey-darker mb-3"
            id="password"
            type="password"
            placeholder="******************"
            onChange={(e) => setPassword(e.target.value)}
          />
          <p className="text-red text-xs italic">Please choose a password.</p>
        </div>
        <div className="flex items-center justify-between">
          <button type="submit">
            <span className="transition duration-500 ease transform hover:-translate-y-1 inline-block bg-pink-600 text-lg font-medium rounded-full text-white px-8 py-3 cursor-pointer">
              Login
            </span>
          </button>
        </div>
      </div>
    </form>
  );
};

export default LoginForm;
