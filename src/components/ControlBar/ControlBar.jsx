import { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './ControlBar.scss';

const ControlBar = ({ 
  genres = [], 
  language = 'ru-RU',
  onSearchChange, 
  onGenreChange, 
  onSortChange,
  searchQuery = '',
  selectedGenre = '',
  sortBy = 'popularity.desc'
}) => {
  const [localSearch, setLocalSearch] = useState(searchQuery);
  const [isGenreOpen, setIsGenreOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const searchTimeoutRef = useRef(null);

  useEffect(() => {
    setLocalSearch(searchQuery);
  }, [searchQuery]);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setLocalSearch(value);
    
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    searchTimeoutRef.current = setTimeout(() => {
      onSearchChange(value);
    }, 500);
  };

  const handleSearchClear = () => {
    setLocalSearch('');
    onSearchChange('');
  };

  const getGenreLabel = () => {
    if (!selectedGenre) {
      return language === 'ru-RU' ? 'Все жанры' : 'All Genres';
    }
    const genre = genres.find(g => g.id === parseInt(selectedGenre));
    return genre ? genre.name : (language === 'ru-RU' ? 'Все жанры' : 'All Genres');
  };

  const getSortLabel = () => {
    const sortOptions = {
      'popularity.desc': language === 'ru-RU' ? 'По популярности' : 'By Popularity',
      'vote_average.desc': language === 'ru-RU' ? 'По рейтингу' : 'By Rating'
    };
    return sortOptions[sortBy] || sortOptions['popularity.desc'];
  };

  const genreLabels = {
    28: language === 'ru-RU' ? 'Боевик' : 'Action',
    12: language === 'ru-RU' ? 'Приключения' : 'Adventure',
    16: language === 'ru-RU' ? 'Мультфильм' : 'Animation',
    35: language === 'ru-RU' ? 'Комедия' : 'Comedy',
    80: language === 'ru-RU' ? 'Криминал' : 'Crime',
    99: language === 'ru-RU' ? 'Документальный' : 'Documentary',
    18: language === 'ru-RU' ? 'Драма' : 'Drama',
    10751: language === 'ru-RU' ? 'Семейный' : 'Family',
    14: language === 'ru-RU' ? 'Фэнтези' : 'Fantasy',
    36: language === 'ru-RU' ? 'История' : 'History',
    27: language === 'ru-RU' ? 'Ужасы' : 'Horror',
    10402: language === 'ru-RU' ? 'Музыка' : 'Music',
    9648: language === 'ru-RU' ? 'Мистика' : 'Mystery',
    10749: language === 'ru-RU' ? 'Романтика' : 'Romance',
    878: language === 'ru-RU' ? 'Научная фантастика' : 'Science Fiction',
    10770: language === 'ru-RU' ? 'TV фильм' : 'TV Movie',
    53: language === 'ru-RU' ? 'Триллер' : 'Thriller',
    10752: language === 'ru-RU' ? 'Военный' : 'War',
    37: language === 'ru-RU' ? 'Вестерн' : 'Western'
  };

  return (
    <motion.div 
      className="control-bar"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <div className="control-bar__search">
        <div className="control-bar__search-icon">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/>
            <path d="M21 21l-4.35-4.35"/>
          </svg>
        </div>
        <input
          type="text"
          placeholder={language === 'ru-RU' ? 'Поиск фильмов...' : 'Search movies...'}
          className="control-bar__input"
          value={localSearch}
          onChange={handleSearchChange}
        />
        {localSearch && (
          <button className="control-bar__clear" onClick={handleSearchClear}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
        )}
      </div>

      <div className="control-bar__filters">
        <div className="control-bar__select-wrapper">
          <button 
            className="control-bar__select control-bar__select--genre"
            onClick={() => {
              setIsGenreOpen(!isGenreOpen);
              setIsSortOpen(false);
            }}
          >
            <span className="control-bar__select-label">{getGenreLabel()}</span>
            <svg className={`control-bar__select-arrow ${isGenreOpen ? 'open' : ''}`} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </button>
          <AnimatePresence>
            {isGenreOpen && (
              <motion.div 
                className="control-bar__dropdown"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <button 
                  className={`control-bar__dropdown-item ${!selectedGenre ? 'active' : ''}`}
                  onClick={() => {
                    onGenreChange('');
                    setIsGenreOpen(false);
                  }}
                >
                  {language === 'ru-RU' ? 'Все жанры' : 'All Genres'}
                </button>
                {genres.map(genre => (
                  <button 
                    key={genre.id}
                    className={`control-bar__dropdown-item ${selectedGenre === genre.id.toString() ? 'active' : ''}`}
                    onClick={() => {
                      onGenreChange(genre.id.toString());
                      setIsGenreOpen(false);
                    }}
                  >
                    {genreLabels[genre.id] || genre.name}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="control-bar__select-wrapper">
          <button 
            className="control-bar__select control-bar__select--sort"
            onClick={() => {
              setIsSortOpen(!isSortOpen);
              setIsGenreOpen(false);
            }}
          >
            <span className="control-bar__select-label">{getSortLabel()}</span>
            <svg className={`control-bar__select-arrow ${isSortOpen ? 'open' : ''}`} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </button>
          <AnimatePresence>
            {isSortOpen && (
              <motion.div 
                className="control-bar__dropdown"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <button 
                  className={`control-bar__dropdown-item ${sortBy === 'popularity.desc' ? 'active' : ''}`}
                  onClick={() => {
                    onSortChange('popularity.desc');
                    setIsSortOpen(false);
                  }}
                >
                  {language === 'ru-RU' ? 'По популярности' : 'By Popularity'}
                </button>
                <button 
                  className={`control-bar__dropdown-item ${sortBy === 'vote_average.desc' ? 'active' : ''}`}
                  onClick={() => {
                    onSortChange('vote_average.desc');
                    setIsSortOpen(false);
                  }}
                >
                  {language === 'ru-RU' ? 'По рейтингу' : 'By Rating'}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

export default ControlBar;