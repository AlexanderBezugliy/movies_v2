import { useState, useEffect, useMemo } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import MoviesGrid from './components/MoviesGrid';
import BottomFeature from './components/BottomFeature';
import MovieModal from './components/MovieModal';
import TVShowModal from './components/TVShowModal';
import { useGenres, useTVGenres, useNowPlayingMovies, useMovieFullData, useTVShowFullData } from './hooks/useTMDB';
import TVShowsGrid from './components/TVShowsGrid';
import './styles/App.scss';

function App() {
  const [language, setLanguage] = useState('ru-RU');
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [selectedMovieId, setSelectedMovieId] = useState(null);
  const [selectedTVShow, setSelectedTVShow] = useState(null);
  const [selectedTVShowId, setSelectedTVShowId] = useState(null);

  const handleLanguageChange = (newLanguage) => {
    setLanguage(newLanguage);
  };

  const handleMovieSelect = (movie) => {
    setSelectedMovie(movie);
    setSelectedMovieId(movie?.id || null);
  };

  const handleTVShowSelect = (tvShow) => {
    setSelectedTVShow(tvShow);
    setSelectedTVShowId(tvShow?.id || null);
  };

  const handleCloseModal = () => {
    setSelectedMovie(null);
    setSelectedMovieId(null);
    setSelectedTVShow(null);
    setSelectedTVShowId(null);
  };

  const { data: fullMovieData, loading: fullMovieLoading } = useMovieFullData(selectedMovieId, language);

  const { data: fullTVShowData, loading: fullTVShowLoading } = useTVShowFullData(selectedTVShowId, language);

  const { data: nowPlayingData, loading: nowPlayingLoading } = useNowPlayingMovies(language);
  const { data: genresData, loading: genresLoading, error: genresError } = useGenres(language);
  const { data: tvGenresData } = useTVGenres(language);

  const genres = useMemo(() => {
    return genresData?.genres || [];
  }, [genresData]);

  const tvGenres = useMemo(() => {
    return tvGenresData?.genres || [];
  }, [tvGenresData]);

  const movies = useMemo(() => {
    return nowPlayingData?.results || [];
  }, [nowPlayingData]);

  const modalMovie = useMemo(() => {
    if (!fullMovieData) return selectedMovie;
    return { ...selectedMovie, ...fullMovieData };
  }, [fullMovieData, selectedMovie]);

  const modalTVShow = useMemo(() => {
    if (!fullTVShowData) return selectedTVShow;
    return { ...selectedTVShow, ...fullTVShowData };
  }, [fullTVShowData, selectedTVShow]);

  return (
    <div className="app">
      <Header language={language} onLanguageChange={handleLanguageChange} />
      
      <main className="app__main">
        <Hero language={language} />
        
        <MoviesGrid 
          movies={movies} 
          genres={genres}
          language={language}
          onMovieSelect={handleMovieSelect}
        />

        <TVShowsGrid 
          genres={tvGenres}
          language={language}
          onTVShowSelect={handleTVShowSelect}
        />

        <BottomFeature language={language} />
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

      <TVShowModal 
        tvShow={modalTVShow}
        isOpen={!!selectedTVShow}
        onClose={handleCloseModal}
        language={language}
        loading={fullTVShowLoading}
      />
    </div>
  );
}

export default App;