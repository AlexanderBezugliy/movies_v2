import { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { getImageUrl, FALLBACK_BACKDROP, FALLBACK_IMAGE } from '../../config/api';
import { useTopRatedMovies } from '../../hooks/useTMDB';
import './BottomFeature.scss';

const BottomFeature = ({ language }) => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  const [imageLoaded, setImageLoaded] = useState(false);

  const { data: topRatedData, loading } = useTopRatedMovies(language);
  
  const topMovie = topRatedData?.results?.[0];

  useEffect(() => {
    setImageLoaded(false);
  }, [topMovie?.id]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.7,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  };

  if (loading || !topMovie) {
    return (
      <section 
        className="bottom-feature" 
        id="bottom-feature" 
        ref={sectionRef}
        aria-label={language === 'ru-RU' ? 'Загрузка' : 'Loading'}
      >
        <div className="bottom-feature__loading" role="status" aria-live="polite">
          <div className="bottom-feature__spinner" aria-hidden="true"></div>
          <span className="bottom-feature__loading-text">
            {language === 'ru-RU' ? 'Загрузка...' : 'Loading...'}
          </span>
        </div>
      </section>
    );
  }

  const backdropUrl = getImageUrl(topMovie.backdrop_path, 'original');
  const posterUrl = getImageUrl(topMovie.poster_path, 'w500');
  const title = language === 'ru-RU' ? topMovie.title : topMovie.original_title;
  const overview = language === 'ru-RU' ? topMovie.overview : topMovie.original_overview;

  return (
    <section 
      className="bottom-feature" 
      id="bottom-feature" 
      ref={sectionRef}
      aria-label={`${title} - ${language === 'ru-RU' ? 'Лучший фильм' : 'Top Rated Movie'}`}
    >
      <div className="bottom-feature__bg" aria-hidden="true">
        {backdropUrl && (
          <img 
            src={backdropUrl} 
            alt=""
            className={`bottom-feature__bg-img ${imageLoaded ? 'loaded' : ''}`}
            onLoad={() => setImageLoaded(true)}
            loading="eager"
          />
        )}
        <div className="bottom-feature__bg-overlay"></div>
      </div>

      <div className="bottom-feature__container">
        <motion.div 
          className="bottom-feature__content"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          <div className="bottom-feature__main">
            <motion.div className="bottom-feature__badge" variants={itemVariants}>
              <span className="bottom-feature__badge-icon" aria-hidden="true">★</span>
              <span>{language === 'ru-RU' ? 'Лучший по версии зрителей' : 'Top Rated by Viewers'}</span>
              <span className="bottom-feature__badge-rating" aria-label={`Рейтинг: ${topMovie.vote_average?.toFixed(1)}`}>
                {topMovie.vote_average?.toFixed(1)}
              </span>
            </motion.div>

            <motion.h2 
              className="bottom-feature__title" 
              variants={itemVariants}
            >
              {title}
            </motion.h2>

            <motion.div className="bottom-feature__meta" variants={itemVariants}>
              <span className="bottom-feature__meta-year">
                {topMovie.release_date?.split('-')[0]}
              </span>
              <span className="bottom-feature__meta-divider" aria-hidden="true">•</span>
              <span className="bottom-feature__meta-rating" aria-label={topMovie.adult ? '18+' : '16+'}>
                {topMovie.adult ? '18+' : '16+'}
              </span>
              <span className="bottom-feature__meta-divider" aria-hidden="true">•</span>
              <span className="bottom-feature__meta-votes">
                {topMovie.vote_count?.toLocaleString()} {language === 'ru-RU' ? 'оценок' : 'votes'}
              </span>
            </motion.div>

            <motion.p 
              className="bottom-feature__overview" 
              variants={itemVariants}
            >
              {overview?.length > 280 
                ? `${overview?.slice(0, 280)}...` 
                : overview
              }
            </motion.p>

            <motion.div className="bottom-feature__actions" variants={itemVariants}>
              <button 
                className="bottom-feature__btn bottom-feature__btn--primary"
                aria-label={language === 'ru-RU' ? 'Смотреть фильм' : 'Watch movie'}
              >
                <span className="bottom-feature__btn-icon" aria-hidden="true">▶</span>
                <span>{language === 'ru-RU' ? 'Смотреть' : 'Watch Now'}</span>
              </button>
              <button 
                className="bottom-feature__btn bottom-feature__btn--secondary"
                aria-label={language === 'ru-RU' ? 'Добавить в избранное' : 'Add to favorites'}
              >
                <span className="bottom-feature__btn-icon" aria-hidden="true">+</span>
                <span>{language === 'ru-RU' ? 'В избранное' : 'Add to Favorites'}</span>
              </button>
            </motion.div>
          </div>

          <motion.div 
            className="bottom-feature__poster" 
            variants={itemVariants}
          >
            <div className="bottom-feature__poster-wrapper">
              <img 
                src={posterUrl || FALLBACK_IMAGE} 
                alt={`${title} - ${language === 'ru-RU' ? 'Постер' : 'Poster'}`}
                className="bottom-feature__poster-img"
                loading="lazy"
              />
              <div className="bottom-feature__poster-rating" aria-label={`Рейтинг: ${topMovie.vote_average?.toFixed(1)} из 10`}>
                <span className="bottom-feature__poster-star" aria-hidden="true">★</span>
                <span>{topMovie.vote_average?.toFixed(1)}</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default BottomFeature;