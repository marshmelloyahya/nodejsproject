import React, { useEffect, useState } from 'react';
import parse from 'html-react-parser';
import axios from 'axios';
import { getComments } from '../services';

const Comments = ({ slug }) => {
  const [comments, setComments] = useState([]);
  const [count, setCount] = useState(0);
  const [newComment, setNewComment] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState('');
  useEffect(() => {
    //   console.log('rerendering triggered');
    setIsLoggedIn(!!localStorage.getItem('token'));
    async function fetchData() {
      const data = await getComments(slug);
      setComments(data);
    }
    fetchData();
  }, []);
  useEffect(() => {
  }, [comments]);
  const PostComment = (e) => {
    e.preventDefault();
    axios({
      method: 'post',
      url: `${process.env.NEXT_PUBLIC_COMMENTS_ROUTE}`,
      data: {
        articleId: slug,
        content: newComment,
        email,
      },
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    setCount(count + 1);
    setComments(comments.concat({
      email: email === '' ? localStorage.getItem('email') : email,
      contenu: newComment,
    }));
    setNewComment('');
    setEmail('');
  };

  return (
    <>
      {comments.length > 0 && (
        <div className="bg-white shadow-lg rounded-lg p-8 pb-12 mb-8">
          <h3 className="text-xl mb-8 font-semibold border-b pb-4">
            {comments.length}
            {' '}
            Comments
          </h3>
            {comments.map((comment, index) => (
              <div key={index} className="border-b border-gray-100 mb-4 pb-4">
                <p className="mb-4">
                  <span className="font-semibold">{comment.email}</span>
                </p>
                <p className="whitespace-pre-line text-gray-600 w-full">{parse(comment.contenu)}</p>
              </div>
            ))}
        </div>
      )}
      <form action="#" onSubmit={PostComment}>
        { !isLoggedIn
 && (
 <div className="flex flex-col items-center">
   <label htmlFor="email" className="text-blue-600">Email</label>
   <input
     type="email"
     id="email"
     value={email}
     onChange={(e) => setEmail(e.target.value)}
     className="shadow-md appearance-none border rounded w-full py-2 px-3 text-white-700 leading-tight focus:outline-none focus:shadow-outline"
   />
 </div>
 )}
        <div className="flex flex-col items-center">
          <label htmlFor="comment" className="text-blue-600">Comment</label>
          <textarea
            id="comment"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="shadow-md appearance-none border rounded w-full py-2 px-3 text-white-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="flex items-center">
          <button type="submit">
            <span className="transition duration-500 ease transform hover:-translate-y-1 inline-block bg-pink-600 text-lg font-medium rounded-full text-white px-8 py-3 cursor-pointer">
              Post Comment
            </span>
          </button>
        </div>
      </form>

    </>
  );
};

export default Comments;
