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
        staggerChildren: 0.15,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  };

  if (loading || !topMovie) {
    return (
      <section className="bottom-feature" id="bottom-feature" ref={sectionRef}>
        <div className="bottom-feature__loading">
          <div className="bottom-feature__spinner"></div>
        </div>
      </section>
    );
  }

  const backdropUrl = getImageUrl(topMovie.backdrop_path, 'original');
  const posterUrl = getImageUrl(topMovie.poster_path, 'w500');
  const title = language === 'ru-RU' ? topMovie.title : topMovie.original_title;
  const overview = language === 'ru-RU' ? topMovie.overview : topMovie.original_overview;

  return (
    <section className="bottom-feature" id="bottom-feature" ref={sectionRef}>
      <div className="bottom-feature__bg">
        {backdropUrl && (
          <img 
            src={backdropUrl} 
            alt={title}
            className={`bottom-feature__bg-img ${imageLoaded ? 'loaded' : ''}`}
            onLoad={() => setImageLoaded(true)}
          />
        )}
        <div className="bottom-feature__bg-overlay"></div>
      </div>

      <div className="bottom-feature__glass">
        <motion.div 
          className="bottom-feature__content"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          <motion.div className="bottom-feature__badge" variants={itemVariants}>
            <span className="bottom-feature__badge-icon">★</span>
            <span>{language === 'ru-RU' ? 'Лучший по версии зрителей' : 'Top Rated by Viewers'}</span>
            <span className="bottom-feature__badge-rating">{topMovie.vote_average?.toFixed(1)}</span>
          </motion.div>

          <motion.h2 className="bottom-feature__title" variants={itemVariants}>
            {title}
          </motion.h2>

          <motion.div className="bottom-feature__poster" variants={itemVariants}>
            <img 
              src={posterUrl || FALLBACK_IMAGE} 
              alt={title}
              className="bottom-feature__poster-img"
            />
            <div className="bottom-feature__poster-rating">
              <span className="bottom-feature__poster-star">★</span>
              <span>{topMovie.vote_average?.toFixed(1)}</span>
            </div>
          </motion.div>

          <motion.p className="bottom-feature__overview" variants={itemVariants}>
            {overview?.slice(0, 250)}
            {(overview?.length > 250) && '...'}
          </motion.p>

          <motion.div className="bottom-feature__meta" variants={itemVariants}>
            <span className="bottom-feature__meta-year">
              {topMovie.release_date?.split('-')[0]}
            </span>
            <span className="bottom-feature__meta-divider">•</span>
            <span className="bottom-feature__meta-rating">
              {topMovie.adult ? '18+' : '16+'}
            </span>
            <span className="bottom-feature__meta-divider">•</span>
            <span className="bottom-feature__meta-votes">
              {topMovie.vote_count?.toLocaleString()} {language === 'ru-RU' ? 'оценок' : 'votes'}
            </span>
          </motion.div>

          <motion.div className="bottom-feature__actions" variants={itemVariants}>
            <button className="bottom-feature__btn bottom-feature__btn--primary">
              <span className="bottom-feature__btn-icon">▶</span>
              {language === 'ru-RU' ? 'Смотреть' : 'Watch Now'}
            </button>
            <button className="bottom-feature__btn bottom-feature__btn--secondary">
              <span className="bottom-feature__btn-icon">+</span>
              {language === 'ru-RU' ? 'В избранное' : 'Add to Favorites'}
            </button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default BottomFeature;