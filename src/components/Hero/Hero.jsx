import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import './Hero.scss';

const Hero = ({ language }) => {
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const heroRef = useRef(null);

  const { scrollY } = useScroll();
  const titleY = useTransform(scrollY, [0, 500], [0, 150]);
  const titleOpacity = useTransform(scrollY, [0, 300], [1, 0]);
  const subtitleY = useTransform(scrollY, [0, 400], [0, 100]);
  const subtitleOpacity = useTransform(scrollY, [0, 250], [1, 0]);

  const handleVideoCanPlay = () => {
    setVideoLoaded(true);
    setIsLoading(false);
    setVideoError(false);
  };

  const handleVideoLoadedData = () => {
    setVideoLoaded(true);
    setIsLoading(false);
  };

  const handleVideoError = () => {
    setVideoError(true);
    setIsLoading(false);
    setVideoLoaded(false);
  };

  const handleVideoWaiting = () => {
    setIsLoading(true);
  };

  const handleVideoPlaying = () => {
    setIsLoading(false);
  };

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
    hidden: { opacity: 0, y: 40, rotateX: 15 },
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  };

  const title = language === 'ru-RU' ? 'Кино фестиваль' : 'Cinema Festival';
  const subtitle = language === 'ru-RU' 
    ? 'Откройте мир лучших фильмов со всего мира' 
    : 'Discover the world\'s best films';

  return (
    <section className="hero" id="hero" ref={heroRef}>
      <div className="hero__video-container">
        {isLoading && !videoError && (
          <div className="hero__loading">
            <div className="hero__spinner"></div>
          </div>
        )}
        
        {!videoError && (
          <video
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            className={`hero__video ${videoLoaded ? 'loaded' : ''}`}
            onCanPlay={handleVideoCanPlay}
            onLoadedData={handleVideoLoadedData}
            onError={handleVideoError}
            onWaiting={handleVideoWaiting}
            onPlaying={handleVideoPlaying}
          >
            <source 
              src="/assets/video/video.mp4" 
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
          <motion.div 
            className="hero__title-wrapper"
            variants={itemVariants}
            style={{ y: titleY, opacity: titleOpacity }}
          >
            <span className="hero__title" data-text={title}>
              {title}
            </span>
            <span className="hero__title hero__title-3d-layer" aria-hidden="true">
              {title}
            </span>
            <span className="hero__title hero__title-3d-layer-2" aria-hidden="true">
              {title}
            </span>
            <motion.div 
              className="hero__title-accent"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 1.2, duration: 0.8, ease: "easeOut" }}
            />
          </motion.div>

          <motion.p 
            className="hero__subtitle" 
            variants={itemVariants}
            style={{ y: subtitleY, opacity: subtitleOpacity }}
          >
            {subtitle}
          </motion.p>

          <motion.div className="hero__actions" variants={itemVariants}>
            <motion.button 
              className="hero__btn hero__btn--primary"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="hero__btn-icon">▶</span>
              {language === 'ru-RU' ? 'Смотреть' : 'Watch Now'}
            </motion.button>
            <motion.button 
              className="hero__btn hero__btn--secondary"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="hero__btn-icon">+</span>
              {language === 'ru-RU' ? 'В избранное' : 'Add to Favorites'}
            </motion.button>
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