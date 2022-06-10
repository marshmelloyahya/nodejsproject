import axios from 'axios';

export const getPosts = async () => {
  const { data } = await axios.get(process.env.NEXT_PUBLIC_ARTICLES_ROUTE);
  return data;
};

export const getCategories = async () => {
  const { data } = await axios.get(process.env.NEXT_PUBLIC_CATEGORIES_ROUTE);
  return data;
};

export const getPostDetails = async (slug) => {
  const { data } = await axios.get(`${process.env.NEXT_PUBLIC_ARTICLE_ROUTE}/${slug}`);
  return data;
};

export const getCategoryPost = async (slug) => {
  const { data } = await axios.get(`${process.env.NEXT_PUBLIC_CATEGORIES_ROUTE}/${slug}`);
  return data;
};

export const getComments = async (slug) => {
  const { data } = await axios.get(`${process.env.NEXT_PUBLIC_COMMENTS_ROUTE}/${slug}`);
  return data;
};
