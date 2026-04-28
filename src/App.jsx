import { useState, useEffect, useMemo } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import MoviesGrid from './components/MoviesGrid';
import { useGenres, useNowPlayingMovies } from './hooks/useTMDB';
import './styles/App.scss';

function App() {
  const [language, setLanguage] = useState('ru-RU');

  const handleLanguageChange = (newLanguage) => {
    setLanguage(newLanguage);
  };

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
    </div>
  );
}

export default App;