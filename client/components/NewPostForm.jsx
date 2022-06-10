/* eslint-disable max-len */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import router from 'next/router';

const NewPostForm = () => {
  const [title, setTitle] = useState('');
  const [autoPublish, setAutoPublish] = useState(false);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [body, setBody] = useState('');
  const [error, setError] = useState('');
  const closeError = () => setError('');

  const HandleSubmit = async (e) => {
    try {
      e.preventDefault();
      await axios({
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        url: process.env.NEXT_PUBLIC_NEW_POST_ROUTE,
        data: {
          title,
          content: body,
          categoryId: selectedCategory,
          autoPublish,
        },
      });
      router.push('/');
    } catch (err) {
      setError(err.response.data.message);
    }
  };
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const resp = await axios({
          method: 'GET',
          url: process.env.NEXT_PUBLIC_CATEGORIES_ROUTE,
        });
        setCategories(resp.data);
        setSelectedCategory(resp.data[0].id);
      } catch (err) {
        setError(err.response.data.message);
      }
    };
    fetchCategories();
  }, []);
  return (
    <form action="#" onSubmit={HandleSubmit}>
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 flex flex-col">
        {error && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
            role="alert"
          >
            <strong className="font-bold">{error}</strong>
            <span
              className="absolute top-0 bottom-0 right-0 px-4 py-3"
              onClick={closeError}
            >
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
            htmlFor="title"
          >
            Title
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-grey-darker"
            id="title"
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-grey-darker text-sm font-bold mb-2"
            htmlFor="body"
          >
            Body
          </label>
          <textarea
            className="shadow appearance-none border rounded w-full py-2 px-3 text-grey-darker"
            id="body"
            type="text"
            placeholder="Body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-grey-darker text-sm font-bold mb-2"
            htmlFor="category"
          >
            Category
          </label>
          <select
            className="shadow appearance-none border rounded w-full py-2 px-3 text-grey-darker"
            id="category"
            type="text"
            placeholder="Category"
            // value={categories[0]}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {categories.map((category) => (
              <option key={category.nom} value={category.id}>
                {category.nom}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <div className="form-check">
            <input
              className="form-check-input  h-4 w-4 border border-gray-300 rounded-sm bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer"
              type="checkbox"
              checked={autoPublish}
              onChange={(e) => setAutoPublish(e.target.checked)}
            //   value=""
              id="flexCheckDefault"
            />
            <label
              className="form-check-label inline-block text-gray-800"
              htmlFor="flexCheckDefault"
            >
              Automatically publish article
            </label>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <button type="submit">
            <span className="transition duration-500 ease transform hover:-translate-y-1 inline-block bg-pink-600 text-lg font-medium rounded-full text-white px-8 py-3 cursor-pointer">
              Post
            </span>
          </button>
        </div>
      </div>
    </form>
  );
};

export default NewPostForm;
