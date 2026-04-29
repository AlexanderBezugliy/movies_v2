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

export const FALLBACK_IMAGE = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='500' height='750' viewBox='0 0 500 750'%3E%3Crect fill='%232a2a3e' width='500' height='750'/%3E%3Ctext fill='%23666' font-family='sans-serif' font-size='48' x='50%25' y='50%25' text-anchor='middle' dominant-baseline='middle'%3E🎬%3C/text%3E%3C/svg%3E";

export const FALLBACK_BACKDROP = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1920' height='1080' viewBox='0 0 1920 1080'%3E%3Crect fill='%232a2a3e' width='1920' height='1080'/%3E%3Ctext fill='%23666' font-family='sans-serif' font-size='72' x='50%25' y='50%25' text-anchor='middle' dominant-baseline='middle'%3E🎬%3C/text%3E%3C/svg%3E";