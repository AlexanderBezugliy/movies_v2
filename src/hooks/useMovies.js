import { useState, useEffect, useCallback, useRef } from 'react';
import { BASE_URL, API_KEY } from '../config/api';

export const useMovies = (language = 'ru-RU') => {
  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [sortBy, setSortBy] = useState('popularity.desc');
  
  const debounceTimerRef = useRef(null);

  const fetchGenres = useCallback(async () => {
    try {
      const params = new URLSearchParams({
        api_key: API_KEY,
        language,
      });
      const response = await fetch(`${BASE_URL}/genre/movie/list?${params}`);
      if (!response.ok) throw new Error('Failed to fetch genres');
      const result = await response.json();
      setGenres(result.genres || []);
    } catch (err) {
      console.error('Error fetching genres:', err);
    }
  }, [language]);

  const fetchMovies = useCallback(async () => {
    setIsLoading(true);
    setIsError(false);

    try {
      const params = new URLSearchParams({
        api_key: API_KEY,
        language,
      });

      let endpoint;

      if (searchQuery && searchQuery.trim()) {
        endpoint = '/search/movie';
        params.append('query', searchQuery.trim());
      } else {
        endpoint = '/discover/movie';
        params.append('sort_by', sortBy);
        if (selectedGenre) {
          params.append('with_genres', selectedGenre);
        }
      }

      const response = await fetch(`${BASE_URL}${endpoint}?${params}`);
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const result = await response.json();
      setMovies(result.results || []);
    } catch (err) {
      console.error('Error fetching movies:', err);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, selectedGenre, sortBy, language]);

  useEffect(() => {
    fetchGenres();
  }, [fetchGenres]);

  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    if (searchQuery && searchQuery.trim()) {
      debounceTimerRef.current = setTimeout(() => {
        fetchMovies();
      }, 500);
    } else {
      fetchMovies();
    }

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [fetchMovies, searchQuery]);

  const handleSearchChange = useCallback((value) => {
    setSearchQuery(value);
  }, []);

  const handleGenreChange = useCallback((value) => {
    setSelectedGenre(value);
  }, []);

  const handleSortChange = useCallback((value) => {
    setSortBy(value);
  }, []);

  return {
    movies,
    genres,
    isLoading,
    isError,
    searchQuery,
    selectedGenre,
    sortBy,
    setSearchQuery: handleSearchChange,
    setSelectedGenre: handleGenreChange,
    setSortBy: handleSortChange,
  };
};