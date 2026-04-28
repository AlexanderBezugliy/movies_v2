import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getImageUrl } from '../../config/api';
import './Hero.scss';

const Hero = ({ movie, language }) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    setImageLoaded(false);
  }, [movie?.id]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
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

  if (!movie) {
    return (
      <section className="hero" id="hero">
        <div className="hero__loading">
          <div className="hero__spinner"></div>
        </div>
      </section>
    );
  }

  const backdropUrl = getImageUrl(movie.backdrop_path, 'original');
  const posterUrl = getImageUrl(movie.poster_path, 'w500');

  const title = language === 'ru-RU' ? movie.title : movie.original_title;
  const overview = language === 'ru-RU' ? movie.overview : movie.original_overview;

  return (
    <section className="hero" id="hero">
      <div className="hero__backdrop">
        {backdropUrl && (
          <>
            <img 
              src={backdropUrl} 
              alt={title} 
              className={`hero__backdrop-img ${imageLoaded ? 'loaded' : ''}`}
              onLoad={() => setImageLoaded(true)}
            />
            <div className="hero__backdrop-overlay"></div>
          </>
        )}
      </div>

      <div className="hero__content">
        <motion.div 
          className="hero__container"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div className="hero__badge" variants={itemVariants}>
            <span className="hero__badge-icon">★</span>
            <span>{language === 'ru-RU' ? 'Топовый фильм' : 'Top Movie'}</span>
            <span className="hero__badge-rating">{movie.vote_average?.toFixed(1)}</span>
          </motion.div>

          <motion.h1 className="hero__title" variants={itemVariants}>
            {title}
          </motion.h1>

          <motion.p className="hero__overview" variants={itemVariants}>
            {overview?.slice(0, 200)}
            {(overview?.length > 200) && '...'}
          </motion.p>

          <motion.div className="hero__meta" variants={itemVariants}>
            <span className="hero__meta-year">
              {movie.release_date?.split('-')[0]}
            </span>
            <span className="hero__meta-divider">•</span>
            <span className="hero__meta-rating">
              {movie.adult ? '18+' : '16+'}
            </span>
            <span className="hero__meta-divider">•</span>
            <span className="hero__meta-popularity">
              #{movie.popularity?.toFixed(0)} {language === 'ru-RU' ? 'популярности' : 'popularity'}
            </span>
          </motion.div>

          <motion.div className="hero__actions" variants={itemVariants}>
            <button className="hero__btn hero__btn--primary">
              <span className="hero__btn-icon">▶</span>
              {language === 'ru-RU' ? 'Смотреть' : 'Watch Now'}
            </button>
            <button className="hero__btn hero__btn--secondary">
              <span className="hero__btn-icon">+</span>
              {language === 'ru-RU' ? 'В избранное' : 'Add to Favorites'}
            </button>
          </motion.div>
        </motion.div>
      </div>

      <motion.div 
        className="hero__scroll-indicator"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 0.6 }}
      >
        <motion.div 
          className="hero__scroll-mouse"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="hero__scroll-wheel"></div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;