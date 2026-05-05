import { useState, useEffect, useCallback, useRef } from 'react';
import { BASE_URL, API_KEY } from '../config/api';

export const useTVShows = (language = 'ru-RU') => {
  const [tvShows, setTvShows] = useState([]);
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
      const response = await fetch(`${BASE_URL}/genre/tv/list?${params}`);
      if (!response.ok) throw new Error('Failed to fetch genres');
      const result = await response.json();
      setGenres(result.genres || []);
    } catch (err) {
      console.error('Error fetching TV genres:', err);
    }
  }, [language]);

  const fetchTVShows = useCallback(async () => {
    setIsLoading(true);
    setIsError(false);

    try {
      const params = new URLSearchParams({
        api_key: API_KEY,
        language,
      });

      let endpoint;

      if (searchQuery && searchQuery.trim()) {
        endpoint = '/search/tv';
        params.append('query', searchQuery.trim());
      } else {
        endpoint = '/discover/tv';
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
      setTvShows(result.results || []);
    } catch (err) {
      console.error('Error fetching TV shows:', err);
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
        fetchTVShows();
      }, 500);
    } else {
      fetchTVShows();
    }

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [fetchTVShows, searchQuery]);

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
    tvShows,
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