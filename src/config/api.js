export const API_KEY = '233fed6fc6d89ee918833b4676303c42';
export const BASE_URL = 'https://api.themoviedb.org/3';
export const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

export const getImageUrl = (path, size = 'w500') => {
  if (!path) return null;
  return `${IMAGE_BASE_URL}/${size}${path}`;
};

export const ENDPOINTS = {
  POPULAR_MOVIES: '/movie/popular',
  TOP_RATED: '/movie/top_rated',
  NOW_PLAYING: '/movie/now_playing',
  GENRES: '/genre/movie/list',
};