import { useRef, useMemo } from 'react';
import { motion, useInView } from 'framer-motion';
import { useTVShows } from '../../hooks/useTVShows';
import TVShowCard from '../TVShowCard';
import ControlBar from '../ControlBar';
import SkeletonCard from '../SkeletonCard';
import './TVShowsGrid.scss';

const TVShowsGrid = ({ genres, language, onTVShowSelect }) => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  const {
    tvShows,
    genres: allGenres,
    isLoading,
    isError,
    searchQuery,
    selectedGenre,
    sortBy,
    setSearchQuery,
    setSelectedGenre,
    setSortBy,
  } = useTVShows(language);

  const displayTVShows = useMemo(() => {
    return tvShows?.slice(0, 25) || [];
  }, [tvShows]);

  const mergedGenres = useMemo(() => {
    if (genres && genres.length > 0) return genres;
    return allGenres;
  }, [genres, allGenres]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.03,
        delayChildren: 0.1,
      },
    },
  };

  const titleVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  };

  const renderContent = () => {
    if (isError) {
      return (
        <div className="tv-shows-grid__error">
          <div className="tv-shows-grid__error-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
          </div>
          <p>{language === 'ru-RU' ? 'Ошибка загрузки данных' : 'Error loading data'}</p>
          <button 
            className="tv-shows-grid__error-retry"
            onClick={() => window.location.reload()}
          >
            {language === 'ru-RU' ? 'Повторить' : 'Retry'}
          </button>
        </div>
      );
    }

    if (isLoading && displayTVShows.length === 0) {
      return (
        <div className="tv-shows-grid__grid">
          {Array.from({ length: 25 }).map((_, index) => (
            <SkeletonCard key={`skeleton-${index}`} index={index} />
          ))}
        </div>
      );
    }

    if (displayTVShows.length === 0) {
      return (
        <div className="tv-shows-grid__empty">
          <div className="tv-shows-grid__empty-icon">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="11" cy="11" r="8"/>
              <path d="M21 21l-4.35-4.35"/>
              <path d="M8 11h6"/>
            </svg>
          </div>
          <p>
            {searchQuery 
              ? (language === 'ru-RU' ? 'Сериалы не найдены' : 'No TV shows found')
              : (language === 'ru-RU' ? 'Сериалы не найдены' : 'No TV shows found')
            }
          </p>
        </div>
      );
    }

    return (
      <motion.div 
        className="tv-shows-grid__grid"
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
      >
        {displayTVShows.map((tvShow, index) => (
          <TVShowCard
            key={tvShow.id}
            tvShow={tvShow}
            genres={mergedGenres}
            index={index}
            language={language}
            onClick={() => onTVShowSelect(tvShow)}
          />
        ))}
      </motion.div>
    );
  };

  return (
    <section 
      className="tv-shows-grid" 
      id="series" 
      data-anchor="series"
      ref={sectionRef}
    >
      <div className="tv-shows-grid__container">
        <motion.div 
          className="tv-shows-grid__header"
          variants={titleVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          <h2 className="tv-shows-grid__title">
            {searchQuery 
              ? (language === 'ru-RU' ? 'Результаты поиска' : 'Search Results')
              : (language === 'ru-RU' ? 'Популярные сериалы' : 'Popular TV Shows')
            }
          </h2>
          <div className="tv-shows-grid__line"></div>
        </motion.div>

        <ControlBar
          genres={mergedGenres}
          language={language}
          onSearchChange={setSearchQuery}
          onGenreChange={setSelectedGenre}
          onSortChange={setSortBy}
          searchQuery={searchQuery}
          selectedGenre={selectedGenre}
          sortBy={sortBy}
        />

        {renderContent()}
      </div>
    </section>
  );
};

export default TVShowsGrid;