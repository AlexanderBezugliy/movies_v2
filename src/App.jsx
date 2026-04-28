import { useState, useEffect, useMemo } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import MoviesGrid from './components/MoviesGrid';
import MovieModal from './components/MovieModal';
import { useGenres, useNowPlayingMovies, useMovieFullData } from './hooks/useTMDB';
import './styles/App.scss';

function App() {
  const [language, setLanguage] = useState('ru-RU');
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [selectedMovieId, setSelectedMovieId] = useState(null);

  const handleLanguageChange = (newLanguage) => {
    setLanguage(newLanguage);
  };

  const handleMovieSelect = (movie) => {
    setSelectedMovie(movie);
    setSelectedMovieId(movie?.id || null);
  };

  const handleCloseModal = () => {
    setSelectedMovie(null);
    setSelectedMovieId(null);
  };

  const { data: fullMovieData, loading: fullMovieLoading } = useMovieFullData(selectedMovieId, language);

  const { data: nowPlayingData, loading: nowPlayingLoading } = useNowPlayingMovies(language);
  const { data: genresData, loading: genresLoading, error: genresError } = useGenres(language);

  const genres = useMemo(() => {
    return genresData?.genres || [];
  }, [genresData]);

  const topMovie = useMemo(() => {
    return nowPlayingData?.results?.[0] || null;
  }, [nowPlayingData]);

  const movies = useMemo(() => {
    return nowPlayingData?.results || [];
  }, [nowPlayingData]);

  const modalMovie = useMemo(() => {
    if (!fullMovieData) return selectedMovie;
    return { ...selectedMovie, ...fullMovieData };
  }, [fullMovieData, selectedMovie]);

  return (
    <div className="app">
      <Header language={language} onLanguageChange={handleLanguageChange} />
      
      <main className="app__main">
        <Hero 
          movie={topMovie} 
          language={language}
        />
        
        <MoviesGrid 
          movies={movies} 
          genres={genres}
          language={language}
          onMovieSelect={handleMovieSelect}
        />
      </main>

      <footer className="app__footer">
        <div className="app__footer-content">
          <p className="app__footer-text">
            © 2026 CINEMAX. {language === 'ru-RU' ? 'Все права защищены' : 'All rights reserved'}
          </p>
          <p className="app__footer-powered">
            {language === 'ru-RU' ? 'Данные предоставлены TMDB' : 'Powered by TMDB'}
          </p>
        </div>
      </footer>

      <MovieModal 
        movie={modalMovie}
        isOpen={!!selectedMovie}
        onClose={handleCloseModal}
        language={language}
        loading={fullMovieLoading}
      />
    </div>
  );
}

export default App;