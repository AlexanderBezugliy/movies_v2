import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getImageUrl, FALLBACK_IMAGE } from '../../config/api';
import { useUpcomingMovies } from '../../hooks/useTMDB';
import './NewReleasesSlider.scss';

const SLIDER_CONFIG = {
  AUTO_PLAY_INTERVAL: 5000,
  TRANSITION_DURATION: 0.5,
  SWIPE_THRESHOLD: 50,
  NAV_BUTTON_SIZE: 32,
  NAV_GAP: 20,
  VISIBLE_SLIDES: {
    mobile: 2,
    tablet: 3,
    desktop: 4,
    wide: 5
  }
};

const NewReleasesSlider = ({ language, onMovieSelect }) => {
  const { data, loading, error } = useUpcomingMovies(language, 1);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [loadedImages, setLoadedImages] = useState(new Set());
  const [containerWidth, setContainerWidth] = useState(0);
  const sliderRef = useRef(null);
  const autoPlayRef = useRef(null);
  const containerRef = useRef(null);

  const movies = data?.results?.slice(0, 10) || [];

  const getVisibleSlides = useCallback(() => {
    const width = window.innerWidth;
    if (width >= 1400) return SLIDER_CONFIG.VISIBLE_SLIDES.wide;
    if (width >= 1024) return SLIDER_CONFIG.VISIBLE_SLIDES.desktop;
    if (width >= 768) return SLIDER_CONFIG.VISIBLE_SLIDES.tablet;
    return SLIDER_CONFIG.VISIBLE_SLIDES.mobile;
  }, []);

  const [visibleSlides, setVisibleSlides] = useState(getVisibleSlides());

  useEffect(() => {
    const handleResize = () => {
      setVisibleSlides(getVisibleSlides());
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setContainerWidth(rect.width);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [getVisibleSlides]);

  const maxIndex = useMemo(() => {
    return Math.max(0, movies.length - visibleSlides);
  }, [movies.length, visibleSlides]);

  const slideWidth = useMemo(() => {
    const availableWidth = containerWidth - (SLIDER_CONFIG.NAV_BUTTON_SIZE * 2) - (SLIDER_CONFIG.NAV_GAP * 2);
    const gap = 8;
    return (availableWidth / visibleSlides) - gap;
  }, [containerWidth, visibleSlides]);

  const goToSlide = useCallback((index) => {
    const newIndex = Math.max(0, Math.min(index, maxIndex));
    setCurrentIndex(newIndex);
  }, [maxIndex]);

  const goToNext = useCallback(() => {
    goToSlide(currentIndex + 1);
  }, [currentIndex, goToSlide]);

  const goToPrev = useCallback(() => {
    goToSlide(currentIndex - 1);
  }, [currentIndex, goToSlide]);

  useEffect(() => {
    if (isAutoPlaying && movies.length > 0) {
      autoPlayRef.current = setInterval(goToNext, SLIDER_CONFIG.AUTO_PLAY_INTERVAL);
    }
    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, [isAutoPlaying, movies.length, goToNext]);

  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
    setIsAutoPlaying(false);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > SLIDER_CONFIG.SWIPE_THRESHOLD;
    const isRightSwipe = distance < -SLIDER_CONFIG.SWIPE_THRESHOLD;

    if (isLeftSwipe) goToNext();
    if (isRightSwipe) goToPrev();

    setTouchStart(null);
    setTouchEnd(null);
    setTimeout(() => setIsAutoPlaying(true), 3000);
  };

  const handleMouseEnter = () => setIsAutoPlaying(false);
  const handleMouseLeave = () => setIsAutoPlaying(true);

  const handleImageLoad = useCallback((movieId) => {
    setLoadedImages(prev => {
      const newSet = new Set(prev);
      newSet.add(movieId);
      return newSet;
    });
  }, []);

  const handleImageError = useCallback((movieId) => {
    setLoadedImages(prev => {
      const newSet = new Set(prev);
      newSet.add(movieId);
      return newSet;
    });
  }, []);

  const handleKeyDown = (e, index) => {
    if (e.key === 'ArrowLeft') goToPrev();
    if (e.key === 'ArrowRight') goToNext();
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onMovieSelect(movies[index]);
    }
  };

  const isImageLoaded = useCallback((movieId) => {
    return loadedImages.has(movieId);
  }, [loadedImages]);

  if (error || movies.length === 0) {
    return null;
  }

  return (
    <section
      className="new-releases"
      id="new-releases"
      aria-label={language === 'ru-RU' ? 'Новинки кино' : 'New Movie Releases'}
    >
      <div className="new-releases__container" ref={containerRef}>
        <div className="new-releases__header">
          <h2 className="new-releases__title">
            {language === 'ru-RU' ? 'Новинки' : 'New Releases'}
          </h2>
          <div className="new-releases__line" />
        </div>

        {loading ? (
          <div className="new-releases__loading" role="status" aria-live="polite">
            <div className="new-releases__spinner" aria-hidden="true" />
            <span className="new-releases__loading-text">
              {language === 'ru-RU' ? 'Загрузка...' : 'Loading...'}
            </span>
          </div>
        ) : (
          <div
            className="new-releases__slider"
            ref={sliderRef}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <button
              className="new-releases__nav new-releases__nav--prev"
              onClick={goToPrev}
              disabled={currentIndex === 0}
              aria-label={language === 'ru-RU' ? 'Предыдущий слайд' : 'Previous slide'}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="15,18 9,12 15,6" />
              </svg>
            </button>

            <div className="new-releases__track-wrapper">
              <div
                className="new-releases__track"
                style={{
                  transform: `translateX(-${currentIndex * (100 / visibleSlides)}%)`,
                  transition: `transform ${SLIDER_CONFIG.TRANSITION_DURATION}s ease-out`
                }}
              >
                <AnimatePresence mode="popLayout">
                  {movies.map((movie, index) => {
                    const title = language === 'ru-RU' ? movie.title : movie.original_title;
                    const posterUrl = getImageUrl(movie.poster_path, 'w342');
                    const hasLoaded = isImageLoaded(movie.id);

                    return (
                      <motion.article
                        key={movie.id}
                        className="new-releases__slide"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.3, delay: index * 0.03 }}
                        onClick={() => onMovieSelect(movie)}
                        onKeyDown={(e) => handleKeyDown(e, index)}
                        tabIndex={0}
                        role="group"
                        aria-label={`${title}, ${movie.release_date?.split('-')[0] || ''}, ${language === 'ru-RU' ? 'Рейтинг' : 'Rating'}: ${movie.vote_average?.toFixed(1)}`}
                      >
                        <div className="new-releases__card">
                          <div className="new-releases__card-inner">
                            {!hasLoaded && (
                              <div className="new-releases__card-skeleton" aria-hidden="true">
                                <div className="new-releases__skeleton-shimmer" />
                              </div>
                            )}
                            <div className="new-releases__card-image-wrapper">
                              <img
                                src={posterUrl || FALLBACK_IMAGE}
                                alt={title}
                                className="new-releases__card-image"
                                loading="lazy"
                                onLoad={() => handleImageLoad(movie.id)}
                                onError={() => handleImageError(movie.id)}
                              />
                              <div className="new-releases__card-overlay">
                                <span className="new-releases__card-play">▶</span>
                              </div>
                              <div className="new-releases__card-rating">
                                <span>★</span>
                                <span>{movie.vote_average?.toFixed(1)}</span>
                              </div>
                              <div className="new-releases__card-badge">
                                {movie.release_date?.split('-')[0] || ''}
                              </div>
                            </div>
                            <div className="new-releases__card-info">
                              <h3 className="new-releases__card-title">{title}</h3>
                              <p className="new-releases__card-meta">
                                {movie.release_date?.split('-')[0] || ''}
                                {movie.runtime && ` • ${Math.floor(movie.runtime / 60)}ч ${movie.runtime % 60}м`}
                              </p>
                            </div>
                          </div>
                        </div>
                      </motion.article>
                    );
                  })}
                </AnimatePresence>
              </div>
            </div>

            <button
              className="new-releases__nav new-releases__nav--next"
              onClick={goToNext}
              disabled={currentIndex >= maxIndex}
              aria-label={language === 'ru-RU' ? 'Следующий слайд' : 'Next slide'}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="9,18 15,12 9,6" />
              </svg>
            </button>
          </div>
        )}

        <div className="new-releases__dots" role="tablist" aria-label="Навигация по слайдам">
          {Array.from({ length: maxIndex + 1 }).map((_, index) => (
            <button
              key={index}
              className={`new-releases__dot ${index === currentIndex ? 'active' : ''}`}
              onClick={() => goToSlide(index)}
              role="tab"
              aria-selected={index === currentIndex}
              aria-label={`${language === 'ru-RU' ? 'Слайд' : 'Slide'} ${index + 1}`}
            />
          ))}
        </div>
      </div>

      <noscript>
        <style>{`
          .new-releases__track {
            flex-wrap: wrap;
          }
          .new-releases__slide {
            flex: 0 0 calc(20% - 6px);
            margin: 4px;
          }
        `}</style>
      </noscript>
    </section>
  );
};

export default NewReleasesSlider;