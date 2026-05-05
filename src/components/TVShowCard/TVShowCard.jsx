import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { getImageUrl, FALLBACK_IMAGE } from '../../config/api';
import PropTypes from 'prop-types';
import './TVShowCard.scss';

const TVShowCard = ({ tvShow, genres, index, language, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef(null);
  const [transform, setTransform] = useState({ rotateX: 0, rotateY: 0, scale: 1 });
  const [imageError, setImageError] = useState(false);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = ((y - centerY) / centerY) * -10;
    const rotateY = ((x - centerX) / centerX) * 10;
    
    setTransform({ rotateX, rotateY, scale: 1.05 });
  };

  const handleMouseLeave = () => {
    setTransform({ rotateX: 0, rotateY: 0, scale: 1 });
    setIsHovered(false);
  };

  const posterUrl = getImageUrl(tvShow.poster_path, 'w500');
  const title = language === 'ru-RU' ? tvShow.name : tvShow.original_name;
  
  const tvShowGenres = tvShow.genre_ids?.slice(0, 2).map(id => {
    const genre = genres?.find(g => g.id === id);
    return genre ? (language === 'ru-RU' ? genre.name : genre.name) : null;
  }).filter(Boolean);

  return (
    <motion.div
      ref={cardRef}
      className="tv-show-card"
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        duration: 0.6,
        delay: (index % 25) * 0.05,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
      style={{
        transform: `perspective(1000px) rotateX(${transform.rotateX}deg) rotateY(${transform.rotateY}deg) scale(${transform.scale})`,
        transformStyle: 'preserve-3d',
      }}
    >
      <div className={`tv-show-card__glow ${isHovered ? 'active' : ''}`}></div>
      
      <div className="tv-show-card__poster-wrapper">
        {posterUrl && !imageError ? (
          <img 
            src={posterUrl} 
            alt={title}
            className="tv-show-card__poster"
            onError={() => setImageError(true)}
          />
        ) : imageError ? (
          <img 
            src={FALLBACK_IMAGE} 
            alt={title}
            className="tv-show-card__poster"
          />
        ) : (
          <div className="tv-show-card__poster-placeholder">
            <span>📺</span>
          </div>
        )}
        
        <div className="tv-show-card__overlay">
          <button className="tv-show-card__play-btn">
            ▶
          </button>
        </div>

        <div className="tv-show-card__rating">
          <span className="tv-show-card__rating-star">★</span>
          <span>{tvShow.vote_average?.toFixed(1)}</span>
        </div>
      </div>

      <div className="tv-show-card__info">
        <h3 className="tv-show-card__title">{title}</h3>
        <div className="tv-show-card__genres">
          {tvShowGenres?.map((genre, idx) => (
            <span key={idx} className="tv-show-card__genre">
              {genre}
              {idx < tvShowGenres.length - 1 && ', '}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

TVShowCard.propTypes = {
  tvShow: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string,
    original_name: PropTypes.string,
    poster_path: PropTypes.string,
    vote_average: PropTypes.number,
    genre_ids: PropTypes.arrayOf(PropTypes.number),
  }).isRequired,
  genres: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string,
  })),
  index: PropTypes.number.isRequired,
  language: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default TVShowCard;