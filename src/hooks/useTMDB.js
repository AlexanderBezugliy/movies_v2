import { useState, useEffect, useCallback } from 'react';
import { BASE_URL, API_KEY } from '../config/api';

export const useTMDB = (endpoint, params = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const queryParams = new URLSearchParams({
        api_key: API_KEY,
        ...params,
      });

      const response = await fetch(`${BASE_URL}${endpoint}?${queryParams}`);

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [endpoint, JSON.stringify(params)]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};

export const useGenres = (language = 'ru-RU') => {
  return useTMDB('/genre/movie/list', { language });
};

export const useTVGenres = (language = 'ru-RU') => {
  return useTMDB('/genre/tv/list', { language });
};

export const usePopularMovies = (language = 'ru-RU', page = 1) => {
  return useTMDB('/movie/popular', { language, page });
};

export const useTopRatedMovies = (language = 'ru-RU', page = 1) => {
  return useTMDB('/movie/top_rated', { language, page });
};

export const useNowPlayingMovies = (language = 'ru-RU', page = 1) => {
  return useTMDB('/movie/now_playing', { language, page });
};

export const useMovieVideos = (movieId, language = 'ru-RU') => {
  return useTMDB(`/movie/${movieId}/videos`, { language });
};

export const useMovieDetails = (movieId, language = 'ru-RU') => {
  return useTMDB(`/movie/${movieId}`, { language, append_to_response: 'videos' });
};

export const useMovieFullData = (movieId, language = 'ru-RU') => {
  const [movieData, setMovieData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!movieId) return;

    const fetchFullData = async () => {
      setLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams({
          api_key: API_KEY,
          language,
          append_to_response: 'videos',
        });

        const response = await fetch(`${BASE_URL}/movie/${movieId}?${params}`);

        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }

        const result = await response.json();
        setMovieData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFullData();
  }, [movieId, language]);

  return { data: movieData, loading, error };
};

export const useTVShowFullData = (tvShowId, language = 'ru-RU') => {
  const [tvShowData, setTvShowData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!tvShowId) return;

    const fetchFullData = async () => {
      setLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams({
          api_key: API_KEY,
          language,
          append_to_response: 'videos',
        });

        const response = await fetch(`${BASE_URL}/tv/${tvShowId}?${params}`);

        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }

        const result = await response.json();
        setTvShowData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFullData();
  }, [tvShowId, language]);

  return { data: tvShowData, loading, error };
};