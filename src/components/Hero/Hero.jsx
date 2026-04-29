import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import './Hero.scss';

const Hero = ({ language }) => {
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [videoError, setVideoError] = useState(false);

  useEffect(() => {
    setVideoLoaded(true);
  }, []);

  const handleVideoCanPlay = () => {
    setVideoLoaded(true);
    setVideoError(false);
  };

  const handleVideoError = () => {
    setVideoError(true);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.5,
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

  const title = language === 'ru-RU' ? 'Кинофестиваль' : 'Cinema Festival';
  const subtitle = language === 'ru-RU' 
    ? 'Откройте мир лучших фильмов со всего мира' 
    : 'Discover the world\'s best films';

  return (
    <section className="hero" id="hero">
      <div className="hero__video-container">
        {!videoError && (
          <video 
            autoPlay 
            loop 
            muted 
            playsInline 
            className={`hero__video ${videoLoaded ? 'loaded' : ''}`}
            onCanPlay={handleVideoCanPlay}
            onError={handleVideoError}
          >
            <source 
              src="https://res.cloudinary.com/dfonotyfb/video/upload/v1775585556/dds3_1_rqhg7x.mp4" 
              type="video/mp4" 
            />
          </video>
        )}
        {videoError && (
          <div className="hero__video-fallback"></div>
        )}
        <div className="hero__video-overlay"></div>
        <div className="hero__video-gradient"></div>
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
            <span>{language === 'ru-RU' ? 'Премьера' : 'Premiere'}</span>
          </motion.div>

          <motion.h1 className="hero__title" variants={itemVariants}>
            {title}
          </motion.h1>

          <motion.p className="hero__subtitle" variants={itemVariants}>
            {subtitle}
          </motion.p>

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