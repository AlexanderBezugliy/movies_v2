import { useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getImageUrl } from '../../config/api';
import './MovieModal.scss';

const MovieModal = ({ movie, isOpen, onClose, language, loading }) => {
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') {
      onClose();
    }
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleKeyDown]);

  if (!movie) return null;

  const title = language === 'ru-RU' ? movie.title : movie.original_title;
  const overview = language === 'ru-RU' ? movie.overview : movie.original_overview;
  const backdropUrl = getImageUrl(movie.backdrop_path, 'original');
  const posterUrl = getImageUrl(movie.poster_path, 'w500');

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString(language === 'ru-RU' ? 'ru-RU' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatRuntime = (minutes) => {
    if (!minutes) return '';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return language === 'ru-RU' 
      ? `${hours}ч ${mins}мин` 
      : `${hours}h ${mins}m`;
  };

  const getYouTubeEmbedUrl = (videos) => {
    const trailer = videos?.results?.find(
      v => v.type === 'Trailer' && v.site === 'YouTube'
    );
    if (trailer) {
      return `https://www.youtube.com/embed/${trailer.key}?autoplay=1&rel=0`;
    }
    const anyVideo = videos?.results?.find(v => v.site === 'YouTube');
    if (anyVideo) {
      return `https://www.youtube.com/embed/${anyVideo.key}?autoplay=1&rel=0`;
    }
    return null;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          className="modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div 
            className="modal"
            initial={{ opacity: 0, scale: 0.9, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 50 }}
            transition={{ type: 'spring', duration: 0.5 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button className="modal__close" onClick={onClose}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>

            <div className="modal__video-wrapper">
              {movie.videos?.results?.length > 0 ? (
                <iframe
                  className="modal__video"
                  src={getYouTubeEmbedUrl(movie.videos)}
                  title={title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <div className="modal__video-fallback">
                  {backdropUrl && (
                    <img src={backdropUrl} alt={title} className="modal__backdrop-fallback" />
                  )}
                  <div className="modal__no-trailer">
                    <span>🎬</span>
                    <p>{language === 'ru-RU' ? 'Трейлер недоступен' : 'Trailer not available'}</p>
                  </div>
                </div>
              )}
            </div>

            <div className="modal__content">
              <div className="modal__header">
                <div className="modal__poster">
                  {posterUrl && <img src={posterUrl} alt={title} />}
                </div>
                <div className="modal__info">
                  <h2 className="modal__title">{title}</h2>
                  
                  <div className="modal__meta">
                    {movie.release_date && (
                      <>
                        <span className="modal__meta-item">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                            <line x1="16" y1="2" x2="16" y2="6"></line>
                            <line x1="8" y1="2" x2="8" y2="6"></line>
                            <line x1="3" y1="10" x2="21" y2="10"></line>
                          </svg>
                          {formatDate(movie.release_date)}
                        </span>
                      </>
                    )}
                    {movie.runtime && (
                      <span className="modal__meta-item">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="12" cy="12" r="10"></circle>
                          <polyline points="12 6 12 12 16 14"></polyline>
                        </svg>
                        {formatRuntime(movie.runtime)}
                      </span>
                    )}
                    <span className="modal__meta-item modal__meta-rating">
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                      </svg>
                      {movie.vote_average?.toFixed(1)}
                    </span>
                  </div>

                  {movie.genres?.length > 0 && (
                    <div className="modal__genres">
                      {movie.genres.map((genre, idx) => (
                        <span key={idx} className="modal__genre-tag">
                          {genre.name}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {overview && (
                <div className="modal__overview-wrapper">
                  <div className="modal__overview">
                    <h3>{language === 'ru-RU' ? 'Описание' : 'Overview'}</h3>
                    <p>{overview}</p>
                  </div>
                </div>
              )}

              <div className="modal__actions">
                <button className="modal__btn modal__btn--primary">
                  <span>▶</span>
                  {language === 'ru-RU' ? 'Смотреть' : 'Watch'}
                </button>
                <button className="modal__btn modal__btn--secondary">
                  <span>+</span>
                  {language === 'ru-RU' ? 'В избранное' : 'Add to Favorites'}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MovieModal;