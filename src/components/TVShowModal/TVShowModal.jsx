import { useEffect, useCallback, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getImageUrl, FALLBACK_BACKDROP, FALLBACK_IMAGE } from '../../config/api';
import './TVShowModal.scss';

const TVShowModal = ({ tvShow, isOpen, onClose, language, loading }) => {
  const [backdropError, setBackdropError] = useState(false);
  const [posterError, setPosterError] = useState(false);

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

  useEffect(() => {
    setBackdropError(false);
    setPosterError(false);
  }, [tvShow?.id]);

  if (!tvShow) return null;

  const title = language === 'ru-RU' ? tvShow.name : tvShow.original_name;
  const overview = language === 'ru-RU' ? tvShow.overview : tvShow.overview;
  const backdropUrl = getImageUrl(tvShow.backdrop_path, 'original');
  const posterUrl = getImageUrl(tvShow.poster_path, 'w500');

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString(language === 'ru-RU' ? 'ru-RU' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
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

  const genres = tvShow.genres?.map(g => g.name).join(', ') || '';

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
              {tvShow.videos?.results?.length > 0 ? (
                <iframe
                  className="modal__video"
                  src={getYouTubeEmbedUrl(tvShow.videos)}
                  title={title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <div className="modal__backdrop">
                  {!backdropError ? (
                    <img 
                      src={backdropUrl} 
                      alt={title}
                      onError={() => setBackdropError(true)}
                    />
                  ) : (
                    <div className="modal__backdrop-fallback" style={{ backgroundImage: `url(${FALLBACK_BACKDROP})` }} />
                  )}
                  <div className="modal__backdrop-overlay"></div>
                </div>
              )}
            </div>

            <div className="modal__content">
              <div className="modal__header">
                <div className="modal__poster">
                  {!posterError ? (
                    <img 
                      src={posterUrl} 
                      alt={title}
                      onError={() => setPosterError(true)}
                    />
                  ) : (
                    <img src={FALLBACK_IMAGE} alt={title} />
                  )}
                </div>
                
                <div className="modal__info">
                  <h2 className="modal__title">{title}</h2>
                  
                  {tvShow.tagline && (
                    <p className="modal__tagline">{tvShow.tagline}</p>
                  )}
                  
                  <div className="modal__meta">
                    {tvShow.vote_average && (
                      <span className="modal__rating">
                        <span className="modal__rating-star">★</span>
                        {tvShow.vote_average.toFixed(1)}
                      </span>
                    )}
                    
                    {tvShow.first_air_date && (
                      <span className="modal__year">
                        {new Date(tvShow.first_air_date).getFullYear()}
                      </span>
                    )}
                    
                    {tvShow.number_of_seasons && (
                      <span className="modal__seasons">
                        {language === 'ru-RU' 
                          ? `${tvShow.number_of_seasons} сезон(ов)` 
                          : `${tvShow.number_of_seasons} season(s)`
                        }
                      </span>
                    )}
                    
                    {tvShow.episode_run_time?.[0] && (
                      <span className="modal__runtime">
                        {tvShow.episode_run_time[0]} {language === 'ru-RU' ? 'мин/эп' : 'min/ep'}
                      </span>
                    )}
                  </div>

                  {genres && (
                    <div className="modal__genres">
                      {genres.split(', ').map((genre, index) => (
                        <span key={index} className="modal__genre">{genre}</span>
                      ))}
                    </div>
                  )}

                  <div className="modal__status">
                    {tvShow.status && (
                      <span className="modal__status-item">
                        <span className="modal__status-label">
                          {language === 'ru-RU' ? 'Статус:' : 'Status:'}
                        </span>
                        {tvShow.status}
                      </span>
                    )}
                    {tvShow.next_episode_to_air && (
                      <span className="modal__status-item">
                        <span className="modal__status-label">
                          {language === 'ru-RU' ? 'Следующая серия:' : 'Next episode:'}
                        </span>
                        {formatDate(tvShow.next_episode_to_air.air_date)}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {overview && (
                <div className="modal__overview">
                  <h3 className="modal__overview-title">
                    {language === 'ru-RU' ? 'Описание' : 'Overview'}
                  </h3>
                  <p className="modal__overview-text">{overview}</p>
                </div>
              )}

              {loading && (
                <div className="modal__loading">
                  <div className="modal__loading-spinner"></div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TVShowModal;